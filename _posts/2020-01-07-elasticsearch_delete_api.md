---
title:  "Elasticsearch delete API 관련 테스트 및 정리"
excerpt: "Elasticsearch에 indexing된 document를 특정 필드의 값을 기준으로 삭제하는 기능에 대하여 테스트 한다."

categories:
  - Elasticsearch
tags:
  - Elasticsearch

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

테스트 개요
======

Elasticsearch에 indexing된 document를 특정 필드의 값을 기준으로 삭제하는 기능에 대하여 테스트 한다.

Elasticsearch의 [Delete API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-delete.html)는 문서의 id값을 기준으로 삭제하기 때문에 일반적으로 데이터를 삭제하는 방식으로 사용하기 어렵다.  
Elasticsearch에서 document를 indexing하면서 document의 id를 특정 값으로 직접 부여하지 않고 indexing한 경우, Elasticsearch의 내부 정책에 따라 hash 형태의 값을 문서의 id값으로 부여하기 때문에 사전에 다른 확인 과정 없이 삭제 대상 문서를 id로 직접 지정하는 방식은 거의 불가능하다.

Elasticsearch는 [Delete By Query API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-delete-by-query.html)를 통해 특정 검색 조건을 만족하는 결과 문서를 삭제하는 것이 가능하다.  
이 문서는 Delete By Query API 사용에 대한 상세한 방법을 설명하기 위한 문서가 아니며 Delete By Query API를 사용하여 특정 검색 조건을 만족하는 결과 문서를 삭제하는 방법과 그와 관련된 테스트에 대한 내용을 정리하기 위하여 작성되었다.  
[Delete By Query API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-delete-by-query.html)에 대한 자세한 설명은 공식 문서를 참고하도록 한다.

  

* * *

테스트 환경
======

테스트는 아래와 같은 환경에서 진행되었다.

*   macOS Mojave 10.14.4
    
*   Elasticsearch 6.7.2
    
*   Kibana 6.7.2
    

  

* * *

테스트 데이터
=======

아래와 같은 형태의 데이터를 indexing하여 테스트를 진행한다.

```
{
    "data_text" : "string type data",
    "db_ref" : 1,
    "interest" : "test",
    "subject" : "math"
}

```

  

* * *

테스트 방식/과정
=========

Kibana의 Dev Tools 환경에서 대부분의 테스트를 진행하였다.

  
테스트 인덱스, 맵핑, 데이터셋

*   테스트 인덱스 이름 : es\_data\_delete\_test\_index
    
*   테스트 인덱스 맵핑 : dynamic mapping
    

테스트 데이터 인덱싱
-----------

bulk API를 사용하여 테스트용 데이터를 인덱싱한다. 9개의 테스트 데이터를 인덱싱한다.

```
POST _bulk
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "math text 1", "db_ref" : 1, "interest" : "test", "subject" : "math" }
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "math text 2", "db_ref" : 2, "interest" : "test", "subject" : "math" }
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "math text 3", "db_ref" : 3, "interest" : "test", "subject" : "math" }
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "english text 4", "db_ref" : 4, "interest" : "test", "subject" : "eng" }
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "english text 5", "db_ref" : 5, "interest" : "test", "subject" : "eng"}
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "english text 6", "db_ref" : 6, "interest" : "test", "subject" : "eng" }
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "한글 텍스트 7", "db_ref" : 7, "interest" : "test", "subject" : "korean" }
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "한글 텍스트 8", "db_ref" : 8, "interest" : "test", "subject" : "korean" }
{ "index" : { "_index" : "es_data_delete_test_index", "_type" : "_doc" } }
{ "data_text" : "한글 텍스트 9", "db_ref" : 9, "interest" : "test", "subject" : "korean" }

```

  
아래와 같은 명령으로 테스트 데이터가 정상적으로 저장되어 있는지 조회해본다.

*   전체 데이터 검색
    
    ```
    GET /es_data_delete_test_index/_search
    {
        "query" : {
            "match_all" : {}
        }
    }
    
    ```
    
      
    
*   검색 결과 개수 확인. 응답에서 count 필드의 값을 확인한다.
    
    ```
    GET /es_data_delete_test_index/_count
    
    GET /es_data_delete_test_index/_count
    {
        "query" : {
            "match_all" : {}
        }
    }
    
    ```
    
      
    

  

테스트 케이스 1 - 하나의 값을 기준으로 삭제
--------------------------

Elasticsearch [term query](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/query-dsl-term-query.html)를 사용하여 특정 필드에 대하여 정확한 term을 기준으로 데이터를 검색할 수 있다.

아래 예는 term query를 사용하여 db\_ref 필드의 값이 1인 데이터를 검색하는 예이다. db\_ref 필드의 값은 유니크한 식별자 값으로 특정 db\_ref값을 갖는 문서는 오직 한개만 존재하도록 테스트 데이터가 인덱싱 되어있다.

```
GET /es_data_delete_test_index/_search
{
    "query": {
        "term" : { "db_ref" : 1 }
    }
}

```

  

```
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 1,
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "es_data_delete_test_index",
        "_type" : "_doc",
        "_id" : "-72zOG0BAWG07ejJMX7s",
        "_score" : 1.0,
        "_source" : {
          "data_text" : "math text 1",
          "db_ref" : 1,
          "interest" : "test",
          "subject" : "math"
        }
      }
    ]
  }
}

```

  
delete by query의 search 요청으로 term query를 전달하여 데이터 삭제요청을 한다. term query 조건에 만족되는 모든 데이터에 대하여 삭제를 요청하는 것이다.

```
POST /es_data_delete_test_index/_delete_by_query
{
    "query": {
        "term" : { "db_ref" : 1 }
    }
}

```

삭제요청에 대한 응답 메시지는 아래와 같다.

```
{
    "took" : 218,
    "timed_out" : false,
    "total" : 1,
    "deleted" : 1,
    "batches" : 1,
    "version_conflicts" : 0,
    "noops" : 0,
    "retries" : {
        "bulk" : 0,
        "search" : 0
    },
    "throttled_millis" : 0,
    "requests_per_second" : -1.0,
    "throttled_until_millis" : 0,
    "failures" : [ ]
}

```

  
delete by query 응답을 확인하고나서 다시 term query로 해당 db\_ref값을 갖는 데이터를 검색하여 삭제여부를 확인한다.

```
GET /es_data_delete_test_index/_search
{
    "query": {
        "term" : { "db_ref" : 1 }
    }
}

# 응답
{
  "took" : 0,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 0,
    "max_score" : null,
    "hits" : [ ]
  }
}

```

  
앞서 진행한 테스트는 고유의 값을 갖는 db\_ref필드에 대한 조건으로 삭제요청을 한 것이었다.  
이제 subject 필드와 같이 같은 값을 갖는 데이터가 여러개 존재하는 필드에 대한 값을 조건으로 삭제 테스트를 해보자.

1.  subject 필드값이 'eng'인 데이터를 검색하여 몇 개의 데이터가 검색되는지 확인한다.
    
    ```
    GET /es_data_delete_test_index/_search
    {
        "query": {
            "term" : { "subject" : "eng" }
        }
    }
    
    ```
    
      
    
2.  subject 필드의 값이 'eng' 인 조건으로 삭제 요청을 한다.
    
    ```
    POST /es_data_delete_test_index/_delete_by_query
    {
        "query": {
            "term" : { "subject" : "eng" }
        }
    }
    
    {
      "took" : 28,
      "timed_out" : false,
      "total" : 3,
      "deleted" : 3,
      "batches" : 1,
      "version_conflicts" : 0,
      "noops" : 0,
      "retries" : {
        "bulk" : 0,
        "search" : 0
      },
      "throttled_millis" : 0,
      "requests_per_second" : -1.0,
      "throttled_until_millis" : 0,
      "failures" : [ ]
    }
    
    ```
    
      
    
3.  subject 필드값이 'eng'인 데이터를 검색하여 몇 개의 데이터가 검색되는지 확인한다.
    
    ```
    GET /es_data_delete_test_index/_search
    {
        "query": {
            "term" : { "subject" : "eng" }
        }
    }
    
    ```
    
      
    
4.  검색 조건을 만족하는 모든 데이터가 삭제되었음을 확인할 수 있다.
    
    ```
    {
      "took" : 0,
      "timed_out" : false,
      "_shards" : {
        "total" : 5,
        "successful" : 5,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : 0,
        "max_score" : null,
        "hits" : [ ]
      }
    }
    
    ```
    
      
    

  
삭제 테스트용 데이터를 다시 인덱싱하여 interest 필드와 같이 전체 데이터가 동일한 값을 갖는 필드를 기준으로 삭제 요청하여 전체 데이터가 삭제되는 것을 확인할 수 있다.

1.  interest 필드값이 'test'인 데이터를 검색하여 몇 개의 데이터가 검색되는지 확인한다.
    
    ```
    GET /es_data_delete_test_index/_search
    {
        "query": {
            "term" : { "interest" : "test" }
        }
    }
    
    ```
    
      
    
2.  interest 필드의 값이 'test' 인 조건으로 삭제 요청을 한다.
    
    ```
    POST /es_data_delete_test_index/_delete_by_query
    {
        "query": {
            "term" : { "subject" : "test" }
        }
    }
    
    ```
    
      
    

  

* * *

테스트 케이스 2 - 여러개의 값을 기준으로 삭제
---------------------------

Elasticsearch [terms query](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/query-dsl-terms-query.html)를 사용하여 특정 필드에 대하여 주어진 값들에 대하여 하나라도 만족하는 경우를 기준으로 데이터를 검색할 수 있다.

아래 예는 terms query를 사용하여 db\_ref 필드의 값이 1, 3, 5 중에 하나라도 일치하는 데이터는 모두 검색하는 쿼리 예이다.

```
GET /es_data_delete_test_index/_search
{
    "query": {
        "terms" : { "db_ref" : [1, 3, 5] }
    }
}

```

  

```
{
  "took" : 0,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 3,
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "es_data_delete_test_index",
        "_type" : "_doc",
        "_id" : "Gr30OG0BAWG07ejJyH_Z",
        "_score" : 1.0,
        "_source" : {
          "data_text" : "english text 5",
          "db_ref" : 5,
          "interest" : "test",
          "subject" : "eng"
        }
      },
      {
        "_index" : "es_data_delete_test_index",
        "_type" : "_doc",
        "_id" : "Fr30OG0BAWG07ejJyH_Z",
        "_score" : 1.0,
        "_source" : {
          "data_text" : "math text 1",
          "db_ref" : 1,
          "interest" : "test",
          "subject" : "math"
        }
      },
      {
        "_index" : "es_data_delete_test_index",
        "_type" : "_doc",
        "_id" : "GL30OG0BAWG07ejJyH_Z",
        "_score" : 1.0,
        "_source" : {
          "data_text" : "math text 3",
          "db_ref" : 3,
          "interest" : "test",
          "subject" : "math"
        }
      }
    ]
  }
}

```

  
delete by query의 search 요청으로 terms query를 전달하여 데이터 삭제요청을 한다. terms query 조건에 만족되는 모든 데이터에 대하여 삭제를 요청하는 것이다.

```
POST /es_data_delete_test_index/_delete_by_query
{
    "query": {
        "term" : { "db_ref" : 1 }
    }
}

```

삭제요청에 대한 응답 메시지는 아래와 같다.

```
{
    "took" : 41,
    "timed_out" : false,
    "total" : 3,
    "deleted" : 3,
    "batches" : 1,
    "version_conflicts" : 0,
    "noops" : 0,
    "retries" : {
        "bulk" : 0,
        "search" : 0
    },
    "throttled_millis" : 0,
    "requests_per_second" : -1.0,
    "throttled_until_millis" : 0,
    "failures" : [ ]
}

```

  
delete by query 응답을 확인하고나서 다시 term query로 해당 db\_ref값을 갖는 데이터를 검색하여 삭제여부를 확인한다.

```
GET /es_data_delete_test_index/_search
{
    "query": {
        "terms" : { "db_ref" : [1, 3, 5] }
    }
}

# 응답
{
    "took" : 0,
    "timed_out" : false,
    "_shards" : {
        "total" : 5,
        "successful" : 5,
        "skipped" : 0,
        "failed" : 0
    },
    "hits" : {
        "total" : 0,
        "max_score" : null,
        "hits" : [ ]
    }
}

```

  
아래와 같이 문서들의 모든 db\_ref값을 삭제 대상 조건으로 terms query에 전달하여 전체 데이터를 삭제하는 것이 가능하다.

```
GET /es_data_delete_test_index/_search
{
    "query": {
        "terms" : { "db_ref" : [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }
}

```

  
다양한 search query 방식으로 데이터 삭제를 테스트 해보자.  
아래 예는 subject의 값이 'math'이거나 'eng'인 데이터를 삭제하는 요청이다.

```
POST /es_data_delete_test_index/_delete_by_query
{
    "query": {
        "terms" : { "subject" : ["math", "eng"] }
    }
}

```

  
아래 예는 db\_ref의 값이 1보다 크거나 같고, 3보다 작거나 같은 데이터를 삭제하는 요청이다.

```
POST /es_data_delete_test_index/_delete_by_query
{
    "query": {
        "range": {
            "db_ref": {
              "gte": 1,
              "lte" : 3
            }
        }
    }
}

```

  

* * *

테스트 결과
======

Elasticsearch는 [Delete By Query API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-delete-by-query.html)를 통해 특정 검색 조건을 만족하는 문서를 삭제하는 것이 가능하였다.  
숫자형의 필드값을 갖는 데이터에 대해서도 terms query를 search query로 사용하여 조건에 부합하는 다수의 문서를 삭제하는 것이 가능하였다.

  

참고자료
====

*   [Elasticsearch Delete API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-delete.html)
    
*   [Elasticsearch Delete By Query API](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/docs-delete-by-query.html)
