---
title:  "Kinesis Data Firehose에서 Amazon Elasticsearch와 S3 데이터 전달하기"
excerpt: "Amazon Kinesis Data Firehose - Delivery Stream의 destination을 Amazon Elasticsearch Service domain으로 지정하고 S3 backup 설정을 하여 Firehose로 전달된 데이터가 Amazon Elasticsaerch와 S3로 저장되는지 확인한다."

categories:
  - AWS_Kinesis_firehose
tags:
  - AWS_Kinesis_firehose
  - AWS_s3
  - Elasticsearch
---

테스트 목적
======

Amazon Kinesis Data Firehose - Delivery Stream의 destination을 Amazon Elasticsearch Service domain으로 지정하고 S3 backup 설정을 하여 Firehose로 전달된 데이터가 Amazon Elasticsaerch와 S3로 저장되는지 확인한다.

테스트 환경
======

*   테스트 리전: 서울 리전
    
*   테스트 관련 서비스:
    
    *   Amazon Kinesis Data Firsehose
        
    *   Amazon Elasticsearch Service(이하 Amazon ES)
        
    *   Amazon S3
        

  

```
                             +----------------------+
  +---------+                |  Event-1 - Stream-1  |                 +--------+
  | Sources |--------------->|         ...          |---------------->| AWS S3 |
  +---------+ data records   |  Event-N - Stream-N  |        backup   +--------+
                             +----------------------+                   Bucket
                                 Delivery Streams
                                  (Event Stream)
                                        |                             +---------------+
                                        |                             | Elasticsearch |
                                        +---------------------------->| Cluster       |<--->[Kibana]
                                                            indexing  +---------------+      dashboard

```

  

* * *

테스트 환경 구성
=========

Amazon ES 도메인
-------------

*   도메인 명: 
    
*   Elasticsearch 6.5.4
    
*   인스턴스 구성
    
    *   인스턴스 유형 : t2.small.elasticsearch (vCPU 1, Memory 2GiB)
        
    *   인스턴스 개수 : 2
        
    *   인스턴스별 일반 EBS(SSD) 10GB 각 1개
        
*   테스트 인덱스 : interest\_service\_click2
    

Kinesis Data Firehose Delivery Stream 생성
----------------------------------------

테스트용 Delivery Stream을 아래와 같은 설정으로 생성하였다.

*   Delivery Stream name : 
    
*   Index : interest\_service\_click2
    
*   Type : isc
    
*   No index rotation
    
*   Backup S3 bucket : 
    
*   Delivery Stream buffer conditions for Elasticsearch
    
    *   buffer size : 5 MB
        
    *   buffer interval : 60 seconds
        
*   IAM role(역할)
    
    *   Amazon ES 도메인 ARN - 
        
    *   시스템팀에 생성 요청.
        

  

Type 설정에서 \_doc 를 입력하면 Elasticsearch index는 \_ 로 시작할 수 없다 라는 에러 메시지가 발생한다.  
\_doc는 Elasticsearch에서 index 생성시 따로 type을 지정하지 않으면 만들어지는 것이다.

위 에러발생을 회피하기 위해 기존에 만들었던 interest\_service\_click index를 사용하지 않고 신규 index를 생성하여 테스트 하는 것으로 테스트 방법을 변경하였다.  
명시적으로 Type명도 isc라는 것으로 설정하였다.

Delivery Stream의 buffer interval을 최소값인 60초로 한 것은 Amazon ES와 S3로 데이터가 저장되는 것을 가능한 빠르게 확인하기 위하여 설정한 것이다.

  

테스트 : Delivery Stream 데이터 전송 및 저장 확인
====================================

Delivery Stream 전송 테스트 및 확인
---------------------------

*   Data Firehose의 'Test with demo data' 기능으로 테스트 데이터를 delivery stream에 넣고 구성데로 전달되는지 확인하였다.
    
*   Amazon ES 테스트 도메인에 interest\_service\_click2 인덱스가 생성되고 search api로 데이터가 조회되는 것을 확인하였다.
    
    ```
    $ curl -XGET '{es_domain}/interest_service_click2/_search'
    
    ```
    
      
    
*   Amazon S3의 test 버킷에 2019/04/30/06/ 경로 아래로 테스트 데이터들이 저장된 것을 확인하였다.
    
    ```
    test-1-2019-04-30-06-26-00-9c948a08-f91a-4ba2-922d-408623ea0ddf
    test-1-2019-04-30-06-27-00-aca38977-b723-47df-b557-488e9d583f93
    test-1-2019-04-30-06-28-06-e0b3d645-e27d-451e-b812-33013a5aa57a
    
    ```
    
      
    

Firehose API 사용하여 Delivery Stream에 테스트 데이터 전송 및 저장 확인
-----------------------------------------------------

커스텀 데이터를 Firehose Delivery Stream에 전송하여 Amazon ES와 S3 저장되는지 테스트한다.  
아래와 같은 데이터를 Firehose Delivery Stream에 전송한다.

```
{
    "user_id": "Aster-Kotlin-Sapphire-564",
    "app_version": "v1.5.16(90)",
    "device_id": "a03cd3d6-0b14-46e1-a2c8-18b1c86cf738",
    "device_manufacturer": "LG",
    "device_name": "LG G7 ThinQ",
    "device_model": "LM-G710N",
    "device_os": "Android",
    "device_os_number": "8.0",
    "event": "interest_service_click",
    "interest_id": 1201,
    "index": 1,
    "interest_name": "1",
    "interest_service_id": null,
    "interest_service_type": "1",
    "interest_service_name": "1",
    "timestamp": "2019-04-30T07:30:00Z"
}

```

  
aws config, credential 설정 관련된 부분은 [AWS CLI 구성](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-configure.html) 문서를 참고하도록 한다.

  
파이썬 가상환경을 구성하고 boto3 라이브러리를 설치한다.

```
$ python3 -m venv ./boto3_venv
$ source ./boto3_venv/bin/activate
$ pip3 install boto3

```

  
아래와 같은 파이썬 코드로 Data Firehose의 Delivery Stream에 데이터를 전송하여 테스트 하였다.

```
import boto3
import json
import sys



def get_firehose_client():
    # Any clients created from this session will use credentials
    # from the [test_profile] section of ~/.aws/credentials
    # with test_profile profile.
    session = boto3.Session(profile_name="test_profile")
    firehose = session.client("firehose")
    return firehose


# Test list up Delivery Streams
def list_delivery_streams():
    firehose = get_firehose_client()

    print("List Delivery Streams")
    response = firehose.list_delivery_streams(DeliveryStreamType="DirectPut")
    print(response["DeliveryStreamNames"])


# Test Record send to Delivery Stream
def put_record_to_delivery_stream():
    print("Put record to Delivery Stream")

    test_data = {
        "user_id": "Aster-Kotlin-Sapphire-564",
        "app_version": "v1.5.16(90)",
        "device_id": "a03cd3d6-0b14-46e1-a2c8-18b1c86cf738",
        "device_manufacturer": "LG",
        "device_name": "LG G7 ThinQ",
        "device_model": "LM-G710N",
        "device_os": "Android",
        "device_os_number": "8.0",
        "event": "interest_service_click",
        "interest_id": 1201,
        "index": 1,
        "interest_name": "1",
        "interest_service_id": None,
        "interest_service_type": "1",
        "interest_service_name": "1",
        "timestamp": "2019-04-30T07:30:00Z"
    }

    firehose = get_firehose_client()

    response = firehose.put_record(
        DeliveryStreamName="test",
        Record={"Data": json.dumps(test_data, ensure_ascii=False)}
    )

    print(response)


def batch_record_to_delivery_stream():
    print("Put batch records to Delivery Stream")

    test_data_list = [
        {
            "user_id": "Aster-Kotlin-Sapphire-564",
            "app_version": "v1.5.16(90)",
            "device_id": "a03cd3d6-0b14-46e1-a2c8-18b1c86cf738",
            "device_manufacturer": "LG", "device_name": "LG G7 ThinQ", "device_model": "LM-G710N", "device_os": "Android", "device_os_number": "8.0",
            "event": "interest_service_click",
            "interest_id": 1101,
            "index": 1,
            "interest_name": "2", "interest_service_id": None, "interest_service_type": "4","interest_service_name": "4",
            "timestamp": "2019-05-03T00:20:00Z"
        },
        {
            "user_id": "Aster-Kotlin-Sapphire-564",
            "app_version": "v1.5.16(90)",
            "device_id": "a03cd3d6-0b14-46e1-a2c8-18b1c86cf738",
            "device_manufacturer": "LG", "device_name": "LG G7 ThinQ", "device_model": "LM-G710N", "device_os": "Android", "device_os_number": "8.0",
            "event": "interest_service_click",
            "interest_id": 1301,
            "index": 1,
            "interest_name": "55", "interest_service_id": None, "interest_service_type": "5","interest_service_name": "7",
            "timestamp": "2019-05-03T00:50:00Z"
        },
        {
            "user_id": "Aster-Kotlin-Sapphire-564",
            "app_version": "v1.5.16(90)",
            "device_id": "a03cd3d6-0b14-46e1-a2c8-18b1c86cf738",
            "device_manufacturer": "LG", "device_name": "LG G7 ThinQ", "device_model": "LM-G710N", "device_os": "Android", "device_os_number": "8.0",
            "event": "interest_service_click",
            "interest_id": 1201,
            "index": 1,
            "interest_name": "1", "interest_service_id": None, "interest_service_type": "1","interest_service_name": "1",
            "timestamp": "2019-05-03T01:15:00Z"
        }
    ]

    # Delivery Stream에 batch로 넣을 데이터 구성
    records_list = list()
    for test_data in test_data_list:
        records_list.append({"Data": json.dumps(test_data, ensure_ascii=False)})

    firehose = get_firehose_client()

    response = firehose.put_record_batch(
        DeliveryStreamName="test",
        Records=records_list
    )

    print(response)


def main():
    arg = sys.argv[1:]
    if "list" in arg:
        list_delivery_streams()
    elif "put" in arg:
        put_record_to_delivery_stream()
    elif "batch" in arg:
        batch_record_to_delivery_stream()
    else:
        print("Unsupported test operation")
        print("Supported operations : ['list', 'put', 'batch']")



if __name__ == "__main__":
    main()

```

  
put\_record() 메소드를 사용한 단일 데이터 전달과 put\_record\_batch() 메소드를 사용한 여러개의 데이터 전달에 대하여 동작을 테스트하였다.

  

* * *

테스트 결과
======

*   Kinesis Data Firehose의 Delivery Stream 구성에서 destination을 Amazon ES, backup all data를 S3로 설정한 구성이 예상대로 데이터를 전달받아 저장하는 것을 확인하였다.
    
*   테스트 데이터의 형상은 Delivery Stream 동작테스트를 위해 전송했던 demo data와 다른 것이다.
    
    *   특별히 mapping 정보를 변경하지 않고 테스트 데이터를 Delivery Stream 전송하면 demo data에 의해 생성되었던 ics type의 mapping정보에 없던 새로운 필드가 추가되어 데이터가 저장되는 것이 확인되었다.
        
*   Delivery Stream의 buffer interval 설정에 따른 데이터 전달 방식을 확인하였다. record put이 성공적으로 되어도 바로 Amazon ES나 S3로 데이터가 전달되지 않고 지연시간이 발생할 수 있음을 확인하였다.
 

* * *

참고자료
====

*   [https://docs.aws.amazon.com/firehose/latest/dev/basic-create.html](https://docs.aws.amazon.com/firehose/latest/dev/basic-create.html)
    
*   [https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html#es-index-rotation](https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html#es-index-rotation)
    
*   [https://docs.aws.amazon.com/ko\_kr/firehose/latest/dev/controlling-access.html](https://docs.aws.amazon.com/ko_kr/firehose/latest/dev/controlling-access.html)
    
*   [https://docs.aws.amazon.com/ko\_kr/firehose/latest/dev/test-drive-firehose.html#test-drive-destination-elasticsearch](https://docs.aws.amazon.com/ko_kr/firehose/latest/dev/test-drive-firehose.html#test-drive-destination-elasticsearch)
    
*   [https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/firehose.html](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/firehose.html)
    
*   [http://blog.bhargavnunna.com/index.php/2017/10/11/data-analysis-on-aws-part-1-1/](http://blog.bhargavnunna.com/index.php/2017/10/11/data-analysis-on-aws-part-1-1/)
    
*   [https://aws.amazon.com/ko/elasticsearch-service/pricing/](https://aws.amazon.com/ko/elasticsearch-service/pricing/)
