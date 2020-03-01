---
title:  "Fluentd(td-agent) Filter plugin"
excerpt: "이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 Filter plugin의 단순 동작 확인에 목적을 두고 있다."

categories:
  - Fluentd
tags:
  - Fluentd

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

테스트 목적
======

이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 Filter plugin의 단순 동작 확인에 목적을 두고 있다.

*   필드를 가공해야하는 경우
    
*   로그 값을 확인하여 필터링 하는 경우
    
*   로그를 파싱하여 저장하는 경우
    

테스트 환경
======

다음과 같은 환경에서 테스트 하였다.

*   OS : masOS Mojave v10.14.6
    
*   Fluentd : 1.0.2 (td-agent : 3.1.1.0)
    

  

테스트 사전 정보
=========

Fluentd 기초 사용법을 확인하여 td-agent 기초 동작을 확인하면 된다.

  

* * *

테스트 케이스 : 필드를 가공해야하는 경우 (Filter - record\_transformer)
======================================================

td-agent로 로그를 수집하여 저장하는 과정에서 필드의 가공이 필요한 경우가 있다.

이러한 경우 Filter plugin중 record\_transformer 타입을 사용하면 된다.

테스트 목적
------

이 테스트는 학습차원에서 다음과 같은 td-agent의 단순 동작 확인이 목적이다.

*   파일에서 로그를 수집하여 저장하는 과정에서 Filter plugin의 record\_transformer 타입을 사용하여 필드 가공
    

  

테스트 시나리오
--------

이 테스트는 다음과 같은 시나리오를 바탕으로 진행된다.

1.  다음과 같은 형태 json로그가 파일에 생성된다.
    
    { "user\_id" : "javascript0247", "created\_at" : "2019-08-16T01:23:45+0900", "os" : "Android" }
    
      
    
2.  파일에서 로그를 수집하고 다음과 같은 조건으로 필드를 가공한다.
    
    *   로그 수집 시각인 "collected\_at" 필드 추가
        
    *   만들어진 시각인 "created\_at" 필드 삭제
        
    *   "os"필드를 "device\_os"로 변경
        
    
      
    
3.  필드가 가공된 로그는 다음과 같은 형태의 파일로 출력된다.
    
    { "user\_id" : "javascript0247", "collected\_at" : "2019-08-16T14:22:00+0900", "device\_os" : "Android" }
    
      
    

  

테스트 Plugin 정보
-------------

### Source Plugin - tail

다음은 테스트에서 사용할 tail 설정 예시이다.

```bashbash
<source>  
  @type tail
  path /Users/kevin/dev/fluentd/test/filter_record_transformer/source/*
  pos_file /Users/kevin/dev/fluentd/test/filter_record_transformer/pos/filter_record_transformer.pos
  <parse>
    @type json
  </parse>
  tag filter_record_transformer.test
  refresh_interval 5s
</source>
```bash

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   @type : tail type을 사용한다. 자세한 내용은 아래의 링크를 통하여 확인한다.
    
*   path : 읽어오고자 하는 파일의 경로를 의미한다.
    
*   pos\_file : td-agent는 파일마다 읽었던 위치를 파일로 저장해두는데 그 파일의 경로를 지정한다.
    
*   parse
    
    *   @type : json를 사용한다. 자세한 내용은 아래의 링크를 통하여 확인한다.
        
*   tag : 이벤트를 구분짓기 위한 tag name을 의미한다.
    
*   refresh\_interval : td-agent가 수집하려는 파일리스트의 갱신주기를 의미한다.
    

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Input Plugin : tail](https://docs.fluentd.org/input/tail)
    
*   [Fluentd - Parser Plugin : json](https://docs.fluentd.org/parser/json)
    

  

### Filter Plugin - record\_transformer

다음은 테스트에서 사용할 grep 설정 예시이다.

```bash
<filter filter_record_transformer.*>  
  @type record_transformer
  enable_ruby true
  <record>
    collected_at ${time.strftime('%Y-%m-%dT%H:%M:%S%z')}
    device_os ${record["os"]}
  </record>
  remove_keys [ "os", "created_at" ]
</filter>

```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   <filter pattern> : pattern 부분에 filter plugin을 적용시키고자 하는 이벤트(tag명)를 명시한다.  
    
*   @type : record을 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   enable\_ruby : 필드 가공시 'Ruby'식 표현을 사용하는 지에 대하여 묻는다.
    
*   record : 필드의 추가를 의미한다. "필드명 : 필드값" 형태로 추가한다.
    
*   remove\_keys : 삭제할 필드명을 지정한다.
    

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Filter plugin : record\_transformer](https://docs.fluentd.org/filter/record_transformer)
    

  

### Match Plugin - file

다음은 테스트에서 사용하게 될 file 설정 예시이다.

```bash
<match filter_record_transformer.*>  
  @type file
  path /Users/kevin/dev/fluentd/test/filter_record_transformer/match/${tag}
  path_suffix ".json"
  add_path_suffix true
  append true
  <format>
    @type json
  </format>
  <buffer tag>
    path /Users/kevin/dev/fluentd/test/filter_record_transformer/match/
    flush_mode interval
    flush_interval 10s
  </buffer>
</match>

```

  

테스트 과정에서 사용하는 설정과 간단한 설명이다. required 설정은 녹색으로 표기하였다.

*   <match pattern> : pattern 부분에 match plugin을 적용시키고자 하는 이벤트(tag명)를 명시한다.
    
*   @type : file을 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   path : 출력할 파일의 경로를 의미한다. 예약어(예: tag)를 사용할 수 있다.
    
*   path\_suffix : 확장자명을 지정한다.
    
*   add\_path\_suffix : path\_suffix 사용유무를 지정한다.
    
*   append : 한 파일에 출력하는지 여부를 지정한다. 원할한 테스트를 위하여 설정한다.
    
*   format : json으로 설정한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   buffer : 자세한 내용은 아래의 링크를 참고한다. 원할한 테스트를 위하여 설정한다.
    

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Output Plugin : file](https://docs.fluentd.org/output/file)
    
*   [Fluentd - Fommatter Plugin : json](https://docs.fluentd.org/formatter/json)
    
*   [Fluentd - Config : Buffer Section](https://docs.fluentd.org/configuration/buffer-section)
    

  
테스트 과정
---------

1.  파일을 생성하고 정상적으로 생성 되었는지 확인한다.
    
    ```bash
    $ touch filter_record_transformer.json | stat filter_record_transformer.json
    16777223 8192640 -rw-r--r-- 1 kevin staff 0 0 "Aug 14 14:01:39 2019" "Aug 14 14:01:39 2019" "Aug 14 14:01:39 2019" "Aug 14 14:01:39 2019" 4096 0 0 filter_record_transformer.json
    ```
    
2.  td-agent 설정파일 경로를 수정한다.   
    다음은 경로 예시이다.
    
    /Users/kevin/dev/fluentd/test/filter\_record\_transformer/config/td-agent\_filter\_record\_transformer.conf
    
    수정한 경로에 td-agent 설정 파일을 생성한다.
    
    ```bash
    $ touch td-agent_filter_record_transformer.conf | stat td-agent_filter_record_transformer.conf
    16777223 8192245 -rw-r--r-- 1 kevin staff 0 0 "Aug 14 13:50:42 2019" "Aug 14 13:50:42 2019" "Aug 14 13:50:42 2019" "Aug 14 13:50:42 2019" 4096 0 0 td-agent_filter_record_transformer.conf
    ```
    
    td-agent 설정 파일을 다음과 같이 수정한다.
    
    ```bash
    $ vim td-agent_filter_record_transformer.conf
    <source>
      @type tail
      tag filter_record_transformer.test
      path /Users/kevin/dev/fluentd/test/filter_record_transformer/source/*
      pos_file /Users/kevin/dev/fluentd/test/filter_record_transformer/pos/filter_record_transformer.pos
      <parse>
        @type json
      </parse>
      refresh_interval 5s
    </source>
    <filter filter_record_transformer.*>
      @type record_transformer
      enable_ruby true
      <record>
        collected_at ${time.strftime('%Y-%m-%dT%H:%M:%S%z')}
        device_os ${record["os"]}
      </record>
      remove_keys [ "os", "created_at" ]
    </filter>
    <match filter_record_transformer.*>
      @type file
      path /Users/kevin/dev/fluentd/test/filter_record_transformer/match/${tag}
      add_path_suffix true
      path_suffix ".json"
      append true
      <format>
        @type json
      </format>
      <buffer tag>
        path /Users/kevin/dev/fluentd/test/filter_record_transformer/match/
        flush_mode interval
        flush_interval 10s
      </buffer>
    </match>
    ```
    
      
    
    이제 td-agent를 실행한다.
    
3.  입력용 파일에 로그를 출력하고 정상적으로 출력되었는지 확인한다.
    
    ```bash
    $ cat filter_record_transformer.json
    { "user_id" : "javascript0247", "created_at" : "2019-08-16T01:23:45+0900", "os" : "Android" }
    { "user_id" : "kotlin_0247", "created_at" : "2019-08-16T14:28:10+0900", "os" : "Android" }
    { "user_id" : "java_8615", "created_at" : "2019-08-16T14:30:00+0900", "os" : "iOS" }
    { "user_id" : "python_1574", "created_at" : "2019-08-16T14:30:00+0900", "os" : "iOS" }
    { "user_id" : "cpp_2464", "created_at" : "2019-08-16T14:30:00+0900", "os" : "iOS" }
    ```
    
      
    출력용 파일에 출력된 로그를 확인한다.
    
    ```bash
    $ cat filter_record_transformer.test.json
    {"user_id":"javascript0247","collected_at":"2019-08-16T15:14:29+0900","device_os":"Android"}
    {"user_id":"kotlin_0247","collected_at":"2019-08-16T15:14:29+0900","device_os":"Android"}
    {"user_id":"java_8615","collected_at":"2019-08-16T15:14:29+0900","device_os":"iOS"}
    {"user_id":"python_1574","collected_at":"2019-08-16T15:14:29+0900","device_os":"iOS"}
    {"user_id":"cpp_2464","collected_at":"2019-08-16T15:14:29+0900","device_os":"iOS"} 
    ```
    
      
    

테스트 결과
------

테스트 결과 record\_transformer 타입을 사용하여 필드 가공이 이루어지는지 확인하였다.

테스트 과정에서 json 형태 로그에 관하여 다음과 같은 필드에 관한 수정이 이루어짐을 확인하였다.

*   필드 추가 - collected\_at
    
*   필드 삭제 - created\_at
    
*   필드명 변경 - os / device\_os
    

  

다음은 위의 필드수정 항목에 대한 예시이다.

{ "user\_id" : "javascript0247", "created\_at" : "2019-08-16T01:23:45+0900", "os" : "Android" }

  

 {"user\_id":"javascript0247","collected\_at":"2019-08-16T15:14:29+0900","device\_os":"Android"}

  

  

  

  

* * *

테스트 케이스 : 로그 값을 확인하여 필터링 하는 경우 (Filter - grep)
==============================================

td-agent로 로그를 수집하여 저장하는 과정에서 필터링하여 원하는 로그만 출력해야하는 경우가 있다.

이러한 경우 Filter plugin중 grep 타입을 사용하면 된다.

테스트 목적
------

이 테스트는 학습차원에서 다음과 같은 td-agent의 단순 동작 확인이 목적이다.

*   파일에서 로그를 수집하여 저장하는 과정에서 Filter plugin의 grep타입을 사용하여 원하는 로그만 필터링 가능
    

테스트 시나리오
--------

이 테스트는 다음과 같은 시나리오를 바탕으로 진행된다.

*   Apache access log가 파일로 생성된다.
    
*   Apache access log중 다음과 같은 요구사항에 충족되는 로그만 필터링한다.
    
    요청 method가 "POST"이면서 status가 2XX이 아닌 경우
    
      
    
*   필터링된 결과는 파일로 출력한다.
    

  

테스트 필요 정보
---------

### Apache Access Log

테스트 과정에서 다음과 같은 Combined 로그 형식(Combined Log Format)을 사용한다.

%h %l %u %t \\"%r\\" %>s %b  \\"%{Referer}i\\" \\"%{User-agent}i\\"  

  

%h : 서버에 요청을 한 클라이언트의 IP 주소를 의미한다.

%l : 클라이언트 컴퓨터의 identd가 제공하는 클라이언트의 RFC 1413 신원이다. 만약 요청한 정보가 없다면 "-"로 표기한다.

%u : HTTP 인증으로 알아낸 문서를 요청한 사용자의 userid이다. 문서를 암호로 보호하지 않는다면 "-" 으로 표기한다.

%t : 서버가 요청처리를 마친 시간을 의미한다. \[day/month/year:hour:minute:second zone\] 형식이다.

\\"%r\\" : 클라이언트의 요청줄을 쌍따옴표로 묶어 표현한다. 

%>s : 서버가 클라이언트에게 보내는 상태코드이다.

%b : 응답 헤더를 제외하고 클라이언트에게 보내는 내용의 크기를 나타낸다. 보내는 내용이 없다면 "-"으로 표기한다.

\\"%{Referer}i\\" : 클라이언트가 참조하였다고 서버에게 알린 사이트이다.

\\"%{User-agent}i\\" : 클라이언트 브라우저가 자신에 대해 알리는 식별 정보를 의미한다.

  

  

다음은 Combined 로그 형식의 예시이다.

127.0.0.1 - frank \[10/Oct/2000:13:55:36 -0700\] "GET /apache\_pb.gif HTTP/1.0" 200 2326 "[http://www.example.com/start.html](http://www.example.com/start.html)" "Mozilla/4.08 \[en\] (Win98; I ;Nav)"

  

자세한 내용은 다음의 링크를 참고한다.

*   [로그파일 - Apache HTTP Server Version 2.4](https://httpd.apache.org/docs/2.4/ko/logs.html)
    

  

### Source Plugin - tail

다음은 테스트에서 사용할 tail 설정 예시이다.

```bash
<source>
  @type tail
  path /Users/kevin/dev/fluentd/test/filter_grep/source/*
  pos_file /Users/kevin/dev/fluentd/test/pos/filter_grep.pos
  tag filter_grep.test
  <parse>
    @type apache2
  </parse>
  refresh_interval 1s
</source>
```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   @type : tail type을 사용한다. 자세한 내용은 아래의 링크를 통하여 확인한다.
    
*   path : 읽어오고자 하는 파일의 경로를 의미한다.
    
*   pos\_file : td-agent는 파일마다 읽었던 위치를 파일로 저장해두는데 그 파일의 경로를 지정한다.
    
*   parse
    
    *   @type : apache2를 사용한다. 자세한 내용은 아래의 링크를 통하여 확인한다.
        
*   tag : 이벤트를 구분짓기 위한 tag name을 의미한다.
    
*   refresh\_interval : td-agent가 수집하려는 파일리스트의 갱신주기를 의미한다.
    

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Input Plugins : tail](https://docs.fluentd.org/input/tail)
    
*   [Fluentd - Parser plugins : apache2](https://docs.fluentd.org/parser/apache2)
    

  

### Filter Plugin - grep

다음은 테스트에서 사용할 grep 설정 예시이다.

```bash
<filter filter_grep*>
  @type grep
  <regexp>
    key method
    pattern ^POST$
  </regexp>
  <regexp>
    key code
    pattern ^[1-1|3-5]\d\d$
  </regexp>
</filter>

```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   <filter pattern> : pattern 부분에 filter plugin을 적용시키고자 하는 이벤트(tag명)를 명시한다.  
    
*   @type : grep을 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   regexp
    
    *   key : 필드명을 지정한다.
        
    *   pattern : "Ruby의 정규표현식 표현"을 사용하여 표현한다.
        

  

*   공식 문서 상에는 "pattern /정규표현식/"으로 표현되어 있으나 "pattern 정규표현식" 형태로 표기하여야 정상적으로 동작한다.
    
*   <and> <or>의 설정은 fluentd 1.2 부터 지원한다.
    

  

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Filter plugins : grep](https://docs.fluentd.org/filter/grep)
    

  

### Match Plugin - file

다음은 테스트에서 사용하게 될 file 설정 예시이다.

```bash
<match filter_grep.*>
  @type file
  path /Users/kevin/dev/fluentd/test/filter_grep/match/${tag}_output
  path_suffix ".log"
  add_path_suffix true
  append true
  <format>
    @type out_file
    output_tag false
    output_time true
  </format>
  <buffer tag>    
    flush_mode interval
    flush_interval 10s
  </buffer>
</match>

```

  

테스트 과정에서 사용하는 설정과 간단한 설명이다. required 설정은 녹색으로 표기하였다.

*   <match pattern> : pattern 부분에 match plugin을 적용시키고자 하는 이벤트(tag명)를 명시한다.
    
*   @type : file을 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   path : 출력할 파일의 경로를 의미한다. 예약어(예: tag)를 사용할 수 있다.
    
*   path\_suffix : 확장자명을 지정한다.
    
*   add\_path\_suffix : path\_suffix 사용유무를 지정한다.
    
*   append : 한 파일에 출력하는지 여부를 지정한다. 원할한 테스트를 위하여 설정한다.
    
*   format : 아래의 **Formatter Plugins - out\_file**을 참고한다.
    
*   buffer : 자세한 내용은 아래의 링크를 참고한다. 원할한 테스트를 위하여 설정한다.
    

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Output plugins : file](https://docs.fluentd.org/output/file)
    
*   [Fluentd - Config : Buffer Section](https://docs.fluentd.org/configuration/buffer-section)
    

  

### Formatter Plugins - out\_file

다음은 테스트에서 사용하게 될 out\_file 설정 예시이다.

```bash
  <format>
    @type out_file
    output_tag false
    output_time true
  </format>

```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   @type : out\_file을 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   output\_tag : tag(이벤트 명)의 출력 여부를 설정한다.
    
*   output\_time : 로그 수집 시간 출력 여부를 설정한다.
    

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Formatter Plugins : out\_file](https://docs.fluentd.org/formatter/out_file)
    

  

테스트 과정
------

1.  입력용 파일을 생성하고 정상적으로 생성 되었는지 확인한다.
    
    ```bash
    $ touch filter_grep_input.log | stat filter_grep_input.log
    16777223 8232044 -rw-r--r-- 1 kevin staff 0 0 "Aug 19 20:20:14 2019" "Aug 19 20:20:14 2019" "Aug 19 20:20:14 2019" "Aug 19 20:20:14 2019" 4096 0 0 filter_grep_input.log
    ```
    
2.  td-agent 설정 경로를 수정한다.
    
    다음은 경로 예시이다.
    
    /Users/kevin/dev/fluentd/test/filter\_grep/config/td-agent.conf
    
    위에서 수정한 경로에 td-agent 설정파일을 생성한다.
    
    ```bash
    $ touch td-agent.conf | stat td-agent.conf
    16777223 8226646 -rw-r--r-- 1 kevin staff 0 0 "Aug 19 15:54:04 2019" "Aug 19 15:54:04 2019" "Aug 19 15:54:04 2019" "Aug 19 15:54:04 2019" 4096 0 0 td-agent.conf
    ```
    
    td-agent 설정 파일을 다음과 같이 수정한다.
    
    ```bash
    $ cat td-agent.conf
    
    <source>
      @type tail
      tag filter_grep
      path /Users/kevin/dev/fluentd/test/filter_grep/source/*
      pos_file /Users/kevin/dev/fluentd/test/filter_grep/pos/filter_grep.pos
      <parse>
        @type apache2
      </parse>
      refresh_interval 5s
    </source>
    
    <filter filter_grep*>
      @type grep
      <regexp>
        key method
        pattern ^POST$
      </regexp>
      <regexp>
        key code
        pattern ^[1-1|3-5]\d\d$
      </regexp>
    </filter>
     
    <match filter_grep*>
      @type file
      path /Users/kevin/dev/fluentd/test/filter_grep/match/${tag}_output
      add_path_suffix true
      path_suffix ".log"
      append true
      <buffer tag>
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
    
    td-agent를 실행한다.
    
3.  입력용 파일에 로그를 출력하고 정상적으로 출력 되었는지 확인한다.
    
    ```bash
     $ cat source/filter_grep_input.log
    127.0.0.1 - - [20/Aug/2019:00:40:00 +0900] "GET /apache_pb.gif HTTP/1.0" 100 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:01 +0900] "POST /regist.html HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:02 +0900] "POST /regist.html HTTP/1.0" 300 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:03 +0900] "GET /apache_pb.gif HTTP/1.0" 400 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:04 +0900] "POST /regist.html HTTP/1.0" 500 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:05 +0900] "POST /regist.html HTTP/1.0" 100 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:06 +0900] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:07 +0900] "POST /regist.html HTTP/1.0" 300 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:08 +0900] "POST /regist.html HTTP/1.0" 400 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    127.0.0.1 - - [20/Aug/2019:00:40:09 +0900] "GET /apache_pb.gif HTTP/1.0" 500 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
    ```
    
    출력용 파일이 정상적으로 출력 되었는지 확인한다.
    
    ```bash
     $ cat match/filter_grep_output.log
    2019-08-20T00:40:02+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":300,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
    2019-08-20T00:40:04+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":500,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
    2019-08-20T00:40:05+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":100,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
    2019-08-20T00:40:07+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":300,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
    2019-08-20T00:40:08+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":400,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
    ```
    

테스트 결과
------

테스트 결과 grep 타입을 사용하여 필터링 가능함을 확인하였다.

테스트 과정에서 다음과 같은 요구사항에 대하여 필터링 되는지 확인하였다.

요청 method가 "POST"이면서 status가 2XX이 아닌 경우

  

다음은 위의 요구사항대로 필터링된 예시이다.

```bash
127.0.0.1 - - [20/Aug/2019:00:40:00 +0900] "GET /apache_pb.gif HTTP/1.0" 100 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:01 +0900] "POST /regist.html HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:02 +0900] "POST /regist.html HTTP/1.0" 300 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:03 +0900] "GET /apache_pb.gif HTTP/1.0" 400 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:04 +0900] "POST /regist.html HTTP/1.0" 500 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:05 +0900] "POST /regist.html HTTP/1.0" 100 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:06 +0900] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:07 +0900] "POST /regist.html HTTP/1.0" 300 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:08 +0900] "POST /regist.html HTTP/1.0" 400 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
127.0.0.1 - - [20/Aug/2019:00:40:09 +0900] "GET /apache_pb.gif HTTP/1.0" 500 2326 "http://www.example.com/start.html" "Mozilla/4.08 [en] (Win98; I ;Nav)"
```

  

```bash
2019-08-20T00:40:02+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":300,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
2019-08-20T00:40:04+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":500,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
2019-08-20T00:40:05+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":100,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
2019-08-20T00:40:07+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":300,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
2019-08-20T00:40:08+09:00   {"host":"127.0.0.1","user":null,"method":"POST","path":"/regist.html","code":400,"size":2326,"referer":"http://www.example.com/start.html","agent":"Mozilla/4.08 [en] (Win98; I ;Nav)"}
```

  

필터링 후에는 다음과 같은 형식으로 저장됨을 알 수 있다.

로그를 기록한 날짜 { host : "클라이언트 아이피", ... 중략... agent : "클라이언트 브라우저 식별정보"}

  

  

  

  

* * *

테스트 케이스 : 로그를 파싱하여 저장하는 경우 (Filter - parser)
============================================

td-agent로 로그를 수집하여 저장하는 과정에서 원하는 형식으로 파싱하여 저장해야 하는 경우가 있다.

이러한 경우에 Filter plugin중 parser 타입을 사용하면된다.

테스트 목적
------

이 테스트는 학습차원에서 다음과 같은 td-agent의 동작 확인이 목적이다.

*   파일에서 로그를 수집하여 저장하는 과정에서 Filter plugin의 parser를 사용하여 파싱 가능
    

테스트 시나리오
--------

이 테스트는 다음과 같은 시나리오를 바탕으로 진행된다.

1.  Apache access log가 입력용 파일에 생성된다.
    
2.  td-agent로 Apache access log를 수집하고 파싱한다.
    
3.  파싱된 결과는 출력용 파일에 json 형태로 출력한다.
    

  

테스트에 필요한 사전 지식
--------------

### Appache Access Log

테스트에서 다음과 같은 Common 로그 형식(Common Log Format)을 사용한다.

%h %l %u %t \\"%r\\" %>s %b  

  

%h : 서버에 요청을 한 클라이언트의 IP 주소를 의미한다.

%l : 클라이언트 컴퓨터의 identd가 제공하는 클라이언트의 RFC 1413 신원이다. 만약 요청한 정보가 없다면 "-"로 표기한다.

%u : HTTP 인증으로 알아낸 문서를 요청한 사용자의 userid이다. 문서를 암호로 보호하지 않는다면 "-" 으로 표기한다.

%t : 서버가 요청처리를 마친 시간을 의미한다. \[day/month/year:hour:minute:second zone\] 형식이다.

\\"%r\\" : 클라이언트의 요청줄을 쌍따옴표로 묶어 표현한다. 

%>s : 서버가 클라이언트에게 보내는 상태코드이다.

%b : 응답 헤더를 제외하고 클라이언트에게 보내는 내용의 크기를 나타낸다. 보내는 내용이 없다면 "-"으로 표기한다.

  

  

다음은 Common 로그 형식의 예시이다.

127.0.0.1 - frank \[10/Oct/2000:13:55:36 -0700\] "GET /apache\_pb.gif HTTP/1.0" 200 2326

  

자세한 내용은 다음의 링크를 참고한다.

*   [로그파일 - Apache HTTP Server Version 2.4](https://httpd.apache.org/docs/2.4/ko/logs.html)
    

  

### Json

json에 대한 설명은 다음의 링크를 참고한다.

*   [JSON - 공식 사이트](http://json.org/)
    

  

### Source Plugin - tail

다음은 테스트에서 사용할 tail 설정 예시이다.

```bash
<source>
  @type tail
  path /Users/kevin/dev/fluentd/test/filter_parser/source/*
  pos_file /Users/kevin/dev/fluentd/test/filter_parser/pos/pos_file.pos
  tag filter_parser
  <parse>
    @type none
  </parse>
  refresh_interval 1s
</source>
```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   @type : tail type을 사용한다. 자세한 설명은 아래의 링크를 통하여 확인한다.
    
*   path : 읽어오고자 하는 파일의 경로를 의미한다.
    
*   pos\_file : td-agent는 파일마다 읽었던 위치를 파일로 저장해두는데 그 파일의 경로를 지정한다.
    
*   parse
    
    *   @type : none을 사용한다. 자세한 설명은 아래의 링크를 통하여 확인한다.
        
*   tag : 이벤트를 구분짓기 위한 tag name을 의미한다.
    
*   refresh\_interval : td-agent가 수집하려는 파일리스트의 갱신주기를 의미한다.
    

  

자세한 내용은 아래의 링크를 참고한다.

*   [Fluentd - Input Plugin : tail](https://docs.fluentd.org/input/tail)
    
*   [Fluentd - Parser Plugin : none](https://docs.fluentd.org/parser/none)
    

  

### Filter Plugin - parser

다음은 테스트에서 사용하게 될 parser 설정 예시이다.

```bash
<filter filter_parser*>
  @type parser
  key_name message
  <parse>
    @type regexp
    expression ^(?<host>[^ ]*) (?<identd>[^ ]*) (?<user>[^ ]*) \[(?<time>[^\]]*)\] "(?<method>\S+)(?: +(?<path>[^ ]*) +\S*)?" (?<code>[^ ]*) (?<size>[^ ]*)$
    time_format %d/%b/%Y:%H:%M:%S %z
  </parse>
</filter>
```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   <filter pattern> : pattern 부분에 filter plugin을 적용시키고자 하는 이벤트(tag명)를 명시한다.  
    
*   @type : parser를 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   key\_name : 파싱하고자 하는 필드명을 명시한다.
    
*   parse : 아래의 **Parser Plugins - regexp**를 참고한다.
    

  

자세한 내용은 아래의 링크를 참고한다.

*   [Fluentd - Filter Plugin : parser](https://docs.fluentd.org/filter/parser)
    

  

### Parser Plugin - regexp

다음은 테스트에서 사용하게 될 regexp 설정 예시이다.

```bash
  <parse>
    @type regexp
    expression ^(?<host>[^ ]*) [^ ]* (?<user>[^ ]*) \[(?<time>[^\]]*)\] "(?<method>\S+)(?: +(?<path>[^ ]*) +\S*)?" (?<code>[^ ]*) (?<size>[^ ]*)$
    time_format %d/%b/%Y:%H:%M:%S %z
  </parse>
```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   @type : regexp를 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   expression : 파싱하고자 하는 형식에 대하여 "Ruby의 정규표현식 표현"을 사용하여 표현한다. 위의 예시는 Apache access log중 Common 로그 형식을 의미한다.
    
*   time\_format : 시간형식을 어떻게 지정할 지에 대한 형식을 지정한다. 위의 예시의 샘플은 "20/Aug/2019:13:55:36 +0900" 이다.
    

  

자세한 내용은 아래의 링크를 참고한다.

*   [Fluentd - Parser Plugins : regexp](https://docs.fluentd.org/parser/regexp)
    
*   [Ruby's Regexp document](https://ruby-doc.org/core-2.4.1/Regexp.html#class-Regexp-label-Options)
    

  

### Match Plugin - file

다음은 테스트에서 사용하게 될 file 설정 예시이다.

```bash
<match filter_parser*>
  @type file
  path /Users/kevin/dev/fluentd/test/filter_parser/match/${tag}_output
  path_suffix ".json"
  add_path_suffix true  
  append true
  <format>
    @type json
  </format>
  <buffer tag>
    flush_mode interval
    flush_interval 10s
  </buffer>
</match>
```

  

위의 설정 예시에 관하여 간단하게 설명하면 다음과 같다. required 설정은 녹색으로 표기하였다.

*   <match pattern> : pattern 부분에 match plugin을 적용시키고자 하는 이벤트(tag명)를 명시한다.
    
*   @type : file을 사용한다. 자세한 내용은 아래의 링크를 참고한다.
    
*   path : 출력할 파일의 경로를 의미한다. 예약어(예: tag)를 사용할 수 있다.
    
*   path\_suffix : 확장자명을 지정한다.
    
*   add\_path\_suffix : path\_suffix 사용유무를 지정한다.
    
*   append : 한 파일에 출력하는지 여부를 지정한다. 원할한 테스트를 위하여 설정한다.
    
*   format
    
    *   @type : json으로 설정한다. 자세한 내용은 아래의 링크를 참고한다.  
        
*   buffer : 자세한 내용은 아래의 링크를 참고한다. 원할한 테스트를 위하여 설정한다.
    

  

자세한 내용은 아래의 링크를 통하여 확인한다.

*   [Fluentd - Output plugins : file](https://docs.fluentd.org/output/file)
    
*   [Fluentd - Formatter plugins : json](https://docs.fluentd.org/formatter/json)
    
*   [Fluentd - Config : Buffer Section](https://docs.fluentd.org/configuration/buffer-section)
    

  

테스트 과정
------

1.  파일을 생성하고 정상적으로 생성 되었는지 확인한다.
    
    ```bash
    $ touch filter_parser_input.log | stat filter_parser_input.log
    16777223 8251706 -rw-r--r-- 1 kevin staff 0 0 "Aug 20 18:26:05 2019" "Aug 20 18:26:05 2019" "Aug 20 18:26:05 2019" "Aug 20 18:26:05 2019" 4096 0 0 filter_parser_input.log
    ```
    
2.  td-agent 설정파일의 경로를 수정한다.  
    다음은 경로예시이다.
    
    /Users/kevin/dev/fluentd/test/filter\_parser/config/td-agent.conf
    
    위에서 수정한 경로에 td-agent 설정파일을 생성한다.
    
    ```bash
    $ touch td-agent.conf | stat td-agent.conf
    16777223 8251793 -rw-r--r-- 1 kevin staff 0 0 "Aug 20 18:29:43 2019" "Aug 20 18:29:43 2019" "Aug 20 18:29:43 2019" "Aug 20 18:29:43 2019" 4096 0 0 td-agent.conf
    ```
    
    td-agent 설정 파일을 다음과 같이 수정한다.
    
    ```bash
    $ cat td-agent.conf
    <source>
      @type tail
      path /Users/kevin/dev/fluentd/test/filter_parser/source/*
      pos_file /Users/kevin/dev/fluentd/test/filter_parser/pos/pos_file.pos
      tag filter_parser
      <parse>
        @type none
      </parse>
      refresh_interval 1s
    </source>
    <filter filter_parser*>
      @type parser
      key_name message
      <parse>
        @type regexp
        expression ^(?<host>[^ ]*) (?<identd>[^ ]*) (?<user>[^ ]*) \[(?<time>[^\]]*)\] "(?<method>\S+)(?: +(?<path>[^ ]*) +\S*)?" (?<code>[^ ]*) (?<size>[^ ]*)$
        time_format %d/%b/%Y:%H:%M:%S %z
      </parse>
    </filter>
    <match filter_parser*>
      @type file
      path /Users/kevin/dev/fluentd/test/filter_parser/match/${tag}_output
      add_path_suffix true
      path_suffix ".json"
      append true
      <format>
        @type json
      </format>
      <buffer tag>
        flush_mode interval
        flush_interval 10s
      </buffer>
    </match>
    ```
    
    이제 td-agent를 실행한다.
    
3.  입력용 파일에 로그를 출력하고 정상적으로 출력 되었는지 확인한다.
    
    ```bash
    $ cat source/filter_parser_input.log
    127.0.0.1 - - [20/Aug/2019:00:40:00 +0900] "GET /apache_pb.gif HTTP/1.0" 100 2326
    127.0.0.1 - - [20/Aug/2019:00:40:01 +0900] "POST /registration.html HTTP/1.0" 200 2326
    127.0.0.1 - - [20/Aug/2019:00:40:02 +0900] "POST /registration.html HTTP/1.0" 300 2326
    127.0.0.1 - - [20/Aug/2019:00:40:03 +0900] "GET /apache_pb.gif HTTP/1.0" 400 2326
    127.0.0.1 - - [20/Aug/2019:00:40:04 +0900] "POST /registration.html HTTP/1.0" 500 2326
    127.0.0.1 - - [20/Aug/2019:00:40:05 +0900] "POST /registration.html HTTP/1.0" 100 2326
    127.0.0.1 - - [20/Aug/2019:00:40:06 +0900] "GET /apache_pb.gif HTTP/1.0" 200 2326
    127.0.0.1 - - [20/Aug/2019:00:40:07 +0900] "POST /registration.html HTTP/1.0" 300 2326
    127.0.0.1 - - [20/Aug/2019:00:40:08 +0900] "POST /registration.html HTTP/1.0" 400 2326
    127.0.0.1 - - [20/Aug/2019:00:40:09 +0900] "GET /apache_pb.gif HTTP/1.0" 500 2326
    ```
    
    출력용 파일이 정상적으로 출력 되었는지 확인한다.
    
    ```bash
    $ cat match/filter_parser_output.json
    {"host":"127.0.0.1","identd":"-","user":"-","method":"POST","path":"/registration.html","code":"300","size":"2326"}
    {"host":"127.0.0.1","identd":"-","user":"-","method":"GET","path":"/apache_pb.gif","code":"400","size":"2326"}
    {"host":"127.0.0.1","identd":"-","user":"-","method":"POST","path":"/registration.html","code":"500","size":"2326"}
    {"host":"127.0.0.1","identd":"-","user":"-","method":"POST","path":"/registration.html","code":"100","size":"2326"}
    {"host":"127.0.0.1","identd":"-","user":"-","method":"GET","path":"/apache_pb.gif","code":"200","size":"2326"}
    {"host":"127.0.0.1","identd":"-","user":"-","method":"POST","path":"/registration.html","code":"300","size":"2326"}
    {"host":"127.0.0.1","identd":"-","user":"-","method":"POST","path":"/registration.html","code":"400","size":"2326"}
    {"host":"127.0.0.1","identd":"-","user":"-","method":"GET","path":"/apache_pb.gif","code":"500","size":"2326"}
    ```
    
      
    

테스트 결과
------

테스트 결과 parser 타입을 사용하여 파싱이 가능함을 확인하였다.

테스트 과정에서 Apache access log를 수집하여 json 형식의 파일로 저장하는 것을 확인하였다.

다음은 파싱전후의 예시이다.

```bash
127.0.0.1 - - [20/Aug/2019:00:40:00 +0900] "GET /apache_pb.gif HTTP/1.0" 100 2326
127.0.0.1 - - [20/Aug/2019:00:40:01 +0900] "POST /registration.html HTTP/1.0" 200 2326
127.0.0.1 - - [20/Aug/2019:00:40:02 +0900] "POST /registration.html HTTP/1.0" 300 2326
```

  

```bash
{"host":"127.0.0.1","identd":"-","user":"-","method":"POST","path":"/registration.html","code":"300","size":"2326"}
{"host":"127.0.0.1","identd":"-","user":"-","method":"GET","path":"/apache_pb.gif","code":"400","size":"2326"}
{"host":"127.0.0.1","identd":"-","user":"-","method":"POST","path":"/registration.html","code":"500","size":"2326"}

```

  
파싱된 후 저장된 json형식의 로그는 다음과 같은 형식으로 저장된다.

{"host": "클라이언트 아이피", "identd" : "클라이언트 RFC1413 신원", "user" : "클라이언트 이름", "method" : "http 메서드", "path": "접근하려는 경로", "code" : "http 상태코드", "size" : "응답 용량"}