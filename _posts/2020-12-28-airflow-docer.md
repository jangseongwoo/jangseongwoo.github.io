---
title: 에어플로우 설치해보기(using docker)
excerpt: Docker를 사용해 에어폴로우 설치를 진행한다. 도커를 이용해 테스트는 로컬에서 진행하지만 실제 프로덕션에서도 도커만 설치되어 있다면 같은 환경으로 개발할 수 있는 이점이 있다. 
    아래 명령을 참조해 에어플로우를 로컬 환경에 설치해본다.
categories:
- Airflow
tags:
- Airflow
- Docker
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---


에어플로우 개요
========

* * *

[Apache Airflow](https://airflow.apache.org/)

*   복잡한 계산을 요하는 작업흐름과 데이터 처리 파이프라인을 조율하기 위해 만든 오픈소스 도구
    
*   주기적인 작업을 등록하거나 ETL 툴로써 좋은 도구가 될 수 있다. 
    

에어폴로우는 기존 Rundeck과 같은 스케줄러와 다른 점은 아래의 방향성 비순환 그래프(DAG)를 만들 수 있다는 것이다.

아래 그림처럼 작업은 Task 단위로 분리되며 각 각의 Task는 선후 관계를 가지고 실행될 수 있다. 특정 작업은 1,2,3,4의 작업이 마무리되어야지만 실행가능하다고 했을 때, 아래 그림처럼 구성해 작업을 실행할 수 있는 것이다. 

![](/assets/images/airflow-1.png)

진행 환경
=====

* * *

로컬 환경

*   Mac Catalina 10.15.7
    
*   Docker 
    
    *   Engine 19.03.8
        
    *   Desktop community 2.3.0.3
        

에어플로우 설치해보기(using docker)
=========================

* * *

Docker를 사용해 에어폴로우 설치를 진행한다. 도커를 이용해 테스트는 로컬에서 진행하지만 실제 프로덕션에서도 도커만 설치되어 있다면 같은 환경으로 개발할 수 있는 이점이 있다. 

아래 명령을 참조해 에어플로우를 로컬 환경에 설치해본다.

```
$ docker pull puckel/docker-airflow

$ docker images
...
puckel/docker-airflow                           latest                                           ce92b0f4d1d5        9 months ago        797MB
...

$ docker run -d -p 8080:8080 puckel/docker-airflow webserver

# 아래의 주소에 접속한다.
# http://localhost:8080/admin/
```

이렇게 할 경우 DAG를 직접 도커에 들어가서 해야되는 불편함이 있다. 

아래 명령어를 이용해 로컬환경의 특정 Path를 도커의 볼륨을 이용해 로컬환경에서 직접 설치한 것과 같이 개발할 수 있도록 해본다. 

```
# docker에 직접 접속하는 방법. 그러나 불편하다.
$ docker exec -ti <container name> bash
$ docker exec -ti keen_allen bash

$ docker stop 

# 아래의 -v이후 첫번째 파라미터는 각자의 로컬 환경에 맞게 진행한다. 
$ docker run -d -p 8080:8080 -v /Users/jangstar/test/airflow_tutorial/:/usr/local/airflow/dags  puckel/docker-airflow webserver
```

Airflow을 이용해 간단한 DAG 만들고 실행해보기 
===============================

* * *

설치 시 docker안의 /usr/local/airflow에 아래의 파일이 존재한다. 

```
$ ls
airflow.cfg  airflow.db  airflow-webserver.pid  dags  logs  unittests.cfg
``` 

아래 명령어로 기본 sql lite db를 초기화한다. 

```
$ airflow initdb
# 실행 결과 에러 발생, 추후 다시 봐야될듯
```

```
# version 확인
$ airflow version

# 현재 등록된 DAG 확인
$ airflow list_dags

# DAG 테스트 등록하기 위해 파일 생성
$ touch my_first.py
```

  
아래의 코드를 `my_first.py`에 입력한다. 

```
from airflow.models import DAG
from airflow.utils.dates import days_ago
from airflow.operators.bash_operator import BashOperator

args = {'owner': 'jovyan', 'start_date': days_ago(n=1)}
dag  = DAG(dag_id='my_first_dag',
           default_args=args,
           schedule_interval='@daily')

t1 = BashOperator(task_id='print_date',
                  bash_command='date',
                  dag=dag)

t2 = BashOperator(task_id='sleep',
                  bash_command='sleep 3',
                  dag=dag)

t3 = BashOperator(task_id='print_whoami',
                  bash_command='whoami',
                  dag=dag)

t1 >> t2 >> t3
```

```
# 문법 체크
$ python my_first.py

# DAG에 제대로 입력 됬는지 확인한다. 
$ airflow list_dags
latest_only_with_trigger
my_first_dag
test_utils
tutorial


# DAG 구성 확인
$ airflow list_tasks my_first_dag
[2020-11-11 12:53:51,742] {{__init__.py:51}} INFO - Using executor SequentialExecutor
[2020-11-11 12:53:51,743] {{dagbag.py:403}} INFO - Filling up the DagBag from /usr/local/airflow/dags
print_date
print_whoami
sleep
$ airflow list_tasks my_first_dag —tree


# TASK 실행
# [사용법] airflow test dag_id task_id execution_date
$ airflow test my_first_dag print_date 2019-06-01T09:00:00

# 스케줄러 실행, 도커로 실행 시 스케줄러가 실행되고 있지 않아서 DAG가 아무것도 안보이는데 
# 실행하면 바로 생성한 DAG가 보인다.
$ airflow scheduler &
```


참고
========

* * *
 
진행하며 참고한 블로그, 간편하게 한번 해보기 좋은 예제가 있어서 해봤다. 

*   [https://blog.naver.com/PostView.nhn?blogId=wideeyed&logNo=221565240108](https://blog.naver.com/PostView.nhn?blogId=wideeyed&logNo=221565240108)