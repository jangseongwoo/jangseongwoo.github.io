---
title:  "Kafka 공식문서"
excerpt: "이 글은 Kafka 공식 문서를 번역하기 위해 작성한 글이다. 전체 문서 번역이 아닌 일부분 중요하다고 생각하는 부분에 대해서 작성을 진행한다. "

categories:
  - Kafka
tags:
  - Kafka

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 글은 Kafka 공식 문서를 번역하기 위해 작성한 글이다. 전체 문서 번역이 아닌 일부분 중요하다고 생각하는 부분에 대해서 작성을 진행한다. 번역하기 어려운 기술용어에 대해서는 원문이 의미 전달에 더 용이할 것이라 판단해 그대로 작성한다. 이 문서는 [Kafak 2.4.0의 공식문서](https://kafka.apache.org/documentation/)를 기준으로 작성했다. 

  

Introduction 
=============

* * *

Apach Kafka는 분산 streaming platform이다. 

  

Streaming platform은 3가지 특징이 있다. 

*   Message queue 또는 Enterprise messaging system과 유사하게 Records를 Publish하고 Subscribe한다.
    
*   Stream of records를 Fault-tolerant(장애에 강한) 방식으로 저장한다. 
    
*   Records가 발생하면 해당 Stream을 처리한다. 
    

![](/assets/images/kafka-apis.png)

  

Kafka 일반적으로 다음과 같은 두 가지 광범위한 종류의 Application에 사용된다.

*   Applications 혹은 System 간 안전하게 데이터를 얻을 수 있는 Real-time streaming data pipelines을 구축한다.
    
*   Streaming data를 Transform하거나 React하기 위한 Real-time streaming data pipelines을 구축한다.
    

  

Kafka가 이런 일들을 어떻게 하는지 이해하기 위해서, Kafka의 능력을 밑바닥부터 파고들어 탐구해 보자.

  

**첫번째 몇 가지 Concept:**

*   Kafka는 Cluster로 작동하며 하나 또는 하나 이상의 Server로 확장할 수 있으며, 이것은 여러 개의 데이터 센터로 확장할 수 있다. 
    
*   Kafka cluster는 Topic으로 streaming records를 구분해 저장한다. 
    
*   각 각의 Record는 Key, value, timestamp로 구성되어 있다. 
    

  

**Kafka 4개의 핵심 API:**

*   [Producer API](https://kafka.apache.org/documentation.html#producerapi): Application이 하나 이상의 Topic에 Streaming record를 게시하도록 허용한다.
    
*   [Consumer API](https://kafka.apache.org/documentation.html#consumerapi): Application이 하나 이상의 Topic에 구독하고 생산된 Streaming record를 처리하도록 허용한다.
    
*   [Streams API](https://kafka.apache.org/documentation/streams): Application이 하나 이상의 Topic으로 부터 입력 Stream을 소비하고 하나 이상의 출력 Topic으로 출력 Stream을 생성하여 효과적으로 입력 Stream을 출력 Stream으로 변환한다.
    
*   [Connector API](https://kafka.apache.org/documentation.html#connect): Topic을 기존 Application이나 데이터 시스템에 연결하는 재사용 가능한 producers, consumers을 만들어서 실행할 수 있다. 예로 관계형 DB의 커넥터는 테이블에 대한 모든 변경 사항을 캡처 할 수 있다.
    

Kafka에서 Clients와 Servers간 통신은 간단하고, 고성능이며, 언어와 관계없는 TCP Protocol를 사용한다. 

  

Topics and Logs
===============

* * *

Topic은 Publish된 Records의 Category 혹은 Feed 이름이다. Kafka의 Topic은 항상 Multi-subscriber를 갖는다. 그것은, Topic은 쓰여진 데이터를 구독하는 0개부터 여러 개의 Consumer를 가질 수 있다는 것이다. 

각 각의 Topic은 다음과 같이 Kafka cluster에서 Partition된 로그를 관리한다. 

![](/assets/images/log_anatomy.png)

각 각의 Partition은 정렬되어 있으며, Immutable한 record의 순서는 계속적으로 추가된다. (-구조화된 commit log로 추가된다.) Partition에 있는 Records는 각 각의 Partition에서 Unique한 식별자인 Offset을 가지고 할당된다. 

Kafka clster는 설정 가능한 Retention 기간을 이용해 Publish된 Records를 지속적으로 저장한다. 예를 들면, Retention 정책이 2일로 설정됬다면, Publish된 시점부터 2일 후까지는 Consuming이 가능하나 2일 이후에는 공간을 비우기 위해 삭제된다. Kafka의 성능은 데이터 크기가 일정하므로 오랫동안 데이터를 저장하는 것에 대해 문제가 되지 않는다.

![](/assets/images/log_consumer.png)

사실은, Consumer마다 생기는 Metadata는 Consumer의 Offset이나 위치이다. 이 Offset은 Consumer에 의해 컨트롤된다: Consumer는 Record를 읽으며 선형적으로 offset을 증가시킬 것이다. 그러나 사실, Consumer에 의해 Offset이 컨트롤되기 떄문에 예를 드는 것처럼 아무 순서나 소비할수 있다. 예를 들면, Consumer는 오래된 Offset에 대해 다시 데이터를 처리할 수 있으며 스킵하고 가장 최근의 Record와 당장 들어온 Record를 소비할 수 있다. 

이런 기능의 결합은 카프카 소비자가 매우 저렴(cheap)하다는 것을 의미한다. "저렴하다"라는 것은 Kafka cluster나 다른 소비자들에게 큰 영향을 미치지 않고 오락가락(come and go)할 수 있다는 것이다. 예를 들어, 기존 소비자가 소비하는 것을 변경하지 않고 어떤 토픽의 컨텐츠의 "tail" 명령어를 사용할 수 있다.

Log가 있는 Paritition들은 여러 가지 용도로 사용된다. 첫 번째로, 로그를 단일 서버에 맞는 크기 이상으로 확장할 수 있다.각 개별 Partition은 호스트하는 서버에 맞아야되지만, Topic에는 많은 Partition이 있어 임의의 양의 데이터를 다룰 수 있다. 둘째 Partition들은 병렬 처리 단위로 작동한다. 

  

분산(Distribution)
================

* * *

Log가 있는 Paritition들은 Kafka cluster에 있는 각 서버를 통해 분산되며 각 서버는 데이터를 처리하고 Partition 공유에 대한 요청을 처리한다. 각 파티션은 장애 허용을 위해 설정된 설정 가능한 수의 서버에 복제된다.

각 파티션에는 리더(leader)역할을 하는 1개의 서버와 팔로워(follower) 역할을 하는 0개 이상의 서버가 있다. 리더는 팔로워(follower)가 리더를 수동적으로 복제하는 동안 파티션에 대한 모든 읽기/쓰기 요청을 처리한다. 

리더가 실패하면 팔로워 중 하나가 자동으로 새로운 리더가 된다. 각 서버는 일부 파티션의 리더와 다른 서버의 팔로어로 작동하므로 부하(load)가 클러스터 내에서 균형을 이뤄진다.

  

지역 복제(Geo-Replication)
======================

* * *

Kafka Mirror-Maker는 Kafka cluster에 지역복제를 지원한다. Mirror-Maker를 사용하면 메시지들을 여러 데이터센터 혹은 다른 지역의 Cloud로 복제를 할 수 있다. 당신은 Active/passivce 시나리오를 백업과 복구를 위해 사용할 수 있다; 또는 Active/active 시나리오들을 데이터 지역성 요구사항을 지원하기 위해, 데이터를 당신의 사용자들에게 가까이 하기 위해 사용할 수 있다. 

  

생산자(Producers)
==============

* * *

생산자는 선택한 토픽에 데이터를 발행한다. 생산자는 Topic 안에 있는 Partition에 Record를 선택해 할당하는 책임을 가진다. 이것은 부하의 균형을 맞추기 위해 간단하게 Round-robin으로 실행되며 혹은 어떤 기준을 가진 특정 Partition 함수에 의해 실행될 수 있다(Record안에 있는 어떤 키를 말한다).

  

소비자(Consumers)
==============

* * *

소비자들은 '소비자 그룹'이라는 이름으로 라벨링이 되며, Topic으로 발행된 각 Record들은 구독하고 있는 소비자 그룹에 있는 하나의 소비자 객체에 전달된다. 소비자 객체는 분리된 프로세스들 혹은 분리된 기계들에 있을 수 있다. 

만약 소비자 객체가 같은 소비자 그룹에 있을 경우, Record들은 효과적으로 소비자 객체들에게 부하 분산될 것이다. 

만약 소비자 객체가 다른 소비자 그룹에 있을 경우, 

  

  

![](/assets/images/consumer-groups.png)