---
title:  "Kafka 설치 및 간단 사용법"
excerpt: "이 글의 목적은 Apache Kafka 공식 사이트의 Quick start를 따라하면서 학습했던 부분을 정리하고 공유하기 위해 작성했다.
"

categories:
  - Kafka
tags:
  - Kafka
---

목적
==

* * *

이 글의 목적은 [Apache Kafka](https://kafka.apache.org/) 공식 사이트의 [Quick start](https://kafka.apache.org/quickstart) 를 따라하면서 학습했던 부분을 정리하고 공유하기 위해 작성했다.

이 이문서에서는 Quick start에 포함된 가장 간단한 부분에 대하여 직접 실행한 내용만 포함되어 있으며, [Apache Kafka](https://kafka.apache.org/)에 대한 자세한 내용은 공식 사이트 문서를 참고하도록 한다.

  

설치
==

* * *

설치를 하기 위해 [링크](https://www.apache.org/dyn/closer.cgi?path=/kafka/2.4.0/kafka_2.12-2.4.0.tgz)에서 2.4.0 버전의 kafka를 다운받는다. 다운받고 해당 폴더에서 다음 명령어를 입력한다. 

```
$ tar -xzf kafka_2.12-2.4.0.tgz
$ cd kafka_2.12-2.4.0
```

  

서버 시작하기 
========

* * *

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
==========

* * *

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
===========

* * *

Kafka는 터미널에서 파일에 입력하기, 표준 입력, 직접 전달의 방법으로 Kafka cluster에 메시지를 보낼 수 있다. 

다음과 같은 명령어를 입력 후 전달하고자 하는 메시지를 입력한다. 기본 적으로 각각의 라인이 하나의 독립된 메시지로 처리된다.

```
$ bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
test 1
test 2
```

  

Consumer 실행하기 
==============

* * *

Kafka는 터미널에서 command line Consumer를 실행할 수 있으며 직접 터미널에서 특정 Topic으로 전달된 메시지를 볼 수 있다. 

```
$ bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
test 1
test 2
```

"테스트 메시지 보내기"에서 입력했던 터미널과 Consumer를 입력했던 터미널을 두 개의 터미널에서 각 각 띄우면 근실시간에 가깝게 입력된 메시지가 Consumer를 실행한 터미널에서 출력됨을 확인할 수 있다.
