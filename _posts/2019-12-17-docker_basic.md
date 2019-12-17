---
title:  "Docker 공식 사이트 Chapter 1~3 학습 내용 정리"
excerpt: "이 문서는 2019. 9. 2 기준 Docker 시작하기를 따라하며 개인적인 학습과 추후 이 내용을 리마인드 할 때 참고하려는 목적을 가지고 있다."

categories:
  - Docker
tags:
  - Docker
---

목적
==

이 문서는 2019. 9. 2 기준 [Docker 시작하기](https://docs.docker.com/get-started/)를 따라하며 개인적인 학습과 추후 이 내용을 리마인드 할 때 참고하려는 목적을 가지고 있다.

  

진행
==

[Docker 시작하기](https://docs.docker.com/get-started/)는 6개의 part로 나뉘어져 있으며 다음과 같다. 이 중 part 3까지만 진행한다.

1.  오리엔테이션
    
2.  컨테이너
    
3.  서비스
    
4.  스웜
    
5.  스택
    
6.  앱 배포
    

1.  스웜의 경우 쿠버네티스를 사용하는 트렌드 비춰 학습에서 제외한다.
    

1.  스택, 6. 앱 배포의 경우 스웜이 초기화 되야만 동작하기 때문에 학습에서 제외한다.
    

  

1\. 오리엔테이션
----------

개념적인 내용은 [Docker 시작하기](https://docs.docker.com/get-started/)를 참고하고 docker 실행과 관련된 내용만 남긴다.

  

Docker의 버전 확인

```
$ docker --version
```

  

Docker 설치에 대한 자세한 정보 확인

```
$ docker version

### 혹은

$ docker info
```

  
hello world 실행

```
$ docker run hello-world
```

  

```
$ docker container ls --all
```

  

2\. 컨테이너
--------

### Docker 이미지 생성, 컨테이너 실행 튜토리얼 진행

컨테이너로 단순한 서버를 구축하는 튜토리얼을 진행한다.

우선 Dockerfile을 만든다.

```
$ touch Dockerfile

$ cat Dockerfile
# Use an official Python runtime as a parent image
FROM python:2.7-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

  

Python 패키지 목록을 만든다.

```
$ cat requirements.txt
Flask
Redis
```

  

소스코드 작성 app.py

```
$ cat app.py
from flask import Flask
from redis import Redis, RedisError
import os
import socket

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
```

  

  

Dockerfile로 이미지를 생성하기 위하여 Dockerfile, 패키지 목록, 소스코드를 확인

```
$ ls
Dockerfile       app.py           requirements.txt
```

  

Dockerfile로 friendlyhello라는 이름의 이미지 만들기

```
$ docker build --tag=friendlyhello .
```

  

생성된 이미지 확인

```
$ docker image ls
REPOSITORY            TAG                 IMAGE ID
friendlyhello         latest              326387cea398
```

  

생성된 이미지를 실행한다.

```
$ docker run -p 4000:80 friendlyhello
```

  

이 컨테이너 80 포트를 4000에 매핑한다.

  

  

해당 url로 접속하여 컨테이너의 동작 확인 한다.

```
$ curl http://localhost:4000
<h3>Hello World!</h3><b>Hostname:</b> 86e9b8deb983<br/><b>Visits:</b> <i>cannot connect to Redis, counter disabled</i>%
```

  

백그라운드에서 실행하려면 다음과 같다.

```
$ docker run -d -p 4000:80 friendlyhello
```

  

### Docker 이미지 공유

[Docker 허브](https://hub.docker.com/)에 로그인한다.

```
$ docker login
```

  

이미지를 공유하기 위해서는 다음과 같이 이미지 태그를 설정해야한다.

```
### docker tag 이미지명 유저이름/레포명:태그명
$ docker tag friendlyhello username/tutorial:part1
```

  

설정한 이미지를 업로드한다.

```
$ docker push username/tutorial:part1
```

  

[Docker 허브](https://hub.docker.com/)에 로그인하여 해당 repo(예 : tutorial)는 미리 만들어야 한다.

  

  

이미지를 업로드하면 다음과 같이 사용할 수 있다. 해당 이미지가 로컬에 존재하지 않는다면 자동으로 다운로드하고 로컬에 이미지를 생성해준다.

```
$ docker run -d -p 4000:80 username/tutorial:part1
```

  

3\. 서비스
-------

서비스의 개념은 [Docker 시작하기 - part3 서비스](https://docs.docker.com/get-started/part3/)를 참고한다. 서비스는 하나의 이미지만 실행하고 이미지 실행 방식을 체계화한다.

서비스의 개념에서 등장하는 것이 docker-compose.yml 파일이고 이는 도커의 행동방식을 정의하는 YAML 파일이다.

  

다음과 같이 docker-compose.yml을 작성한다.

```
$ cat docker-compose.yml
version: "3"
services:
  web:
    # replace username/repo:tag with your name and image details
    image: username/tutorial:part1
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - "4000:80"
    networks:
      - webnet
networks:
  webnet:

```

위의 YAML 파일에 대한 설명은 [Docker 시작하기 - part3 서비스](https://docs.docker.com/get-started/part3/)를 참고한다.

  

### 새로운 load-balanced app 실행

배포 전에 Swarm을 초기화 한다.

```
$ docker swarm init
```

  

이제 실행하는데 getstartedlab라는 이름의 스택으로 실행한다.

```
$ docker stack deploy -c docker-compose.yml getstartedlab

```

  

Docker의 서비스 목록을 확인하면 getstartedlab 뒤에 web이 붙어 getstartedlab\_web이라는 형태로 서비스가 존재하는 것을 확인할 수 있다.

```
$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                       PORTS
r8ikpt4dypup        getstartedlab_web   replicated          5/5                 username/tutorial:part1   *:4000->80/tcp

```

  

  

getstartedlab 스택의 서비스를 확인하면 다음과 같다.

```
$ docker stack services getstartedlab
ID                  NAME                MODE                REPLICAS            IMAGE                       PORTS
r8ikpt4dypup        getstartedlab_web   replicated          5/5                 username/tutorial:part1   *:4000->80/tcp

```

  

다음과 같은 명령으로 특정 서비스내 task 목록을 확인할 수 있다.(아마도 컨테이너 단위를 의미하는 듯 싶다.)

```
$ docker service ps getstartedlab_web
ID                  NAME                  IMAGE                       NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
dk5k5bt68eoa        getstartedlab_web.1   username/tutorial:part1   docker-desktop      Running             Running 25 minutes ago
nq0q77gcwo03        getstartedlab_web.2   username/tutorial:part1   docker-desktop      Running             Running 25 minutes ago
hsd20wrbpkjx        getstartedlab_web.3   username/tutorial:part1   docker-desktop      Running             Running 25 minutes ago
qin17db37xvs        getstartedlab_web.4   username/tutorial:part1   docker-desktop      Running             Running 25 minutes ago
s8u54k1ax8f6        getstartedlab_web.5   username/tutorial:part1   docker-desktop      Running             Running 25 minutes ago
```

  

다음과 같은 명령으로 특정 스택내 task 목록을 확인할 수 있다.

```
$ docker stack ps getstartedlab
ID                  NAME                  IMAGE                       NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
dk5k5bt68eoa        getstartedlab_web.1   username/tutorial:part1   docker-desktop      Running             Running 58 minutes ago
nq0q77gcwo03        getstartedlab_web.2   username/tutorial:part1   docker-desktop      Running             Running 58 minutes ago
hsd20wrbpkjx        getstartedlab_web.3   username/tutorial:part1   docker-desktop      Running             Running 58 minutes ago
qin17db37xvs        getstartedlab_web.4   username/tutorial:part1   docker-desktop      Running             Running 58 minutes ago
s8u54k1ax8f6        getstartedlab_web.5   username/tutorial:part1   docker-desktop      Running             Running 58 minutes ago

```

  

### 앱 확장

docker-compose.yml 파일을 다음과 같이 수정한다.

```
$ cat docker-compose.yml
version: "3"
services:
  web:
    # replace username/repo:tag with your name and image details
    image: username/tutorial:part1
    deploy:
      replicas: 10
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - "4000:80"
    networks:
      - webnet
networks:
  webnet:

```

  

이제 실행하는데 기존과 같은 getstartedlab라는 이름의 스택으로 실행한다.

```
$ docker stack deploy -c docker-compose.yml getstartedlab

```

  

  

서비스를 확인하면 다음과 같이 업데이트 된 것을 확인할 수 있다. 새로운 레플리카가 생성된 것을 확인할 수 있다.

```
$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                       PORTS
r8ikpt4dypup        getstartedlab_web   replicated          10/10               username/tutorial:part1   *:4000->80/tcp
```

  

```
$ docker stack ps getstartedlab
ID                  NAME                   IMAGE                       NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
dk5k5bt68eoa        getstartedlab_web.1    username/tutorial:part1   docker-desktop      Running             Running 2 hours ago
nq0q77gcwo03        getstartedlab_web.2    username/tutorial:part1   docker-desktop      Running             Running 2 hours ago
hsd20wrbpkjx        getstartedlab_web.3    username/tutorial:part1   docker-desktop      Running             Running 2 hours ago
qin17db37xvs        getstartedlab_web.4    username/tutorial:part1   docker-desktop      Running             Running 2 hours ago
s8u54k1ax8f6        getstartedlab_web.5    username/tutorial:part1   docker-desktop      Running             Running 2 hours ago
sqn7aohfghfg        getstartedlab_web.6    username/tutorial:part1   docker-desktop      Running             Running 3 minutes ago
3wee43wtqo1q        getstartedlab_web.7    username/tutorial:part1   docker-desktop      Running             Running 3 minutes ago
0h6xfiw9a92s        getstartedlab_web.8    username/tutorial:part1   docker-desktop      Running             Running 3 minutes ago
metnndctvyn4        getstartedlab_web.9    username/tutorial:part1   docker-desktop      Running             Running 3 minutes ago
rn22s1618j0g        getstartedlab_web.10   username/tutorial:part1   docker-desktop      Running             Running 3 minutes ago
```

  

스택의 종료는 다음과 같이 한다. 

```
$ docker stack rm getstartedlab
```

  

swarm의 종료는 다음과 같이 한다.

```
$ docker swarm leave --force
```

  

  

명령어 모음
======

파트별로 진행하며 사용한 명령어만 간략하게 살펴보기 위하여 정리하였다.

  

**part1 오리엔테이션**

```
## List Docker CLI commands
$ docker
$ docker container --help

## Display Docker version and info
$ docker --version
$ docker version
$ docker info

## Execute Docker image
$ docker run hello-world

## List Docker images
$ docker image ls

## List Docker containers (running, all, all in quiet mode)
$ docker container ls
$ docker container ls --all
$ docker container ls -aq
```

  

**part2 컨테이너**

```
$ docker build -t friendlyhello .  # Create image using this directory's Dockerfile
$ docker run -p 4000:80 friendlyhello  # Run "friendlyhello" mapping port 4000 to 80
$ docker run -d -p 4000:80 friendlyhello         # Same thing, but in detached mode
$ docker container ls                                # List all running containers
$ docker container ls -a             # List all containers, even those not running
$ docker container stop <hash>           # Gracefully stop the specified container
$ docker container kill <hash>         # Force shutdown of the specified container
$ docker container rm <hash>        # Remove specified container from this machine
$ docker container rm $(docker container ls -a -q)         # Remove all containers
$ docker image ls -a                             # List all images on this machine
$ docker image rm <image id>            # Remove specified image from this machine
$ docker image rm $(docker image ls -a -q)   # Remove all images from this machine
$ docker login             # Log in this CLI session using your Docker credentials
$ docker tag <image> username/repository:tag  # Tag <image> for upload to registry
$ docker push username/repository:tag            # Upload tagged image to registry
$ docker run username/repository:tag                   # Run image from a registry
```

  

**part3 서비스**

```
$ docker stack ls                                            # List stacks or apps
$ docker stack deploy -c <composefile> <appname>  # Run the specified Compose file
$ docker service ls                 # List running services associated with an app
$ docker service ps <service>                  # List tasks associated with an app
$ docker inspect <task or container>                   # Inspect task or container
$ docker container ls -q                                      # List container IDs
$ docker stack rm <appname>                             # Tear down an application
$ docker swarm leave --force      # Take down a single node swarm from the manager
```
