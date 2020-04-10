---
title:  "Kinesis Data Firehose - PutRecordBatch 제약조건 확인"

categories:
  - AWS_Kinesis_firehose
tags:
  - AWS_Kinesis_data_stream
  - AWS
  - AWS_Kinesis_firehose

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

2019\. 10. 1 기준 Kinesis Data Firehose(이하 Firehose) 개발자 안내서 나와 있는 쓰기와 관련된 제약조건은 다음과 같다.

Source에 따라 구분한다.

*   Direct PUT
    
    *   1,000레코드/초, 1,000트랜잭션/초, 1MiB/초. (아시아 태평양(서울) 리전 기준)
        
        *   PutRecord - 별도로 표기되지 않음.
            
        *   PutRecordBatch - 호출당 최대 500개의 레코드 또는 호출당 4MiB를 지원 (둘 중 더 작은 크기 지원).
            
*   Kinesis stream
    
    *   위의 제한이 적용되지 않아 Kinesis Data Firehose가 아무런 제한없이 확장/축소 됨.
        

  

이 테스트는 Direct PUT - PutRecordBatch의 제약조건을 벗어날 경우에 firehose 및 boto3가 어떻게 동작하는 지 확인한다.

  

테스트 환경
======

테스트 환경은 다음과 같다.

*   테스트 리전: 서울 리전
    
*   테스트 관련 서비스:
    
    *   Amazon Kinesis Data Firsehose
        
    *   Amazon Elasticsearch Service(이하 Amazon ES)
        
    *   Amazon S3
        

  

테스트 환경 구성
=========

Data Firehose 생성
----------------

테스트용 Data Firehose를 아래와 같은 설정으로 생성하였다.

*   Delivery Stream name :seong-firehose-batch-limit-test
    
*   Delivery stream ARN : 
    
*   Index :seong\_firehose\_batch\_limit\_test
    
*   Type : \_doc
    
*   No index rotation
    
*   Backup S3 bucket : seong-bucket-test
    
*   Delivery Stream buffer conditions for Elasticsearch
    
    *   buffer size : 1 MB
        
    *   buffer interval : 60 seconds
        

  

테스트의 편의를 위하여 buffer size : 1MB, buffer interval : 60 seconds로 설정하였다.

  

Amazon ES 도메인
-------------

테스트용 Amazon ES는 기존에 생성한 Amazone ES를 사용하였다.

*   도메인 명: seong-es-test
    
*   도메인 ARN : 
    
*   Elasticsearch 6.7
    
*   인스턴스 구성
    
    *   인스턴스 유형 : t2.small.elasticsearch(vCPU 1, Memory 2GiB)
        
    *   인스턴스 개수 : 2
        
    *   인스턴스별 일반 EBS(SSD) 10GB 각 1개
        
*   테스트 인덱스 :seong\_firehose\_batch\_limit\_test
    

  

Python 및 Boto3 환경 구성
--------------------

테스트의 편의를 위하여 python과 boto3 라이브러리를 사용하며, 다음과 같은 버전에서 테스트하였다.

*   Python 버전 : 3.7
    
*   boto3 버전 : 1.9.236
    

  

다음과 같이 가상환경을 구설 및 활성화하여 boto3 라이브러리를 설치한다.

```
$ mkdir put_records_batch_limit
$ cd put_records_batch_limit
$ virtualenv --python=python3.7 .venv/
$ source .venv/bin/activate
$ pip install boto3
```

  

테스트
===

테스트는 한 번의 PutRecordBatch 호출할 때 레코드 수와 전송 용량에 따라 4가지 케이스로 나누어 테스트 한다.

*   레코드 수 500개 이하이고, 전송 용량이 4MiB 이하인 경우 ( 레코드수 <= 500 and 전송용량 <= 4MiB)
    
*   레코드 수 500개 초과이고, 전송 용량이 4MiB 이하인 경우 ( 레코드수 > 500 and 전송용량 <= 4MiB)
    
*   레코드 수 500개 이하이고, 전송 용량이 4MiB 초과인 경우 ( 레코드수 <= 500 and 전송용량 > 4MiB)
    
*   레코드 수 500개 초과이고, 전송 용량이 4Mib 초과인 경우 ( 레코드수 > 500 and 전송용량 > 4MiB)
    

  

테스트의 편의를 위하여 다음과 같은 main.py를 사용하고 테스트 케이스 별로 데이터 레코드 파일을 변경하여 테스트 한다.

```
import boto3
import json
import sys

AWS_PROFILE_NAME = ""
DELIVERY_STREAM_NAME = "seong-firehose-batch-limit-test"


def get_firehose_client():
    session = boto3.Session(profile_name=)
    firehose = session.client("firehose")
    return firehose


def batch_record_to_delivery_stream(test_record_list):
    print("Put batch records to Delivery Stream")

    records_list = list()
    for test_data in test_record_list:
        records_list.append(
            {"Data": json.dumps(test_data, ensure_ascii=False)})

    firehose = get_firehose_client()

    response = firehose.put_record_batch(
        DeliveryStreamName=DELIVERY_STREAM_NAME,
        Records=records_list
    )

    print(response)


def read_test_data_file(filename):
    record_list = list()
    with open(filename, "r", encoding='UTF-8') as fileobject:
        lines = fileobject.readlines()
        for line in lines:
            record_list.append(json.loads(line))

    return record_list


def main():
    test_record_list = read_test_data_file("batch_limit_test.log")
    batch_record_to_delivery_stream(test_record_list)


if __name__ == "__main__":
    main()
```

  

* * *

테스트 케이스 : 레코드 수 500개 이하, 전송 용량이 4MiB 이하인 경우
-------------------------------------------

테스트를 위하여 500개 이하의 레코드와 4MiB이하의 파일을 생성한다. 샘플 데이터는 10개 레코드, 용량은 약 5KB 이다.

```
$ ls -al batch_limit_test.log
-rw-r--r--  1 seong  staff  5092 10  1 17:50 batch_limit_test.log

$ cat batch_limit_test.log | wc -l
10
```

  

main.py를 실행하면 데이터 레코드를 Firehose에 전송 하였음을 알 수 있다.

```
$ python3 main.py
Put batch records to Delivery Stream
{'FailedPutCount': 0, 'Encrypted': False, 'RequestResponses': [{'RecordId': 'PGJzE2xGu2l3rbtqIoGZbcX8pppglqEXnCq8Vnkr54qUckUkXoAXFqeKGydhyCDJKlPzX7NXGlpoRvyfnlN1JVjKYs5t11Mx8T4yyqrQYcwuILWj9D1iNsEQjYMUAYYsdAR3jxGD3Wh6Y9h4pbzSAqHzpkOESSN47WjrRc8WRuNdff2UGvfwfiFwjCY6eok/yLGlwwfCKCbq7vqabXTCV2X+O929d9eW'}, {'RecordId': 'TpqiT4Ye2uBUqSVyE8F/lg5DSehMupQ0QQQNdwjhEEo0VXvEGHG1txjHyUU1vGPQGdTcfdyphTz1BlT3LtA9aGUTv/sUs8yuCVI7z8WJIlqe1gTMXIm9wUfD0vWPiQlaZkqUlJBaXoqsByVCPKbh04XJPnr6sYq50OmwR0SS0/bqbHxgAEHIu03iLB5kxo/+YzJWsHgFQgi4pfavl/bVZzJEblEEqUXs'}, {'RecordId': 'j3HuuyQMGnNut+gKvH6QojQPRX5/QwewFpc9A4aC33VnT28LipXBhbHWFlk6uOmmtGEvT/koFZ7MlACW7NU9YubUPvQ5zMhwGUQH29tBd+PwUvU31tDxNSBknkfw1vkwsRExQHGArURQNs4tXDMlCL+GvS4v6WEDPiSAnYOb3kc64maHW3vVJMzbvl1yF+sM0pjFVlcuf2oD5mFBpQVAaG6TxfVJhPBJ'}, {'RecordId': 'tC5R73BXMGDWcQqwrHsjjQF9VFaLYP2hT3KBhjF1WSFh6sKvuo2RXcCl5LxHjIAkiufF4HlQzrMLPGiBh+5sdlDX8NO0NbkJqbTkSjx7y8/BnDXv0HULsiJb69DdaOvUV8b52muzUTvBdXsuMKv/layX0Qvx5cJvxBwx2vFeTzBF8z6T07pj39ihL2U0WVfSmoysEw/TxBFPVN6o4P75BBzOfYnApJZE'}, {'RecordId': 'XyW/djuKA6qngb7B4EPPZAwRlDe9SI1UDyMLNOnW+72GhydUpc33MUhcNQ0W2ClNrzFdl9BtFa0nUK3f3WXFn9bGcfm52BEcEiUTBwcC0p6pIeaQs2TpbPN3yXbzq8o6ai1ETE2TQnGj9lG1Mb7naebkc5IxX7Xb9MsfIXbpLf4Hq5PQij4dKjoMjKYbr753x8otP/LZ668hYHB7Kd+Rgcbgj2VrvnSI'}, {'RecordId': 'gaB3UcIecD9tH7R7rSjk7IAsuZ93jokmSRo9EzBoL1opmOo6BdygCtUW5NTKGonS6datg2aD5TWzjUrhMkc01VH1mjbiLl+yRRq9b6K0Wo2Qv/bCH2A5VHv8PI3LAhSD/nNNsHdtL8I4C5U7X2rc7jJD7dPcTe+CAwWyM5lnyHZ+x2cECuN1JsSuvih6dP3DBVj4gmklUyPky3TTIWdpdxQGOq6WWLjW'}, {'RecordId': 'ow1wcN/e2BtW4ecnKfBEXPuAZWK90oOImdmHB943Fwr7PN4nbjlwmWMvuzVNIjXtKtfoZzBgpetBprm8C4aL2+HmPMx+pJzJRXr97Xo+T9WyqN6zg+/1Vqh+EqU/j3g2fWQUXO9qPmdkJpiUBjNhNyaxp4pMqdx2zYVBOt8N5HuIqyjcryBtcq7gdNLN1ZPcWKIqrPG3vmA+BJyHpEe3UzSzWWk4hdFD'}, {'RecordId': '7ruf+obtfoeMuQmtDawZNUF0ibpEDFqtE2JOW4VCyg0IG6fP8MyFpZ25hsjx+B53xTAvcddnu+ZGJJpQSWiKXKdmA3f2kg+VktMvY27f/SG8LhTG7Zp+Zb9cVtbd/PrmhmqXxdCmpOGpL3WUTRqChK3yrx5mcKG241h+HQTZs3FoOwZggBczE5/cGOEOJBTv+IbziszYs/jGW14JtS/0yP/J4RKh0qg3'}, {'RecordId': 'YwKyiO33CsLXIJyLVF/pekZoetYOrg6fAEdnuCIKkOhjnIuLL62jLfySwqi0mOui52wTmr1wbGloL0BJ4jkJ/zqNhrlFvwJWkntabz6zTJlSo8517nPhVF/iS7waGWY3QbLXqLWCYiz0ZR1Mb/HAOU6vvHRmtHhQacLsLFOWVdvspZrCyKngyVs/1g+YWV1gIS/8GMOY3HzeAmj5zJXum+FC/3mjtmuD'}, {'RecordId': 'TnNpFXAIpNqM4LTYBROdizLSFMY5C9/S2TUFksPAoiaiZXhG2ISr9RRGr/Emztg3QRlEAzqPp2iHOdHKaOPRQ7J2zB7vIe00esNpXRfJ1Twz/HXfo7fTXTvtH3gu5qUjOa/TZqIj5gLS1SxaJTU1wb3bLzwzxLpuQ+jmeBEpiziuUnrI8vJnn2CzeV2y22IVX0kZTzd5dGxmDxt783Syon5CJJ0GLeGu'}], 'ResponseMetadata': {'RequestId': ' ', 'HTTPStatusCode': 200, 'HTTPHeaders': {'x-amzn-requestid': ' ', 'x-amz-id-2': '', 'content-type': 'application/x-amz-json-1.1', 'content-length': '2459', 'date': 'Tue, 01 Oct 2019 09:06:08 GMT'}, 'RetryAttempts': 0}}
```

  

이제 Firehose의 Destination(Amazon Elasticsearch, S3)에 데이터 레코드가 저장되었는지 확인한다.

  

우선 Amazon ES에 확인하면seong\_firehose\_batch\_limit\_test 인덱스에 데이터 레코드가 저장되었다.

```
$ curl -XGET https://search-seong-es-test.es.amazonaws.com/seong_firehose_batch_limit_test/_count
{"count":10,"_shards":{"total":5,"successful":5,"skipped":0,"failed":0}}%
```

  

S3 버킷을 확인하면 파일이 생성되었음을 알 수 있고 해당 파일을 다운로드 한다.

```
$ aws s3 ls s3://seong-bucket-test --recursive
2019-10-01 18:21:20       5082 2019/10/01/09/seong-firehose-batch-limit-test-1-2019-10-01-09-20-18-bb8365b1-4ac9-442a-961d-d1fc07933b43

$ aws s3 cp s3://seong-bucket-test/2019/10/01/09/seong-firehose-batch-limit-test-1-2019-10-01-09-20-18-bb8365b1-4ac9-442a-961d-d1fc07933b43 ./s3_backup_file.log
download: s3://seong-bucket-test/2019/10/01/09/seong-firehose-batch-limit-test-1-2019-10-01-09-20-18-bb8365b1-4ac9-442a-961d-d1fc07933b43 to ./s3_backup_file.log
```

  

다운로드한 파일을 확인하면 S3에도 데이터 레코드가 저장되었음을 알 수 있다.

```
$ cat s3_backup_file.log
```

  

S3 백업용 파일은 줄바꿈 없이 저장 되어 있다.

  

테스트 결과를 정리하면 다음과 같다.

*   500개 이하 이면서 전송용량이 4MiB이하인 데이터 레코드는 PutRecordBatch 호출로 Firehose에 전송된다.
    
*   Firehose는 데이터 레코드를 Amazon es와 S3에 저장하며, S3에 저장된 파일은 레코드간 줄바꿈 없이 저장된다.
    

  

* * *

  

테스트 케이스 : 레코드 수 500개 초과, 전송 용량이 4MiB 이하인 경우
-------------------------------------------

테스트를 위하여 500개 초과의 레코드와 4MiB 이하의 파일을 생성한다. 샘플 데이터는 1000개 레코드, 용량은 약 16KB 이다.

```
... 중략 ...

{"index0": 808}
{"index0": 630}
{"index0": 623}
{"index0": 190}
{"index0": 91}
{"index0": 937}
{"index0": 670}
{"index0": 653}
{"index0": 72}
{"index0": 538}
{"index0": 936}
{"index0": 932}
{"index0": 141}
{"index0": 430}
{"index0": 752}
{"index0": 137}
{"index0": 582}
{"index0": 824}
{"index0": 925}
{"index0": 937}
```

  

```
$ ls -al batch_limit_test.log
-rw-r--r--  1 seong  staff  15897 10  1 18:52 batch_limit_test.log

$ cat batch_limit_test.log | wc -l
1000
```

  

main.py를 실행하면 데이터 레코드는 Firehose에 전송되지 않고 exception이 발생함을 알 수 있다.

```
$ python3 main.py > result.log 2>&1

$ cat result.log
Put batch records to Delivery Stream
Traceback (most recent call last):
  File "main.py", line 49, in <module>
    main()
  File "main.py", line 45, in main
    batch_record_to_delivery_stream(test_record_list)
  File "main.py", line 27, in batch_record_to_delivery_stream
    Records=records_list
  File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/botocore/client.py", line 357, in _api_call
    return self._make_api_call(operation_name, kwargs)
  File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/botocore/client.py", line 661, in _make_api_call
    raise error_class(parsed_response, operation_name)
botocore.exceptions.ClientError: An error occurred (ValidationException) when calling the PutRecordBatch operation: 1 validation error detected: Value '[Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=14 cap=14]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=14 cap=14]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), 

... 중략 ...

Record(data=java.nio.HeapByteBuffer[pos=0 lim=14 cap=14]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=15 cap=15])]' at 'records' failed to satisfy constraint: Member must have length less than or equal to 500
```

  

  

이제 Firehose의 Destination(Amazon Elasticsearch, S3)에 데이터 레코드가 저장되었는지 확인한다.

  

우선 Amazon ES에 확인하면seong\_firehose\_batch\_limit\_test 인덱스에는 어떠한 레코드도 저장되지 않는다는 것을 알 수 있다.

```
$ curl -XGET https://search-seong-es-test.es.amazonaws.com/seong_firehose_batch_limit_test/_count
{"count":0,"_shards":{"total":5,"successful":5,"skipped":0,"failed":0}}
```

  

Amazon es에 seong\_firehose\_batch\_limit\_test 인덱스는 미리 생성해두었다.

  

S3 버킷을 확인하면 파일도 생성되지 않음을 알 수 있다.

```
$ aws s3 ls s3://seong-bucket-test --recursive | wc -l
0
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   500개 초과이면서 전송용량이 4MiB이하인 데이터 레코드는 PutRecordBatch 호출로 Firehose에 전송하면 boto3 라이브러리에서 exception error가 발생한다.
    
*   exception error의 내용은 "Member must have length less than or equal to 500"이다.
    
*   데이터 레코드는 Amazon es, S3 모두에 저장되지 않는다.
    

  

* * *

  

테스트 케이스 : 레코드 수 500개 이하, 전송 용량이 4MiB 초과인 경우
-------------------------------------------

테스트를 위하여 500개 이하의 레코드와 4MiB 초과의 파일을 생성한다. 샘플 데이터는 50개 레코드, 용량은 약 5.3MB 이다.

```
$ ls -al batch_limit_test.log
-rw-r--r--  1 seong  staff  5311688 10  1 19:41 batch_limit_test.log

$ cat batch_limit_test.log | wc -l
50
```

  

main.py를 실행하면 데이터 레코드는 Firehose에 전송되지 않고 exception이 발생함을 알 수 있다.

```
$ python3 main.py > result.log 2>&1

$ cat result.log
Put batch records to Delivery Stream
Traceback (most recent call last):
  File "main.py", line 49, in <module>
    main()
  File "main.py", line 45, in main
    batch_record_to_delivery_stream(test_record_list)
  File "main.py", line 27, in batch_record_to_delivery_stream
    Records=records_list
  File "/Users/seong/dev/collecting_conects_app_data/put_records_batch_limit/.venv/lib/python3.7/site-packages/botocore/client.py", line 357, in _api_call
    return self._make_api_call(operation_name, kwargs)
  File "/Users/seong/dev/collecting_conects_app_data/put_records_batch_limit/.venv/lib/python3.7/site-packages/botocore/client.py", line 661, in _make_api_call
    raise error_class(parsed_response, operation_name)
botocore.errorfactory.InvalidArgumentException: An error occurred (InvalidArgumentException) when calling the PutRecordBatch operation: Records size exceeds 4 MB limit
```

  

  

이제 Firehose의 Destination(Amazon Elasticsearch, S3)에 데이터 레코드가 저장되었는지 확인한다.

  

우선 Amazon ES에 확인하면seong\_firehose\_batch\_limit\_test 인덱스에는 어떠한 레코드도 저장되지 않는다는 것을 알 수 있다.

```
$ curl -XGET https://search-seong-es-test.es.amazonaws.com/seong_firehose_batch_limit_test/_count
{"count":0,"_shards":{"total":5,"successful":5,"skipped":0,"failed":0}}
```

  

Amazon es에 seong\_firehose\_batch\_limit\_test 인덱스는 미리 생성해두었다.

  

S3 버킷을 확인하면 파일도 생성되지 않음을 알 수 있다.

```
$ aws s3 ls s3://seong-bucket-test --recursive | wc -l
0
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   500개 이하이면서 전송용량이 4MiB초과인 데이터 레코드는 PutRecordBatch 호출로 Firehose에 전송하면 boto3 라이브러리에서 exception error가 발생한다.
    
*   exception error의 내용은 "Records size exceeds 4 MB limit" 이다.
    
*   데이터 레코드는 Amazon es, S3 모두에 저장되지 않는다.
    

  

  

* * *

  

테스트 케이스 : 레코드 수 500개 초과, 전송 용량이 4MiB 초과인 경우
-------------------------------------------

테스트를 위하여 500개 초과 레코드와 4MiB 초과하는 파일을 생성한다. 샘플 데이터는 1000개 레코드, 용량은 약 5.3MB 이다.

```
$ ls -al batch_limit_test.log
-rw-r--r--  1 seong  staff  5082104 10  1 20:38 batch_limit_test.log

$ cat batch_limit_test.log | wc -l
1000
```

  

main.py를 실행하면 데이터 레코드는 Firehose에 전송되지 않고 exception이 발생함을 알 수 있다.

```
$ python3 main.py > result.log 2>&1

$ cat result.log
Put batch records to Delivery Stream
Traceback (most recent call last):
  File "main.py", line 49, in <module>
    main()
  File "main.py", line 45, in main
    batch_record_to_delivery_stream(test_record_list)
  File "main.py", line 27, in batch_record_to_delivery_stream
    Records=records_list
  File "/Users/seong/dev/collecting_conects_app_data/put_records_batch_limit/.venv/lib/python3.7/site-packages/botocore/client.py", line 357, in _api_call
    return self._make_api_call(operation_name, kwargs)
  File "/Users/seong/dev/collecting_conects_app_data/put_records_batch_limit/.venv/lib/python3.7/site-packages/botocore/client.py", line 661, in _make_api_call
    raise error_class(parsed_response, operation_name)
botocore.exceptions.ClientError: An error occurred (ValidationException) when calling the PutRecordBatch operation: 1 validation error detected: Value '[Record(data=java.nio.HeapByteBuffer[pos=0 lim=5107 cap=5107]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5060 cap=5060]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5112 cap=5112]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5095 cap=5095]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5095 cap=5095]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5120 cap=5120]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5107 cap=5107]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5076 cap=5076]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5104 cap=5104]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5111 cap=5111]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5058 cap=5058]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5103 cap=5103]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5111 cap=5111]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5047 cap=5047]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5096 cap=5096]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5048 cap=5048]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5102 cap=5102]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5062 cap=5062]), Record(data=java.nio.HeapByteBuffer[pos=0 lim=5047 cap=5047]), 

... 중략 ...
```

  

  

이제 Firehose의 Destination(Amazon Elasticsearch, S3)에 데이터 레코드가 저장되었는지 확인한다.

  

우선 Amazon ES에 확인하면seong\_firehose\_batch\_limit\_test 인덱스에는 어떠한 레코드도 저장되지 않는다는 것을 알 수 있다.

```
$ curl -XGET https://search-seong-es-test.es.amazonaws.com/seong_firehose_batch_limit_test/_count
{"count":0,"_shards":{"total":5,"successful":5,"skipped":0,"failed":0}}
```

  

Amazon es에 seong\_firehose\_batch\_limit\_test 인덱스는 미리 생성해두었다.

  

S3 버킷을 확인하면 파일도 생성되지 않음을 알 수 있다.

```
$ aws s3 ls s3://seong-bucket-test --recursive | wc -l
0
```

  

  

테스트 결과를 정리하면 다음과 같다.

*   500개 초과이면서 전송용량이 4MiB 초과인 데이터 레코드는 PutRecordBatch 호출로 Firehose에 전송하면 boto3 라이브러리에서 exception error가 발생한다.
    
*   exception error의 내용은 "Member must have length less than or equal to 500" 이며, 데이터 레코드수에 관한 exception이다.
    
*   데이터 레코드는 Amazon es, S3 모두에 저장되지 않는다.
    

  

테스트 결과
======

테스트 결과는 다음과 같이 정리할 수 있다.

*   Firehose는 제약조건 내의 PutRecordBatch 호출 (500개 이하 레코드, 4MiB이하 전송용량)에 대하여 데이터 레코드를 es와 s3에 전송함을 알 수 있었다.
    
*   Firehose는 제약조건을 벗어난 PutRecordBatch 호출 (500개 초과 레코드 혹은 4MiB초과 전송요량)에 대하여 데이터 레코드를 es, s3에 어느 곳에도 전송하지 않는다.
    
    *   boto3에서 exception error가 발생하며 "레코드 개수"와 "전송용량"중 "레코드 개수"를 먼저 확인한다.
        
    *   데이터 레코드의 일부라도 전송되지 않는다. (All or Nothing)
        

  

  

참고자료
====

*   Kinesis Data Firehose에서 Amazon Elasticsearch와 S3 데이터 전달(블로그 내 문서)
