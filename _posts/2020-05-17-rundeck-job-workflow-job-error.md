---
title: "Rundeck 설치와 Job 등록하기, Workflow, Job 실행 시 Error에 대한 설명"
excerpt: "이 문서 작성의 목적은 Rundeck에 대해 공부한 것을 정리하기 위한 것이다.

모든 범위의 내용에 대해 정리한 것이 아닌 중요하다고 생각한 특정 항목들에 대해 정리한다."

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

문서 개요
=====

* * *

문서 작성 목적
--------

이 문서 작성의 목적은 Rundeck에 대해 공부한 것을 정리하기 위한 것이다.

모든 범위의 내용에 대해 정리한 것이 아닌 중요하다고 생각한 특정 항목들에 대해 정리한다.

다루는 내용
------

이 문서는 아래의 항목에 해당하는 것에 대해 설명한다.

작동 관련 

*   Job을 등록하고 실행하는 방법
    
*   Workflow 
    
*   Job 실행 시 Error   
    

컨셉 관련

*   Job의 성공 여부는 어떻게 체크하고 있는가?
    
*   스케줄링은 어떻게 되고 있는건가?
    

Pre-requirements
----------------

다음과 같은 항목에 대해 사전 지식 또는 설치가 되어 있다는 가정하에 진행한다.

*   Docker
    

Test 환경
-------

Test 환경은 다음과 같다.

*   macOS Catalina 10.15.4
    
*   Rundeck 3.2.6
    

Rundeck을 Docker Container로 실행하기
===============================

* * *

Docker가 설치되어 있다는 가정하에 진행한다.

Rundeck을 Docker container로 실행하기 위해 다음과 같은 명령어를 입력한다.

```
$ docker run --name test-rundeck -p 4440:4440 -v {local_volume_path}:/home/rundeck/server/data rundeck/rundeck:3.2.6
```

명령어 입력 후 브라우저를 이용해 아래의 주소에 접속한다.

```
127.0.0.1:4440
```

Rundeck login화면이 보인다면 정상적으로 실행된 것이다. Login하기 위해 다음과 같이 ID, PW를 입력한다.

*   ID: admin
    
*   PW: admin
    

Job을 등록하고 실행하는 방법
=================

* * *

Job을 등록하고 실행하기 위해 Rundeck docker container(이하 Rundeck)에서 로컬 볼륨을 공유한 폴더에서 테스트 스크립트를 작성한다.

test\_echo.sh를 생성하고 아래와 같이 입력한다.

```
echo "test"
date
```

로그인 하게 되면 이제 프로젝트를 만들어야되는데 프로젝트는 JOB들의 집합이며 하나의 서비스라고 생각하면 된다. 이 프로젝트에서 여러 개의 작업들을 정의할 수 있고 각 작업들은 각 각의 Workflow에 따라 1회 또는 스케줄링 되어 실행되게 된다. 지금은 테스트로 프로젝트를 생성하는 것이니 자유롭게 항목을 채워 프로젝트를 생성한다.

![](/assets/images/rundeck1.jpg)

입력한 후 왼쪽의 JOBS 클릭하면 아래와 같은 화면이 나온다. 아래 사진은 이미 작업을 생성해서 조금 다를 수 있는데, ‘Create a new Job’ 항목을 클릭해 새로운 작업을 생성한다.

![](/assets/images/rundeck2.jpg)

클릭하면 아래와 같이 여러 카테고리가 있고 각 카테고리는 세부 항목들이 있는데, 우리가 할 것은 스케줄링된 Shell script 실행을 하는 작업이기 때문에 Details에 작업 이름을 입력하고 ‘Schedule’ 항목을 클릭한다.

![](/assets/images/rundeck3.jpg)

클릭하면 아래와 같은 화면이 나오는데 ‘Schedule to run repeatedly’ 항목에 Yes를 하고 원하는 시간을 설정한다.

![](/assets/images/rundeck4.jpg)

그 다음은 ‘Workflow’를 클릭한 이후에 설정하면 되는데 Add a Step에서 Command를 클릭해 우리가 만든 Shell script를 설정하면 된다.

Shell script 경로 설정 시 절대경로로 해주어야 하며 Local host machine의 경로가 아닌 Docker Container의 경로를 입력해야 제대로 실행이 된다.

![](/assets/images/rundeck5.jpg)

설정 한 이후 Job을 바로 실행시켜볼 수 있는데 아래와 같이 나오면 성공적으로 실행된 것이다.

![](/assets/images/rundeck6.jpg)

Workflow 설정 및 설명
================

* * *

1개의 Job은 여러 개의 실행이 가능한 명령의 집합인데, 이 명령들은 순서를 가질 수도 있고 순서 없이 실행될 수 있다.

이런 것들을 정의하기 위해 Rundeck에서는 Workflow가 있다.

Option
------

먼저, Option에 대해 설명한다.

Option은 해당 Job에 대한 설명을 추가할 수 있으며 Job을 실행할 때 특정 값을 입력하지 않으면 실행이 되지 않게 하는 것등을 설정할 수 있다.

자세한 내용은 다음을 참고한다.

*   [https://docs.rundeck.com/docs/manual/job-options.html](https://docs.rundeck.com/docs/manual/job-options.html)
    

Workflow
--------

Workflow에선 두 가지 중요한 설정이 있다. 이 두 가지 설정 중 하나는 특정 Step에서 실패 했을 경우 어떻게 할지 설정하는 것이다.

*   Stop at the failed step: 바로 실패(Default)
    
*   Run remaining steps before failing: 다음 Step을 진행하고 모든 Step이 끝난 후 작업을 실패 처리
    

![](/assets/images/rundeck7.jpg)

두 번째는 Strategy이다. Strategy는 Step들을 어떻게 각 Node에 실행할 지 컨트롤하는 설정이다. Node-Oriented와 Step-Oriented이 있다.

*   _Node First_: 모든 Workflow를 각 노드에 실행한다. (default)
    
*   _Sequential_: 각 Step을 차례대로 모든 노드에 실행시킨다. 실행된 Step은 모든 노드에서 실행이 완료되어야 다음 Step으로 진행한다.
    
*   _Parallel_: 모든 Step들을 병렬로 실행한다.
    

Node First는 다음과 같이 실행된다.

```
1.   NodeA    step#1
2.     "      step#2
3.     "      step#3
4.   NodeB    step#1
5.     "      step#2
6.     "      step#3
```

Sequential는 다음과 같이 실행된다.

```
1.   NodeA    step#1
2.   NodeB      "
3.   NodeA    step#2
4.   NodeB      "
5.   NodeA    step#3
6.   NodeB      "
```

Node-oriented flow가 더 흔하게 쓰이며 프로세스에 따라 적잘하게 선택해 사용하면 된다.

더 복잡한 Strategy rule들은 다음을 참고한다.

*   [**Ruleset Workflow Strategy Plugin**](https://docs.rundeck.com/docs/manual/workflow-strategies/ruleset.html)
    

Node Steps, Workflow Steps, Error Handler
-----------------------------------------

Node Steps, Workflow Steps는 각 각 클릭 시 나와있는 것(Command, Script, etc..)에 대해 실행할 수 있으며 Node 또는 Workflow 단위로 설정이 가능하다.

Node Steps에서 설정한 작업은 각 Node마다 1번씩 실행된다.

Workflow Steps에서 설정한 작업은 전체 Workflow에서 단 1회만 실행된다.

![](https://aircrew.atlassian.net/wiki/download/attachments/277970945/fig0410a.bf052f58.png?api=v2)

이 부분에서 중요한 것은 각 작업이 실행되었는데 실패할 경우 어떻게 처리 되는 지가 중요한데, Rundeck에서 이것은 Error Handler를 통해 처리한다.

**Error Hadler**

![](/assets/images/rundeck8.jpg)

Error Handler는 특정 Command가 실패했을 경우 불려지는 처리기이다. 위의 사진처럼 추가할 수 있다.

Error Hadler를 추가했을 경우와 추가하지 않았을 경우의 에러 처리가 다르다.

*   **Step 실패 시 Error Handler 추가 안했을 경우**
    
    1.  Workflow가 실패로 변경된다.
        
    2.  만약 `keepgoing="false"`
        
        1.  그러면 전체 Workflow가 중지된다.
            
    3.  그렇지 않으면, 남은 Workflow가 순서에 따라 실행된다.
        
    4.  Workflow가 실패 결과 상태로 종료된다.
        

*   **Step 실패 시 Error Handler 추가 했을 경우**
    
    *   Error Handler가 실행된다.
        
    *   만약 Error Handler가 성공적으로 실행되고 `keepgoingOnSuccess="true"`
        
        1.  Workflow `keepgoing`이 무시되고,
            
        2.  Workflow 상태는 실패로 변경되지 않고 다음 스텝으로 진행된다.
            
    *   만약 `keepgoing="false"`
        
        1.  Workflow는 실패로 변경된다.
            
        2.  그리고 나서 전체 Workflow는 중지된다.
            
    *   만약 `keepgoing="true"`
        
        1.  Error Handler가 실패하면, Workflow는 실패로 변경된다.
            
        2.  아니면 Workflow는 추가적으로 변경되지 않는다.
            
    *   남아있는 Workflow step들은 순서대로 실행된다.
        
    *   Workflow가 끝나면 이전에 변경된 상태로 종료된다.
        

마지막으로 정리하자면, Error Handler가 추가되고 Error Handler의 작업이 성공적으로 마무리 되면 실패된 Step은 실패되지 않고 성공되었다고 결과 상태가 표시된다.

그래서 Error Handler를 추가 시 정말 오류 없이 성공적으로 결과가 나온 것이 아닌 보조 작업이라면, 반드시 결과가 0으로 리턴하는 것이 아닌 다른 결과 코드를 반환해야 해당 Step이 실패되었다고 표시되며 나중에 다시 디버깅할 때 쉽게 볼 수 있다.
