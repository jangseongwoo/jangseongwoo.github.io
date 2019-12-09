/\*<!\[CDATA\[\*/ div.rbtoc1575889350967 {padding: 0px;} div.rbtoc1575889350967 ul {list-style: disc;margin-left: 0px;} div.rbtoc1575889350967 li {margin-left: 0px;padding-left: 0px;} /\*\]\]>\*/

*   [목적](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-목적)
*   [테스트 환경](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-테스트환경)
    *   [로컬 환경](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-로컬환경)
    *   [AWS 테스트 리전, 관련 서비스, 흐름](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-AWS테스트리전,관련서비스,흐름)
    *   [AWS Elasticsearch 환경](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-AWSElasticsearch환경)
    *   [AWS Kinesis Firehose 환경](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-AWSKinesisFirehose환경)
*   [Fluentd에서 AWS Kinesis firehose로 데이터 보내기](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-Fluentd에서AWSKinesisfirehose로데이터보내기)
    *   [데이터 수집 플랫폼 테스트 환경 구축](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-데이터수집플랫폼테스트환경구축)
    *   [Elasticsearch에 Template 설정](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-Elasticsearch에Template설정)
    *   [Fluentd의 AWS Kinesis Data stream 플러그인 설치하기](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-Fluentd의AWSKinesisDatastream플러그인설치하기)
    *   [Fluentd의 설정 변경 및 실행](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-Fluentd의설정변경및실행)
    *   [Data gererator를 만들고 실행하기](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-Datagererator를만들고실행하기)
    *   [데이터 입력이 제대로 됬는지 확인](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-데이터입력이제대로됬는지확인)
*   [테스트 결과](#Fluentd로데이터수집해AWSKinesisfirehose로보내기-테스트결과)

목적
==

* * *

이 문서는 커넥츠 15초 동영상 데이터 수집 플랫폼 POC의 Fluentd에서 AWS Kinesis firehose로 데이터 보내는 테스트의 과정과 결과를 기록하기 위해 작성하였다.

Elasticsearch, Fluentd, AWS Kinesis firehose에 대한 기초 지식에 대한 것은 이미 알고 있다는 가정하에 문서 작성을 한다. 모르는 경우 기술전략실안에 있는 위키 문서들을 참고하도록 한다.

테스트 환경
======

* * *

테스트 환경은 다음과 같다.

로컬 환경
-----

*   Python 3.7.4
    
*   Fluentd 1.7.1
    
*   Ruby 2.4.0
    
*   MacOS Catalina
    

AWS 테스트 리전, 관련 서비스, 흐름
----------------------

*   테스트 리전: 서울 리전
    
*   테스트 관련 서비스:  
    
    *   Amazon Kinesis Data Firehose
        
    *   Amazon Elasticsearch Service(이하 Amazon ES)
        
    *   Amazon S3
        

  

```
                                                  Kinesis Data Firehose
                                                 +----------------------+
  +---------+           +--------+               |  Event-1 - Stream-1  |                 +--------+
  |  data   |---------->|Fluentd |-------------->|         ...          |---------------->| AWS S3 |
  +---------+           +--------+ data records  |  Event-N - Stream-N  |        backup   +--------+
                                                 +----------------------+                   Bucket
                                                     Delivery Streams
                                                      (Event Stream)
                                                            |                             +---------------+
                                                            |                             | Elasticsearch |
                                                            +---------------------------->| Cluster       |<--->[Kibana]
                                                                                indexing  +---------------+      dashboard
```

AWS Elasticsearch 환경
--------------------

*   도메인 명: conects-data-es-test
    
*   Elasticsearch 7.1
    
*   인스턴스 구성
    
    *   인스턴스 유형 : t2.small.elasticsearch (vCPU 1, Memory 2GiB)
        
    *   인스턴스 개수 : 1
        
    *   인스턴스별 일반 EBS(SSD) 10GB 각 1개
        
*   테스트 인덱스 : conect-data-test
    

AWS Kinesis Firehose 환경
-----------------------

*   Input: AWS Kinesis Data stream
    
*   Output: AWS Elasticsearch
    
*   Index rotation 적용
    

Fluentd에서 AWS Kinesis firehose로 데이터 보내기
=======================================

* * *

데이터 수집 플랫폼 테스트 환경 구축
--------------------

테스트를 위해 먼저 AWS Kinesis Firehose를 생성한다. 

생성시 위에 서술한 테스트 환경에 해당하는 스펙과 설정으로 생성한다. 생성 시 유의 사항은 다음과 같다. Index rotation 기능을 활성화한 이유는 커넥츠 15초 데이터 수집 플랫폼에서 해당 기능을 이용하기 때문이다.

*   AWS Kinesis Firehose의 설정 중 Index rotation의 시간을 Hour으로 설정한다.
    

위에 설명한 AWS 자원은 생성했다는 가정하에 POC는 다음과 같은 순서로 테스트를 진행한다.

1.  Elasticsearch에 template을 설정한다.
    
2.  Fleuntd의 설정을 변경해 특정 디렉토리의 로그를 Watch하고 Output을 AWS Kinesis firehose으로 설정한다.
    
3.  정상적으로 데이터가 Fluentd에서 Firehose로 입력되었는 지 확인한다.
    
4.  정상적으로 데이터가 Firehose에서 Elasticsearch로 입력되었는 지 확인한다.
    

Elasticsearch에 Template 설정
--------------------------

Elasticsearch에 tempalte을 설정하기 위해 Kibana Dev tools에 아래와 같은 명령어를 실행한다.

```
PUT _template/conect-template-test
{
    "index_patterns": [
        "conect-data-test-*"
    ],
    "settings": {
        "number_of_shards": 1
    },
    "aliases": {
        "conect-data": {}
    },
    "mappings": {
            "_source": {
                "enabled": true
            },
            "properties": {
                "board_id": {
                    "type": "long"
                },
                "playtime": {
                    "type": "long"
                },
                "timestamp": {
                    "type": "date"
                },
                "user_id": {
                    "type": "long"
                },
                "interest": {
                    "type": "keyword"
                }
        }
    }
}
```

명령어 실행 후 아래와 같은 메시지가 나온다면 성공적으로 동작한 것이다. 

```
{
  "acknowledged" : true
}
```

Fluentd의 AWS Kinesis Data stream 플러그인 설치하기
------------------------------------------

Fluentd의 많은 플러그인 중 AWS Kinesis를 위한 Output plugin이 있다. 자세한 내용은 [aws-fluent-plugin-kinesis 문서](https://github.com/awslabs/aws-fluent-plugin-kinesis)를 참고한다.

AWS Kinesis output plugin 설치 명령은 다음과 같다.

```
$ gem install fluent-plugin-kinesis
```

Fluentd의 설정 변경 및 실행
-------------------

다음과 같은 디렉토리 구조를 생성한다. 해당 구조로 프로젝트 디렉토리를 구성한 이후 다음 내용을 진행한다.

```
Project/pos/
Project/pos/pos_file.pos
Project/source/{log_file.log}
Project/kinesis_test.config
```

kinesis\_test.config을 생성하고 다음과 같이 내용을 입력한다. 내용 중 Path, Pos\_file에 대한 설정은 각자 환경에 맞게 구성한다.

```
<source>
  @type tail
  path /Users/st/test/conect_data_poc/source/*.log
  pos_file /Users/st/test/conect_data_poc/pos/pos_file.pos
  tag kinesis.test
  <parse>
    @type json
  </parse>
  refresh_interval 5s
</source>


<match kinesis.*>
  @type kinesis_firehose
  region ap-northeast-2
  delivery_stream_name test-fluentd-firehose
  <buffer tag>
    flush_mode interval
    flush_interval 1s
  </buffer>
</match>
```

Fluentd를 실행하기 위해 Project 디렉토리에서 다음과 같은 명령을 실행한다.

```
$ fluentd -c kinesis_test.config -o fleuntd.log
```

새로운 터미널을 열고 로그 파일을 보기 위해 다음과 같은 명령을 실행한다.

```
$ tail -f fleuntd.log
```

로그 파일을 통해 Fluentd가 정상적으로 실행되었다는 것을 확인한다.

  

Data gererator를 만들고 실행하기
------------------------

다음과 같은 데이터 형식으로 Data generator를 만들면 된다. 

```
board_id : long
playtime : long
timestamp : date형
user_id : long
interest: long
```

Data generator를 만들기 위해 data\_generator.py를 생성하고 다음과 같이 내용을 입력한다. 

```
from datetime import datetime
import string
import time
from multiprocessing import Pool
from random import *
import random
from datetime import timedelta, datetime
import json


def random_date(start, end):
    """
    This function will return a random datetime between two datetime 
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)


def make_datetime_now():
    d1 = datetime.strptime('1/1/2019 1:30 PM', '%m/%d/%Y %I:%M %p')
    d2 = datetime.strptime('12/29/2019 4:50 AM', '%m/%d/%Y %I:%M %p')
    
    d3 = random_date(d1, d2)
    d3 = str(d3)

    random_date_string = d3[0:10] + 'T' +d3[11:]+'Z'

    return random_date_string


def make_random_number(start, end):
    random_number = randint(start, end)
    
    return random_number


def make_datum():
    board_id = make_random_number(0, 1000000)
    playtime = make_random_number(0, 15)
    user_id = make_random_number(0, 1000000)
    timestamp = make_datetime_now()
    interest = "test_first"

    datum = {
        "board_id" : board_id,
        "playtime" : playtime,
        "user_id" : user_id, 
        "timestamp" : timestamp,
        "interest" : "test_fluentd_firehose"
    }

    return datum


def make_datum_to_json(datum):
    return json.dumps(datum)


def write_datum_json_to_file(datum, file_name):
    with open(file_name, 'a') as file_object:
        file_object.write(datum)
        file_object.write("\n")


def main():

    for j in range(0, 100):
        for i in range(0, 100):
            datum = make_datum()
            
            print(datum)

            datum_json = make_datum_to_json(datum)
            write_datum_json_to_file(datum_json, "source/test_fluentd_firehose.log")
        time.sleep(1)


if __name__ == "__main__":
    main()
```

다음과 같이 명령어를 입력해 data\_generator.py을 실행한다.  실행 시 data\_generator.py는 10000개의 데이터를 생성하고 파일로 기록한다.

```
$ python data_generator.py > firehose.log
```

미리 설정해둔 fleuntd.log에서 다음과 같은 메시지를 확인한다.

```
2019-11-14 21:07:00 +0900 [info]: #0 following tail of /Users/st/test/conect_data_poc/source/test_fluentd_firehose.log
```

데이터 입력이 제대로 됬는지 확인
------------------

데이터 입력이 제대로 되었는 지 확인하기 위해 Elasticsearch, S3를 확인한다.

먼저 S3를 확인한다. Firehose 생성 시 버킷을 sw-test123으로 지정했으니 해당 버킷의 다음 경로를 확인한다. 경로는 Firehose의 s3 데이터 생성 규칙에 따라 생성되며 모를 경우 AWS Firehose [공식문서](https://docs.aws.amazon.com/ko_kr/firehose/latest/dev/s3-prefixes.html)를 참고하도록 한다. 

*   sw-test123/2019/11/18/11/test-fluentd-firehose-1-2019-11-18-11-31-41-51ca2829-cd74-401a-97b3-1a0e771487ea
    
*   sw-test123/2019/11/18/11/test-fluentd-firehose-1-2019-11-18-11-32-42-e92a1013-5683-4021-8b4f-5a54714af860
    

위의 두개의 파일을 확인하면 정확히 10000개의 레코드가 입력된것을 확인할 수 있다. 

데이터 입력이 제대로 되었는 지 확인하기 위해 다음으로 Elasticsearch를 확인한다.

확인을 위해 Kibana Dev tools에서 아래와 같은 쿼리를 입력하고 결과를 확인한다.

```
GET _search/
{
  "query": {
    "match": {"interest":"test_fluentd_firehose"}
  }
}

```

  

```
{
  "took" : 16,
  "timed_out" : false,
  "_shards" : {
    "total" : 22,
    "successful" : 22,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10000,
      "relation" : "eq"
    },
    "max_score" : 0.99693555,
    "hits" : [
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629703967127024877424999399426.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 922281,
          "playtime" : 13,
          "user_id" : 48951,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-02-19T23:08:10Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629705176052844492054174105602.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 919679,
          "playtime" : 4,
          "user_id" : 515347,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-12-26T08:25:05Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629706384978664106683348811778.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 484020,
          "playtime" : 14,
          "user_id" : 475076,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-10-06T15:58:35Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629707593904483721312523517954.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 476641,
          "playtime" : 1,
          "user_id" : 883424,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-05-14T20:46:58Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629708802830303335941698224130.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 967380,
          "playtime" : 5,
          "user_id" : 642448,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-03-18T11:11:58Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629710011756122950570872930306.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 261627,
          "playtime" : 1,
          "user_id" : 242466,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-07-27T03:16:14Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629711220681942565200047636482.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 486000,
          "playtime" : 6,
          "user_id" : 390459,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-06-22T22:54:43Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629712429607762179829222342658.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 449380,
          "playtime" : 12,
          "user_id" : 635895,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-12-14T21:01:22Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629713638533581794458397048834.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 380671,
          "playtime" : 8,
          "user_id" : 964548,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-10-16T08:25:32Z"
        }
      },
      {
        "_index" : "conect-data-test-2019-11-18-11",
        "_type" : "_doc",
        "_id" : "49601506511312770511672440629714847459401409087571755010.0",
        "_score" : 0.99693555,
        "_source" : {
          "board_id" : 497368,
          "playtime" : 7,
          "user_id" : 222811,
          "interest" : "test_fluentd_firehose",
          "timestamp" : "2019-08-18T04:00:50Z"
        }
      }
    ]
  }
}


```

결과 중 total의 value의 값이 10000인 것을 통해 정확히 10000개의 Documents가 입력되었음을 알 수 있다. 

테스트 결과
======

* * *

테스트 결과 Fluentd에서 Firehose로 데이터가 정상적으로 입력되며 Firehose에서 Elasticsearch, S3로 데이터가 정상적으로 입력됨을 확인할 수 있다.
