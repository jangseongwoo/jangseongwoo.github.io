---
title:  "Fluentd(td-agent) output plugin"
excerpt: "이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 단순 동작 확인에 목적을 두고 있다."

categories:
  - Fluentd
tags:
  - Fluentd

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

테스트 목적
======

이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 단순 동작 확인에 목적을 두고 있다.

*   로그 파일을 읽고 표준 출력하기
    
*   로그 파일을 읽고 파일로 출력하기
    
*   로그 파일을 읽고 Elasticsearch에 Insert하기
    
*   로그 파일을 읽고 Amazone S3에 저장하기
    

  

테스트 환경
======

다음과 같은 환경에서 테스트 하였다.

*   OS : macOS Mojave 10.14.5
    
*   Fluentd : 1.0.2 (td-agent : 3.1.1.0)
    

  

테스트에 필요한 사전정보
=============

Fluentd 기초 사용법을 확인하여 td-agent 기초 동작을 확인하면 된다.

  

* * *

테스트 케이스 : 로그 파일을 읽고 표준 출력하기
===========================

테스트 목적
------

td-agent가 다음과 같은 의도대로 동작 하는지 확인한다.

*   파일의 로그를 읽고 표준 출력하기
    

테스트 과정
------

1.  입력용 파일을 생성한다.
    
    ```
     $ touch file_to_stdout_test.log
    ```
    
      
    파일이 정상적으로 생성되었는지 확인한다.
    
    ```
    $ ls -l file_to_stdout_test.log
    drwxr-xr-x  4 kevin  staff  0  8  6 16:52 file_to_stdout_test.log 
    ```
    
2.  td-agent.conf 파일을 다음과 같이 수정한다.
    
    ```
    $ vim /etc/td-agent/td-agent.conf
    <source>
      @type tail 
      path /Users/kevin/dev/fluentd/test/file_to_stdout/source/file_to_stdout_test.log 
      pos_file /home/kevin/dev/fluentd/test/pos_file/file_to_stdout.pos 
      tag file_to_stdout.test 
      <parse>
        @type none
      </parse>
    </source>
    <match file_to_stdout.*>
      @type stdout
    </match> 
    ```
    
      
    
    tail, stdout은 default plugin으로 별도의 plugin 설치가 필요하지 않다.
    
    *   source  
        
        *   path : 읽어오고자 하는 로그 파일의 경로를 지정하는 parameter로 wildcard(\*)를 사용하여 디렉터리를 지정할 수도 있다.
            
        *   pos\_file : td-agent는 입력용 로그 파일에 접근하여 읽었던 위치를 파일로 저장한다. 그 파일의 경로를 지정하는 parameter이다.
            
        *   parse : 로그 파일 포맷을 의미한다. none은 라인 단위 구문 분석을 의미한다.
            
        *   tag : 이벤트를 구분짓기 위한 tag name을 의미한다.
            
    *   match
        
        *   <match tag명 > : tag명에 대한 이벤트를 출력하겠다는 의미이다.
            
    
      
    
    설정에 관하여 더 자세한 내용은 아래의 링크를 통하여 확인할 수 있다.
    
    *   [Fluentd - Input Plugins : tail](https://docs.fluentd.org/input/tail) 
        
    *   [Fluentd - Output Plugins : stdout](https://docs.fluentd.org/output/stdout)
        
    
      
    
      
    
    이제 td-agent를 한다.
    
      
    
3.  파일에 다음과 같은 로그를 저장하고 이를 확인한다.
    
    ```
    $ vim file_to_stdout_test.log
    file_to_stdout_test 1
    file_to_stdout_test 2
    file_to_stdout_test 3
    file_to_stdout_test 4
    file_to_stdout_test 5
    ```
    
      
    td-agent의 표준 출력을 확인한다.
    
    ```
    $ tail -5f /var/log/td-agent/td-agent.log
    2019-08-06 20:30:20.191939654 +0900 file_to_stdout.test: {"message":"file_to_stdout_test 1"}
    2019-08-06 20:30:25.738923745 +0900 file_to_stdout.test: {"message":"file_to_stdout_test 2"}
    2019-08-06 20:30:31.243424029 +0900 file_to_stdout.test: {"message":"file_to_stdout_test 3"}
    2019-08-06 20:30:35.698592603 +0900 file_to_stdout.test: {"message":"file_to_stdout_test 4"}
    2019-08-06 20:30:40.123402487 +0900 file_to_stdout.test: {"message":"file_to_stdout_test 5"}
    ```
    
      
    

테스트 결과
------

파일에 저장된 로그는 라인 단위로 읽어와 "로그를 수집한 날짜", "이벤트 Tag명", "로그"를 표준출력하며 형식은 다음과 같음을 알 수 있다.

```
(로그를 수집한 날짜) (이벤트 Tag명): {"message":"(로그)"}
```

  

* * *

테스트 케이스 : 로그 파일을 읽고 파일로 출력하기
============================

테스트 목적
------

td-agent가 다음과 같은 의도대로 동작 하는지 확인한다.

*   디렉터리내 파일들의 로그를 읽고 파일 출력하기(출력 파일의 파일명 양식지정)
    

테스트 과정
------

1.  입력용 파일을 생성한다.  
    
    ```
    $ touch file_to_file_01.log file_to_file_02.log file_to_file_03.log 
    ```
    
      
    파일이 정상적으로 생성되었는지 확인한다.
    
    ```
    $ ls -l file_to_file_0*.log
    -rw-r--r--  1 kevin  staff  0  8 13 21:09 file_to_file_01.log
    -rw-r--r--  1 kevin  staff  0  8 13 21:09 file_to_file_02.log
    -rw-r--r--  1 kevin  staff  0  8 13 21:09 file_to_file_03.log
    ```
    
2.  td-agent.conf 파일을 다음과 같이 수정한다.
    
    ```
    $ vim /etc/td-agent/td-agent.conf
    <source>
      @type tail
      path /Users/kevin/dev/fluentd/test/file_to_file/source/*
      pos_file /Users/kevin/dev/fluentd/test/pos/file_to_file.pos
      tag file_to_file.test
      <parse>
        @type none
      </parse>
      refresh_interval 1s
    </source>
    <match file_to_file.*>
      @type file
      path /Users/kevin/dev/fluentd/test/file_to_file/match/${tag}
      <buffer tag>
        flush_mode interval
        flush_interval 10s
      </buffer>
    </match>
    ```
    
      
    
    tail, file은 default plugin으로 별도의 plugin 설치가 필요하지 않다.
    
    *   source  
        
        *   path : 읽어오고자 하는 로그 파일의 경로를 지정하는 parameter로 wildcard(\*)를 사용하여 디렉터리를 지정할 수도 있다. 디렉터리를 지정하기 위하여 wildcard(\*)로 지정한다.
            
        *   pos\_file : td-agent는 입력용 로그 파일에 접근하여 읽었던 위치를 파일로 저장한다. 그 파일의 경로를 지정하는 parameter이다.
            
        *   parse : 로그 파일 포맷을 의미한다. none은 라인 단위 구문 분석을 의미한다.
            
        *   tag : 이벤트를 구분짓기 위한 tag name을 의미한다.
            
        *   refresh\_interval : td-agent가 수집하려는 파일리스트의 갱신주기를 의미한다.
            
    *   match
        
        *   <match tag명 > : tag명에 대한 이벤트를 출력하겠다는 의미이다.
            
        *   path : 저장할 경로를 지정한다. 예약어 tag를 사용한다.
            
    *   buffer
        
        *   <buffer 예약어> : 예약어에 대한 필터를 지정한다.
            
        *   flush\_mode : flush의 mode를 설정한다.(lazy, interval, immediate)
            
        *   flush\_interval : flush\_mode가 interval일 경우에만 지정하며, flush의 주기를 설정한다.
            
    
      
    
    더 자세한 내용은 아래의 링크를 통하여 확인한다.
    
    *   [Fluentd - Input Plugins : tail](https://docs.fluentd.org/input/tail) 
        
    *   [Fluentd - Output Plugins : file](https://docs.fluentd.org/output/file)
        
    *   [Fluentd - Configuration : Buffer Section](https://docs.fluentd.org/configuration/buffer-section)
        
    
      
    
      
    이제 td-agent를 실행한다.
    
3.  입력용 로그 파일 1개에 다음과 같이 로그를 출력한다.  
    
    ```
    $ vim file_to_file_01.log
    file_to_file_01    line 1
    file_to_file_01    line 2
    file_to_file_01    line 3
    file_to_file_01    line 4
    file_to_file_01    line 5
    ```
    
      
    출력용 파일을 확인한다.
    
    ```
    $ cat file_to_file.test_0.log
    2019-08-13T21:58:56+09:00	file_to_file.test	{"message":"file_to_file_01    line 1"}
    2019-08-13T21:58:56+09:00	file_to_file.test	{"message":"file_to_file_01    line 2"}
    2019-08-13T21:58:56+09:00	file_to_file.test	{"message":"file_to_file_01    line 3"}
    2019-08-13T21:58:56+09:00	file_to_file.test	{"message":"file_to_file_01    line 4"}
    2019-08-13T21:58:56+09:00	file_to_file.test	{"message":"file_to_file_01    line 5"}
    ```
    
      
    
    파일명은 ${tag\]\_${index}.log형태로 출력된다.
    
    만약 ${tag}.log형태로 출력하려면 다음과 같이 match의 append 옵션을 수정하면 된다.
    
    ```
    <match 이벤트 tag명>
      ...중략...
      
      append true
      
      ...중략...
    <match>
    ```
    
      
    
      
    
    나머지 파일에도 로그를 출력한다.  
    
    ```
    $ vim file_to_file_02.log
    file_to_file_02    line 1
    file_to_file_02    line 2
    file_to_file_02    line 3
    file_to_file_02    line 4
    file_to_file_02    line 5
    ```
    
      
    
    ```
    $ vim file_to_file_03.log
    file_to_file_03    line 1
    file_to_file_03    line 2
    file_to_file_03    line 3
    file_to_file_03    line 4
    file_to_file_03    line 5
    ```
    
    출력용 파일을 확인한다.  
    
    ```
    $ cat file_to_file.test_1.log
    2019-08-13T22:07:06+09:00	file_to_file.test	{"message":"file_to_file_02    line 1"}
    2019-08-13T22:07:06+09:00	file_to_file.test	{"message":"file_to_file_02    line 2"}
    2019-08-13T22:07:06+09:00	file_to_file.test	{"message":"file_to_file_02    line 3"}
    2019-08-13T22:07:06+09:00	file_to_file.test	{"message":"file_to_file_02    line 4"}
    2019-08-13T22:07:06+09:00	file_to_file.test	{"message":"file_to_file_02    line 5"}
    2019-08-13T22:07:17+09:00	file_to_file.test	{"message":"file_to_file_03    line 1"}
    2019-08-13T22:07:17+09:00	file_to_file.test	{"message":"file_to_file_03    line 2"}
    2019-08-13T22:07:17+09:00	file_to_file.test	{"message":"file_to_file_03    line 3"}
    2019-08-13T22:07:17+09:00	file_to_file.test	{"message":"file_to_file_03    line 4"}
    2019-08-13T22:07:17+09:00	file_to_file.test	{"message":"file_to_file_03    line 5"}
    ```
    
      
    

테스트 결과
------

테스트 결과는 다음과 같다.

*   입력용 파일에 저장된 로그는 라인 단위로 읽어와 "로그를 수집한 날짜", "이벤트 Tag명", "로그"를 파일로 출력하며 형식은 다음과 같다.
    
    ```
    (로그를 수집한 날짜) (이벤트 Tag명) {"message":"(로그)"}
    ```
    
      
    
*   디렉터리내 여러개 파일의 로그가 파일로 출력된다.
    
*   파일명 양식을 설정하면 다음과 같은 형태로 출력된다.
    
    파일명양식\_{index}.log
    
      
    

  

* * *

테스트 케이스 : 로그 파일을 읽고 Elasticsearch에 Insert하기
===========================================

테스트 목적
------

td-agent가 다음과 같은 의도대로 동작하는지 확인한다.

*   파일의 json 로그를 읽고 elasticsearch에 insert하기
    

  

테스트 환경 추가 구성
------------

이 테스트를 위하여 다음과 같은 아키텍쳐를 추가 구성해야한다.

Elasticsearch 6.7.1

  

테스트 과정
------

1.  입력용 파일을 생성한다.
    
    ```
    $ touch json_file_to_es_test.log
    ```
    
      
    파일이 정상적으로 생성되었는지 확인한다.
    
    ```
    $ ls -l
    total 0
    -rw-r--r--  1 kevin  staff  0  8 13 13:48 json_file_to_es.log
    ```
    
2.  td-agent.conf 파일을 다음과 같이 수정한다.
    
    ```
    $ vim /etc/td-agent/td-agent.conf
    <source>
      @type tail
      path /Users/kevin/dev/fluentd/test/json_file_to_es/source/**
      pos_file /Users/kevin/dev/fluentd/test/pos/json_file_to_es.pos
      tag json_file_to_es.test
      <parse>
        @type json
      </parse>
    </source>
    <match json_file_to_es.**>
      @type elasticsearch
      host localhost
      port 9200
      index_name json_file_to_es
      type_name _doc
    </match>
    ```
    
      
    
    tail은 default plugin으로 별도의 plugin설치가 필요하지 않다.
    
    es는 td-agent v3.0.1 이상부터 default plugin이다. 따라서 테스트 환경(td-agent v3.1.1.0)에서는 별도의 plugin 설치가 필요하지 않다.
    
    *   source  
        
        *   path : 읽어오고자 하는 로그 파일의 경로를 지정하는 parameter로 wildcard(\*)를 사용하여 디렉터리를 지정할 수도 있다.
            
        *   pos\_file : td-agent는 입력용 로그 파일에 접근하여 읽었던 위치를 파일로 저장한다. 그 파일의 경로를 지정하는 parameter이다.
            
        *   parse : 로그 파일 포맷을 의미한다. json은 라인 별로 json으로 파싱한다는 의미한다.
            
        *   tag : 이벤트를 구분짓기 위한 tag name을 의미한다.
            
    *   match
        
        *   <match tag명 > : tag명에 대한 이벤트를 출력하겠다는 의미이다.
            
        *   host : 로그를 출력할 elasticsearch의 host를 의미한다.
            
        *   port: 로그를 출력할 elasticsearch의 port를 의미한다.
            
        *   index\_name : 로그를 출력할 elasticsearch index의 이름을 지정한다.
            
        *   type\_name : 로그를 출력할 elasticsearch index의 type을 의미하며 별도로 지정하지 않는다면 elasticsearch v6.7.1 기준 \_doc type에 저장된다.
            
    
      
    
    더 자세한 내용은 아래의 링크를 통하여 확인한다.
    
    *   [Fluentd - Input Plugins : tail](https://docs.fluentd.org/input/tail) 
        
    *   [Fluentd - Output Plugins : Elasticsearch](https://docs.fluentd.org/output/elasticsearch)
        
    *   [fluent-plugin-elasticsearch repository](https://github.com/uken/fluent-plugin-elasticsearch)
        
    
      
    
      
    이제 td-agent를 실행한다.
    
3.  elasticsearch는 local 환경에서 구동하기 때문에 다음의 설정을 확인한다.
    
    port 확인(default : 9200)
    
      
    elasticsearch를 실행한다.
    
    ```
    $ ./bin/elasticsearch
    ```
    
      
    elasticsearch가 구동되는지 확인한다.
    
    ```
    $ curl -X GET "localhost:9200"
    {
      "name" : "kevin_es_node_name",
      "cluster_name" : "kevin_es_cluster_name",
      "cluster_uuid" : "G_WJqbiFS7Srdm4S1mUKWA",
      "version" : {
        "number" : "6.7.1",
        "build_flavor" : "default",
        "build_type" : "tar",
        "build_hash" : "2f32220",
        "build_date" : "2019-04-02T15:59:27.961366Z",
        "build_snapshot" : false,
        "lucene_version" : "7.7.0",
        "minimum_wire_compatibility_version" : "5.6.0",
        "minimum_index_compatibility_version" : "5.0.0"
      },
      "tagline" : "You Know, for Search"
    }
    ```
    
      
    
    elasticsearch에 index가 생성되고 document가 추가되는지 확인하기 위하여 document를 추가한다.
    
    ```
    $ curl -H 'Content-Type: application/json' -XPOST localhost:9200/json_file_to_es/_doc/1/ -d '{"file_name" : "creat_index_add_document", "tag_name" : "test", "lines" : 1}'
    {"_index":"json_file_to_es","_type":"_doc","_id":"1","_version":1,"result":"created","_shards":{"total":2,"successful":1,"failed":0},"_seq_no":0,"_primary_term":1}%
    ```
    
      
    정상적으로 document가 추가 되었는지 확인한다.
    
    ```
    $ curl -XGET 'localhost:9200/json_file_to_es/_search?pretty'
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
        "total" : 1,
        "max_score" : 1.0,
        "hits" : [
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "1",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "creat_index_add_document",
              "tag_name" : "test",
              "lines" : 1
            }
          }
        ]
      }
    }
    ```
    
      
    정상적으로 document가 추가된 것을 확인하였으면 테스트 진행을 위하여 index를 삭제한다.
    
    ```
    $ curl -XDELETE 'localhost:9200/json_file_to_es?pretty'
    {
      "acknowledged" : true
    }
    ```
    
      
    
4.  입력용 로그파일에 로그를 출력한다.
    
    ```
    $ vim json_file_to_es.log
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 1 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 2 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 3 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 4 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 5 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 6 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 7 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 8 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 9 }
    { "file_name" : "json_file_to_es", "tag_name" : "json_file_to_es", "lines" : 10 } 
    ```
    
      
    elasticsearch에 index에 정상적으로 insert 되었는지 확인한다.
    
    ```
    $ curl -X GET 'localhost:9200/json_file_to_es/_search?filter_path=hits&pretty'
    {
      "hits" : {
        "total" : 10,
        "max_score" : 1.0,
        "hits" : [
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "boabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 2
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "cYabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 5
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "dYabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 9
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "doabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 10
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "coabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 6
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "dIabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 8
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "bYabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 1
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "b4abimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 3
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "cIabimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 4
            }
          },
          {
            "_index" : "json_file_to_es",
            "_type" : "_doc",
            "_id" : "c4abimwBFFtJqSTvn084",
            "_score" : 1.0,
            "_source" : {
              "file_name" : "json_file_to_es",
              "tag_name" : "json_file_to_es",
              "lines" : 7
            }
          }
        ]
      }
    }
    ```
    
      
    

테스트 결과
------

테스트 결과는 다음과 같다.

*   입력용 파일에 로그를 라인 단위로 읽고 json으로 파싱한다.
    
*   파싱한 로그는 Elasticsearch index에 Insert 된다.
    

  

  

* * *

테스트 케이스 : 로그 파일을 읽고 Amazon S3에 저장하기
===================================

테스트 목적
------

td-agent가 다음과 같은 의도대로 동작 하는지 확인한다.

*   파일의 로그를 읽고 Amazon S3 저장하기
    
    *   Amazone S3 저장하기 전, 미리 설정한 경로에 임시저장 여부
        
    *   Amazone S3 저장할 때, 미리 설정한 경로와 파일명 양식에 맞추어 저장여부
        

테스트 과정
------

1.  입력용으로 사용할 로그 파일 생성한다.
    
    ```
    $ touch source.log
    ```
    
      
    파일이 정상적으로 생성 되었는지 확인한다.
    
    ```
    $ ls -l
    total 0
    -rw-r--r--  1 kevin  staff  0  8  9 15:00 source.log
    ```
    
2.  td-agent 파일은 다음과 같이 수정한다.
    
    ```
    $ vim /etc/td-agent/td-agent.conf
    <source>
      @type tail
      path /Users/kevin/dev/fluentd/test/file_to_s3/source/*
      pos_file /Users/kevin/dev/fluentd/test/pos/file_to_s3.pos
      tag file_to_s3.test
      <parse>
        @type none
      </parse>  
      refresh_interval 1s
    </source>
    <match file_to_s3.*>
      @type s3
      aws_key_id ### access key id를 입력
      aws_sec_key ### access secret key를 입력
      s3_bucket ### s3_bucket
      s3_region ### s3_region
      store_as text
      path fluentd-raw-test
      s3_object_key_format %{path}/${tag}_%{index}.log
      <buffer tag>
        @type file
        path /Users/kevin/dev/fluentd/test/file_to_s3/match
        flush_mode interval
        flush_interval 50s
      </buffer>
    </match>
    ```
    
      
    
    tail은 default plugin으로 별도의 plugin 설치가 필요하지 않다.
    
    s3는 테스트 환경(td-agent v3.1.1)에서는 별도의 plugin 설치가 필요하지 않다.
    
    *   source  
        
        *   path : 읽어오고자 하는 로그 파일의 경로를 지정하는 parameter로 wildcard(\*)를 사용하여 디렉터리를 지정할 수도 있다. 편의상 파일명을 지정하지 않고 wildcard를 사용한다.
            
        *   pos\_file : td-agent는 입력용 로그 파일에 접근하여 읽었던 위치를 파일로 저장한다. 그 파일의 경로를 지정하는 parameter이다.
            
        *   parse : 로그 파일 포맷을 의미한다. none은 라인 단위 구문 분석을 의미한다.
            
        *   tag : 이벤트를 구분짓기 위한 tag name을 의미한다.
            
        *   refresh\_interval : td-agent가 수집하려는 파일리스트의 갱신주기를 의미한다.
            
    *   match
        
        *   <match tag명 > : tag명에 대한 이벤트를 출력하겠다는 의미이다.
            
        *   aws\_key\_id : AWS access key id를 입력한다.
            
        *   aws\_sec\_key : AWS secret key를 입력한다.
            
        *   s3\_bucket : bucket 이름을 지정한다.
            
        *   s3\_region : region을 입력한다.
            
        *   store\_as : 저장할 파일 포맷을 지정한다.
            
        *   path : bucket 하위의 저장되는 경로를 지정한다.
            
        *   s3\_object\_key\_format : 파일의 저장하는 양식을 지정한다.
            
    *   buffer
        
        *   <buffer 예약어> : 예약어에 대한 필터를 지정한다.
            
        *   path : 임시 저장 파일의 경로를 지정한다.
            
        *   flush\_mode : flush의 mode를 설정한다.(lazy, interval, immediate)
            
        *   flush\_interval : flush\_mode가 interval일 경우에만 지정하며, flush의 주기를 설정한다.
            
    
      
    
    더 자세한 내용은 아래의 링크를 통하여 확인한다.
    
    *   [Fluentd - Input Plugins : tail](https://docs.fluentd.org/input/tail)
        
    *   [Fluentd - Output Plugins : s3](https://docs.fluentd.org/output/s3)
        
    *   [fluent-plugin-s3 repository](https://github.com/fluent/fluent-plugin-s3)
        
    *   [Fluentd - Configuration : Buffer Section](https://docs.fluentd.org/configuration/buffer-section)
        
    
      
    
      
    이제 td-agent를 실행한다.
    
3.  입력 로그 파일에 로그를 출력한다.
    
    ```
    $ vim source.log
     
    ./source/source.log - Loop seq 1
    ./source/source.log - Loop seq 2
    ./source/source.log - Loop seq 3
     
    ... 중략 ...
    
    ./source/source.log - Loop seq 98
    ./source/source.log - Loop seq 99
    ./source/source.log - Loop seq 100
    ```
    
4.  미리 설정한 임시 저장 경로에 파일이 생성되는지 확인한다.
    
    ```
    $ ls -al
    total 32
    drwxr-xr-x  4 kevin  staff   128  8 12 21:49 .
    drwxr-xr-x  6 kevin  staff   192  8  9 17:04 ..
    -rw-r--r--  1 root   staff  8992  8 12 21:49 buffer.b58feaf4165048e338efa067db3a22de5.log
    -rw-r--r--  1 root   staff    79  8 12 21:49 buffer.b58feaf4165048e338efa067db3a22de5.log.meta
    ```
    
      
    
    입력 파일에 로그 출력후 flush\_interval 시간이 지나기 전에 확인해야한다.
    
      
    
    파일에 접근하여 내용을 확인한다.
    
    ```
    $ cat *.log
    2019-08-12T21:49:23+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 1"}
    2019-08-12T21:49:23+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 2"}
    
    
    ...중략...
    
    2019-08-12T21:49:23+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 98"}
    2019-08-12T21:49:23+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 99"}
    2019-08-12T21:49:23+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 100"}
    ```
    
5.  Amazon S3 페이지에서 파일이 설정한 경로와 파일명 양식으로 저장되었는지 확인한다.
    
    ![](http://wiki.stunitas.com:8443/download/attachments/19498010/S3.png?version=1&modificationDate=1565705351000&api=v2)
    
      
    해당 파일을 다운로드하여 정상적으로 출력되었는 지 확인한다.
    
    ```
    $ cat file_to_s3.test_0.txt
    2019-08-09T19:15:22+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 1"}
    2019-08-09T19:15:22+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 2"}
    
    ... 중략 ...
    
    2019-08-09T19:15:22+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 99"}
    2019-08-09T19:15:22+09:00	file_to_s3.test	{"message":"./source/source.log - Loop seq 100"}
    
    
    ```
    
      
    

테스트 결과
------

테스트 결과는 다음과 같다.

*   입력용 파일에 저장된 로그는 라인 단위로 읽어와 "로그를 수집한 날짜", "이벤트Tag명", "로그"를 파일로 출력하며 형식은 다음과 같다.
    
    ```
    (로그를 수집한 날짜) (이벤트 Tag명) {"message":"(로그)"}
    ```
    
      
    
*   Amazone S3에 저장하기 전, 미리 설정한 경로에 파일을 생성하여 임시 저장하게 할 수 있다. 
    
*   Amazone S3 저장시 미리 설정한 경로와 파일명 양식에 맞추어 저장할 수 있다.
    

  

* * *

참고자료
====

*   [Fluentd - Input Plugins](https://docs.fluentd.org/input)
    
*   [Fluentd - Output Plugins](https://docs.fluentd.org/output)
