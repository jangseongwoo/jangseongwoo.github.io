---
title:  "Metabase와 Nginx를 로컬에서 실행하고 연동하기"
excerpt: "이 문서는 Metabase와 Nginx를 로컬에서 설치하고 실행하는 방법에 대해 정리하기 위해 작성했다."

categories:
  - Metabase
tags:
  - Metabase
  - Nginx

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 목적
=====

* * *

이 문서는 Metabase와 Nginx를 로컬에서 설치하고 실행하는 방법에 대해 정리하기 위해 작성했다.

Nginx는 Nginx의 기능 중 ssl을 이용한 HTTPS 연결이 가능하도록 하는 기능을 설정하기 위해 사용했다.

선결 지식 및 조건
==========

* * *

*   Metabase에 대한 기본적인 이해
    
*   Docker 환경 설치
    
*   Docker Container 실행 방법 및 기본 지식
    
*   Nginx 기본 설정 및 ssl 설정
    
*   ssl 설정을 위한 Pem파일
    

Metabase 설치 및 실행 
=================

* * *

Metabase를 Docker를 이용해 Container로 실행한다. 다음과 같은 명령어를 입력한다. 로컬 호스트의 디렉토리 경로를 테스트를 진행하는 호스트에 따라 적절하게 수정해준다. 아래의 명령어는 버전 0.29.3으로 설치하는 명령어이다. 다른 버전을 원한다면 마지막의 `metabase/metabase:v0.29.3`을 metabase/metabase로 수정하면 된다.

```
$ docker run -d -p 3000:3000 --name metabase -v $(pwd)/metabase.db:/metabase.db metabase/metabase:v0.29.3
```

Metabase Docker Container가 정상적으로 실행되었는 지 확인하기 위해 다음과 같은 명령어를 입력하고 결과를 확인한다.

```
$ docker ps

CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS                                      NAMES
29f03aae9325        metabase/metabase:v0.29.3   "/app/run_metabase.sh"   23 hours ago        Up 23 hours         0.0.0.0:3000->3000/tcp                     metabase
```

확인 후 웹 브라우저를 이용해 localhost:3000으로 접속한다. 접속 시 Metabase 로그인 화면이 보인다면 정상적으로 실행된 것이다. 

Nginx 설치 및 실행 
==============

* * *

Nginx를 Metabase에 연결하기 위해서 아래와 같이 Config 파일을 수정한다. Pem 파일을 어떻게 생성하는 지에 대한 부분은 이 문서의 범위를 벗어나므로 다른 사이트를 참고해 생성하도록 한다.

```
server {
  listen 80;
  listen [::]:80;
  return 301 https://$host$request_uri;
}

server {
  listen 443;

  ssl on;
  ssl_certificate  /nginx/data/.pem;
  ssl_certificate_key  /nginx/data/.pem;

  location / { 
    proxy_pass http://172.17.0.1:3000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
  

Docker Container 생성 시 기본 네트워크 드라이버 설정은 Brigde이다. 

따라서 위의 Nginx 설정 중 proxy_pass의 값은 Metabase docker container의 ip값으로 설정되어야 하며 아래와 같은 명령어를 통해 확인할 수 있다. 

```
$ docker inspect -f "{{ .NetworkSettings.IPAddress }}" metabase;
```

자세한 내용은 블로그 문서 [Docker Container Network 중 Bridge에 대한 설명 정리](https://jangseongwoo.github.io/tags/#docker)를 참고한다. 

  

이제 Nginx를 Docker를 이용해 Container로 실행한다. 다음과 같은 명령어를 입력한다. {path} 부분은 각 로컬 환경에 따라 설치된 metabase 경로에 맞게 설정해준다. 

```
$ docker run --name nginx -v $(path)/metabase/nginx/log:/var/log/nginx -v $(path)/metabase/nginx/data:/nginx/data -v $(path)/metabase/nginx/conf:/etc/nginx/conf.d -p 80:80 -p 443:443 -it -d nginx
```
  
```
$ docker ps

CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS                                      NAMES
4b4441129191        nginx                       "nginx -g 'daemon of…"   23 hours ago        Up 23 hours         0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp   nginx
29f03aae9325        metabase/metabase:v0.29.3   "/app/run_metabase.sh"   23 hours ago        Up 23 hours         0.0.0.0:3000->3000/tcp                     metabase
```

Docker Container가 정상적으로 실행되었는 지 확인하기 위해 다음과 같은 명령어를 입력하고 결과를 확인한다.

  

결과 확인 
======

* * *

웹 브라우저를 이용해 아래와 같은 주소에 접속해 정상적으로 접속이 되는 지 확인한다.  https 를 사용하여 ssl 연결이 정상적으로 동작되는지 확인한다.

```
https://localhost
```