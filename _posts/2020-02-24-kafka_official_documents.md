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

만약 소비자 객체가 다른 소비자 그룹에 있을 경우, 각 각의 Record는 모든 소비자 Process에게 Broadcast될 것이다.

![](/assets/images/consumer-groups.png)

2개의 Kafka cluster는 4개의 Partition(P0~P3)과 2개의 소비자 그룹으로 호스팅하고 있다. 소비자 그룹 A는 2개의 소비자 인스턴스, 그룹 B에서는 4개의 소비자 인스턴스를 가지고 있다. 

그러나, 대부분, Topic의 "논리적 구독자"마다 하나씩 적은 수의 소비자 그룹이있는 것으로 나타났다. 각 그룹은 많은 수의 장애애 강하고 확장성이 있는 소비자 인스턴스가 있다. 이것은 단일 프로세스 대신 소비자 클러스터로 구성된 publish-subscribe 형태이다.

카프카에서 소비를 구현하는 방법은 소비자 인스턴스에 대한 로그의 파티션을 분할하여 각 인스턴스가 언제든지 파티션의 "공정 공유"의 독점 소비자가 되도록 하는 것이다. 그룹 내 멤버쉽을 유지하는 이 과정은 카프카 프로토콜에 의해 동적으로 처리된다. 만약, 새로운 인스턴스가 그룹에 들어오게 되면 새로운 인스턴스는 그룹의 다른 멤버로부터 몇개의 Partition들을 넘게 받게 될 것이다; 만약 인스턴스가 죽으면, 그것의 Partition들은 기존 인스턴스들에게 분산되어질 것이다. 

Kafka는 Topic안의 다른 Partition 사이에서 전체적인 정렬을 제공하는 것이 아닌 1개의 Partition안에서만 Record들을 정렬해 제공한다. 1개의 Partition마다 정렬되는 것은 대다수 Application에게 데이터 Key에 의해 데이터를 정렬해 제공하는 것으로 충분하다. 하지만 만약 전체 레코드의 정렬된 순서가 필요하면 파티션이 하나뿐인 토픽에 대해서만 가능하다. 이것은 1개의 소비자 그룹당 단 1개의 소비자 프로세스가 있다는 것을 의미한다.

  

Multi-tenancy
=============

* * *

당신은 Kafka를 Multi-tenancy 솔루션으로 사용할 수 있다. Multi-tenancy는 데이터를 생성하거나 소비할 수 있는 토픽을 구성하여 사용할 수 있다. 쿼터에 대한 운영지원도 있다. 관리자들은 클라이언트에 의해 사용되는 브로커 리소스를 컨트롤 하기 위해 요청의 쿼터(할당량)을 정의하거나 시행할 수 있다. 

더 자세한 정보는 [security documentation](https://kafka.apache.org/documentation/#security)를 참조한다. 

  

Guarantees
==========

* * *

고 수준의 Kafka는 다음과 같은 것들을 보증한다:

*   공급자에 의한 메시지는 공급자가 보낸 순서대로 특정 Topic의 Partition에 추가된다. 이것은, 만약 레코드 M1과 M2가 같은 공급자에 의해 보내졌을 때, M1이 M2보다 먼저 왔다면, M1은 M2보다 로그 안에서 먼저 나타나며 M2보다 더 낮은 Offset을 가질 것이다. 
    
*   소비자 인스턴스는 로그 안에 저장된 순서대로 레코드들을 볼 것이다. 
    
*   복제 Factor N으로 정의된 Topic은, N-1개의 서버가 죽어도 로그에 송신된 레코드들중 어떤 것도 손실하지 않는다. 
    

이 보증에 관한 자세한 정보는 문서의 Design 섹션에서 볼 수 있다. 

  

Messaging system으로써의 Kafka
==========================

* * *

카프카의 스트림에 대한 개념은 전통적인 엔터프라이즈 메시징 시스템과 어떻게 다른가?

전통적인 Messaging은 2개의 모델을 갖고 있다: [queuing](http://en.wikipedia.org/wiki/Message_queue)과 [publish-subscribe](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)이다. 큐에서는, 여러 소비자들은 서버로부터 데이터를 읽을 것이며 각 레코드들은 그들 중 하나에 저장될 것이다; publish-subscribe에서는 레코드는 모든 소비자들에게 Broadcast된다. 이 두 모델은 각각 장점과 단점을 가지고 있다. Queue의 강점은 여러 개의 소비자 인스턴스들로 1개의 데이터를 분할해 처리하는 것이 가능하다는 것이며 이것은 처리 과정을 확장할 수 있게 한다. 불행하게도, 큐 모델은 1개의 데이터를 여러번 읽을 수 없다. 1개의 프로세스가 데이터를 한번 읽으면 그 데이터는 사라진다. publish-subscribe 모델은 data를 여러 프로세스에게 Broadcast하는 것을 허용한다. 그러나 모든 메시지는 모든 구독자들에게 메시지가 가기 때문에 처리 과정을 확장할 수 있는 방법이 없다. 

Kafka의 소비자 그룹의 컨셉은 일반적으로 2가지가 있다. 큐 모델과 마찬가지로 소비자 그룹을 사용하면 프로세스 모음(소비자 그룹의 구성원)에 대해 처리를 분할 할 수 있습니다. publish-subscribe과 마찬가지로 Kafka는 여러 소비자 그룹에게 메시지를 Broadcast하는 것을 허용한다.

Kafka의 모델의 장점은 모든 Topic이 이러한 두 가지의 장점을 갖는다는 것이다. - Kafka는 처리를 확장할 수 있고 여러 개의 Multi-subscriber를 가질 수 있다- 이것은 하나를 선택할 필요가 없다는 것이다. 

또한 Kafka는 전통적인 메시징 시스템보다 더 강력한 정렬 기능을 가지고 있다.

전통적인 큐는 서버에 있는 순서대로 레코드를 보관하며, 여러 소비자가 대기열에서 소비할 경우, 서버는 저장된 순서대로 레코드를 배포한다.  그러나, 서버가 순서대로 레코드들을 전달하지만, 레코드들이 비동기적으로 소비자에게 전달되면 정렬 순서와 다르게 소비자에게 갈 수 있다. 이것은 병렬적인 소비에 의해 레코드의 정렬 순서를 잃었다는 것을 의미한다. 메시징 시스템은 종종 대기열에서 하나의 프로세스만 소비할 수 있는 "독점적인 소비자"라는 개념을 가지면서 작동하지만, 물론 이것은 처리에는 병렬이 없다는 것을 의미한다. 

Kafka는 더 좋다. 병렬처리 개념-파티션-을 가지면, 카프카는 소비자 프로세스 풀에 대한 로드 밸런싱과 정렬 보증을 모두 제공할 수 있다. 이는 Topic에 할당된 파티션들을 소비자 그룹안에 있는 소비자에게 각 파티션이 정확히 1개의 소비자가 소비하게 함으로써 가능하다.  이렇게 함으로써, 우리는 소비자가 해당 파티션의 유일한 독자이며 데이터를 순서대로 사용한다는 것을 확신할 수 있다. 파티션이 많으므로 많은 소비자 인스턴스에서 부하의 균형을 유지한다. 그러나 소비자 그룹에는 파티션보다 더 많은 소비자 인스턴스가 있을 수 없다는 것에 유의한다. 

  

Storage system으로써의 Kafka
========================

* * *

메시지와 메시지를 소비하는 소비자가 느슨하게 연결되는 것을 허용하는 메시지 큐들은 실시간 메시지의 효과적인 저장 시스템으로 작동한다. Kafka와 다른 점은 그것이 매우 좋은 저장 시스템이라는 것이다. 

Kafka에 쓰여진 데이터는 디스크에 저장되며 Fault-tolerance를 위해 복제된다. Kafka는 공급자들이 승인을 기다릴 수 있도록 하여, 쓰기가 완전히 복제되고 서버가 고장 나더라도 지속되도록 보장할 때까지 쓰기가 완료되지 않도록 한다.

Kafka는 확장 성이 우수한 디스크 구조이다. 서버에 50KB 또는 50TB의 영구 데이터가 있는지에 상관없이 Kafka는 동일한 성능을 수행한다.

스토리지에 대한 고민과 클라이언트가 읽기 위치를 제어할 수 있게 한 결과, Kafka는 고성능, 낮은 지연 시간 커밋 로그 스토리지, 복제 및 전파를 전담하는 특수 목적의 분산 파일 시스템의 일종으로 생각할 수 있다.

Kafka에 대한 저장 커밋 로그와 복제 디자인에 대해 더 많은 정보는 [이 페이지](https://kafka.apache.org/documentation/#design)를 참고한다.

  

Stream processing을 위한 Kafka
===========================

* * *

실시간 스트림 처리를 위한 목적을 위해서는 읽고 쓰고 스트림 데이터를 저장하는 것으로는 충분하지 않다. 

Kafka의 스트림 프로세서는 입력 항목에서 데이터를 지속적으로 스트림하고, 이 입력에 대해 약간의 처리를 수행하고, 출력 Topic에 대한 데이터의 연속 스트림을 생성하는 모든 것이다.

예를 들어, 유통 애플리케이션은 판매와 발송의 입력 스트림을 받아들이고, 이 데이터를 계산한 일련의 재주문 및 가격 조정 스트림을 산출할 수 있다.

이것은 생산자와 소비자 API들을 이용해 간단하게 직접 프로세싱하는 것이 가능하다. 그러나 좀 더 복잡한 변환을 위해 카프카는 완전히 통합된 [Streams API](https://kafka.apache.org/documentation/streams)를 제공한다. 이를 통해 스트림에서 집계를 계산하거나 스트림을 함께 결합하는 애플리케이션을 구축할 수 있다.

이 기능은 이러한 유형의 애플리케이션이 직면하는 어려운 문제를 해결하는 데 도움이 된다. 즉, 주문되지 않은 데이터 처리, 코드 변경 시 입력 재처리, 상태 저장 연산 수행 등이다.

스트림 API는 카프카가 제공하는 핵심 기본 요소를 기반으로 한다 : 입력에 생산자, 소비자 API를 사용하고 상태 저장을 위해 사용하고 스트림 프로세서 인스턴스 간의 내결함성을 위해 동일한 그룹 메커니즘을 사용한다.

  

조각을 모으기
=======

* * *

메시징, 스토리지 및 스트림 처리의 조합은 비정상적으로 보일 수 있지만 스트리밍 플랫폼으로서 Kafka의 역할에 필수적이다.

HDFS와 같은 분산 파일 시스템을 사용하면 배치 처리를 위해 정적 파일을 저장할 수 있다. 실제로 이와 같은 시스템을 통해 과거의 과거 데이터를 저장하고 처리 할 수 ​​있다.

기존의 엔터프라이즈 메시징 시스템을 사용하면 구독 후 도착할 향후 메시지를 처리 ​​할 수 ​​있다. 이러한 방식으로 구축 된 응용 프로그램은 향후 데이터가 도착하면 처리한다.

Kafka는 이 두 가지 기능을 모두 갖추고 있으며 이러한 기능은 스트리밍 데이터 파이프 라인뿐만 아니라 스트리밍 응용 프로그램을위한 플랫폼으로 Kafka를 사용하는데도 중요하다.

스토리지 및 지연 시간이 짧은 구독을 결합하면 스트리밍 애플리케이션이 과거 및 미래 데이터를 동일한 방식으로 처리 할 수 ​​있습니다. 즉, 단일 응용 프로그램은 기록 된 저장된 데이터를 처리 할 수 ​​있지만 마지막 레코드에 도달했을 때 끝나지 않고 향후 데이터가 도착할 때 처리를 계속할 수 있다. 이것은 메시지 처리 응용 프로그램뿐만 아니라 일괄 처리를 포함하는 일반적인 스트림 처리 개념이다.

스트리밍 데이터 파이프 라인과 마찬가지로 실시간 이벤트 구독을 결합하면 대기 시간이 짧은 파이프 라인에 Kafka를 사용할 수 있다. 그러나 데이터를 안정적으로 저장하는 기능을 통해 데이터 전달이 보장되어야하는 중요한 데이터 또는 주기적으로 만 데이터를로드하거나 유지 보수를 위해 오랜 시간 동안 다운 될 수있는 오프라인 시스템과의 통합에 데이터를 사용할 수 있다. 스트림 처리 기능을 통해 데이터가 도착할 때 데이터를 변환 할 수 있다.

Kafka가 제공하는 보증, API 및 기능에 대한 자세한 내용은 나머지 [documentation](https://kafka.apache.org/documentation.html)을 참조하면 된다.

  

이후 문서의 내용은 Quick Start guide이며 이 부분은 다른 문서에 있으니 참고하기 바란다. 

참고 문서
=====

* * *

참고 문서는 다음과 같다. 

*   Kafka 공식 문서: [https://kafka.apache.org/documentation/](https://kafka.apache.org/documentation/)
