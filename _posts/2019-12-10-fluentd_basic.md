---
title:  "Fluentd 기초 사용법"
excerpt: "이 문서는 Fluentd(td-agent) 사용함에 있어 다음과 같은 사용법을 정리하기 위하여 작성 되었다."

categories:
  - Fluentd
tags:
  - Fluentd

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

이 문서는 Fluentd(td-agent) 사용함에 있어 다음과 같은 사용법을 정리하기 위하여 작성 되었다.

*   td-agent의 실행과 종료
    
*   td-agent 로그파일
    
*   td-agent 설정파일 경로를 변경하는 방법
    

환경
==

다음과 같은 환경에서 Fluentd를 구동하였다.

*   OS : macOS Mojave 10.14.5
    
*   Fluentd : 1.0.2 (td-agent : 3.1.1.0)
    

사용법
===

실행, 종료
------

td-agent의 실행은 다음과 같은 명령으로 한다.

```
$ sudo launchctl load /Library/LaunchDaemons/td-agent.plist
```

td-agent의 종료는 다음과 같은 명령으로 한다.

```
$ sudo launchctl unload /Library/LaunchDaemons/td-agent.plist
```

편의를 위하여 다음과 같이 디렉터리에 접근하여 실행, 종료 하기도 한다.

```
$ cd /Library/LaunchDaemons
$ sudo launchctl load td-agent.plist
$ sudo launchctl unload td-agent.plist
```

로그 파일
-----

td-agent의 로그는 다음과 같은 경로의 파일에 저장된다.

```
/var/log/td-agent/td-agent.log
```

다음과 같이 td-agent 로그 파일을 테일링하여 td-agent의 동작을 확인하기도 한다.

```
$ tail -50f td-agent.log
2019-09-18 14:47:33 +0900 [info]: #0 shutting down input plugin type=:tail plugin_id="object:3fe4d84363e8"
2019-09-18 14:47:33 +0900 [info]: #0 shutting down output plugin type=:file plugin_id="object:3fe4d859ffcc"
2019-09-18 14:47:33 +0900 [info]: Worker 0 finished with status 0
2019-09-18 15:18:32 +0900 [info]: parsing config file is succeeded path="/Users/kevin/dev/fluentd/test/file_path/config/td-agent.conf"
2019-09-18 15:18:32 +0900 [info]: using configuration file: <ROOT>
  <source>
    @type tail
    tag "file_path"
    path "/Users/kevin/dev/fluentd/test/file_path/source/prefix*"
    pos_file "/Users/kevin/dev/fluentd/test/file_path/pos/pos_file.pos"
    refresh_interval 5s
    read_from_head true
    <parse>
      @type "none"
    </parse>
  </source>
  <match file_path*>
    @type file
    path "/Users/kevin/dev/fluentd/test/file_path/match/${tag}_output"
    add_path_suffix true
    path_suffix ".log"
    append true
    <buffer tag>
      flush_mode interval
      flush_interval 5s
      path "/Users/kevin/dev/fluentd/test/file_path/match/${tag}_output"
    </buffer>
    <format>
      @type "out_file"
      output_tag false
      output_time true
    </format>
  </match>
</ROOT>
2019-09-18 15:18:32 +0900 [info]: starting fluentd-1.0.2 pid=2152 ruby="2.4.2"
2019-09-18 15:18:32 +0900 [info]: spawn command to main:  cmdline=["/opt/td-agent/embedded/bin/ruby", "-Eascii-8bit:ascii-8bit", "/opt/td-agent/usr/sbin/td-agent", "--log", "/var/log/td-agent/td-agent.log", "--use-v1-config", "--under-supervisor"]
2019-09-18 15:18:32 +0900 [info]: gem 'fluent-plugin-elasticsearch' version '2.4.0'
2019-09-18 15:18:32 +0900 [info]: gem 'fluent-plugin-kafka' version '0.6.5'
2019-09-18 15:18:32 +0900 [info]: gem 'fluent-plugin-rewrite-tag-filter' version '2.0.1'
2019-09-18 15:18:32 +0900 [info]: gem 'fluent-plugin-s3' version '1.1.0'
2019-09-18 15:18:32 +0900 [info]: gem 'fluent-plugin-td' version '1.0.0'
2019-09-18 15:18:32 +0900 [info]: gem 'fluent-plugin-td-monitoring' version '0.2.3'
2019-09-18 15:18:32 +0900 [info]: gem 'fluent-plugin-webhdfs' version '1.2.2'
2019-09-18 15:18:32 +0900 [info]: gem 'fluentd' version '1.0.2'
2019-09-18 15:18:32 +0900 [info]: adding match pattern="file_path*" type="file"
2019-09-18 15:18:32 +0900 [info]: adding source type="tail"
2019-09-18 15:18:32 +0900 [info]: #0 starting fluentd worker pid=2159 ppid=2152 worker=0
2019-09-18 15:18:32 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_path/source/prefix_test.txt
2019-09-18 15:18:32 +0900 [info]: #0 following tail of /Users/kevin/dev/fluentd/test/file_path/source/prefix_test.log
2019-09-18 15:18:32 +0900 [info]: #0 fluentd worker is now running worker=0
```

설정파일 경로를 변경하는 방법
================

td-agent 설정파일의 기본 경로는 다음과 같다.

/etc/td-agent/td-agent.conf

설정파일의 경로를 변경하기 위해서는 다음 경로의 파일에 접근해야 한다.

/opt/td-agent/usr/sbin/td-agent

```
$ cat /opt/td-agent/usr/sbin/td-agent
#!/opt/td-agent/embedded/bin/ruby
ENV["GEM_HOME"]="/opt/td-agent/embedded/lib/ruby/gems/2.4.0/"
ENV["GEM_PATH"]="/opt/td-agent/embedded/lib/ruby/gems/2.4.0/"
ENV["FLUENT_CONF"]="/etc/td-agent/td-agent.conf"
ENV["FLUENT_PLUGIN"]="/etc/td-agent/plugin"
ENV["FLUENT_SOCKET"]="/var/run/td-agent/td-agent.sock"
load "/opt/td-agent/embedded/bin/fluentd"
```

위의 파일 내용중 ENV\["FLUENT\_CONF"\]="/etc/td-agent/td-agent.conf"을 원하는 설정파일의 경로를 변경해주면 된다.

다음은 변경한 예시이다.

```
$ vim /opt/td-agent/usr/sbin/td-agent
#!/opt/td-agent/embedded/bin/ruby
ENV["GEM_HOME"]="/opt/td-agent/embedded/lib/ruby/gems/2.4.0/"
ENV["GEM_PATH"]="/opt/td-agent/embedded/lib/ruby/gems/2.4.0/"
ENV["FLUENT_CONF"]="/Users/kevin/dev/fluentd/test/file_path/config/td-agent.conf"
ENV["FLUENT_PLUGIN"]="/etc/td-agent/plugin"
ENV["FLUENT_SOCKET"]="/var/run/td-agent/td-agent.sock"
load "/opt/td-agent/embedded/bin/fluentd"
```

  
참고자료
=======

*   [https://docs.fluentd.org/installation/install-by-dmg](https://docs.fluentd.org/installation/install-by-dmg)
    
*   [https://docs.fluentd.org/installation/post-installation-guide](https://docs.fluentd.org/installation/post-installation-guide)
