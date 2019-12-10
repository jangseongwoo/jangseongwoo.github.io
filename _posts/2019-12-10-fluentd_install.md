---
title:  "Fluentd(td-agent) 설치 및 실행 방법"
excerpt: "아래 내용은 Mac에서 td-agent를 설치하고 기본 동작을 확인하는 것을 기준으로 작성된 내용이다."

categories:
  - Fluentd
tags:
  - Fluentd
---

Td-agent 설치 및 확인
================

아래 내용은 Mac에서 td-agent를 설치하고 기본 동작을 확인하는 것을 기준으로 작성된 내용이다.

참고:

*   [https://docs.fluentd.org/installation/install-by-dmg](https://docs.fluentd.org/installation/install-by-dmg)
    

  
설치 완료되면 아래 경로에 td-agent가 설치된다.  
/opt/td-agent/usr/sbin/

```
$ ls -l /opt/td-agent/usr/sbin/
total 16
-rwxr-xr-x  1 root  wheel  348 Feb  1  2018 td-agent
-rwxr-xr-x  1 root  wheel  177 Feb  1  2018 td-agent-gem

```

  
디폴트 설정 파일은 아래 경로에서 확인할 수 있다.

```
$ ls -l /etc/td-agent/
total 8
drwxr-xr-x  2 root  wheel    64 Jun 12 22:27 plugin
-rw-r--r--  1 root  wheel  2381 Jun 12 22:27 td-agent.conf

```

/etc/td-agent/td-agent.conf 파일의 내용 일부는 아래와 같다.

```
... 중략 ...

# HTTP input
# POST http://localhost:8888/<tag>?json=<json>
# POST http://localhost:8888/td.myapp.login?json={"user"%3A"me"}
# @see http://docs.fluentd.org/articles/in_http
<source>
  @type http
  @id input_http
  port 8888
</source>

... 중략 ...

```

Start td-agent on Mac
---------------------

Daemon 방식 실행

```
$ sudo launchctl load /Library/LaunchDaemons/td-agent.plist
$ less /var/log/td-agent/td-agent.log

$ ps -ef | grep td-agent
    0 47678     1   0 10:42PM ??         0:00.37 /opt/td-agent/embedded/bin/ruby /opt/td-agent/usr/sbin/td-agent --log /var/log/td-agent/td-agent.log --use-v1-config
    0 47679 47678   0 10:42PM ??         0:00.46 /opt/td-agent/embedded/bin/ruby -Eascii-8bit:ascii-8bit /opt/td-agent/usr/sbin/td-agent --log /var/log/td-agent/td-agent.log --use-v1-config --under-supervisor
  502 47713 47688   0 10:44PM ttys025    0:00.00 grep td-agent

```

데몬으로 실행하는 경우 stdout이 없고 stdout으로 출력되는 로그가 /var/log/td-agent/td-agent.log에 남겨진다.

  
기본 foreground로 실행하기

```
$ /opt/td-agent/usr/sbin/td-agent -c /etc/td-agent/td-agent.conf

```

이 경우 stdout으로 출력된다.

  

Test
----

```
$ curl -X POST -d 'json={"json":"message"}' http://localhost:8888/debug.test

```

  

Stop td-agent damon on Mac
--------------------------

```
$ sudo launchctl unload /Library/LaunchDaemons/td-agent.plist

```

  

* * *

참고자료
====

*   [https://docs.fluentd.org/installation/install-by-dmg](https://docs.fluentd.org/installation/install-by-dmg)
    
*   [https://bcho.tistory.com/1115](https://bcho.tistory.com/1115)
    
*   [https://brunch.co.kr/@zigzag/16?utm\_source=gaerae.com&utm\_campaign=%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%8A%A4%EB%9F%BD%EB%8B%A4&utm\_medium=social&fbclid=IwAR1pVa1grnRrsxpiOIHJBLyT\_ATjBjpeuyA1v7GxsK0Aj8\_DoqKeUbndIdQ](https://brunch.co.kr/@zigzag/16?utm_source=gaerae.com&utm_campaign=%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%8A%A4%EB%9F%BD%EB%8B%A4&utm_medium=social&fbclid=IwAR1pVa1grnRrsxpiOIHJBLyT_ATjBjpeuyA1v7GxsK0Aj8_DoqKeUbndIdQ)
