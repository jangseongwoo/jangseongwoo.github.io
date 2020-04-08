---
title:  "[테스트] Elasticsearch Update API 관련 테스트 및 정리"
excerpt: "이 문서는 Elasticsearch의 Update 관련 테스트 및 정보를 기술하기 위해 작성한다. 해당 문서는 Elasticsearch 7.1 version을 기준으로 작성되었다. 가독성을 위해 용어 중 Elasticsearch는 ES로 줄여서 표현하겠다. 공식 문서 버전 기준은 7.x 버전을 기준으로 작성했다. "

categories:
  - Elasticsearch
tags:
  - Elasticsearch

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 작성의 목적
=========

* * *

이 문서는 Elasticsearch의 Update 관련 테스트 및 정보를 기술하기 위해 작성한다.

해당 문서는 Elasticsearch 7.1 version을 기준으로 작성되었다. 가독성을 위해 용어 중 Elasticsearch는 ES로 줄여서 표현하겠다. 공식 문서 버전 기준은 7.x 버전을 기준으로 작성했다. 

ES Update API 작동 방식
===================

* * *

공식 사이트에서 Update API 관련 내용은 [Elasticsearch Reference \[7.x\]](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/index.html) » [REST APIs](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/rest-apis.html) » [Document APIs](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/docs.html) » [Update API](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/docs-update.html) 에 정리되어 있다. 

해당 문서를 읽고 API Update 관련해 필요한 부분만 정리해 남겨둔다.

```
원문

In addition to being able to index and replace documents, we can also update documents. Note though that Elasticsearch does not actually do in-place updates under the hood. Whenever we do an update, Elasticsearch deletes the old document and then indexes a new document with the update applied to it in one shot.

  

번역

문서를 색인화하고 교체할 수 있을 뿐만 아니라 문서를 업데이트할 수도 있습니다. 그러나 Elasticsearch는 실제로 후드 아래에서 인플레이스 업데이트를 수행하지 않습니다. 업데이트를 수행할 때마다 Elasticsearch는 이전 문서를 삭제한 다음 업데이트가 적용된 새 문서를 한 번에 인덱싱합니다.
```

Update API 간단한 예시 
==================

* * *

ES에서 문서를 Update하는 방법은 두 가지가 있다. 스크립트를 이용해 Update하는 방식과 직접 문서의 필드를 지정해 Update하는 방법이 있다. 

1번 방법

```
POST /customer/\_doc/1/\_update?pretty
{
  "doc": { "name": "Jane Doe", "age": 20 }
}
```

 2번 방법(script)

```
POST /customer/\_doc/1/\_update?pretty
{
  "script" : "ctx.\_source.age += 5"
}
```

스크립트를 이용한 multi field 테스트 
==========================

* * *

multi field update 테스트를 하기 위해 다음과 같은 명령어를 입력해 Document를 index한다. 

```
POST test\_multi\_field\_update/\_doc
{
  "category\_id" : 1,
  "updated\_at" : "2019-11-05T14:54:26Z",
  "user\_id" : 1220267,
  "created\_at" : "2019-11-05T08:07:33Z",
  "id" : 1657898,
  "title" : "",
  "body" : "test\_body"
}
```

Index 후 데이터가 원하는대로 정확하게 입력 됬는 지 다음과 같은 명령어를 통해 확인한다. 

```
GET test\_multi\_field\_update/\_search
```

아래처럼 응답 결과가 나오면 정상적으로 Document 입력이 된 것이다. 

```
{
  "took" : 0,
  "timed\_out" : false,
  "\_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max\_score" : 1.0,
    "hits" : \[
      {
        "\_index" : "test\_multi\_field\_update",
        "\_type" : "\_doc",
        "\_id" : "MId9DnABTeXXiGlkj0Cm",
        "\_score" : 1.0,
        "\_source" : {
          "category\_id" : 1,
          "updated\_at" : "2019-11-05T14:54:26Z",
          "user\_id" : 1220267,
          "created\_at" : "2019-11-05T08:07:33Z",
          "id" : 1657898,
          "title" : "",
          "body" : "test\_body"
        }
      }
    \]
  }
}
```

이제, 다음과 같은 명령어를 입력해 multi field에 대해 업데이트를 한다. 

```
POST test\_multi\_field\_update/\_update\_by\_query?pretty
{
  "script": {
    "source": "ctx.\_source.body = 'converted\_body';",
    "lang": "painless"
  },
  "query" : {
    "term": {
        "id": 1657898
    }
  }
}
```

응답 결과는 다음과 같다. 

```
{
  "took" : 56,
  "timed\_out" : false,
  "total" : 1,
  "updated" : 1,
  "deleted" : 0,
  "batches" : 1,
  "version\_conflicts" : 0,
  "noops" : 0,
  "retries" : {
    "bulk" : 0,
    "search" : 0
  },
  "throttled\_millis" : 0,
  "requests\_per\_second" : -1.0,
  "throttled\_until\_millis" : 0,
  "failures" : \[ \]
}
```

결과 중 "updated" field가 1로 증가 되었다면 정상적으로 실행된 것이다. 

업데이트가 정상적으로 됬는 지 다음과 같은 명령어를 입력해 확인한다. 

```
GET test\_multi\_field\_update/\_search
```

응답 결과는 다음과 같다. 

```
{
  "took" : 0,
  "timed\_out" : false,
  "\_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max\_score" : 1.0,
    "hits" : \[
      {
        "\_index" : "test\_multi\_field\_update",
        "\_type" : "\_doc",
        "\_id" : "MId9DnABTeXXiGlkj0Cm",
        "\_score" : 1.0,
        "\_source" : {
          "category\_id" : 1,
          "updated\_at" : "2019-11-05T14:54:26Z",
          "user\_id" : 1220267,
          "created\_at" : "2019-11-05T08:07:33Z",
          "id" : 1657898,
          "title" : "",
          "body" : "converted\_body"
        }
      }
    \]
  }
}
```

검색된 결과를 통해 body field와 locale field가 정상적으로 업데이트 된 것을 확인할 수 있다.