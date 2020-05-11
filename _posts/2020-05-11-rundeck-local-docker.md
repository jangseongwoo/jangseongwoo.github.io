---
title: "Rundeck Local환경에서 Docker로 실행해보기"
excerpt: "신입 개발자, 경력 개발자의 면접 평가 요소의 차이와 면접 팁에 대해 설명하고 이번에 신입부터 현재 직장까지 오게 된 이직기를 말씀드리겠습니다. "

categories:
  - Rundeck
tags:
  - Rundeck
  - Docker
  - Docker_container

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

# Rundeck이란?
Rundeck는 특정 작업을 효율적으로 진행할 수 있도록 도와주는 자동화 기능을 가진 오픈소스 소프트웨어이다.  Rundeck을 이용해 기존 쉘 스크립트, 툴 등을 스케줄링 잡으로 만들어 특정 시간대에 실행하는 작업을 자동화할 수 있으며 워크플로우 제어, 스케줄링, 로깅, 액세스 제어 등 여러가지 기능들이 있다.  다른 자동화 툴과 연계해 사용할 수 있으며 Airflow와 비슷한 기능이 많다. 

# Rundeck Docker Container로 실행하기
Rundeck을 Local 환경에 직접 설치하지 않고 Docker container로 실행해보자. Docker는 이미 설치되어 있다고 가정하고 진행한다. 

```
$ docker run --name test-rundeck -p 4440:4440 -v data:/home/rundeck/server/data rundeck/rundeck:3.2.6
```

위의 명령어를 입력해 rundeck 3.2.6 버전을 Container로 실행한다. 
실행 후 브라우저를 이용해 아래의 주소에 접속한다. 

```
127.0.0.1:4440
```

Test를 하기 위해 현재 위치에서 test_echo.sh를 생성하고 아래와 같이 입력한다. 

```
echo "test"
```

이후 이 파일을 직접 Docker container로 Docker cp 명령어를 이용해 복사할 것이다. 

```
$ docker cp test_echo.sh test-rundeck:/home/
```

```
$ docker exec -it -u root test-rundeck bash

$ cd /home/
$ sudo chmod +x test_echo.ssh
```
