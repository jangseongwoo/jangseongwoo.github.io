---
title:  "JMeter 기본 사용법"
excerpt: " JMeter는 java로 만들어진 성능 테스트 툴이다. 구매한 솔루션의 Spec을 확인하거나 서버의 스케일링을 위해 사용한다."

categories:
  - Test
tags:
  - JMeter
  - Test
---


* * *

JMeter란?
========

 JMeter는 java로 만들어진 성능 테스트 툴이다. 구매한 솔루션의 Spec을 확인하거나 서버의 스케일링을 위해 사용한다.

설치하기
====

1.  oracle site ( [https://www.oracle.com/technetwork/java/javase/downloads/index.html](https://www.oracle.com/technetwork/java/javase/downloads/index.html) ) 에서 java (version : 8+) 을 다운받는다.
    
2.  java를 설치한다.
    
3.  apach jmeter site( [https://jmeter.apache.org/download\_jmeter.cgi](https://jmeter.apache.org/download_jmeter.cgi) ) 로 이동한다.
    
4.  binary file 을 다운받는다. ( zip 또는 tgz )
    
5.  압축을 푼다.
    

실행하기
====

*   JMeter에는 GUI mode 와  CLI mode 가 있다.
    
*   GUI mode 에서는 test script를 만들 수 있고, test script를 실행할 수 있다. 하지만, load test는 GUI mode에서 하지 않는다. ( [https://jmeter.apache.org/usermanual/get-started.html](https://jmeter.apache.org/usermanual/get-started.html)
    
    1.  4 Running JMeter)
        
*   CLI mode 에서는 GUI mode에서 만든 test script( .jmx)를 이용하여 load test 를 수행할 수 있다.  
    

GUI Mode
--------

1.  terminal을 실행한다.
    
2.  Jmeter 압축을 푼 경로로 이동한다.
    
3.  apache-jmeter-5.1 폴더로 이동한다.
    
    ```
    java jar ./bin/ApacheJMeter.jar
     
    or
     
    sh ./bin/jmeter.sh
    ```
    
      
    
4.  위 명령을 입력하여 JMeter를 실행한다. 
    

  

CLI Mode
--------

1.  terminal을 실행한다.
    
2.  Jmeter 압축을 푼 경로로 이동한다.
    
3.  apache-jmeter-5.1 폴더로 이동한다.
    
    ```
    ./bin/jmeter -n -t [jmxfile].jmx -l [logfile].jtl -e -o [loadtest result path]
    ```
    
      
    
4.  위 명령어를 입력하면 jmx script file 을 이용하여 CLI mode로 실행한다.( -n : nongui, -t : testfile(.jmx), -l : logfile, -e : , -o :  )
    
5.  CLI 모드에서 테스트하기 전에 GUI 모드에서 Thread group, Sampler, Listener 등을 설정할 script파일을 생성해야 한다.
    

  

테스트 전 준비 사항
===========

목적 파악
-----

*   성능 테스트를 할 것인지, 부하 테스트를 할 것인지 목적을 설정한다.
    
*   사내에는 스케일 아웃 조건을 파악하기 위해 테스트를 한다.
    
*   성능 테스트의 경우 Response time, TPS 등을 확인한다.
    
*   부하 테스트의 경우 서버가 다운되는 동시 접속량을 확인한다.
    

  

테스트 수행
======

테스트 플랜 설정하기
-----------

### Thread group 생성

*   Number of Threads : 테스트할 서버로 접속을 시도하는 사용자의 수
    
*   Lamp-Up Period : 사용자간 접속을 요청하는 간격
    
*   Loop count : 사용자마다 요청 하는 횟수
    

*   Number of Threads, Lamp-Up Period, Loop count를 설정한다.
    
*   예를 들어 Lamp-Up Period를 2로 설정했다면 첫 번째 사용자가 접속 요청후 2초 후 두 번째 사용자가 접속 요청을 한다.
    
*   Number of Threads \* Loop count = 총 요청 횟수 이다.
    
*   접속을 계속 시도하고 싶은 경우 Loop count를 Forever로 체크하면 된다.
    

  

### Sampler 생성

*   사용자의 행동을 대행한다.
    
*   API test의 경우 HTTP Request를 사용한다. ( API는 http로 호출하기 때문.)
    
*   HTTP Request에서 protocol, ip, port, method, path, body data( POST일 경우 )을 설정한다.
    
*   HTTP Reqeust를 보낼때 json형식으로 보내야 된다면, HTTP Header Manager 를 추가하고 설정한다.( Thread Group 오른쪽 마우스 클릭 -> config element -> HTTP Header Manager) 
    

  

### Listener 생성

*   처리 상황 및 결과를 데이터나 그래프로 보여준다.
    
*   응답시간이 필요한 경우 Plugin으로 Response Times Over Time을 설치하여 사용한다.( [https://jmeter-plugins.org/wiki/ResponseTimesOverTime](https://jmeter-plugins.org/wiki/ResponseTimesOverTime/) )
    

참조 사이트
======

*   Apache get started ( [https://jmeter.apache.org/usermanual/get-started.html](https://jmeter.apache.org/usermanual/get-started.html) )
