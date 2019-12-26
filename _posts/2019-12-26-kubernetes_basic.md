---
title:  "Kubernetes 입문자를 위한 기초 내용 정리"
excerpt: "이 문서는 Kuberetes에 대한 기초 내용을 개인적으로 내용을 정리하기 위하여 작성되었다."

categories:
  - Kubernetes
tags:
  - Kubernetes
---

문서목적
====

이 문서는 Kuberetes에 대한 기초 내용을 개인적으로 내용을 정리하기 위하여 작성되었다.  
자세한 내용이나 특정 항목에 대한 서비스의 구체적인 정보는 공식사이트 자료를 참고하도록 한다.
  

Docker 기초 개념
------------

### 가상화의 정의

*   동일한 또는 상이한 여러 개의 운영체제를 완전히 독립된 방식으로 동시에 실행하는 것 (ex. 하나의 머신 위에 Linux와 Window 운영 체제를 동시에 실행)
    

### 가상화의 장점

*   하드웨어의 소프트웨어화 ⇒ 유연성, 자동화, 민첩성
    
*   높은 하드웨어 활용도
    
*   여러 개의 운영체제, 소프트웨어 운영 가능
    
*   High Scalability
    
*   High Availability - Live Migration
    
*   하드웨어 관리 부담 감소
    
*   Migration 용이
    

### Hypervisor

*   하드웨어와 가상화된 OS 사이에서 둘 사이의 인터페이스 역할을 하면서 하드웨어 자원을 가상화 OS에 공유해주고 관리하는 역할을 하는 소프트웨어
    

  

### Docker에 대한 장점과 특징

도커와 VM의 아키텍쳐

![](/assets/images/kube.jpg)

### Docker란?

*    컨테이너가 돌아갈 수 있는 환경을 제공
    
*    사실 상의 컨테이너 표준
    

### Docker의 장점 및 VM과 Docker의 차이점

*   Light and Scalable
    
*   Portable
    

A container runs _natively_ on Linux and shares the kernel of the host machine with other containers. It runs a discrete process, taking no more memory than any other executable, making it lightweight.

By contrast, a virtual machine (VM) runs a full-blown “guest” operating system with _virtual_ access to host resources through a hypervisor. In general, VMs provide an environment with more resources than most applications need.

  

### Docker 컨데이터 개발 방법

![](/assets/images/kube2.jpg)

그림 . 도커 워크플로우

*   Dockerfile이란 빌드 파일을 통해서 이미지 생성
    
*   Image를 Docker run 명령어로 Container 실행
    
*   Docker hub가 있어 공식 이미지 또는 커스텀 이미지를 올리고 내려 받을 수 있다.
    
*   Container는 Stateless이므로 영구 저장이 필요한 파일은 별도 스토리지에 저장해야 한다.
    

  

* * *

Kubernetes 기초 개념
----------------

### Kubernetes가 필요한 이유

*   수 많은 Docker들을 관리하기 위해
    
*   최근 2017~2018년도 트렌드 분석 시 컨테이너 관리 표준 처럼 되어 가고 있는 것을 알 수 있다.
    

### Kubernetes(이하 K8S) Pod

*   K8S의 기본적인 관리 단위 -> 관리의 편의성
    
*   하나 이상의 컨테이너를 가질 수 있음
    
*   공유 유틸리티 역할을 하는 컨테이너를 Pod에 같이 패키징 가능
    
*   같은 Pod안의 컨테이너들은 IP 주소와 로컬 디스크를 공유 할 수 있다.
    

그림 . Pods 구조 예시

![](/assets/images/kube3.jpg)

K8S 아키텍처
--------

### K8S architecture, component

  

![](/assets/images/kube4.jpg)

*   K8S는 Master component와 Node component로 구성되어 있다.
    
*   Master component는 K8S Cluster의 컨트롤 영역을 제공한다. (ex. 배포, 스케줄링 등)
    
*   각 Component의 자세한 설명은 공식 사이트 참조를 하면 된다.
    

*   Components
    
    *   kube-apiserver: K8S API 서버, All communication about cluster state flows through the API Server.
        
    *   etcd: AKA The API Server’s datastore, 영구적 저장
        
    *   kubelet: Communicates with API Server to know what pods it should run, Broadcasts status of pods, nodes
        
    *   controller-manager: AKA managing controllers powering Kubernetes abstractions
        
    *   kube-scheduler: A control loop that is crucial to cluster operation by ensuring that nodes run pods
        
    *   node: container runtime interface, default is docker. 
        
    *   kube-proxy: manage network communication between node, pods. expose container traffic like load balancer
        

### K8S service

*   Service- L4 Load balancer
    

![](/assets/images/kube4.jpg)

K8S ingress

*   Ingress-  L7 Load balancer
    
*   URI 기반으로 서비스 별 라우팅
    
*   Google Cloud의 Load balancer
    

![](/assets/images/kube5.jpg)

### K8S Deployments& ReplicaSet

*   Deployment가 복수개의 ReplicaSet을 통해 Rolling Update 방식으로 처리한다.
    


