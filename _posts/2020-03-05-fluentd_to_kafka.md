---
title:  "Fluent-plugin-kafka"
excerpt: "이 문서는 Fluentd를 이용해 데이터를 수집해 Kafka에 데이터를 Publishing 하는 것에 대해 학습한 것을 정리하기 위해 작성했다. "

categories:
  - Kafka
tags:
  - Kafka
  - Fluentd

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---


문서 작성 목적 
=========

* * *

이 문서는 Fluentd를 이용해 데이터를 수집해 Kafka에 데이터를 Publishing 하는 것에 대해 학습한 것을 정리하기 위해 작성했다. 

  

테스트 환경 
=======

* * *

테스트 환경은 다음과 같다.

*   macOS Catalina 10.15.2
    
*   Fluentd 1.0.2
    
*   Kafka 2.4.0
    

구조
==

* * *

테스트 진행하려는 데이터 파이프라인의 구조는 다음과 같다. 

```
+-----------------------------------------------------------------------------------------------+
|   Local iMac                                                                                  |
|                                                                                               |
|                                                                                               |
|                   +--------------------+               +---------------------+                |
|                   |                    |               |                     |                |
|                   |                    |               |                     |                |
|                   |                    |               |                     |                |
|  Source +-------->+      Fluentd       +-------------->+       Kafka         |                |
|                   |                    |               |                     |                |
|                   |                    |               |                     |                |
|                   |                    |               |                     |                |
|                   +--------------------+               +---------------------+                |
|                                                                                               |
|                                                                                               |
+-----------------------------------------------------------------------------------------------+
```

Kafka setting
=============

* * *

Local iMac에서 Fluentd를 구성해 Source 폴더 안에 있는 Log파일의 데이터를 수집하려고 한다. 이와 같이 하기 위해 다음 내용을 따라서 진행한다. Kafka를 설치 했다는 가정하에 진행한다. 

서버 시작하기 
--------

Kafka는 ZooKeeper를 사용하고 있다. 그래서 먼저 ZooKeeper server를 실행한다. 편리한 실행을 위해 아래의 스크립트를 이용해 Kafka패키지에 포함되어 있는 ZooKeeper instance를 실행한다. 그 뒤에 Kakfa server를 실행한다.

```
$ bin/zookeeper-server-start.sh config/zookeeper.properties

$ bin/kafka-server-start.sh config/server.properties


[2020-01-02 21:47:03,844] INFO Reading configuration from: config/zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
[2020-01-02 21:47:03,847] WARN config/zookeeper.properties is relative. Prepend ./ to indicate that you're sure! (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
[2020-01-02 21:47:03,851] INFO clientPortAddress is 0.0.0.0/0.0.0.0:2181 (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
...
```

Topic 생성하기
----------

Kafka는 Topic이라는 것을 기준으로 메시지를 publish, subscribe 하는 방식으로 사용한다.

테스트를 위해 "test"라는 이름의 Topic을 직접 생성해보자. 생성 시 설정은 1개의 단일 Partition과 1개의 Replica이다. 다음 명령어를 입력한다. 명령어 입력 후 > 모양이 터미널에 뜨며 메시지를 입력할 수 있다. 

```
$ bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test
```

  

생성 후 다음과 같은 명령어를 입력해 정상적으로 Topic이 생성됬는지 확인할 수 있다. 

```
$ bin/kafka-topics.sh --list --bootstrap-server localhost:9092
test
```

테스트 메시지 보내기
-----------

Kafka는 터미널에서 파일에 입력하기, 표준 입력, 직접 전달의 방법으로 Kafka cluster에 메시지를 보낼 수 있다. 

다음과 같은 명령어를 입력 후 전달하고자 하는 메시지를 입력한다. 기본 적으로 각각의 라인이 하나의 독립된 메시지로 처리된다.

```
$ bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
test 1
test 2
```

Consumer 실행하기 
--------------

Kafka는 터미널에서 command line Consumer를 실행할 수 있으며 직접 터미널에서 특정 Topic으로 전달된 메시지를 볼 수 있다. 

```
$ bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
test 1
test 2
```

"테스트 메시지 보내기"에서 입력했던 터미널과 Consumer를 입력했던 터미널을 두 개의 터미널에서 각 각 띄우면 근실시간에 가깝게 입력된 메시지가 Consumer를 실행한 터미널에서 출력됨을 확인할 수 있다. 

  

Fluentd setting
===============

* * *

Local iMac에서 Fluentd를 구성해 Source 폴더 안에 있는 Log파일의 데이터를 수집하려고 한다. 이와 같이 하기 위해 다음과 같이 프로젝트 폴더를 생성한다.

```
Project/pos/
Project/pos/pos_file.pos
Project/source/{log_file.log}
Project/kafka.config
```

주석으로 처리 된 각 파일의 이름을 보고 파일 생성과 해당 내용을 입력한다. 

```
# in Kafka.config

<source>
  @type tail
  path /Users/st/test/fluentd_kafka/source/*.log
  pos_file /Users/st/test/fluentd_kafka/pos/pos_file.pos
  tag syslog
  <parse>
    @type json
  </parse>
</source>

<match syslog>
  @type kafka
  brokers 127.0.0.1:9092
  default_topic test
</match>
```

  

Test file 만들고 로그가 Kafka에 입력되는 지 확인하기
====================================

* * *

Project/source 폴더에서 test.log 파일을 만들고 아래와 같이 내용을 입력한다. 

```
# in Kafka.config

{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
```

실행한 Kafka consumer에서 다음과 같이 내용이 출력되는 지 확인한다. 

```
{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
{"name":"seong","salary":56000,"region":"seoul"}
```

  

참고 문서
=====

* * *

참고 문서는 다음과 같다. 

*   Kafka quicstart guide: [https://kafka.apache.org/quickstart](https://kafka.apache.org/quickstart)
    
*   Fluentd kafka plugin: [https://docs.fluentd.org/output/kafka](https://docs.fluentd.org/output/kafka)
    
*   fluent-plugin-kafka fluentd과 Kafka의 연동**: **[http://blog.daum.net/\_blog/BlogTypeView.do?blogid=0IYwf&articleno=678218&\_bloghome\_menu=recenttext](http://blog.daum.net/_blog/BlogTypeView.do?blogid=0IYwf&articleno=678218&_bloghome_menu=recenttext)
