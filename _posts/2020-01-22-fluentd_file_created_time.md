---
title:  "Fluentd의 Read from head option에 대해 알아보기"
excerpt: "Fluentd의 Read from head option이 있다. 이해할 때 헷갈리는 부분이 있어 정확한 이해를 위해 로컬에서 직접 시나리오를 만들어 테스트를 진행해본다."

categories:
  - Fluentd
tags:
  - Fluentd
---

테스트 목적
======

Fluentd(이하 td-agent)로 로그를 수집할 때 디렉터리 워치로 파일 로그를 수집하는 경우가 있다. (예시 : 날짜별 파일 로그 수집)

이러한 경우에서 로그 파일 생성 시점에 따라 다음과 같은 케이스로 분류할 수 있다.

*   파일 생성 시점과 로그 저장 시점이 다른 경우
    
*   파일 생성 시점과 로그 저장 시점이 같은 경우
    

  

위의 로그 파일 생성 시점에 관하여 추가적인 설명을 하면 다음과 같다.

파일 생성과 로그 저장이 다른 시점에 이루어지는 경우

*   로그 파일이 생성이 된다. 이후에 로그가 발생하면 파일에 저장한다.
    
*   커널 명령으로 표현하면 다음과 같다.
    ```
    $ touch log_file.log
    $ echo "log_test_1" >> log_file.log
    ```
    
      
    

  

파일 생성과 로그 저장이 같은 시점에 이루어지는 경우

*   로그가 발생하면 파일 생성과 동시에 로그를 저장한다.
    
*   커널 명령으로 표현하면 다음과 같다.
    
    ```
    $ echo "log_test_1" > log_file.log
    ```
    
      
    

  
이 테스트는 로그 파일 생성 시점에 따른 케이스별로 테스트하며 td-agent가 동작을 확인하는 데에 목적이 있다.

  

테스트 환경
======

테스트 환경은 다음과 같다.

OS : macOS Mojave 10.14.6

td-agent : v1.0.2

  

테스트에 필요한 사전 지식
==============

다음과 같은 사전 지식이 필요하다.

*   Source Plug In : tail
    
*   Match Plug In : match
    
*   td-agent 관련 정보
    
    *   td-agent 실행, 종료
        
    *   td-agent 동작 로그 확인 방법
        
    *   td-agent 설정 경로
        

  

Source Plug In : tail
---------------------

다음 링크들을 참고 한다.

*   [Fluentd - Input Plugin : tail](https://docs.fluentd.org/input/tail)
    
*   [Fluentd - plugin에 대한 학습 정리](https://jangseongwoo.github.io/fluentd/fluentd_filter_plugin_operation_check/)

*   [Fluentd(td-agent) output plugin](https://jangseongwoo.github.io/fluentd/fluentd_output_plugin_operation_check/)
    

Match Plug In : match
---------------------

다음 링크들을 참고 한다.

*   [Fluentd - Output Plugin : file](https://docs.fluentd.org/output/file)
    
*   [Fluentd - plugin에 대한 학습 정리](https://jangseongwoo.github.io/fluentd/fluentd_filter_plugin_operation_check/)
    

td-agent 관련 정보
--------------

[Fluentd 기초 사용법](https://jangseongwoo.github.io/fluentd/fluentd_basic/)을 확인하여 td-agent 기초 동작을 확인하면 된다.

td-agent의 파일 감지 여부와 read\_from\_head 옵션
---------------------------------------

"td-agent가 수집하려는 파일의 감지 여부(position file에 저장되는 정보)"와 "read\_from\_head 옵션"에 따라 "파일에서 로그수집 시작위치"가 다르다.

이와 관련하여 혼동되는 부분이 있을 것이라 생각되어 다음과 같이 정리한다.

수집하려는 파일의 감지여부

read\_from\_file 옵션

로그수집 시작위치

O

true

파일의 bottom부터 수집

O

false

파일의 bottom부터 수집

X

true

파일의 head부터 수집

X

false

파일의 bottom부터 수집

  

더 자세한 내용은 [Fluentd - Input Plugin : tail : read\_from\_head](https://docs.fluentd.org/input/tail#read_from_head)에서 확인한다.

테스트 과정
======

td-agent의 설정 파일의 경로를 다음과 같이 지정한다.

/Users/kevin/dev/fluentd/test/file\_creation\_time/config/td-agent.conf

  

```
$ cat /opt/td-agent/usr/sbin/td-agent

... 중략 ...

ENV["FLUENT_CONF"]="/Users/kevin/dev/fluentd/test/file_creation_time/config/td-agent.conf"

... 중략 ...
```

  

  

td-agent 설정 파일을 다음과 같이 수정하고 실행한다.

```
$ cat config/td-agent.log 
<source>
  @type tail
  tag file_creation_time
  path /Users/kevin/dev/fluentd/test/file_creation_time/source/*
  pos_file /Users/kevin/dev/fluentd/test/file_creation_time/pos/pos_file.pos
  <parse>
    @type none
  </parse>
  refresh_interval 5s
</source>
<match file_creation_time*>
  @type file
  path /Users/kevin/dev/fluentd/test/file_creation_time/match/${tag}_output
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

  

```
$ sudo launchctl load td-agent.plist
```

  

케이스 : 파일 생성 시점과 로그 저장 시점이 다른 경우
-------------------------------

다음과 같이 입력용 빈 파일을 생성한다.

```
$ touch source/different_time_input.log
```

  

  

다음과 같이 td-agent가 파일 생성을 인지한 것을 확인한다.

```
$ cat /var/log/td-agent/td-agent.log

... 중략 ...

2019-08-29 17:40:32 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_creation_time/source/different_time_input.log
```

  

  

다음과 같이 입력용 파일에 로그를 저장한다.

```
$ echo "log_test_line1" >> source/differnt_time_input.log
```

  

  

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_creation_time_output.log
2019-08-29T17:41:03+09:00	{"message":"log_test_line1"}
```

  

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "log_test_line2" >> source/differnt_time_input.log
$ echo "log_test_line3" >> source/differnt_time_input.log
$ echo "log_test_line4" >> source/differnt_time_input.log
```

  

  

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_creation_time_output.log
2019-08-29T17:41:03+09:00	{"message":"log_test_line1"}
2019-08-29T17:49:58+09:00	{"message":"log_test_line2"}
2019-08-29T17:50:04+09:00	{"message":"log_test_line3"}
2019-08-29T17:50:10+09:00	{"message":"log_test_line4"}
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   입력용 빈 파일을 생성하면 td-agent 파일 생성을 인지한다.
    
*   입력용 파일 생성 이후 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만  로그가 저장된다.
    

  

  

케이스 : 파일 생성 시점과 로그 저장 시점이 같은 경우
-------------------------------

다음과 같이 로그를 파일에 저장한다.

```
$ echo "log_test_line1" > source/same_time_input.log
```

  

별도의 파일 생성없이 로그를 저장하여도 파일이 생성되고 로그가 저장된다.

  

  

다음과 같이 td-agent가 파일 생성을 인지한 것을 확인한다.

```
$ cat /var/log/td-agent/td-agent.log

... 중략 ...

2019-08-29 18:10:42 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_creation_time/source/same_time_input.log
```

  

  

출력용 파일에 로그가 저장 되었는지 확인 하였지만 로그가 저장된 것을 확인할 수 없다.

```
$ tail -10f match/file_creation_time_output.log

... 중략 ...

same_time_input.log의 로그 내용이 출력되지 않음.
```

  

  

다음과 같이 입력용 파일에 로그를 저장한다.

```
$ echo "log_test_line2" >> source/same_time_input.log
```

  

  

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_creation_time_output.log

... 중략 ...

2019-08-29T18:16:57+09:00	{"message":"log_test_line2"}
```

  

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "log_test_line3" >> source/same_time_input.log
$ echo "log_test_line4" >> source/same_time_input.log
$ echo "log_test_line5" >> source/same_time_input.log
```

  

  

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_creation_time_output.log

... 중략 ...

2019-08-29T18:16:57+09:00	{"message":"log_test_line2"}
2019-08-29T18:18:40+09:00	{"message":"log_test_line3"}
2019-08-29T18:18:43+09:00	{"message":"log_test_line4"}
2019-08-29T18:18:46+09:00	{"message":"log_test_line5"}
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   입력용 파일을 생성과 동시에 로그를 저장하면 td-agent는 파일 생성은 인지하지만 출력용 파일을 확인 하였을 때 로그가 저장되지 않는다.
    
*   입력용 파일 생성 이후 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만  로그가 저장된다.
    

  

  

케이스 : 파일 생성 시점과 로그 저장 시점이 같은 경우 (read\_from\_head 옵션을 true로 설정하였을 때)
--------------------------------------------------------------------

**케이스 : 파일 생성 시점과 로그 저장 시점이 같은 경우**와 동일한 설정, 과정에서 Source plug in - tail의 read\_from\_head 옵션을 변경하고 td-agent의 동작을 확인한다.

  

td-agent 설정 파일에 다음과 같은 옵션을 source plugin에 추가한다.

```
read_from_head = true
```

  

```
$ cat config/td-agent.log 
<source>
  @type tail
  tag file_creation_time
  read_from_head = true 
  path /Users/kevin/dev/fluentd/test/file_creation_time/source/*
  pos_file /Users/kevin/dev/fluentd/test/file_creation_time/pos/pos_file.pos
  <parse>
    @type none
  </parse>
  refresh_interval 5s
</source>
<match file_creation_time*>
  @type file
  path /Users/kevin/dev/fluentd/test/file_creation_time/match/${tag}_output
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

```
$ sudo launchctl load td-agent.plist
```

  

다음과 같이 로그를 파일에 저장한다.

```
$ echo "log_test_line1" > source/same_time_head_input.log
```

  

다음과 같이 td-agent가 파일 생성을 인지한 것을 확인한다.

```
$ cat /var/log/td-agent/td-agent.log

... 중략 ...

019-08-29 18:39:16 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_creation_time/source/same_time_head_input.log
```

  

출력용 파일을 확인하면 로그가 저장된 것을 알 수 있다.

```
$ tail -10f match/file_creation_time_output.log

... 중략 ...

2019-08-29T18:39:16+09:00	{"message":"log_test_line1"}
```

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "log_test_line2" >> source/same_time_head_input.log
$ echo "log_test_line3" >> source/same_time_head_input.log
$ echo "log_test_line4" >> source/same_time_head_input.log
```

  

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_creation_time_output.log

... 중략 ...

2019-08-29T18:39:16+09:00	{"message":"log_test_line1"}
2019-08-29T18:44:52+09:00	{"message":"log_test_line2"}
2019-08-29T18:44:58+09:00	{"message":"log_test_line3"}
2019-08-29T18:45:02+09:00	{"message":"log_test_line4"}
```

  

테스트 결과를 정리하면 다음과 같다.

*   read\_from\_head = true인 경우에는 입력용 파일을 생성과 동시에 로그를 저장하면 td-agent는 파일 생성을 인지하고 출력용 파일에도 로그가 저장된다.
    
*   입력용 파일에 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만  로그가 저장된다.
    

  

테스트 결과
======

테스트 결과를 정리하면 다음과 같다.

파일 생성 시점과 로그 저장 시점이 다른 경우

*   입력용 로그 파일에 저장된 로그는 출력용 파일에 저장됨을 알 수 있다.
    

  

파일 생성 시점과 로그 저장 시점이 다른 경우

*   입력용 로그 파일 생성 시점의 저장된 로그는 출력용 파일에 저장되지 않는다.
    
*   생성이후 저장된 로그는 출력용 파일에 저장된다.
    
*   만약 파일 생성 시점의 로그를 저장하고자 한다면 Input plug in - tail의 read\_from\_head 옵션은 true로 한다.
