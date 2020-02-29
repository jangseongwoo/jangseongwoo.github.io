---
title:  "Docker 컨테이너간 볼륨 공유에 대한 학습"
excerpt: "다수의 Docker 컨테이너(이하 컨테이너)를 운영하다가 보면 컨테이너 간에 볼륨 공유가 필요할 상황이 있다."

categories:
  - Docker
tags:
  - Docker

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 목적
=====

다수의 Docker 컨테이너(이하 컨테이너)를 운영하다가 보면 컨테이너 간에 볼륨 공유가 필요할 상황이 있다.

예를 들면 Apache 서버 컨테이너의 로그 파일을 Fluentd 컨테이너로 수집하는 경우이다.

이 경우 Fluentd가 Apache 서버의 로그 파일을 접근하려면 다음과 같이 두 가지 방법이 존재한다.

*   Fluentd가 Apache 서버 컨테이너 볼륨에 접근하여 로그 파일을 수집하는 방법
    
*   호스트 OS에 공유 볼륨을 생성한 후 이 공간에 Apache 서버는 로그 파일을 저장하고 Fluentd는 로그 파일을 수집하는 방법
    

[Volume을 활용한 Data 관리](https://medium.com/dtevangelist/docker-%EA%B8%B0%EB%B3%B8-5-8-volume%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-data-%EA%B4%80%EB%A6%AC-9a9ac1db978c)를 살펴보면 후자의 방법이 합리적이라고 설명하고 있다.

이 문서에서는 컨테이너간 볼륨 공유를 위하여 호스트 OS에 공유 볼륨을 생성하는 방법과 실제로 테스트하여 동작 확인 한다.

Docker로 호스트 OS에 볼륨을 공유하는 방법
===========================

[Docker 공식 문서 - 저장 공간](https://docs.docker.com/storage/)을 살펴보면 mount 하는 방법에 따라 다음과 같이 구분한다. 

*   Bind mount
    
*   Volume
    
*   Tmpfs
    

이 문서에서는 휘발성 메모리에 mount 하는 tmpfs에 대하여는 다루지 않는다.

테스트 환경
======

다음과 같은 환경에서 테스트 하였다.

*   OS 
    
    *   버전 : masOS Mojave v10.14.6
        
*   Docker
    
    *   버전 : 19.03.2
        
    *   Python 이미지 - 버전 : 3.6
        
    *   Fluentd 이미지 - 버전 : v1.0.2 
        

사용되는 Docker CLI 명령어
===================

이 문서에서는 다음과 같은 Docker 명령어를 사용한다.

*   docker build
    
*   docker container
    
*   docker image
    
*   docker run
    
*   docker stop
    
*   docker rm
    
*   docker volume
    

위의 나열된 명령어의 설명과 사용법은 다음의 링크를 참고하면 된다.

*   [Docker 공식문서 - docker build](https://docs.docker.com/engine/reference/commandline/build/)
    
*   [Docker 공식문서 - docker container](https://docs.docker.com/engine/reference/commandline/container/)
    
*   [Docker 공식문서 - docker image](https://docs.docker.com/engine/reference/commandline/image/)
    
*   [Docker 공식문서 - docker run](https://docs.docker.com/engine/reference/commandline/run/)
    
*   [Docker 공식문서 - docker stop](https://docs.docker.com/engine/reference/commandline/stop/)
    
*   [Docker 공식문서 - docker rm](https://docs.docker.com/engine/reference/commandline/stop/)
    
*   [Docker 공식문서 - docker volume](https://docs.docker.com/engine/reference/commandline/stop/)
    

mount와 관련하여 다음과 같은 주의사항이 있다.

*   \-v 옵션: Host OS에서 해당 경로의 디렉터리가 존재하지 않으면 새롭게 생성한다.
    
*   \-mount 옵션 : Host OS에서 해당 경로의 디렉터리가 존재하지 않으면 mount 자체가 안 된다.
    

테스트 사전 정보
=========

환경 변수 등록
--------

테스트 편의를 위하여 다음과 같이 환경 변수를 등록하여 사용한다.

```
$ export DOCKER_SHARED_VOLUME_TEST_PATH=/Users/kevin/dev/docker/test/shared_volume

```

  

```
$ env
... 중략 ...

DOCKER_SHARED_VOLUME_TEST_PATH=/Users/kevin/dev/docker/test/shared_volume

... 중략 ...
```

  

"로그생성" 컨테이너 이미지 생성
------------------

이 테스트에서는 "로그생성" 컨테이너의 이미지 생성은 다음과 같이 한다.

1.  다음과 같이 Dockerfile을 생성한다.
    
    ```
    $ cat image_of_make_logfile/Dockerfile
    FROM python:3.6
    RUN mkdir -p /app
    RUN mkdir -p /app/input
    WORKDIR /app
    COPY . /app
    ENV NAME Make_Log_File
    CMD ["python", "make_log.py", "5", "60", "/app/input/"]
    
    ```
    
      
    
2.  다음과 같은 Python 코드를 작성한다.
    
    ```
    ### image_of_make_logfile/make_log.py
    
    import random
    import sys
    import datetime
    import time
    
    
    def main():
        sys_argv = sys.argv
        batch_count = 5
        make_log_running_time = 60
        log_file_dir_path = "./"
    
        if len(sys_argv) > 3:
            batch_count = int(sys_argv[1])
            make_log_running_time = int(sys_argv[2])
            log_file_dir_path = sys_argv[3]
    
        choice_list = ["c++", "python", "java",
                       "javascript", "kotlin", "scala", "ruby"]
    
        now_date = datetime.datetime.today()
        filename = "".join([log_file_dir_path, str(now_date.date()), ".log"])
    
        for batch_no in range(batch_count):
            with open(filename, "a") as file_object:
                for i in range(make_log_running_time):
                    time.sleep(0.999999)
                    created_at = time.strftime("%Y/%m/%dT%H:%M:%S")
                    log_message = "{}-{}    {}    {}\n".format(
                        batch_no, i, created_at, random.choice(choice_list))
                    file_object.write(log_message)
        print("make log end!")
    
    
    if __name__ == "__main__":
        main()
    
    
    
    ```
    
      
    
3.  다음과 같이 Docker 이미지를 생성한다.
    
    ```
    $ cd image_of_make_logfile
    $ docker build --tag=make_logfile_image .
    Sending build context to Docker daemon  11.26kB
    Step 1/7 : FROM python:3.6
     ---> 1c515a624542
    Step 2/7 : RUN mkdir -p /app
     ---> Running in a993e327f25c
    Removing intermediate container a993e327f25c
     ---> b4b52d6451f8
    Step 3/7 : RUN mkdir -p /app/input
     ---> Running in a944e3182d51
    Removing intermediate container a944e3182d51
     ---> 20d3277a9ee7
    Step 4/7 : WORKDIR /app
     ---> Running in 09577255b80a
    Removing intermediate container 09577255b80a
     ---> 2d6f8cbc1cde
    Step 5/7 : COPY . /app
     ---> dcbd7f937bad
    Step 6/7 : ENV NAME Make_Log_File
     ---> Running in b41268eb0611
    Removing intermediate container b41268eb0611
     ---> 1c2d3febff85
    Step 7/7 : CMD ["python", "make_log.py", "5", "60", "/app/input/"]
     ---> Running in 630ce115c0e4
    Removing intermediate container 630ce115c0e4
     ---> 5a345b58606c
    Successfully built 5a345b58606c
    Successfully tagged make_logfile_image:latest
    ```
    
      
    

"로그수집" 컨테이너 설정파일
----------------

Fluentd 이미지를 사용할 예정이며 td-agent 설정 파일은 다음과 같다.

```
$ cat fluentd/td_agent.conf
<source>
  @type tail
  tag docker_log_collect
  path /input/*
  <parse>
    @type none
  </parse>
  refresh_interval 5s
  read_from_head true
</source>

<match docker_log_collect*>
  @type file
  path /output/${tag}_output
  add_path_suffix true
  path_suffix ".log"
  append true
  <buffer tag>
    flush_mode interval
    flush_interval 3s
  </buffer>
  <format>
    @type out_file
    output_tag false
    output_time true
  </format>
</match>
```

  

  

* * *

Bind mount
==========

Bind mount는 Host OS에 종속적이다.

컨테이너를 실행하면 --mount 혹은 -v 옵션에서 Host OS 로컬 경로와 컨테이너 경로를 mount만 하면 사용할 수 있다.

만약 컨테이너와 Bind mount된 Storage에 파일이 저장된다면 Host OS에서도 확인할 수도 있다.

더 자세한 내용은 다음의 링크를 참고하면 된다.

*   [Docker 공식 문서 - 저장 공간 / Bind mounts](https://docs.docker.com/storage/bind-mounts/)
    

  

테스트
---

다음과 같은 시나리오를 바탕으로 테스트를 할 예정이다.

1.  "로그생성" 컨테이너를 구성하고 실행한다.
    
2.  "로그수집" 컨테이너를 구성하고 실행한다.
    
3.  Host OS 상에서 입력용 로그 파일과 출력용 로그 파일을 비교한다.
    

  

### 1\. 로그 생성 컨테이너 실행

테스트 사전 정보에서 생성한 Docker 이미지를 바탕으로 컨테이너를 실행한다.

```
$ docker run -d --name=make_logfile_container --mount type=bind,source=${DOCKER_SHARED_VOLUME_TEST_PATH}/host_storage/input,target=/app/input make_logfile_image:latest
bd31f0fb4e4a03eb16375e5ff6fcd1e95998dec26802cb457f56f5ff31572b46
```

  

컨테이너의 상태를 확인한다.

```
$ docker container ps --all
CONTAINER ID        IMAGE                       COMMAND                  CREATED              STATUS              PORTS               NAMES
bd31f0fb4e4a        make_logfile_image:latest   "python make_log.py …"   About a minute ago   Up About a minute                       make_logfile_container

```

  

컨테이너의 Mount상태를 확인한다.

```
$ docker inspect make_logfile_container
[
    ... 중략 ...
    "Mounts": [
            {
                "Type": "bind",
                "Source": "/Users/kevin/dev/docker/test/shared_volume/host_storage/input",
                "Destination": "/app/input",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
]

```

  

입력용 로그 파일에 로그가 저장되는지 확인한다.

```
$ cat host_storage/input/2019-09-10.log
0-0    2019/09/10T05:49:19    scala
0-1    2019/09/10T05:49:20    ruby
0-2    2019/09/10T05:49:21    c++
0-3    2019/09/10T05:49:22    c++
0-4    2019/09/10T05:49:23    c++

... 중략 ...
```

  

초당 1개 로그를  5분간 파일에 저장한다.

  

### 2\. 로그 수집 컨테이너 실행

테스트 사전 정보의 td-agent 설정 파일을 바탕으로 Fluentd 컨테이너를 다음과 같이 실행한다.

```
$ docker run -d --name=log_collector_container --mount type=bind,source=${DOCKER_SHARED_VOLUME_TEST_PATH}/host_storage/input,target=/input --mount type=bind,source=${DOCKER_SHARED_VOLUME_TEST_PATH}/host_storage/output,target=/output --mount type=bind,source=${DOCKER_SHARED_VOLUME_TEST_PATH}/fluentd,target=/fluentd/etc -e FLUENTD_CONF=td_agent.conf fluent/fluentd:v1.0.2
47a6f572fdb2427a0872266ce373b9e99da1e2cae5ee4dc83f0d5aaaf6f56cd2
```

  

컨테이너가 실행되었는지 확인한다.

```
$ docker container ps --all
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS                      PORTS                 NAMES
47a6f572fdb2        fluent/fluentd:v1.0.2       "/bin/entrypoint.sh …"   5 minutes ago       Up 5 minutes                5140/tcp, 24224/tcp   log_collector_container
bd31f0fb4e4a        make_logfile_image:latest   "python make_log.py …"   22 minutes ago      Exited (0) 17 minutes ago                         make_logfile_container
```

  

컨테이너의 Mount상태를 확인한다.

```
$ docker inspect log_collector_container
[
    ... 중략 ...
    "Mounts": [
            {
                "Type": "bind",
                "Source": "/Users/kevin/dev/docker/test/shared_volume/host_storage/input",
                "Destination": "/input",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            },
{
                "Type": "bind",
                "Source": "/Users/kevin/dev/docker/test/shared_volume/host_storage/output",
                "Destination": "/output",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            },
            {
                "Type": "bind",
                "Source": "/Users/kevin/dev/docker/test/shared_volume/fluentd",
                "Destination": "/fluentd/etc",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
]

```

  

출력용 로그파일에 저장되는지 확인한다.

```
$ cat host_storage/output/docker_log_collect_output.log
019-09-10T06:06:39+00:00	{"message":"0-0    2019/09/10T05:49:19    scala"}
2019-09-10T06:06:39+00:00	{"message":"0-1    2019/09/10T05:49:20    ruby"}
2019-09-10T06:06:39+00:00	{"message":"0-2    2019/09/10T05:49:21    c++"}
2019-09-10T06:06:39+00:00	{"message":"0-3    2019/09/10T05:49:22    c++"}
2019-09-10T06:06:39+00:00	{"message":"0-4    2019/09/10T05:49:23    c++"}

... 중략 ...
```

  

### 3\. 입,출력용 로그 파일 확인

입력용 로그 파일을 확인한다.

```
$ cat host_storage/input/2019-09-10.log
0-0    2019/09/10T05:49:19    scala
0-1    2019/09/10T05:49:20    ruby
0-2    2019/09/10T05:49:21    c++
0-3    2019/09/10T05:49:22    c++
0-4    2019/09/10T05:49:23    c++

... 중략 ...
```

  

```
$ cat host_storage/input/2019-09-10.log| wc -l
300
```

  

출력용 로그 파일을 확인한다.

```
$ cat host_storage/output/docker_log_collect_output.log
019-09-10T06:06:39+00:00	{"message":"0-0    2019/09/10T05:49:19    scala"}
2019-09-10T06:06:39+00:00	{"message":"0-1    2019/09/10T05:49:20    ruby"}
2019-09-10T06:06:39+00:00	{"message":"0-2    2019/09/10T05:49:21    c++"}
2019-09-10T06:06:39+00:00	{"message":"0-3    2019/09/10T05:49:22    c++"}
2019-09-10T06:06:39+00:00	{"message":"0-4    2019/09/10T05:49:23    c++"}

... 중략 ...
```

  

```
$ cat host_storage/output/docker_log_collect_output.log| wc -l
300
```

  

입력용 로그 파일과 출력용 로그 파일을 비교한 결과는 다음과 같이 정리할 수 있다.

입력용 로그 파일의 내용은 출력용 로그 파일에 '수집날짜 { "message" : "로그 내용" } 형태로 저장된다.

  

* * *

Volume
======

Volume 마운트는 Host OS에 파일 시스템에 종속적이지 않으며 Docker에서 완전히 관리 한다. 

volume 마운트를 사용하기 위해서는 Docker 명령으로 volume 생성이 필요하다.

더 자세한 내용은 다음의 링크를 참고하면 된다.

*   [Docker 공식 문서 - 저장 공간 / Volume](https://docs.docker.com/storage/volumes/)
    

  

테스트
---

다음과 같은 시나리오를 바탕으로 테스트를 할 예정이다.

1.  Volume을 생성한다.
    
2.  "로그생성" 컨테이너를 구성하고 실행한다.
    
3.  "로그수집" 컨테이너를 구성하고 실행한다.
    
4.  Host OS 상에서 입력용 로그 파일과 출력용 로그 파일을 비교한다.
    

  

### 1\. Volume 생성

다음과 같이 Volume을 생성한다.

```
$ docker volume create logfile_input
logfile_input
```

  

다음과 같은 명령으로 Volume의 상태를 확인한다.

```
$ docker volume inspect logfile_input
[
    {
        "CreatedAt": "2019-09-10T08:41:41Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/logfile_input/_data",
        "Name": "logfile_input",
        "Options": {},
        "Scope": "local"
    }
]
```

  

### 2\. 로그 생성 컨테이너 실행

테스트 사전 정보에서 생성한 Docker 이미지를 바탕으로 컨테이너를 실행한다.

```
$ docker run -d --name=make_logfile_container --mount type=volume,source=logfile_input,target=/app/input make_logfile_image:latest
7a265902761be76af2957140e0966b99d297e0fda78f5dffe17df9daca4c7453
```

  

컨테이너의 동작을 확인한다.

```
$ docker container ps --all
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS               NAMES
1dcc4e6c3181        make_logfile_image:latest   "python make_log.py …"   2 minutes ago       Up 2 minutes                            make_logfile_container

```

  

컨테이너의 Mount상태를 확인한다.

```
$ docker inspect make_logfile_container
[
    ... 중략 ...
    "Mounts": [
            {
                "Type": "volume",
                "Name": "logfile_input",
                "Source": "/var/lib/docker/volumes/logfile_input/_data",
                "Destination": "/app/input",
                "Driver": "local",
                "Mode": "z",
                "RW": true,
                "Propagation": ""
            }
        ],
]

```

  

### 3\. 로그 수집 컨테이너 실행

테스트 사전 정보의 td-agent 설정 파일을 바탕으로 Fluentd 컨테이너를 다음과 같이 실행한다.

```
$ docker run -d --name=log_collector_container --mount type=volume,source=logfile_input,target=/input --mount type=bind,source=${DOCKER_SHARED_VOLUME_TEST_PATH}/host_storage/output,target=/output -v ${DOCKER_SHARED_VOLUME_TEST_PATH}/fluentd:/fluentd/etc -e FLUENTD_CONF=td_agent.conf fluent/fluentd:v1.0.2
ba7be8af4dc7ddea4ba30ebccb80736f9700717289748b74e27ab45e9ab22195
```

  

컨테이너가 실행되었는지 확인한다.

```
$ docker container ps --all
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS                 NAMES
ba7be8af4dc7        fluent/fluentd:v1.0.2       "/bin/entrypoint.sh …"   5 seconds ago       Up 4 seconds        5140/tcp, 24224/tcp   log_collector_container
1dcc4e6c3181        make_logfile_image:latest   "python make_log.py …"   4 minutes ago       Up 4 minutes
```

  

### 3\. 출력용 로그 파일 확인

출력용 로그 파일을 확인한다.

```
$ cat host_storage/output/docker_log_collect_output.log
2019-09-16T00:41:33+00:00	{"message":"0-0    2019/09/10T09:39:39    kotlin"}
2019-09-16T00:41:33+00:00	{"message":"0-1    2019/09/10T09:39:40    ruby"}
2019-09-16T00:41:33+00:00	{"message":"0-2    2019/09/10T09:39:41    c++"}
2019-09-16T00:41:33+00:00	{"message":"0-3    2019/09/10T09:39:42    kotlin"}
2019-09-16T00:41:33+00:00	{"message":"0-4    2019/09/10T09:39:43    scala"}

... 중략 ...
```

  

```
$ cat host_storage/output/docker_log_collect_output.log| wc -l
300
```

  

출력용 로그 파일을 확인한 결과 다음과 같이 정리할 수 있다.

입력용 로그 파일의 내용이 출력용 로그 파일에 '수집날짜 { "message" : "로그 내용" } 형태로 저장된다.
