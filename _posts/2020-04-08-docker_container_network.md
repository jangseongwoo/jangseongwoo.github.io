---
title:  "Docker Container Network 중 Bridge에 대한 설명 정리"
excerpt: "이 문서는 Docker Container 간 통신이 어떻게 이뤄지는 지에 대한 기본적인 내용과 Docker Network중 Bridge와 관련되어 학습한 내용을 정리하기 위해 작성했다."

categories:
  - Docker
tags:
  - Docker
  - Container
  - Docker_Network
  - Bridge

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 목적
=====

* * *

이 문서는 Docker Container 간 통신이 어떻게 이뤄지는 지에 대한 기본적인 내용과 Docker Network중 Bridge와 관련되어 학습한 내용을 정리하기 위해 작성했다.

  

선결 지식
=====

* * *

본 문서를 이해하기 위해 아래의 사항에 대한 선결지식이 필요하다.

*   [Linux namespace](https://bluese05.tistory.com/11)
    
*   Docker container 
    

Docker network 개요
=================

* * *

Docker container가 매우 강력한 이유 중 하나는 Docker container 간 Network 연결을 할 수 있으며 Docker container와 Docker container가 아닌 워크로드에 연결할 수 있기 때문이다.

Docker container와 서비스는 연결하려는 것이 Docker container인지 아닌지 알 필요가 없다. Docker 호스트는 Docker를 이용해 플랫폼에 구애받지 않고 Docker container들을 관리, 연결할 수 있다.

  

Docker network drivers
======================

* * *

Docker networking subsystem은 [Network driver](https://docs.docker.com/network/#network-drivers) 들을 이용해 Container 간 연결을 쉽게할 수 있다. 여러 Network driver들은 기본으로 제공되며 Network driver는 다음과 같은 것들이 있다. 

*   [Bridge](https://docs.docker.com/network/bridge/)
    
*   Host
    
*   Overlay
    
*   Macvlan
    
*   None
    
*   Network plugins
    

Docker container 생성 시 기본적으로 설정되는 Network driver는 [Bridge](https://docs.docker.com/network/bridge/)이다. 그래서 **이 문서에서는 Docker network driver 중 Bridge에 대해서만 설명을 진행**한다. 

Docker network driver bridge
============================

* * *

Docker를 설치하게 되면 자동으로 **Host machine**의 Network interface에 **Docker0라는 Virtual interface가 생성**된다. Docker0는 Host machine의 네트워크에 생성이 되며 특징은 다음과 같다.

*   **Gateway는 자동으로 172.17.0.1로 설정** 되며 16 bit netmask(255.255.0.0) 로 설정된다. 
    
*   이 ip는 DHCP를 통해 할당 받는 것은 아니며, docker 내부 로직에 의해 자동 할당 받는 것이다.
    
*   **docker0 는 일반적인 interface가 아니며, virtual ethernet bridge 이다.**
    

Container가 생성될 때 사용자가 특정 Network driver를 설정한 것이 아니라면 Default로 Docker0라는 Network interface에 연결이 된다.

Docker0는 각 Container의 veth 인터페이스와 바인딩되며, 호스트OS의 eth0 인터페이스와 이어주는 역할을 한다. 그림으로 표현하면 다음과 같다. 

![](/assets/images/docker_network.jpg)

Docker network driver인 bridge에 대해 살펴보기 위해 Docker inspect 명령을 이용해 default Bridge에 대한 정보를 확인해본다. 또한, Container를 실행, 중지하며 ip가 어떻게 할당되는 지 확인할 것이다.

Default로 생성된 Bridge 확인 및 Container 실행하기 
----------------------------------------

Host machine의 Docker network를 확인하기 위해 다음과 같은 명령어를 입력한다. 결과를 통해 docker network bridge가 생성되어 있음을 확인할 수 있다.

```
$ docker network ls 

NETWORK ID          NAME                DRIVER              SCOPE
803a5d2302ae        bridge              bridge              local
9f7e1fc9c760        host                host                local
6327db5741c8        none                null                local
```
  

Default로 생성된 bridge에 대한 정보를 확인하기 위해 다음과 같은 명령어를 입력한다. 

```
$ docker network inspect bridge

[
    {
        "Name": "bridge",
        "Id": "708de6eadf6df7b1664c24d57068e4ee563083b7d40966ef1fabdb6e6f7d6c19",
        "Created": "2019-12-17T02:26:14.548142243Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
```
  

Linux 계열 OS(Mac 제외)에서는 다음과 같은 명령어로 Host machine에 생성된 Docker0를 확인할 수 있다.

```
$ ip link

  

응답예:

1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default  
link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00  
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc mq state UP mode DEFAULT group default qlen 1000  
link/ether 0a:86:23:77:c7:58 brd ff:ff:ff:ff:ff:ff  
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default  
link/ether 56:84:7a:fe:97:99 brd ff:ff:ff:ff:ff:ff  
17: veth4ad9372: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP mode DEFAULT group default  
link/ether ae:7b:c6:12:47:b5 brd ff:ff:ff:ff:ff:ff
```
  

정보 확인 결과를 통해 다음과 같은 사실을 알 수 있다.

*   Default로 생성되는 Network bridge인 Docker0가 생성되어있다.
    
*   Docker0의 Gateway는 172.17.0.1로 할당되어있다.
    

  

Docker container가 생성시 Docker0에 연결되며 ip는 순차적으로 할당받는다는 것을 확인하기 위해 2개의 Docker container를 실행한다. Container는 어떤 이미지를 사용하든 상관없으나 예시에서는 metabase, nginx를 실행한다. 

다음과 같은 명령어를 터미널에서 입력한다. Metabase container를 먼저 실행하고 그 뒤에 Nginx container를 실행한다.

```
$ docker run -d -p 3000:3000 --name metabase metabase/metabase
$ docker run --name nginx -p 80:80 -p 443:443 -it -d nginx
```
  

실행한 Container가 Default network bridge에 연결된 것과 Container에 할당된 ip 정보 확인
---------------------------------------------------------------------

실행된 2개의 Container의 ip와 Network bridge에 대해 살펴보기 위해 아래와 같은 명령어를 입력하고 결과를 확인한다.  

```
$ docker inspect bridge

[
    {
        "Name": "bridge",
        "Id": "803a5d2302aeacf5287cb5965e57c27089631da415c847cfdfbbb64ca8d30d6e",
        "Created": "2019-12-10T08:46:11.87359326Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "4b4441129191fbe839a650e8f707a09164d4e59d97a3c600d400745044a4fcb6": {
                "Name": "nginx",
                "EndpointID": "ca4b72f736d7487ed28ccf14566db70f0cd6c22452c36f812884ef1f5970733d",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
            "a945aa2f444e4c44b31af2179ee00b0bbbcc415ab43a47176abb8cb53548c9ae": {
                "Name": "metabase",
                "EndpointID": "1c0f86d1144ea8103298ff99a357b8986db5127db95c76ec54f2366d05d7b932",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            },
        },
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
```
  

결과를 통해 다음과 같은 사실을 알 수 있다. 

*   Docker container 실행 시 할당되는 ip는 "172.17.0.2"부터 순차적으로 할당된다. metabase container가 먼저 실행되었기 때문에 ip가 "172.17.0.2"로 할당되고 뒤이어 실행된 nginx container는 ip가 "172.17.0.3"으로 할당된 것을 확인할 수 있었다.
    
*   Docker container 실행 시 Default로 Docker0라는 가상 Network interface에 연결된다. 
    

  

다음은 Container 생성 시 eth0가 생성되는 것을 확인하기 위해 다음과 같은 명령어를 입력한다. 아래 예시는 Docker 공식 사이트([https://success.docker.com/article/networking#whatyouwilllearn](https://success.docker.com/article/networking#whatyouwilllearn))에서 발췌한 것이며 위에 생성한 Container와 다른 Container를 실행해서 테스트하지만, 해당 방법이 eth0가 생성되는 것을 확인하는데에는 문제가 없기 때문에 아래의 예시를 사용했다.

```
$ docker run --rm -it --name c1 busybox sh
# in docker 
$ ip address

1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: tunl0@NONE: <NOARP> mtu 1480 qdisc noop qlen 1
    link/ipip 0.0.0.0 brd 0.0.0.0
3: ip6tnl0@NONE: <NOARP> mtu 1452 qdisc noop qlen 1
    link/tunnel6 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00 brd 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00
28: eth0@if29: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue
    link/ether 02:42:ac:11:00:04 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.4/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

결과를 통해 eth0가 생성되었으며 Container의 ip는 172.17.0.4로 할당되었음을 확인 할 수 있다. 

Container 중지, 시작 시 ip가 변경되는 지 확인
--------------------------------

이번에는 Container가 실행되면서 할당받은 ip가 해당 Container가 중지되고 재실행됬을 때, 동일한 ip를 가지고 실행되는 지 다른 ip를 할당받아 실행되는 지 확인한다.

확인을 위해 위에 테스트에서 실행된 Metabase, Nginx 2개의 Container를 중지한다.

```
$ docker stop metabase
$ docker stop nginx
$ docker ps
# Metabase, nginx가 중지된 것을 확인한다. 
```
  

이번에는 위의 예시처럼 metabase, nginx 순서로 실행하는 것이 아닌 nginx, metabase 순서로 실행해서 결과를 확인한다. 기존 Nginx의 ip는 172.17.0.3으로 할당되었으며 Metabase의 ip는 172.17.0.2로 할당되었다. 

```
$ docker start nginx
$ docker start metabase
$ docker inspect bridge

[
    {
        "Name": "bridge",
        "Id": "803a5d2302aeacf5287cb5965e57c27089631da415c847cfdfbbb64ca8d30d6e",
        "Created": "2019-12-10T08:46:11.87359326Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "4b4441129191fbe839a650e8f707a09164d4e59d97a3c600d400745044a4fcb6": {
                "Name": "nginx",
                "EndpointID": "2aa7e1481e72ec47d976e1d49e63715219fab5e4dd785c388f3b2845f319b6e0",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            },
            "a945aa2f444e4c44b31af2179ee00b0bbbcc415ab43a47176abb8cb53548c9ae": {
                "Name": "metabase",
                "EndpointID": "89e4b1690cce8f2bd6d7a96d3a464dba1bd9349db20bf4c88a99427ace3afb16",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
        },
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
```
  

테스트 결과를 통해 다음과 같은 사실을 알 수 있다.

*   Nginx container의 ip가 172.17.0.3에서 172.17.0.2으로 변경되었다.
    
*   Metabase container의 ip가 172.17.0.2에서 172.17.0.3으로 변경되었다.
    
*   Container에 할당되는 ip는 실행되면서 변경될 수 있으며, 실행 순서에 따라 실행 시 ip가 변경되어 할당 될 수도 있다는 것을 확인할 수 있었다. 
    

  

따라서, Container간 통신 시 실행중에 할당된 Container의 ip를 사용하여 통신 설정을 할 경우 해당 Container가 재시작되는 경우 ip가 변경되어 이슈가 발생할 수 있다. 해당 이슈가 발생하지 않게 하기 위한 해결 방법은 다음과 같다. 

*   Container간 통신 시 Docker0 gateway ip와 Container의 Port 번호로 설정한다. ex) [http://172.17.0.1:3000](http://172.17.0.1:3000/)
    
*   Docker compose를 이용해 각 Container를 각각 Service로 등록한 후 통신 설정 시 Service name을 설정한다.
    

  

해결방법에 대한 자세한 내용은 이 문서의 범위를 벗어나 기술하지 않으며 필요 시 Docker [공식 홈페이지](https://docs.docker.com/compose/overview/)를 참고한다.

결론
==

* * *

학습을 통해 Docker Container의 통신이 어떻게 이뤄지는 지 알 수 있었으며, Container 실행 시 어떻게 ip를 할당 받는 지 테스트해 향후 Container 간 통신시 Container의 ip를 직접 입력할 경우 이슈가 발생할 수 있다는 것을 알 수 있었다. 

  

참고 자료 
======

* * *

*   Linux namespace - NET:  [https://bluese05.tistory.com/28](https://bluese05.tistory.com/28)
    
*   Docker Network 구조(1) - docker0와 container network 구조: [https://bluese05.tistory.com/15](https://bluese05.tistory.com/15)
    
*   Docker 공식 사이트 network part: [https://docs.docker.com/network/](https://docs.docker.com/network/)
    
*   Docker 공식 사이트 network part - bridge networks: [https://docs.docker.com/network/bridge/](https://docs.docker.com/network/bridge/)
    
*   Docker Swarm Reference Architecture: Exploring Scalable, Portable Docker Container Networks: [https://success.docker.com/article/networking#whatyouwilllearn](https://success.docker.com/article/networking#whatyouwilllearn)
    
*   Linux namespace: [https://bluese05.tistory.com/11](https://bluese05.tistory.com/11)
    
*   [[번역] 확장성 있고, 이식성 있는 Docker Container 네트워크 설계](https://ziwon.github.io/post/designing-scalable-portable-docker-container-networks/): [https://ziwon.dev/post/designing-scalable-portable-docker-container-networks/](https://ziwon.dev/post/designing-scalable-portable-docker-container-networks/)
    
*   Docker 네트워크 설명 개인 블로그 글:
    
    *   [https://doitnow-man.tistory.com/183](https://doitnow-man.tistory.com/183)
        
    *   [https://jungwoon.github.io/docker/2019/01/13/Docker-4/](https://jungwoon.github.io/docker/2019/01/13/Docker-4/)