---
title:  "[테스트] Fluentd - Http Input Plugin 부하 및 성능 테스트"
excerpt: "HTTP Data Listener 기능을 Fluentd의 Http Input Plugin을 사용하여 구성하고 테스트한 내용을 정리한다.
테스트로 확인한 내용은 다음과 같다.
*   Fluentd Http Input Plugin을 사용한 HTTP Listener가 오류없이 얼마나 많은 유저의 요청을 처리할 수 있는 지 확인 (부하 테스트)
*   Fluentd Http Input Plugin을 사용한 HTTP Listener의 초당 처리량 확인 (성능 테스트)"

categories:
  - Fluentd
tags:
  - Fluentd, Fluentd Plugin, HTTP Listener, Test

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---


목적
==

* * *

HTTP Data Listener 기능을 Fluentd의 Http Input Plugin을 사용하여 구성하고 테스트한 내용을 정리한다.

테스트로 확인한 내용은 다음과 같다.

*   Fluentd Http Input Plugin을 사용한 HTTP Listener가 오류없이 얼마나 많은 유저의 요청을 처리할 수 있는 지 확인 (부하 테스트)
    
*   Fluentd Http Input Plugin을 사용한 HTTP Listener의 초당 처리량 확인 (성능 테스트)
    

  

이 테스트는 Fluentd에서 지원하는 HTTP input Plugin의 기본적인 동작 성능을 확인하기 위한 목적으로 진행된 것이다.

하나의 머신에서 Data Sender와 Fluentd 환경이 모두 구성되고 테스트용으로 작은 테스트 데이터를 보내고 저장하는 방식으로 확인한 것이기 때문에 절대로 실제 프로덕션의 다양한 환경에서의 성능에 대한 기준지표로 사용하지 않도록 주의하자!

아래의 실제 테스트 중 최종 결과에 대해서만 서술한다.
  

테스트 환경
======

* * *

*   OS : macOS Catalina v10.15.2
    
    *   CPU 3.5GHz, quad core Intel i5
        
    *   Memory 16GB 2400 MHz DDR4
        
*   Fluentd : v1.8.0
    
*   Jmeter : v5.1
    

테스트 환경 구축
=========

* * *

테스트를 위하여 다음과 같은 구조를 갖는 디렉터리를 구성한다.

```
/http_listener_fluentd_test
├── fluentd.conf ### fluentd 설정파일
└── /output ### fluentd 출력 디렉터리
```

Fluentd 설정 파일 추가하고 Fluentd 실행
-----------------------------

테스트를 위한 Fluentd 중요 동작은 다음과 같다.

*   http 플러그인을 Input 플러그인으로 json 데이터를 입력 받는다.
    
*   Input 플러그인으로 입력 받은 데이터를 파일로 저장한다.
    

  

Fluentd 중요 동작과 몇 가지 디테일을 추가하여 다음과 같은 Fluentd 설정 파일을 생성한다. 설정 파일 내용중 _**{프로젝트 디렉터리 경로}**_ 에는 절대 경로를 추가해야한다.

```
<source>
  @type http
  port 9880
  bind 0.0.0.0
  tag http_listener_test
  <parse>
    @type json
  </parse>
</source>
<match http_listener*>
  @type file
  path {프로젝트 디렉터리 경로}/output/${tag}_%Y-%m-%d
  add_path_suffix true
  path_suffix ".log"
  append true
  <buffer tag, time>
    flush_mode interval
    flush_interval 10s
  </buffer>
  <format>
    @type out_file
    output_tag false
    output_time true
  </format>
</match>
```

설정 파일의 플러그인에 대한 자세한 설명은 아래의 Fluentd 공식 문서를 확인한다.

*   [Fluentd - Input Plugins : http](https://docs.fluentd.org/input/http)
    
*   [Fluentd - Output Plugins : file](https://docs.fluentd.org/output/file)
    

  

다음과 같은 명령으로 Fluentd를 실행한다.
```
$ fluentd -c fluentd.conf -o fluentd.log
```

테스트 데이터 전송하여 Fluentd 동작 확인
--------------------------

Fluentd가 동작 확인을 위하여 다음과 같은 파일을 생성한다.

```
{
  "board_id": 10,
  "playtime": 5,
  "minimum_play": "Y",
  "timestamp": "2019-11-12T10:00:01Z",
  "user_id": 1,
  "interest": 100
}
```
  

다음과 같은 명령으로 앞서 생성한 _test.json_ 데이터를 Fluentd로 전송한다.

```
$ curl -s -H "Content-Type: application/x-ndjson" -XPOST http://localhost:9880/http_listener_test --data-binary @test.json
```
  

Fluentd의 buffer flush interval을 고려하여 1분뒤에 _./http_listener_fluentd_test/output_ 에 생성된 파일을 확인한다.

테스트에서는 _http_listener_test_2020-01-13.log_ 파일이 생성된 것을 확인했으며 파일 내용은 다음과 같다.

```
2020-01-13T17:52:09+09:00	{"board_id":10,"playtime":5,"minimum_play":"Y","timestamp":"2019-11-12T10:00:01Z","user_id":1,"interest":100}
```

Jmeter 설치 및 Test Plan 설정
------------------------

다음 문서를 읽으며 Jmeter를 설치하고 사용법을 확인하면 된다.

*   [JMeter 사용법](https://jangseongwoo.github.io/test/jmeter_basic/)
    

13 Jan 2020 기준 Jmeter 공식 홈페이지에는 Jmeter 5.2 다운로드 링크만 남아있어, 다음과 같이 Jmeter 5.1 다운로드 관련 내용을 남긴다.

*   [https://archive.apache.org/dist/jmeter/binaries/](https://archive.apache.org/dist/jmeter/binaries/) 에서 apache-jmeter-5.1.zip(2019-02-18 19:42, 57M) 검색후 다운로드
    

  

Jmeter를 실행하고 다음과 같은 Test Plan 구조를 구성한다.

*   Test Plan
    
    *   Thread Group
        
        *   HTTP Request
            
        *   Summary Report
            

  

Thread Group 설정에서 다음과 같은 설정값을 입력한다.

*   Ramp-up period (seconds) : 0
    
*   Loop count : 100
    

  

HTTP Request에는 다음과 같은 데이터를 입력한다. 한번의 request에 하나의 데이터가 전송된다.

*   Method : POST
    
*   Path : [http://localhost:9880/http_listener_test](http://localhost:9880/http_listener_test)
    
*   Body Data : {"board_id":10,"playtime":5,"minimum_play":"Y","timestamp":"2019-11-12T10:00:01Z","user_id":1,"interest":100}
    

  

테스트
==

* * *

부하 테스트
------

부하 테스트는 "_동시 전송하는 User 수(Number of Thread)_"를 변경하며 진행하고 이 내용은 테스트 케이스로 구분하여 정리한다.

각각의 테스트 케이스는 동일한 조건으로 3회 실행하고 한 번이라도 오류가 발생하면 해당 케이스는 오류가 발생한 것으로 간주한다. 결과의 일부는 이 문서에서는 따로 기술하지 않는다. 최종 결과를 참고 바란다. 

### 테스트 케이스 : Number of Thread = 100

3회 실행, 0회 오류 발생 (Error : 0%, 0%, 0%)

### 테스트 케이스 : Number of Thread = 150

3회 실행, 3회 오류 발생 (Error : 1.33%, 1.49%, 1.29%)

### 테스트 케이스 : Number of Thread = 125

3회 실행, 0회 오류 발생 (Error : 0%, 0%, 0%)

### 테스트 케이스 : Number of Thread = 137

3회 실행, 3회 오류 발생 (Error : 0.37%, 0.52%, 0.49%)

### 테스트 케이스 : Number of Thread = 128

**3회 실행, 0회 오류 발생 (Error : 0%, 0%, 0%)**

성능 테스트
------

성능 테스트는 부하 테스트에서 오류율 0%를 만족하고, Number of Thread 값이 가장 큰 케이스(Number of Thread = 128)로 진행한다.

성능 테스트는 5회 실행하고 Throughput 값, Received 값의 평균을 구한다.

5회 실행한 결과의 평균은 **Throughput : 3528.82 , Received : 303.256** 이다.

1 ~ 3 회차는 부하테스트 - 테스트 케이스 Number of Thread = 128을 참고 한다.

4회차 실행결과 : Throughput - 3662.4, Received - 314.74

![](/assets/images/http_test.jpg)

5회차 실행결과 : Throughput - 3548.7, Received - 304.96

![](/assets/images/http_test2.jpg)

5회의 평균을 구하면 다음과 같다.

*   Throughput : 3528.82   
    (3249.6 + 3564.5 + 3618.9 + 3662.4 + 3548.7) / 5
    
*   Received : 303.256  
    (279.26 + 306.32 + 311.00 + 314.74 + 304.96) / 5
    

테스트 결과
======

* * *

테스트 결과를 정리하면 다음과 같다.

*   하나의 머신에서 Jmeter를 사용하여 Fluentd HTTP Listener(Http input plugin사용)에 데이터를 전송했을 때, Fluentd쪽에서 오류없이 데이터를 받는 기준으로 **3528.82개/초, 303.256KB/초**의 데이터를 받아 파일로 저장할 수 있었다.
