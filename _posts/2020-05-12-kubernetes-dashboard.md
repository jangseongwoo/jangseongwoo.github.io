---
title: "Kubernetes dashboard 설치하고 실행하기"
excerpt: "이 글에서는 Kubernetes dashboard를 Local 환경에서 설치하고 실행해보는 것을 목적으로 한다. "

categories:
  - Kubernetes
tags:
  - Kubernetes
  - Docker
  - Kubernetes_dashboard

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

# 목적
이 글에서는 Kubernetes dashboard를 Local 환경에서 설치하고 실행해보는 것을 목적으로 한다. 

# 테스트 환경
테스트 환경은 다음과 같다. 
* MacOS Catalina version 10.15.4
* Mac Terminal
* Docker desktop community 2.3.0.2
* Docker engine 19.03.8
* Kububernetes 1.16.5

# Pre-requirement
이 글의 테스트를 따라하기 위한 사전 조건은 다음과 같다. 
* Docker 설치

# Kubernetes 설치하기 
Kubernetes를 설치하기 위해 먼저, Docker desktop을 실행한다. 
실행 후 Docker desktop 아이콘을 클릭하면 환경 설정으로 들어갈 수 있다. 환경 설정에서 Kubernetes를 클릭하면 아래와 같은 화면이 나온다.
아래와 같이 **Enable Kubernetes와  Show system  containers (advanced)를 클릭한다.  **  
![](/assets/images/kubernetes_config.png)

그러면 자동으로 Kubernetes가 설치가 되며 MacOS용 Docker에서 제공하는 Kubernetes 통합 기능을 이용해 Kubernetes를 로컬에서 실행할 수 있게 된다.

# Kubernetes Dashboard 설치하기 
Kubernetes dashboard를 설치하기 위해 다음과 같은 명령어를 Terminal에서 실행한다. 
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
```

Kubernetes dashboard를 실행하기 위해 다음과 같은 명령어를 Terminal에서 실행한다. 
```
kubectl proxy
```

실행한 후 아래와 같은 주소를 브라우저에 입력하면 접속할 수 있다. 
```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

처음 접속 시 2개의 방법을 통해 로그인을 할 수 있는데 Token을 이용해 하는 방법을 설명한다. 
Kubernetes dashboard를 접속할 수 있는 Token을 얻기 위해 다음과 같은 명령어를 Terminal에서 실행한다. 
```
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')
```

그러면 아래와 같이 결과가 나오게 되는데 token: 이후의 부분을 복사해 브라우저에서 token 항목에 입력하면 Dashboard에 로그인할 수 있다. 
```
Name:         default-token-
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: default
              kubernetes.io/service-account.uid: c86b5ad5-

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  20 bytes
token:      secret
```
