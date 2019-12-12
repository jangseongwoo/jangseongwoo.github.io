---
title:  "Fluentd - 입력 로그 파일 경로 설정"
excerpt: "Fluentd(이하 td-agent)로 로그 파일의 로그를 수집할 때 파일 경로에 관하여 다음과 같은 케이스가 존재한다."

categories:
  - Fluentd
tags:
  - Fluentd
---  

테스트 목적
======

Fluentd(이하 td-agent)로 로그 파일의 로그를 수집할 때 파일 경로에 관하여 다음과 같은 케이스가 존재한다.

*   파일 경로를 지정하는 경우 (예 : log/access.log)
    
*   디렉터리와 확장자만 지정하는 경우 (예 : log/\*.log)
    
*   디렉터리와 파일명의 prefix만 지정하는 경우 (예: log/access\*)
    

  

이 테스트는 위와 같은 케이스에 대하여 td-agent를 실행하고 로그 파일을 생성할 때 td-agent의 동작을 확인하는 데에 목적이 있다.

테스트 환경
======

테스트 환경은 다음과 같다.

OS : macOS Mojave 10.14.6

td-agent : v1.0.2

  

테스트에 필요한 사전 지식
==============

다음과 같은 사전 지식이 필요하다.

*   Source Plug In : tail
    
    *   read\_from\_head에 관한 옵션
        
*   Match Plug In : match
    
*   td-agent 관련 정보
    
    *   td-agent 실행, 종료
        
    *   td-agent 동작 로그 확인 방법
        
    *   td-agent 설정 경로
        

  

Source Plug In : tail
---------------------

다음 링크들을 참고 한다.

*   [Fluentd - Input Plugin : tail](https://docs.fluentd.org/input/tail)
    

### read\_from\_head 옵션

다음 링크들을 참고 한다.

*   [Fluentd - Input Plugin : tail - read\_from\_head](https://docs.fluentd.org/input/tail#read_from_head)
    

Match Plug In : match
---------------------

다음 링크들을 참고 한다.

*   [Fluentd - Output Plugin : file](https://docs.fluentd.org/output/file)
    

td-agent 기초 사용법
---------------

Fluentd 기초 사용법을 확인하여 td-agent 기초 동작을 확인하면 된다.

테스트간 공통사항
=========

td-agent의 설정 파일의 경로를 다음과 같이 지정한다.

/Users/kevin/dev/fluentd/test/file\_path/config/td-agent.conf

  

```
$ cat /opt/td-agent/usr/sbin/td-agent

... 중략 ...

ENV["FLUENT_CONF"]="/Users/kevin/dev/fluentd/test/file_path/config/td-agent.conf"

... 중략 ...
```

  

케이스 : 파일 경로를 지정하는 경우
====================

td-agent 설정 파일을 다음과 같이 수정하고 실행한다.

```
$ cat config/td-agent.log 
<source>
  @type tail
  tag file_path
  path /Users/kevin/dev/fluentd/test/file_path/source/fixed_file_path.log
  pos_file /Users/kevin/dev/fluentd/test/file_path/pos/pos_file.pos
  <parse>
    @type none
  </parse>
  refresh_interval 5s
  read_from_head true
</source>

<match file_path*>
  @type file
  path /Users/kevin/dev/fluentd/test/file_path/match/${tag}_output
  add_path_suffix true
  path_suffix ".log"
  append true
  <buffer tag>
    flush_mode interval
    flush_interval 5s
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

  

  

다음과 같이 로그를 파일에 저장한다.

```
$ echo "fixed_file_path_line_1" > source/fixed_file_path.log
```

다음과 같이 td-agent가 파일 생성을 인지한 것을 확인한다.

```
$ cat /var/log/td-agent/td-agent.log
 
... 중략 ...
 
2019-08-30 14:28:35 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_path/source/fixed_file_path.log
```

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_path_output.log
2019-08-30T14:28:35+09:00	{"message":"fixed_file_path_line_1"}

```

  

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "fixed_file_path_line_2" >> source/fixed_file_path.log
$ echo "fixed_file_path_line_3" >> source/fixed_file_path.log
$ echo "fixed_file_path_line_4" >> source/fixed_file_path.log
$ echo "fixed_file_path_line_5" >> source/fixed_file_path.log
```

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_path_output.log
2019-08-30T14:28:35+09:00	{"message":"fixed_file_path_line_1"}
2019-08-30T14:29:30+09:00	{"message":"fixed_file_path_line_2"}
2019-08-30T14:29:34+09:00	{"message":"fixed_file_path_line_3"}
2019-08-30T14:29:38+09:00	{"message":"fixed_file_path_line_4"}
2019-08-30T14:29:47+09:00	{"message":"fixed_file_path_line_5"}
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   td-agent 설정 파일상의 입력 파일이 실제로 존재하지 않아도 td-agent는 실행된다.
    
*   입력용 파일이 생성되고 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만 로그가 저장된다.
    

  

케이스 : 디렉터리와 확장자만 지정하는 경우
========================

td-agent 설정 파일을 다음과 같이 수정하고 실행한다.

```
$ cat config/td-agent.log 
<source>
  @type tail
  tag file_path
  path /Users/kevin/dev/fluentd/test/file_path/source/*.log
  pos_file /Users/kevin/dev/fluentd/test/file_path/pos/pos_file.pos
  <parse>
    @type none
  </parse>
  refresh_interval 5s
  read_from_head true
</source>

<match file_path*>
  @type file
  path /Users/kevin/dev/fluentd/test/file_path/match/${tag}_output
  add_path_suffix true
  path_suffix ".log"
  append true
  <buffer tag>
    flush_mode interval
    flush_interval 5s
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

  

### \*.log에 로그 저장

다음과 같이 로그를 파일에 저장한다.

```
$ echo "filename_extension_log_line_1" > source/log_file.log
```

다음과 같이 td-agent가 파일 생성을 인지한 것을 확인한다.

```
$ cat /var/log/td-agent/td-agent.log
 
... 중략 ...
 
2019-08-30 15:05:01 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_path/source/log_file.log
```

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_path_output.log
2019-08-30T15:05:01+09:00	{"message":"filename_extension_log_line_1"}

```

  

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "filename_extension_log_line_2" >> source/log_file.log
$ echo "filename_extension_log_line_3" >> source/log_file.log
```

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_path_output.log
2019-08-30T15:05:01+09:00	{"message":"filename_extension_log_line_1"}
2019-08-30T15:08:01+09:00	{"message":"filename_extension_log_line_2"}
2019-08-30T15:08:06+09:00	{"message":"filename_extension_log_line_3"}
```

  

  

### \*.log가 아닌 경우

다음과 같이 로그를 파일에 저장한다.

```
$ echo "filename_extension_txt_line_1" > source/text_file.txt
```

다음과 같이 td-agent가 파일 생성을 인지하지 못한다.

```
$ cat /var/log/td-agent/td-agent.log
 
... 중략 ...

파일 생성 인지 관한 로그가 저장되지 않는다.
```

출력용 파일을 확인 했을때 로그가 저장되지 않는 것을 알 수 있다.

```
$ tail -10f match/file_path_output.log
입력용 파일에 저장한 로그가 저장되지 않는다.
```

  

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "filename_extension_txt_line_2" >> source/text_file.txt
$ echo "filename_extension_txt_line_3" >> source/text_file.txt
```

출력용 파일을 확인 했을때 로그가 저장되지 않는 것을 알 수 있다.

```
$ tail -10f match/file_path_output.log
입력용 파일에 저장한 로그가 저장되지 않는다.
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   td-agent 설정 파일상 설정한 경로와 확장자가 일치하는 파일의 경우
    
    *   입력용 파일이 생성되고 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만 로그가 저장된다.
        
*   td-agent 설정 파일상 설정한 경로는 일치하고 확장자가 일치하지 않는 경우
    
    *   출력용 파일에 로그가 저장되지 않는다.
        

  

케이스 : 디렉터리와 파일명의 prefix만 지정하는 경우
================================

td-agent 설정 파일을 다음과 같이 수정하고 실행한다.

```
$ cat config/td-agent.log 
<source>
  @type tail
  tag file_path
  path /Users/kevin/dev/fluentd/test/file_path/source/prefix*
  pos_file /Users/kevin/dev/fluentd/test/file_path/pos/pos_file.pos
  <parse>
    @type none
  </parse>
  refresh_interval 5s
  read_from_head true
</source>

<match file_path*>
  @type file
  path /Users/kevin/dev/fluentd/test/file_path/match/${tag}_output
  add_path_suffix true
  path_suffix ".log"
  append true
  <buffer tag>
    flush_mode interval
    flush_interval 5s
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

### prefix가 일치하는 경우

다음과 같이 로그를 파일에 저장한다.

```
$ echo "prefix_line_1" > source/prefix_test.txt
```

다음과 같이 td-agent가 파일 생성을 인지한 것을 확인한다.

```
$ cat /var/log/td-agent/td-agent.log
 
... 중략 ...
 
2019-08-30 15:35:45 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_path/source/prefix_test.txt
```

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_path_output.log
2019-08-30T15:35:45+09:00	{"message":"prefix_line_1"}

```

  

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "prefix_line_2" >> source/prefix_test.txt
$ echo "prefix_line_3" >> source/prefix_test.txt
```

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_path_output.log
2019-08-30T15:35:45+09:00	{"message":"prefix_line_1"}
2019-08-30T15:36:58+09:00	{"message":"prefix_line_2"}
2019-08-30T15:37:01+09:00	{"message":"prefix_line_3"}
```

  

다음과 같이 파일에 로그를 저장한다.

```
$ echo "prefix_line_1" > source/prefix_test.log
$ echo "prefix_line_2" >> source/prefix_test.log
$ echo "prefix_line_3" >> source/prefix_test.log
```

다음과 같이 td-agent가 파일 생성을 인지한 것을 확인한다.

```
$ cat /var/log/td-agent/td-agent.log
 
... 중략 ...
 
2019-08-30 15:40:00 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_path/source/prefix_test.log
```

출력용 파일을 확인하면 다음과 같다.

```
$ tail -10f match/file_path_output.log
2019-08-30T15:40:00+09:00	{"message":"prefix_line_1"}
2019-08-30T15:40:09+09:00	{"message":"prefix_line_2"}
2019-08-30T15:40:13+09:00	{"message":"prefix_line_3"}
```

  

### prefix가 일치하지 않는 경우

다음과 같이 로그를 파일에 저장한다.

```
$ echo "prefix_line_1" > none.txt
```

다음과 같이 td-agent가 파일 생성을 인지하지 못한다.

```
$ cat /var/log/td-agent/td-agent.log
 
... 중략 ...

파일 생성 인지 관한 로그가 저장되지 않는다.
```

출력용 파일을 확인 했을때 로그가 저장되지 않는 것을 알 수 있다.

```
$ tail -10f match/file_path_output.log
입력용 파일에 저장한 로그가 저장되지 않는다.
```

  

  

다시 한번 다음과 같이 파일에 로그를 저장한다.

```
$ echo "prefix_line_2" >> none.txt
$ echo "prefix_line_3" >> none.txt
```

출력용 파일을 확인 했을때 로그가 저장되지 않는 것을 알 수 있다.

```
$ tail -10f match/file_path_output.log
입력용 파일에 저장한 로그가 저장되지 않는다.
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   td-agent 설정 파일상 설정한 경로와 prefix가 일치하는 파일의 경우
    
    *   입력용 파일이 생성되고 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만 로그가 저장된다.
        
*   td-agent 설정 파일상 설정한 경로는 일치하지만 prefix가 일치하지 않는 파일의 경우
    
    *   출력용 파일에 로그가 저장되지 않는다.
        

  

  

테스트 결과
======

테스트 결과는 다음과 같이 정리할 수 있다.

파일 경로를 지정하는 경우

*   td-agent 설정 파일상의 입력 파일이 실제로 존재하지 않아도 td-agent는 실행된다.
    
*   입력용 파일이 생성되고 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만 로그가 저장된다.
    

  

디렉터리와 확장자만 지정하는 경우

*   td-agent 설정 파일상 설정한 경로와 확장자가 일치하는 파일의 경우 : 입력용 파일이 생성되고 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만 로그가 저장된다.
    
*   td-agent 설정 파일상 설정한 경로는 일치하고 확장자가 일치하지 않는 경우 : 출력용 파일에 로그가 저장되지 않는다.
    

  

디렉터리와 파일명의 prefix만 지정하는 경우

*   td-agent 설정 파일상 설정한 경로와 prefix가 일치하는 파일의 경우 : 입력용 파일이 생성되고 로그를 저장하면 출력용 파일에 로그의 형식은 바뀌지만 로그가 저장된다.
    
*   td-agent 설정 파일상 설정한 경로는 일치하지만 prefix가 일치하지 않는 파일의 경우 : 출력용 파일에 로그가 저장되지 않는다.
