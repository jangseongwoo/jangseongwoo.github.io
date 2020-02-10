---
title:  "Elasticsearch multi_match 기본 사용법 및 Type에 대한 설명 정리"
excerpt: "이 문서는 Elasticsearch에서 Multi\_match query를 사용할 경우 필요한 지식에 대해 정리하고 공유하기 위해 작성했다."

categories:
  - Elasticsearch
tags:
  - Elasticsearch
---

*   [문서 목적](#ElasticsearchMulti-matchquery내용정리-문서목적)
*   [테스트 환경](#ElasticsearchMulti-matchquery내용정리-테스트환경)
*   [Multi\_match 기본 설정에 대한 설명](#ElasticsearchMulti-matchquery내용정리-Multi_match기본설정에대한설명)
*   [Multi\_match wildcards, 가중치 설명](#ElasticsearchMulti-matchquery내용정리-Multi_matchwildcards,가중치설명)
*   [Multi\_match Type option에 대한 설명](#ElasticsearchMulti-matchquery내용정리-Multi_matchTypeoption에대한설명)
    *   [Best\_fields type](#ElasticsearchMulti-matchquery내용정리-Best_fieldstype)
    *   [Most\_fields type](#ElasticsearchMulti-matchquery내용정리-Most_fieldstype)
    *   [Phrase and Phrase\_prefix type](#ElasticsearchMulti-matchquery내용정리-PhraseandPhrase_prefixtype)
    *   [Cross\_fields type](#ElasticsearchMulti-matchquery내용정리-Cross_fieldstype)
*   [참고 자료 ](#ElasticsearchMulti-matchquery내용정리-참고자료)

문서 목적
=====

* * *

이 문서는 Elasticsearch에서 Multi\_match query를 사용할 경우 필요한 지식에 대해 정리하고 공유하기 위해 작성했다. 가독성을 위해 Elasticsearch는 ES로 표기한다. 

  

테스트 환경
======

* * *

테스트 환경은 다음과 같다. 

*   ES, Kibana: 7.1 
    
*   MacOS Catalina 10.15.2
    

  

Multi\_match 기본 설정에 대한 설명
=========================

* * *

아래와 같이 Query를 실행할 경우 기본값으로 설정되는 항목에 대해 설명한다. 

```
{
    "query": {
        "multi_match" : {
            "query":    "this is a test",
            "fields": [ "subject", "message" ]
        }
    }
}

```

기본값으로 설정되는 항목은 다음과 같다. 

*   Query 대상 필드 개수 제한: 1024개. [참고문서](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-settings.html)
    
*   Type: Best\_fields
    

  

Multi\_match wildcards, 가중치 설명
==============================

* * *

Multi\_match는 Wildcards를 지원한다. 다음은 예시이다. 예시에서는 "\*\_name"로 Field를 지정해 \_name으로 끝나는 Field를 대상 Field로 지정한다. 

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query":    "Will Smith",
      "fields": [ "title", "*_name" ] 
    }
  }
}

```

또한, 각 각의 Field에 대해 가중치를 부여할 수 있다. 다음은 예시이다. 예시에서는 "subject" field는 "message" field에 대해 3배 중요하다. 

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query" : "this is a test",
      "fields" : [ "subject^3", "message" ] 
    }
  }
}

```

  

Multi\_match Type option에 대한 설명
===============================

* * *

다음은 Multi\_match type과 해당 Type에 대한 설명을 표로 정리한 것이다. 

|     |     |
| --- | --- |
| `best_fields` | (**기본 설정값**) 모든 Field에 대해 Match되는 Field를 찾는다. 가장 잘 Match되는 **1개의 Field를 기준으로 Score를 계산**한다. 참고문서 `best_fields`. |
| `most_fields` | 모든 Field에 대해 Match되는 각 각의 field에 대해 점수를 계산하고 모두 합한다. 합한 점수를 field 개수로 나눠서 최종 스코어를 계산한다. 참고문서 `most_fields`. |
| `cross_fields` | Treats fields with the same `analyzer` as though they were one big field. Looks for each word in **any**field. See `cross_fields`. |
| `phrase` | Runs a `match_phrase` query on each field and uses the `_score` from the best field. See `phrase` and `phrase_prefix`. |
| `phrase_prefix` | Runs a `match_phrase_prefix` query on each field and uses the `_score` from the best field. See `phrase`and `phrase_prefix`. |
| `bool_prefix` | Creates a `match_bool_prefix` query on each field and combines the `_score`from each field. See `bool_prefix`. |

Best\_fields type
-----------------

Best\_fields type은 **기본 설정값**이며 모든 Field에 대해 Match되는 Field를 찾는다. Best\_fields type는 dis\_max query를 여러 개의 field에 대해 각 각 Match query한 결과와 같다.

예시는 다음과 같다. 

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "brown fox",
      "type":       "best_fields",
      "fields":     [ "subject", "message" ],
      "tie_breaker": 0.3
    }
  }
}

```

위의 예시 Query는 다음과 같이 실행될 것이다. 

```
GET /_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match": { "subject": "brown fox" }},
        { "match": { "message": "brown fox" }}
      ],
      "tie_breaker": 0.3
    }
  }
}

```

Best\_fields type은 가장 잘 Match되는 **1개의 Field를 기준으로 Score를 계산**한다. tie\_breaker 설정 시 다음과 같이 점수가 계산된다.

*   가장 잘 Match되는 **1개의 Field를 기준으로 Score를 계산**한다.
    
*   나머지 Field에 대해 tie\_breaker \* score를 한 후 Score에 Plus한다. 
    

**참고**

Best\_fields Type Query 시 "tie\_breaker"를 1로 설정하면, Most\_fields Type으로 "tie\_braker"를 설정 하지 않았을 경우와 같은 Score가 나오게 된다.

이 이유는 점수 계산 방식의 차이인데, Best\_fields는 각 field의 Score 중 제일 큰 값을 최종 Score로 하는 반면에 Most\_fields는 각 field의 Score를 모두 더해서 최종 Score를 계산하기 때문이다.

따라서, Best\_fields Type의 "tie\_braker"를 1로 설정할 경우 모든 Field의 Score를 합해 최종 Score를 계산하게 되므로 Most\_fields Type과 동일한 점수가 나오게 된다.

점수 계산에 대해 조금 더 자세히 설명하자면, Best\_fields type은 각 각의 Field에 대해 Field별로 [BM25](https://ict-nroo.tistory.com/82)의 알고리즘을 이용해 점수를 계산한다. 

즉, 주어진 대상 Field 별로 Score를 계산하고 이 계산된 모든 Score를 비교해 가장 큰 값을 최종 Document의 Score로 결정하는 것이다. 다음은 예시이다. 

```
  "hits" : {
    "total" : {
      "value" : 4,
      "relation" : "eq"
    },
    "max_score" : 0.9913396,
    "hits" : [
      {
        "_shard" : "[test_multi_match_query][0]",
        "_node" : "_MqXQL7fShunzdcE4D6j9w",
        "_index" : "test_multi_match_query",
        "_type" : "_doc",
        "_id" : "QfQRHnABGReuIwC7G8rY",
        "_score" : 0.9913396,
        "_source" : {
          "first_field" : "first",
          "second_field" : "first",
          "third_field" : "first"
        },
        "_explanation" : {
          "value" : 0.9913396,
          "description" : "max of:",
          "details" : [
            {
              "value" : 0.6103343,
              "description" : "weight(second_field:first in 1) [PerFieldSimilarity], result of:",
              "details" : {...}
            },
            {
              "value" : 0.30873197,
              "description" : "weight(first_field:first in 1) [PerFieldSimilarity], result of:",
              "details" : {...}
            },
            {
              "value" : 0.9913396,
              "description" : "weight(third_field:first in 1) [PerFieldSimilarity], result of:",
              "details" : {...}
            }
          ]
        }
      },
...하략
```

이 예시는 Multi\_match query를 Best\_fields type으로 3개의 Field에 대해 Query 했을 때 계산 과정을 설명한 내용이다. 이 Multi\_match query의 Query절은 3개의 Field에 대해 정확히 일치한다. (Ex. 검색어: First, 대상 필드 3개의 값: First)

예시 중 중요한 부분은 "hits" → "hits" → "\_explanation" -> "details" 부분이다. 해당 부분을 보면 각 각의 3개의 Field에 대해 Per field 별로 Score를 계산하고 그 중 최고점을 최종 Score로 계산한다. 모두 Query 절이 정확히 일치해도 모든 문서의 대상 Field가 얼마나 자주 등장하는 지, Term의 길이 등 Relevance 계산 알고리즘에 의해 점수가 다르게 계산된다. 

`공식 문서는 best_fields를 참고한다. `

  

중요 Operator and minimum\_should\_match에 대한 설명

Best\_fields type, most\_fields type은 공통적으로 Field 중심적이다. 이 두 개의 Type은 각 각의 Field에 대해 Match query를 실행하며 Match query마다 Operator와 Minimum\_should\_match가 적용된다. 

예시는 다음과 같다. 

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "Will Smith",
      "type":       "best_fields",
      "fields":     [ "first_name", "last_name" ],
      "operator":   "and" 
    }
  }
}

```

위의 Query는 Will, Smith로 분석된 Token이 First\_name, Last\_name 중에 1개의 field라도 모두 존재하면 Match된다. 식으로 표현하면 다음과 같다. 

```
(+first_name:will +first_name:smith) 
| (+last_name:will  +last_name:smith)

```

정리하면, Query를 분석한 Terms가 1개의 Field에 대해 모두 존재할 경우 Match된다. 

Most\_fields type
-----------------

모든 Field에 대해 Match되는 각 각의 field에 대해 점수를 계산하고 모두 합한다. 

다음은 예시이다. 

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "quick brown fox",
      "type":       "most_fields",
      "fields":     [ "title", "title.original", "title.shingles" ]
    }
  }
}

```

위와 같이 작성된 쿼리는 실제로 다음과 같은 쿼리로 실행될 것이다.

```
GET /_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "title":          "quick brown fox" }},
        { "match": { "title.original": "quick brown fox" }},
        { "match": { "title.shingles": "quick brown fox" }}
      ]
    }
  }
}

```

위 예시는 Title이라는 이름의 field를 다른 분석기를 통해 분석된 결과에 Match 되는 지 확인하고 점수를 계산하기 때문에 위 예시 Query의 검색 키워드인 "quick brown fox"에 더 근접한 결과를 얻을 수 있다.

점수 계산 방법은 다음과 같다. 

*   각 각의 Match되는 field에 대해 점수를 계산한 후 합한다.
    

자세한 사항은 `most_fields를 참고한다.`

Phrase and Phrase\_prefix type
------------------------------

phrase, Phrase\_prfix type은 Best\_fields type과 비슷하게 동작한다. 다른 점은 Match query 대신 Match\_phrase, Match\_phrase\_prefix으로 동작한다는 것이다. 

자세한 사항은 [Phrase, Phrase\_prefix](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-multi-match-query.html#type-phrase)를 참고한다. 

Cross\_fields type
------------------

Cross\_fields type은 여러 field가 일치해야 하는 구조화된 문서에 특히 유용하다. 예를 들어, "Will Smith" 키워드로 First\_name과 Last\_name에 대해 Query할 경우, 최적의 Match는 1개 Field에 "Will", 나머지 1개의 Field가 "Smith"에 Match될 경우일 것이다. 

Cross\_fields type은 다음과 같이 검색을 진행한다.

1.  Query를 분석기로 분석한다.
    
2.  분석된 각 각의 Term들을 모든 Field에 대해 질의하는데, 이 질의 대상이 되는 Field들을 1개의 큰 Field로 만들어 Match 되는 지 질의한다. 
    

  

중요 Most\_field type 차이점 비교

Most\_field type과의 차이점을 비교하면 2가지가 있다. 

첫 번째는 Most\_field type은 field마다 Operator, minimum\_should\_match를 적용하지만 Cross\_fields type은 Term마다 적용한다.

두 번째는 관련성이다. 만약 "Will Smith"이라는 이름을 검색한다고 생각해보자. 검색 시 'Will', 'Smith'이라는 두개의 Terms는 각 각의 last\_name, first\_name Field에 대해 검색할 것이다. 결과는 "Smith Jones"가 "Will Smith" 보다 점수가 높을 것이다.

왜냐하면, last\_name에 "Smith"는 굉장히 흔하지 않기 때문에 Last\_name: "Smith"의 Score는 Last\_name: "Will", First\_name: "Smith"의 총합 Score보다 더 높기 때문이다.

  

Cross\_fields type은 query로 입력한 키워드를 분석한 후 모든 Field에 대해 각 각의 Term을 검색한다. 예시는 다음과 같다. 

```
GET /_search
{
  "query": {
    "multi_match" : {
      "query":      "Will Smith",
      "type":       "cross_fields",
      "fields":     [ "first_name", "last_name" ],
      "operator":   "and"
    }
  }
}

```

이 Query는 다음과 같이 실행될 것이다.

```
+(first_name:will last_name:will) 
+(first_name:smith last_name:smith)

```

따라서, 최소한 1개 이상의 Field에 대해 모두 Terms가 존재할 것이다.

  

참고 자료 
======

* * *

참고 자료는 다음과 같다. 

*   ES 공식문서: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-multi-match-query.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/query-dsl-multi-match-query.html)
    
*   ES multi\_match query field 개수 설정 관련 공식 문서: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-settings.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/search-settings.html)
