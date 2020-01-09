---
title:  "Elasticsearch - 여러 개의 Index와 연결된 Alias를 대상으로 Indexing 요청을 하는 경우 동작 확인"
excerpt: "이 문서는 Elasticsearch Alias에 대하여 아래와 같은 경우에 대한 동작을 확인하기 위한 테스트 과정과 결과를 정리하기 위하여 작성되었다."

categories:
  - Elasticsearch
tags:
  - Elasticsearch
---

목적
==

이 문서는 Elasticsearch Alias에 대하여 아래와 같은 경우에 대한 동작을 확인하기 위한 테스트 과정과 결과를 정리하기 위하여 작성되었다.

*   2개 이상의 Index가 설정된 Alias에 indexing할 경우 정상적으로 indexing 되는지 여부 확인
    
*   만일 정상적으로 indexing된다면 데이터가 어떤 Index에 저장되는지 확인
    

이 테스트는 Elasticsearch와 Kibana 사용에 대한 기본적인 내용을 알고 있다는 가정하에 진행되었다. 사전 지식이 필요한 경우 [Elasticsearch 공식 문서](https://www.elastic.co/guide/index.html)를 참고하도록 한다.

테스트 환경
======

테스트 환경은 다음과 같다.

*   Elasticsearch version 6.7.1
    
*   Kibana version 6.7.1
    

테스트 진행
======

Elasticsearch alias에 연결된 index 개수에 따른 동작 차이가 있는지 비교하기 위하여 아래와 같이 2가지 경우로 나누어서 테스트를 진행한다.

*   테스트 Case 1: 1개 index를 포함하는 alias를 대상으로 indexing 요청한 경우 동작 확인
    
*   테스트 Case 2: 2개 이상의 index를 포함하는 alias를 대상으로 indexing 요청한 경우 동작 확인
    

  

아래 테스트에서 사용되는 index생성, alias설정, 데이터 indexing과 같은 요청은 Kibana에서 제공하는 Dev tools을 사용는 것을 기준으로 진행된다.

  

* * *

테스트 Case 1: 1개 index를 포함하는 alias를 대상으로 indexing 요청한 경우 동작 확인
------------------------------------------------------------

다음과 같은 순서로 테스트를 진행한다.

1.  Elasticsearch에 Index를 1개 생성한다.
    
2.  생성한 Index에 대하여 Alias를 설정한다.
    
3.  Alias를 대상으로 데이터 indexing을 요청한다.
    
4.  결과를 확인한다.
    

  

### Step1 - Elasticsearch에 Index를 1개 생성

아래와 같은 명령으로 Elasticsearch에 Index를 1개 생성한다.

```
PUT test_index_1

```

아래 명령으로 test\_index\_1 이라는 이름의 index가 생성되었는지 확인한다.

```
GET _cat/indices/test_index_1?format=json

# 응답 예:
[
  {
    "health" : "yellow",
    "status" : "open",
    "index" : "test_index_1",
    "uuid" : "2j6DWAQGRsepaf8vBoK1FQ",
    "pri" : "5",
    "rep" : "1",
    "docs.count" : "0",
    "docs.deleted" : "0",
    "store.size" : "1.1kb",
    "pri.store.size" : "1.1kb"
  }
]

```

### Step2 - 생성한 Index에 대하여 Alias를 설정

아래 명령으로 test\_index\_1 이라는 이름의 index에 alias\_for\_write\_test1 이라는 이름으로 alias를 설정한다. [Index Aliases](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/indices-aliases.html) 문서 참고.

```
POST /_aliases
{
    "actions" : [
        { "add" : { "index" : "test_index_1", "alias" : "alias_for_write_test1" } }
    ]
}

# 응답 예:
{
  "acknowledged" : true
}

```

  
아래 명령으로 alias 정보를 확인한다. [cat aliases](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/cat-alias.html) 문서 참고.

```
GET /_cat/aliases?format=json

# 응답 예:
[
    {
        "alias" : "alias_for_write_test1",
        "index" : "test_index_1",
        "filter" : "-",
        "routing.index" : "-",
        "routing.search" : "-"
    }
]

```

### Step3 - Alias를 대상으로 데이터 indexing을 요청

아래와 같이 테스트용 데이터를 alias\_for\_write\_test1 alias를 대상으로 indexing 한다.

```
POST alias_for_write_test1/doc
{
    "board_id" : 10,
    "playtime" : 5,
    "minimum_play" : "Y",
    "timestamp" : "2019-11-19T11:21:01Z",
    "user_id" : 1,
    "interest" : 100,
    "goal" : "alias write test"
}

# 응답 예:
{
  "_index" : "test_index_1",
  "_type" : "doc",
  "_id" : "7QV4g24BUKHIwWQy68LW",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}

```

  
**에러 메시지 없이 정상적으로 indexing 되었을 경우에 반환되는 응답을 확인할 수 있다.**

### Step4 - 결과 확인

아래와 같은 명령을 사용하여 alias를 대상으로 데이터를 조회해 본다.

```
GET /alias_for_write_test1/_search
{
    "query" : {
        "match_all" : {}
    }
}

```

정상적으로 indexing된 데이터를 쿼리 결과로 확인할 수 있다.

```
{
  "took" : 2,
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
        "_index" : "test_index_1",
        "_type" : "doc",
        "_id" : "7QV4g24BUKHIwWQy68LW",
        "_score" : 1.0,
        "_source" : {
          "board_id" : 10,
          "playtime" : 5,
          "minimum_play" : "Y",
          "timestamp" : "2019-11-19T11:21:01Z",
          "user_id" : 1,
          "interest" : 100,
          "goal" : "alias write test"
        }
      }
    ]
  }
}

```

  

* * *

테스트 Case 2: 2개 이상의 index를 포함하는 alias를 대상으로 indexing 요청한 경우 동작 확인
----------------------------------------------------------------

다음과 같은 순서로 테스트를 진행한다.

1.  Elasticsearch에 Index를 3개 생성한다.
    
2.  생성한 3개 Index에 대하여 동일한 Alias를 설정한다.
    
3.  Alias를 대상으로 데이터 indexing을 요청한다.
    
4.  결과를 확인한다.
    

  

### Step1 - Elasticsearch에 Index를 3개 생성

아래와 같은 명령으로 Elasticsearch에 Index를 3개 생성한다.

```
PUT test_index_2
PUT test_index_3
PUT test_index_4

```

아래 명령으로 test\_index\_2, test\_index\_3, test\_index\_4 이라는 이름의 index가 생성되었는지 확인한다.

```
GET _cat/indices/test_index_2?format=json
GET _cat/indices/test_index_3?format=json
GET _cat/indices/test_index_3?format=json

```

  
참고로 아래와 같이 와일드카드를 사용하여 조회하는 것도 가능하다.

```
GET _cat/indices/test_index_*?format=json

```

### Step2 - 생성한 3개 Index에 대하여 동일한 Alias를 설정

아래 명령으로 test\_index\_2, test\_index\_3, test\_index\_4 index에 alias\_for\_write\_test2 라는 이름으로 alias를 설정한다. [Index Aliases](https://www.elastic.co/guide/en/elasticsearch/reference/7.1/indices-aliases.html) 문서 참고.

```
POST /_aliases
{
    "actions" : [
        { "add" : { "index" : "test_index_2", "alias" : "alias_for_write_test2" } },
        { "add" : { "index" : "test_index_3", "alias" : "alias_for_write_test2" } },
        { "add" : { "index" : "test_index_4", "alias" : "alias_for_write_test2" } }
    ]
}

# 응답 예:
{
  "acknowledged" : true
}

```

  
아래 명령으로 alias 정보를 확인한다. [cat aliases](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/cat-alias.html) 문서 참고.

```
GET /_alias/alias_for_write_test2

# 응답 예:
{
  "test_index_2" : {
    "aliases" : {
      "alias_for_write_test2" : { }
    }
  },
  "test_index_3" : {
    "aliases" : {
      "alias_for_write_test2" : { }
    }
  },
  "test_index_4" : {
    "aliases" : {
      "alias_for_write_test2" : { }
    }
  }
}

```

### Step3 - Alias를 대상으로 데이터 indexing을 요청

아래와 같이 테스트용 데이터를 alias\_for\_write\_test2 alias를 대상으로 indexing 한다.

```
POST alias_for_write_test2/doc
{
    "board_id" : 69,
    "playtime" : 14,
    "minimum_play" : "Y",
    "timestamp" : "2019-11-19T12:01:01Z",
    "user_id" : 2,
    "interest" : 200,
    "goal" : "alias write test 2"
}

```

  
**indexing이 실패하고 다음과 같은 응답메시지가 반환되는 것을 확인할 수 있었다.**

```
{
  "error": {
    "root_cause": [
      {
        "type": "illegal_argument_exception",
        "reason": "no write index is defined for alias [alias_for_write_test2]. The write index may be explicitly disabled using is_write_index=false or the alias points to multiple indices without one being designated as a write index"
      }
    ],
    "type": "illegal_argument_exception",
    "reason": "no write index is defined for alias [alias_for_write_test2]. The write index may be explicitly disabled using is_write_index=false or the alias points to multiple indices without one being designated as a write index"
  },
  "status": 400
}

```

### Step4 - 결과 확인

아래와 같은 명령을 사용하여 alias를 대상으로 데이터를 조회해 본다.

```
GET /alias_for_write_test2/_search
{
    "query" : {
        "match_all" : {}
    }
}

```

  
앞의 과정에서 indexing에 실패했고, 쿼리 결과로 데이터가 없는 것을 확인할 수 있다.

```
{
  "took" : 10,
  "timed_out" : false,
  "_shards" : {
    "total" : 15,
    "successful" : 15,
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

  

* * *

테스트 결과
======

테스트를 통해 다음과 같은 사실을 확인할 수 있었다.

*   1개의 Index에 대하여 설정된 Alias를 대상으로 indexing 하는 경우에는 오류 없이 데이터가 처리된다.
    
*   2개 이상의 Index에 대하여 설정된 Alias를 대상으로 indexing 하는 경우에는 오류가 발생되며 indexing되지 않는다.
    

  
여러개의 index와 연결된 alias에 대한 indexing 요청 실패와 관련되어 [공식 문서: Index Alias > Write Index](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/indices-aliases.html) 항목에 아래와 같이 설명되고 있다.

It is possible to associate the index pointed to by an alias as the write index.  
When specified, all index and update requests against an alias that point to multiple indices will attempt to resolve to the one index that is the write index.  
Only one index per alias can be assigned to be the write index at a time.  
If no write index is specified and there are multiple indices referenced by an alias, then writes will not be allowed.

내용을 요약하면 다음과 같다.

*   1개의 Alias에 2개 이상의 Index가 설정되어 있을 경우 1개의 Alias 당 정확히 1개의 Index만 write 가능(index/update) Index로 설정할 수 있다.
    
*   2개 이상의 Index가 Alias와 연결되어 있는 경우, 어느 하나의 Index에 명시적으로 is\_write\_index가 설정되어 있어야 데이터 입력이 정상적으로 되며 그렇지 않을 경우 오류가 발생한다.
    

  

* * *

추가테스트: Alias - is\_write\_index 설정 후 동작 확인
==========================================

앞서 테스트한 '테스트 Case 2: 2개 이상의 index를 포함하는 alias를 대상으로 indexing 요청한 경우 동작 확인'에서 여러 개의 index를 포함하는 alias에 대한 indexing 요청이 실패했었다.

is\_write\_index 설정 추가 후 테스트
----------------------------

테스트 결과에서 설명한 is\_write\_index를 alias와 연결된 특정 index 하나에 설정하고 다시 indexing을 하는 테스트를 해보자.

1.  test\_index\_4 인덱스가 write index로 동작하도록 is\_write\_index 설정하여 alias 설정을 변경한다. 아래 명령은 기존에 test\_index\_4와 연결된 alias 설정을 삭제하고 다시 추가하는 명령이다.
    
    ```
    POST /_aliases
    {
        "actions" : [
            {
                "remove" : {
                    "index" : "test_index_4",
                    "alias" : "alias_for_write_test2"
                }
            },
            {
                "add" : {
                    "index" : "test_index_4",
                    "alias" : "alias_for_write_test2",
                    "is_write_index" : true
                }
            }
        ]
    }
    
    ```
    
      
    
2.  아래 명령으로 alias\_for\_write\_test2 alias의 정보를 확인해 보면 test\_index\_4에 is\_write\_index 옵션이 설정된 것을 확인할 수 있다.
    
    ```
    아래와 같은 명령으로 GET /_alias/alias_for_write_test2
    
    # 응답 예:
    {
      "test_index_2" : {
        "aliases" : {
          "alias_for_write_test2" : { }
        }
      },
      "test_index_3" : {
        "aliases" : {
          "alias_for_write_test2" : { }
        }
      },
      "test_index_4" : {
        "aliases" : {
          "alias_for_write_test2" : {
            "is_write_index" : true
          }
        }
      }
    }
    
    ```
    
      
    
3.  테스트용 데이터를 alias\_for\_write\_test2를 대상으로 다시 indexing 한다.
    
    ```
    POST alias_for_write_test2/doc
    {
        "board_id" : 69,
        "playtime" : 14,
        "minimum_play" : "Y",
        "timestamp" : "2019-11-19T12:35:01Z",
        "user_id" : 2,
        "interest" : 200,
        "goal" : "alias write test 2"
    }
    
    ```
    
      
    
4.  indexing 요청 응답을 확인하고, 아래와 같이 데이터를 조회해본다.
    
    ```
    GET /alias_for_write_test2/_search
    {
        "query" : {
            "match_all" : {}
        }
    }
    
    # 응답 결과:
    {
      "took" : 6,
      "timed_out" : false,
      "_shards" : {
        "total" : 15,
        "successful" : 15,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : 1,
        "max_score" : 1.0,
        "hits" : [
          {
            "_index" : "test_index_4",
            "_type" : "doc",
            "_id" : "7gWrg24BUKHIwWQyAMLH",
            "_score" : 1.0,
            "_source" : {
              "board_id" : 69,
              "playtime" : 14,
              "minimum_play" : "Y",
              "timestamp" : "2019-11-19T12:35:01Z",
              "user_id" : 2,
              "interest" : 200,
              "goal" : "alias write test 2"
            }
          }
        ]
      }
    }
    
    ```
    
      
    

  

is\_write\_index 설정 추가 후 테스트 결과
-------------------------------

Alias설정에 write index로 설정된 test\_index\_4로 데이터가 저장된 것을 확인할 수 있다.

여러 개의 index를 포함하는 alias에 대하여 특정 index에 is\_write\_index 옵션을 지정하면 alias를 대상으로 indexing 요청이 처리 가능함을 확인하였다.
