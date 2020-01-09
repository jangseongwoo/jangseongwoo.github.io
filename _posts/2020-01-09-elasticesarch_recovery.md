---
title:  "Amazon Elasticsearch 인덱스 복구"
excerpt: "이 문서는 AWS Elasticsearch를 복구하는 과정을 정리한 문서이다."

categories:
  - Elasticsearch
tags:
  - Elasticsearch
---  

목적
==

이 문서는 AWS Elasticsearch를 복구하는 과정을 정리한 문서이다.

인덱스 복구에 대한 자세한 내용은 [Amazon Elasticsearch Service - 인덱스 스냅샷 작업](https://docs.aws.amazon.com/ko_kr/elasticsearch-service/latest/developerguide/es-managedomains-snapshots.html#es-managedomains-snapshot-restore)을 통해 확인한다.

  

환경
==

Amazon Elasticsearch

*   버전 : 6.7
    
*   인스턴스 유형 : t2.small.elasticsearch
    
*   인스턴스 개수 : 2
    
*   볼륨 크기 : 10 GB
    
*   복구할 인덱스 : test_index
    

  

복구 과정
=====

스냅샷 존재 여부 확인
------------

Amazon Elasticsearch의 스냅샷 정책은 다음과 같고 현재 시점( 2019. 11. 5 )에서 복구 희망 시점(2019. 10. 29 )의 스냅샷으로 복구 가능하다는 것을 알 수 있다.

모든 Amazon ES 도메인은 자동 스냅샷을 생성하지만 빈도는 다릅니다.

*   Elasticsearch 5.3 이상을 실행하는 도메인의 경우 Amazon ES는 시간별 자동 스냅샷을 생성하고 최대 336개의 스냅샷을 14일 동안 보관합니다.
    
*   Elasticsearch 5.1 이하를 실행하는 도메인의 경우 Amazon ES는 일별 자동 스냅샷을 생성하고(지정한 시간 동안) 최대 14개의 스냅샷을 30일 동안 보관합니다.
    

  

Amazon Elasticsearch는 '리포지토리' 단위로 스냅샷을 저장한다.

자동 스냅샷 '리포지토리'를 확인하기 위하여 다음과 같은 명령으로 '리포지토리'를 확인한다.

```
$ curl -XGET '{aws_elasticsearch_endpoint}/_snapshot'
{"cs-automated":{"type":"s3"}}
```

  

"cs-automated" 리포지토리에 복구 희망 시점(2019. 10. 29 )의 스냅샷이 남아 있는지 확인한 결과 "2019-10-29t02-47-55.820cba71-42d5-4d4d-ac3e-6cb058db9b51" 스냅샵이 남아 있었다.

```
### http://엔드포인트/_snapshot/리포지토리/_all?pretty

$ curl -XGET '{aws_elasticsearch_endpoint}/_snapshot/cs-automated/_all?pretty'
{
  "snapshots" : [ {
    "snapshot" : "2019-10-22t01-47-54.328ccc95-18b0-455e-bf24-abeeeaf18eeb",
    "uuid" : "LsMY9UfnTn-gR1V751JEQQ",
    "version_id" : 6070099,
    "version" : "6.7.0",
    "indices" : [ ".opendistro-alerting-alert-history-2019.06.20-000052",

... 중략 ...

  }, {
    "snapshot" : "2019-10-29t02-47-55.820cba71-42d5-4d4d-ac3e-6cb058db9b51",
    "uuid" : "HyKrNLXCRdW3DPTMkcPdFg",
    "version_id" : 6070099,
    "version" : "6.7.0",
    "indices" : [ 

... 중략 ... 

"test_index",  

... 중략 ...

 ],
    "include_global_state" : true,
    "state" : "SUCCESS",
    "start_time" : "2019-10-29T02:47:55.177Z",
    "start_time_in_millis" : 1572317275177,
    "end_time" : "2019-10-29T02:51:19.273Z",
    "end_time_in_millis" : 1572317479273,
    "duration_in_millis" : 204096,
    "failures" : [ ],
    "shards" : {
      "total" : 968,
      "failed" : 0,
      "successful" : 968
    }
  }, {

... 중략 ...
```

  

스냅샷으로 인덱스 복구
------------

복구 하려는 인덱스가 현재 시점에 존재하는 경우에는 충돌이 발생할 수 있다. 따라서 삭제하거나 명칭을 변경해야한다.

현재 존재하는 "test_index" 인덱스를 삭제한다.

```
$ curl -XDELETE '{aws_elasticsearch_endpoint}/test_index'
{"acknowledged" : true}%

```

  

인덱스를 복구하기 위하여 복구 희망 시점의 스냅샵 ID를 알아야 한다.

위의 "복구 가능 확인 여부"에서 확인한 스냅샵 ID는 "2019-10-29t02-47-55.820cba71-42d5-4d4d-ac3e-6cb058db9b51" 이다.

  

다음과 같은 명령으로 복구 희망 시점(2019. 10. 29) "test_index" 인덱스를 복구한다.

```
### https://엔드포인트/_snapshot/리포지토리/스냅샷 ID/_restore
### json : {"indics": 인덱스명 } 

$ curl -XPOST '{aws_elasticsearch_endpoint}/_snapshot/cs-automated/2019-10-29t02-47-55.820cba71-42d5-4d4d-ac3e-6cb058db9b51/_restore' -d '{"indices": "test_index"}' -H 'Content-Type: application/json'
{"accepted":true}%
```

  

"test_index" 인덱스가 복구 되었는지 확인한 결과 248265개의 다큐먼트가 존재한다는 것을 알 수 있다.

```
$ curl -XGET '{aws_elasticsearch_endpoint}/test_index/_count?pretty'
{
  "count" : 248265,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  }
}

```

  

참고자료
====

*   [Amazon Elasticsearch Service 인덱스 스냅샷 작업](https://docs.aws.amazon.com/ko_kr/elasticsearch-service/latest/developerguide/es-managedomains-snapshots.html#es-managedomains-snapshot-restore)
