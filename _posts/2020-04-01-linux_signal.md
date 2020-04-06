---
title:  "리눅스의 시그널과 &, nohup에 대한 차이"
excerpt: "이 문서의 목적은 리눅스 환경에서 시그널이란 무엇이며 &와 nohup의 차이점에 대해 서술하기 위해 작성했다. "

categories:
  - Linux
tags:
  - Linux

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 문서의 목적은 리눅스 환경에서 시그널이란 무엇이며 &와 nohup의 차이점에 대해 서술하기 위해 작성했다. 

  

시그널
===

* * *

리눅스에서 시그널이란 다음과 같다. 

*   **시그널**은 [유닉스](https://ko.wikipedia.org/wiki/%EC%9C%A0%EB%8B%89%EC%8A%A4), [유닉스 계열](https://ko.wikipedia.org/wiki/%EC%9C%A0%EB%8B%89%EC%8A%A4_%EA%B3%84%EC%97%B4), [POSIX](https://ko.wikipedia.org/wiki/POSIX) 호환 운영 체제에 쓰이는 제한된 형태의 [프로세스 간 통신](https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4_%EA%B0%84_%ED%86%B5%EC%8B%A0)이다. 시그널은 프로세스나 동일 프로세스 내의 특정 스레드로 전달되는 **비동기식** 통보이다. 이러한 신호들은 1970년대 [벨 연구소](https://ko.wikipedia.org/wiki/%EB%B2%A8_%EC%97%B0%EA%B5%AC%EC%86%8C)를 통해 존재한 뒤로 최근의 시기에는 [POSIX](https://ko.wikipedia.org/wiki/POSIX) 표준에 정의되어 있다.
    

쉽게 말하면 유닉스 계열의 운영체제에서 프로세스 - 프로세스 혹은 동일 프로세스안의 쓰레드간 통신을 하기 위해 시그널을 사용한다. 

이러한 시그널의 가장 쉬운 예는 터미널에서 실행한 프로세스를 kill 명령을 이용해 종료하는 것이다. kill 명령은 특정 Process에게 종료 시그널을 보내고 받은 Process는 작동을 종료하게 된다. 

![](/assets/images/signal.jpg)

시그널 발생 케이스
----------

이벤트는 다음과 같은 케이스에 발생한다. 

*   Hardware Exception(3 나누기 0 같은 예외 상황)
    
*   Software condition(Alarm, Expire 등)
    
*   단말기에서 발생하는 사용자 입력(^c, ^z 등)
    
*   Kill등과 같은 시스템 콜
    

시그널은 IPC(Inter-Process Communication)의 종류 중 하나다. IPC에 대해 설명하면 이 문서의 범위를 벗어나므로 설명하지 않지만 검색을 통해 어떤 것들이 있는 지 알아두면 좋다. 

시그널의 처리 방법
----------

시그널을 받은 프로세스는 다음과 같은 방법 중 하나를 선택해 처리하게 된다. 

*   프로세스가 받은 시그널에 따라 시그널에 정의된 기본 동작을 수행한다. 
    
*   프로세스가 받은 시그널을 무시한다. 프로세스가 시그널을 무시하기로 지정하면 유닉스는 프로세스에 시그널을 전달하지 않는다. 
    
*   개발자가 미리 지정해놓은 함수에 의해 특정 시그널을 처리한다. 
    
*   블록킹(무시). 블록된 시그널은 큐에 쌓여 있다가 블록이 해제되면 전달된다. 
    

개발자가 미리 특정 시그널에 대한 처리 함수를 정의하는 부분에 대해서도 핸들러 지정부터 여러 내용이 있는 데 해당 내용도 마찬가지로 이 문서의 범위를 벗어나므로 이 부분에 궁금하다면 구글링을 권한다. 

주요 시그널 설명
---------

시그널의 종류는 다음과 같다. 아래의 여러 시그널을 이용해 터미널에서 특정 프로세스를 종료하거나 프로세스 간 오류 혹은 예외상황에 대해 시그널을 통해 처리할 수 있는 것이다. 

| 신호  | 이식 가능한 번호 | 기본 동작 | 설명  |
| --- | --- | --- | --- |
| SIGABRT | 6   | 종료 (코어 덤프) | 프로세스 중단 신호 |
| SIGALRM | 14  | 종료  | 알람 클럭 |
| SIGBUS | 없음  | 종료 (코어 덤프) | 정의되지 않은 메모리 오브젝트의 일부분에 접근. |
| SIGCHLD | 없음  | 무시  | 차일드 프로세스 종료, 중단, 계속 |
| SIGCONT | 없음  | 계속  | 정지하지 않으면 계속 실행. |
| SIGFPE | 없음  | 종료 (코어 덤프) | 오류가 있는 산술 조작. |
| SIGHUP | 1   | 종료  | 행업(Hangup). |
| SIGILL | 없음  | 종료 (코어 덤프) | 유효하지 않은 명령. |
| SIGINT | 2   | 종료  | 터미널 인터럽트 신호. |
| SIGKILL | 9   | 종료  | 킬 (신호를 잡거나 무시할 수 없음). |
| SIGPIPE | 없음  | 종료  | 신호를 읽는 사용자가 없는 상태에서 파이프에 기록. |
| SIGPOLL | 없음  | 종료  | 폴링 가능한 이벤트. |
| SIGPROF | 없음  | 종료  | 프로파일링 타이머 시간 초과. |
| SIGQUIT | 3   | 종료 (코어 덤프) | 터미널 종료 신호. |
| SIGSEGV | 없음  | 종료 (코어 덤프) | 잘못된 메모리 참조. |
| SIGSTOP | 없음  | 정지  | 실행 정지 (신호를 잡거나 무시할 수 없음) |
| SIGSYS | 없음  | 종료 (코어 덤프) | 불량 시스템 호출. |
| SIGTERM | 15  | 종료  | 종료 신호. |
| SIGTRAP | 없음  | 종료 (코어 덤프) | 트레이스/브레이크포인트 트랩. |
| SIGTSTP | 없음  | 정지  | 터미널 정지 신호. |
| SIGTTIN | 없음  | 정지  | 백그라운드 프로세스 읽기 시도. |
| SIGTTOU | 없음  | 정지  | 백그라운드 프로세스 쓰기 시도. |
| SIGUSR1 | 없음  | 종료  | 사용자 정의 신호 1. |
| SIGUSR2 | 없음  | 종료  | 사용자 정의 신호 2. |
| SIGURG | 없음  | 무시  | 높은 대역의 데이터를 소켓에서 이용 가능. |
| SIGVTALRM | 없음  | 종료  | 가상 타이머 시간 초과. |
| SIGXCPU | 없음  | 종료 (코어 덤프) | CPU 시간 제한 초과. |
| SIGXFSZ | 없음  | 종료 (코어 덤프) | 파일 크기 제한 초과. |

  

&, Nohup에 대한 설명
===============

* * *

먼저 &, Nohup에 대해 설명하면 다음과 같다. 

*   &: Shell에서 백그라운드로 서브쉘을 생성해 특정 명령어를 실행하는 제어 명령어. Job으로써 실행되며 비동기적으로 실행된다. 
    
*   [nohup](https://ko.wikipedia.org/wiki/Nohup) : **nohup**은 HUP(hangup) 신호를 무시하도록 만드는 [POSIX](https://ko.wikipedia.org/wiki/POSIX) 명령어이다. HUP 신호는 전통적으로 터미널이 의존 프로세스들에게 로그아웃을 알리는 방식이다. 일반적으로 터미널로 향하는 출력은 별도로 넘겨주기 처리를 하지 않았을 경우 `nohup.out`이라는 이름의 파일로 출력된다.
    

&, Nohup에 대한 차이점
----------------

&, Nohup에 대한 차이점은 다음과 같다. 

*   Shell에서 특정 프로세스를 실행하고 Shell을 종료했을 때 **& 명령어로 실행할 경우 종료된다.** 
    
*   Shell에서 특정 프로세스를 실행하고 Shell을 종료했을 때 **Nohup 명령어로 실행할 경우 종료되지 않는다.** 
    

이렇게 되는 이유를 설명하면, Shell에서 특정 프로세스를 실행했을 경우 실행한 Shell이 종료하게 되면 자식 프로세스들도 종료하게 된다. 이때 시그널은 SIGHUP(Hangup)를 보내게 되는데 &으로 실행한 프로세스의 경우 SIGHUP(Hangup) 시그널의 기본 동작으로 종료하게 된다. 

그러나, Nohup으로 실행한 프로세스는 SIGHUP(Hangup)을 무시하도록 하는 명령어이기 때문에 종료되지 않고 백그라운드로 계속 실행되게 된다. 

  

참고 문서
=====

* * *

참고 문서는 다음과 같다. 

*   whats-the-difference-between-nohup-and-ampersand: [https://stackoverflow.com/questions/15595374/whats-the-difference-between-nohup-and-ampersand](https://stackoverflow.com/questions/15595374/whats-the-difference-between-nohup-and-ampersand)
    
*   Ampersands & on the command line: [https://bashitout.com/2013/05/18/Ampersands-on-the-command-line.html](https://bashitout.com/2013/05/18/Ampersands-on-the-command-line.html)
    
*   쉘 스크립트에서 멀티프로세스(혹은 스레드) 기능 사용하기: [https://twpower.github.io/189-run-multi-processes-in-shell-script-using-ampersand](https://twpower.github.io/189-run-multi-processes-in-shell-script-using-ampersand)
    
*   nuhup 위키: [https://ko.wikipedia.org/wiki/Nohup](https://ko.wikipedia.org/wiki/Nohup)
    
*   시그널: [https://jihooyim1.gitbooks.io/unixbasic/contents/07.html](https://jihooyim1.gitbooks.io/unixbasic/contents/07.html)
    
*   시스템프로그래밍- 시그널: [https://12bme.tistory.com/224](https://12bme.tistory.com/224)
    
*   [Unix/Linux Signal 개념 및 종류](https://jangpd007.tistory.com/90): [https://jangpd007.tistory.com/90](https://jangpd007.tistory.com/90)
    
*   Linux, Unix 응용: [https://eunguru.tistory.com/96](https://eunguru.tistory.com/96)
