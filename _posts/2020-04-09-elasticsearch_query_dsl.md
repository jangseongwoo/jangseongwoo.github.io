---
title:  "Elasticsearch - Query DSL 기초 학습"
excerpt: "이 문서의 목적은 Elasticsearch 공식 사이트의 Query DSL에 대해 학습했던 부분을 정리하고 공유하기 위해 작성했다. [Elasticsearch - Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl.html)과 관련된 모든 내용을 설명하고 공유하는 것이 이 문서의 목적은 아니며 자세한 설명은 공식 문서를 참고하도록 한다."

categories:
  - Elasticsearch
tags:
  - Elasticsearch
  - Elasticsearch_query_DSL

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 문서의 목적은 Elasticsearch 공식 사이트의 Query DSL에 대해 학습했던 부분을 정리하고 공유하기 위해 작성했다. [Elasticsearch - Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl.html)과 관련된 모든 내용을 설명하고 공유하는 것이 이 문서의 목적은 아니며 자세한 설명은 공식 문서를 참고하도록 한다.

이어지는 설명에서는 Kibana에서 제공하는 'Dev Tools'를 사용하여 Elasticsearch에 query하는 방식을 기준으로 설명한다.  
Postman과 같은 다른 툴을 사용하여 실습하는 경우 Elasticsearch에 대한 정보를 포함하여 query대상 URL을 지정하기 바란다.

테스트 환경
======

* * *

테스트 환경은 다음과 같다. 

*   Elatiscsearch: 7.1.1
    
*   Kibana: 7.1.1
    
*   MacOS: Catalina 10.15.2
    

참고한 Elatiscsearch 공식문서의 버전은 다음과 같다. 

*   7.x
    

샘플 데이터 Elasticsearch에 추가
========================

* * *

이 문서에서 사용하는 데이터는 Kibana에서 기본 제공되는 샘플 데이터를 사용한다.

샘플 데이터를 설정하는 방법은 Kibana home에서 "Load a data set and a Kibana dashboard" 링크를 클릭한 후 3개의 Sample 데이터 중 Sample eCommerce orders를 선택한다.

아래에서 실습에서는 해당 데이터가 생성되있다는 가정하에 예시 Query를 작성했다. 샘플 데이터를 넣지 않아도 되지만, 실제로 Query를 연습해보는 것이 중요하기 때문에 데이터를 입력하고 하길 권장한다. 

문서 범위
=====

* * *

이 문서에서 다루는 내용의 범위는 다음과 같다.

*   Query 요청과 응답에 대한 공통 부분 설명
    
*   [Query and filter context](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html)
    
*   [Compound queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html)
    
*   [Full text queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html)
    
*   [Match all](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-all-query.html)
    
*   [Term-level queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html)
    

Query 요청과 응답에 대한 공통 부분 설명 
==========================

* * *

Elasticsearch에서 Query를 사용할 때 공통적인 부분에 대한 설명은 다음과 같다. 

```
{
    "size" : # 반환받는 Document 개수의 값이다
    ,"from" : # 몇번째 문서부터 가져올지 지정. 기본값은 0이다
    ,"timeout" : # 검색 요청시 결과를 받는 데까지 걸리는 시간이다. timeout을 너무 작게하면 전체 샤드에서 timeout을 넘기지 않은 문서만 결과로 출력된다. 기본 값은 무한이다.
    ,"_source" : # 검색시 필요한 필드만 출력하고 싶을 때 사용한다
    ,"query" : # 검색 조건문을 설정할 때 사용한다
    ,"aggs" : # 통계 및 집계 데이터를 설정할 때 사용한다
    ,"sort" : # 문서 결과의 정렬 조건을 설정할 때 사용한다
}
```

Query의 응답에서 공통적인 부분에 대한 설명은 다음과 같다. 

```
{
    "took" : # Query를 실행하는데 걸린 시간이다
    ,"timed_out" : # Query 시간이 초과했는 지 True, False로 나타낸다
    ,"_shards" : {
        "total" : # Query를 요청한 전체 샤드 개수이다
        ,"successful" : # Query에 성공적으로 응답한 샤드 개수이다
        ,"failed" : # Query에 실패한 샤드 개수이다
    }
    ,"hits" : {
        "total" : # Query에 매칭된 문서의 전체 개수이다
        ,"max_score" : # Query에 일치하는 문서의 스코어 값중 가장 높은 값이다
        ,"hits" : # Query 결과를 표시한다
    }
}
```

쿼리와 필터 컨텍스트(Query and filter context)
=====================================

* * *

**관련성 점수(Relevance scores)**
----------------------------

Elasticsearch에서는 기본적으로 관련성 점수로 검색 결과를 정렬한다. 관련성 점수는 Query와 얼마나 잘 매칭되는 지 표현한 것이다. 관련성 점수는 실수이며 _score 메타 필드안에 값이 있다. 

관련성 점수는 Query 절이 Query context 혹은 Filter context인지에 따라 다르게 계산된다. 

**Query context**
-----------------

Query context에서는, 문서가 Query와 얼마나 유사한지에 따라 점수가 계산된다. 

**Filter context**
------------------

Filter context에서는, 문서가 Query와 일치하는지를 구분한다. 점수는 계산되지 않는다. 점수를 계산하지 않기 때문에 Query context보다 검색 속도가 빠르다.

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-filter-context.html#relevance-scores](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-filter-context.html#relevance-scores)

복합 쿼리(Compound queries)
=======================

* * *

**Boolean query**
-----------------

boolean query는 query 필드 하위에 bool 필드를 정의하여 사용한다.

boolean query는 다음과 같은 하위 쿼리를 정의하여 사용한다. boolean query는 다른 종류의 하위 쿼리를 사용하여 정의할 수 있다.

*   must: Must절에 있는 모든 Query가 일치하는 문서를 검색한다. score에 영향을 준다.
    
*   filter: Must절에 있는 모든 Query가 일치하는 문서를 검색한다. score에 영향을 주지 않는다.
    
*   should: Should절에 지정된 Query 중 하나라도 일치하는 문서를 검색한다.
    
*   must not: Must not절에 있는 모든 Query가 일치하지 않는 문서를 검색한다.
    

하위 쿼리는 단일 쿼리(term, match, range 등)를 정의하여 사용하며, 여러개의 단일 쿼리를 정의(아래 예시의 should)하여 사용할 수도 있다. 

예시 Query는 다음과 같다. 

```
GET kibana_sample_data_ecommerce/_search
{
  "query": {
    "bool": {
      "must": {
        "term" : { "customer_id": 4}
      },
      "filter": {
        "term": {"day_of_week":"Wednesday"}
      },
      "must_not": {
        "range": {
          "order_date": { "gte": "2016-12-21T06:51:50+00:00",
            "lte": "2019-12-31T06:51:50+00:00"
          }
        }
      },
      "should": [
        {"term": { "customer_last_name":"Garza"}},
        {"term": { "customer_last_name":"Solomon"}}
      ],
      "boost": 1
    }
  }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-bool-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-bool-query.html)

**Dis_max query**
------------------

dis_max query는 query와 정확히 일치하는 Document에 가장 높은 점수를 부여하고 나머지 subqueries에 대해 매칭될 경우 tie_braker의 값을 곱해 최종 점수를 계산한다. tie_braker의 기본값은 0.0이며 최대값은 1.0이다. 

예시 Query는 다음과 같다. 

```
GET kibana_sample_data_ecommerce/_search/
{
    "query": {
        "dis_max" : {
            "queries" : [
                { "term" : { "day_of_week" : "Tuseday" }},
                { "term" : { "customer_id" : "24" }}
            ],
            "tie_breaker" : 0.7
        }
    }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-dis-max-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-dis-max-query.html)

전문 쿼리(Full text queries)
========================

* * *

**Match query**
---------------

match query를 이용해 query 필드로 정의된 텍스트와 매치되는 문서들을 검색할 수 있다. 유의 사항은 입력한 text가 검색 되기전 분석(analyze)과정을 거치고 검색에 사용된다는 것이다.

match query는 query 필드로 정의된 텍스트에서 띄어쓰기를 기준으로 단어를 구분하여 검색한다. 아래 예시에서는 _customer_full_name_ 필드 값이 _"Eddie"_ 또는 _"James"_ 인 다큐먼트를 검색한다.

예시 Query는 다음과 같다. 

```
GET kibana_sample_data_ecommerce/_search
{
    "query": {
        "match" : {
            "customer_full_name" : {
                "query" : "Eddie James"
            }
        }
    }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-match-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-match-query.html)

**Match phrase query**
----------------------

match phrase query는 띄워쓰기까지 포함한 정확한 구(phrase)를 검색할때 사용한다. 입력된 text는 match query와 같이 분석되지만 token 단위로 원래의 구와 동일한 순서로 배치되어 있는 구만을 검색한다. 

예시 Query는 다음과 같다. 

```
GET /_search
{
    "query": {
        "match_phrase" : {
            "message" : "this is a test"
        }
    }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-match-query-phrase.html#query-dsl-match-query-phrase](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-match-query-phrase.html#query-dsl-match-query-phrase)

**Multi-match query**
---------------------

Multi-match query를 이용하면 여러 개의 field에서 query를 검색할 수 있다.

동일한 query를 다른 필드에 Match query를 사용한 것과 같은 결과를 얻을 수 있다.

예시 Query는 다음과 같다. 

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query":    "this is a test", 
      "fields": [ "subject", "message" ] 
    }
  }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-multi-match-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-multi-match-query.html)

**Match all query**
-------------------

Query에 매치되는 모든 Document를 검색한다. 검색 결과의 점수는 1.0이다. 

예시 Query는 다음과 같다. 

```
GET /_search
{
    "query": {
        "match_all": {}
    }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-match-all-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-match-all-query.html)

텀 레벨 쿼리(Term-level queries)
===========================

* * *

**Exists query**
----------------

Exists query는 메타 필드 검색과 관련된 쿼리이다.

field에 정의한 이름의 필드가 존재하는 Document를 검색한다. 특정 Field의 값에는 여러 가지 이유로 값이 없을 수 있는 데, 이러한 값 없는 field가 있는 Documents들을 제외할 수 있는 query이다.

예시 Query는 다음과 같다. 

```
GET /_search
{
    "query": {
        "exists": {
            "field": "user"
        }
    }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-exists-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-exists-query.html)

**Range query**
---------------

지정한 범위의 값이 포함된 문서를 리턴한다. 

예시 Query는 다음과 같다. 

```
GET _search
{
    "query": {
        "range" : {
            "age" : {
                "gte" : 10,
                "lte" : 20,
                "boost" : 2.0
            }
        }
    }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-range-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-range-query.html)

**Term query**
--------------

지정한 Field에 입력한 Term이 정확하게 매칭되는 Document를 리턴한다. 

예시 Query는 다음과 같다. 

```
GET /_search
{
    "query": {
        "term": {
            "user": {
                "value": "Kimchy",
                "boost": 1.0
            }
        }
    }
}
```
  

Term query를 Text field에 사용하는 것은 좋지 않다. 

기본값 설정으로, Elasticsearch에서는 Text fields에 대해 분석을 하고 query를 수행한다. 이것은 특정 field의 값을 찾는 데 어려움을 야기할 수 있다.

따라서, Text field를 찾기 위해서는 Match query를 사용하는 것을 권장한다.

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-term-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-term-query.html)

**Terms query**
---------------

지정한 Field에 하나 또는 하나 이상의 Term이 정확하게 매칭되는 Document를 리턴한다. 

예시 Query는 다음과 같다. 

```
GET /_search
{
    "query" : {
        "terms" : {
            "user" : ["kimchy", "elasticsearch"],
            "boost" : 1.0
        }
    }
}
```

공식문서 링크: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-terms-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-terms-query.html)

  

참고 문서
=====

*   Elasticsearch 공식 문서: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-dis-max-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-dis-max-query.html)
    
*   Elasticsearch 쿼리 DSL 기초: [https://bakyeono.net/post/2016-08-20-elasticsearch-querydsl-basic.html#bool-쿼리](https://bakyeono.net/post/2016-08-20-elasticsearch-querydsl-basic.html#bool-%EC%BF%BC%EB%A6%AC)
    
*   [Elasticsearch] 입문하기(4) - 다양한 검색 방법 ( Query DSL ): [https://victorydntmd.tistory.com/314](https://victorydntmd.tistory.com/314) 
    
*   Elasticsearch - 2.검색 API(Elasticsearch Query DSL): [https://coding-start.tistory.com/165](https://coding-start.tistory.com/165)