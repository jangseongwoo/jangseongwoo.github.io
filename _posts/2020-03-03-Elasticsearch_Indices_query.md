---
title:  "Elasticsearch Indices query 정리"
excerpt: "이 글의 목적은 Apache Kafka 공식 사이트의 Quick start를 따라하면서 학습했던 부분을 정리하고 공유하기 위해 작성했다."

categories:
  - Elasticsearch
tags:
  - Elasticsearch

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 작성 목적 
=========

* * *

이 문서는 Elasticsearch Indices query에 대해 정리하기 위해 작성했다. 

테스트는 Kibana의 Dev tools에서 진행하는 것을 기준으로 문서를 작성했다. 

  

테스트 환경 
=======

* * *

테스트 환경은 다음과 같다.

*   macOS Catalina v10.15.2
    
*   Elasticsearch 7.1
    
*   Kibana 7.1
    

  

Elasticsearch Indices query
===========================

* * *

Cat indices API 사용 예
--------------------

Elasticsearch의 Index list와 각 Index의 Documents 개수를 확인하기 위해서 다음과 같은 명령어를 입력한다. 

```
GET _cat/indices
```

결과는 다음과 같다. 

```
green open st-prod-conects-15sec-index-2020-01-17 7jh2KhP6SdeDxwm2hy5kfg 5 1   6307   0     2mb      1mb
green open st-prod-conects-15sec-index-2020-01-19 SLOT4YsRQqm21rbvmCZG7g 5 1   2561   0     1mb  573.8kb
green open st-prod-conects-15sec-index-2020-02-12 XGS8G2AoTiaqXTuwiZ-6IA 5 1   5220   0   2.1mb      1mb
green open st-prod-conects-15sec-index-2020-01-28 DGxK_YcwTJu7xYCSQ_BUxA 5 1   4158   0   1.5mb  794.7kb
green open st-prod-conects-15sec-index-2020-02-01 tIOUrhWTSO-_crw1MIOI2g 5 1   2225   0   1.1mb  555.4kb
green open st-prod-conects-15sec-index-2019-12-10 k9dLLvBGTFqPpka6rvjxhg 5 1   8470   0   2.4mb    1.2mb
green open st-prod-conects-15sec-index-2020-02-14 lSdUS-YSRUC9TjjKTfSxCA 5 1   5831   0   2.3mb    1.1mb
... 하략 
```

  

결과에 컬럼과 특정 Index를 보기 위해서는 다음과 같은 명령어를 입력하면 된다. 

```
GET /_cat/indices/st*?v&s=index
```

결과는 다음과 같다. 

```
health status index                                  uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   st-prod-conects-15sec-index-2019-12-06 1OOwRAA9Rb2kd5XECLUbig   5   1       1702            0    809.1kb        393.4kb
green  open   st-prod-conects-15sec-index-2019-12-07 UXtG3bGRRzSuTU8aWa5AGg   5   1       1653            0    810.3kb        429.2kb
green  open   st-prod-conects-15sec-index-2019-12-08 CdIeUvR8T52Trgpc8J9i4Q   5   1       4251            0      1.3mb        678.6kb
green  open   st-prod-conects-15sec-index-2019-12-09 hKLDEP9tQYCLp4cDnpr_Pg   5   1       6004            0      1.8mb        931.7kb
green  open   st-prod-conects-15sec-index-2019-12-10 k9dLLvBGTFqPpka6rvjxhg   5   1       8470            0      2.4mb          1.2mb
green  open   st-prod-conects-15sec-index-2019-12-11 wgRb_p6uSUGCtmw9wdMjlw   5   1       8032            0      2.3mb          1.1mb
```

Cat indices API에 대한 설명
----------------------

```
GET /_cat/indices/
GET /_cat/indices/<index>
```

위의 Query에 대해 설명을 진행한다. 

다음 명령어는 기본적인 API에 대한 설명이다. <index>에는 특정 Index의 이름, 또는 \*을 이용해 규칙에 맞는 Index를 조회할 수 있다. 

  

```
GET /_cat/indices/st*?v&s=index
```

위의 Query에 대해 설명을 진행한다. 제일 마지막의 <index>에 해당하는 부분을 st로 시작하는 index에 대해 조회하며 결과 표시를 ? 뒤의 옵션을 이용해 변경해 출력했다. 

옵션에 대한 자세한 사항은 아래의 표를 참고한다. 

| 항목  | 설명  |
| --- | --- |
| S   | (Optional, string) Comma-separated list of column names or column aliases used to sort the response. |
| V   | (Optional, boolean) If true, the response includes column headings. Defaults to false. |

  

참고 문서
=====

* * *

참고 문서는 다음과 같다. 

*   Elasticsearch 공식 문서: [https://www.elastic.co/guide/en/elasticsearch/reference/7.x/cat-indices.html](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/cat-indices.html)
