---
title:  "Fluentd로 데이터 수집해 AWS Kinesis Data stream으로 보내기"
excerpt: "이 문서는 AWS Kinesis에 대한 학습 중 Fluentd와 AWS Kinesis Data stream을 연동 하여 데이터를 처리하는 방법에 대해 테스트하고 공유하기 위해 작성했다."

categories:
  - Fluentd
tags:
  - Fluentd
  - AWS_Kinesis_data_stream
  - AWS

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 작성의 목적
=========

* * *

이 문서는 AWS Kinesis에 대한 학습 중 Fluentd와 AWS Kinesis Data stream을 연동 하여 데이터를 처리하는 방법에 대해 테스트하고 공유하기 위해 작성했다.

Fluentd에 대한 기초적인 지식 및 설치에 대한 것은 알고 있다는 것으로 가정해 문서를 작성했다. 해당 부분을 모르는 경우 Fluentd 기초 문서를 참고한다.

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
    
    *   Amazon Kinesis Data Stream
        

  

```
                                                  
                           Kinesis Stream        
  +---------+                +--------+          
  | Sources |--------------->| Shard  |
  +---------+ data records   +--------+          
                             Data Stream
                                        
                                        
                                        
                                        
                                        
                                        
```

AWS Kinesis Data stream 환경
--------------------------

테스트용 Data Stream을 아래와 같은 설정으로 생성하였다.

*   Kinesis Steram name : test-seongwoo-data-stream
    
*   Shard
    
    *   샤드 수 : 1
        
    *   쓰기 : 1 MB/초, 1000 레코드/초
        
    *   읽기 : 2 MB/초
        

Fluentd로 데이터 수집해 AWS Kinesis Data stream으로 보내기
==============================================

* * *

테스트는 다음과 같은 순서로 진행된다.  

1.  Fluentd의 AWS Kinesis Data stream Output plugin을 설치한다.
    
2.  Fluentd Config 파일 변경한다.
    
3.  Fluentd를 실행하고 Watch하고 있는 디렉토리에 로그파일을 기록한다.
    
4.  로그가 정상적으로 AWS Kinesis Data stream에 입력됬는 지 확인한다.
    

테스트는 다음과 같은 디렉토리 구조를 기준으로 진행하였다. 해당 구조로 프로젝트 디렉토리를 구성한 이후 다음 내용을 진행한다.

```
Project/pos/
Project/pos/pos_file.pos
Project/source/{log_file.log}
Project/kinesis_test.config
```

Fluentd의 AWS Kinesis Data stream 플러그인 설치하기
------------------------------------------

Fluentd의 많은 플러그인 중 AWS Kinesis Data stream을 위한 Output plugin이 있다. 자세한 내용은 [aws-fluent-plugin-kinesis 문서](https://github.com/awslabs/aws-fluent-plugin-kinesis)를 참고한다.

AWS Kinesis Data stream output plugin 설치 명령은 다음과 같다.

```
$ gem install fluent-plugin-kinesis
```

Fluentd의 Config 파일 변경하기
-----------------------

소스 로그를 수집해 AWS Kinesis Data stream으로 로그파일을 보내기 위해서는 Fluentd의 config 파일을 변경해 Input과 Output에 대해 설정해야 한다.

따라서, kinesis\_test.config을 다음과 같이 수정한다. 내용 중 {project\_folder\_path}은 프로젝트 디렉토리의 절대 경로를 입력하면 된다.

```
<source>
  @type tail
  path {project_folder_path}/source/*.log
  pos_file {project_folder_path}/pos/pos_file.pos
  tag kinesis.test
  <parse>
    @type none
  </parse>
</source>
<match kinesis.*>
  @type kinesis_streams
  region ap-northeast-2
  stream_name test-seongwoo-data-stream
</match>
```

Fluentd 실행하기
------------

Fluentd를 실행하기 위해 Project 디렉토리에서 다음과 같은 명령을 실행한다.

```
$ fluentd -c kinesis_test.config -o fleuntd.log
```

새로운 터미널을 열고 로그 파일을 보기 위해 다음과 같은 명령을 실행한다.

```
$ tail -f fleuntd.log
```

로그 파일을 통해 Fluentd가 정상적으로 실행되었다는 것을 확인한다.

Fluentd가 Watch하고 있는 디렉토리에 로그파일 기록하기
-----------------------------------

Fluentd가 watch하는 디렉토리에 로그파일 기록하기 위해 다음과 같은 명령어를 실행한다. 프로젝트 디렉토리 아래의 source 디렉토리에서 입력한다.

```
$ echo "test" > test1.log
```

로그가 정상적으로 기록되고 Fluentd가 의도한대로 동작하고 있다면 Fluentd 로그파일에 다음과 같은 로그 메시지가 발생한다.

```
2019-11-12 19:31:56 +0900 [info]: #0 following tail of /Users/st/test/fluentd_kinesis/source/test1.log
```

AWS Kinesis Data stream에 정상적으로 로그가 입력되었는 지 확인하기
-----------------------------------------------

아래 방법은 AWS Kinesis Data stream에 AWS Kinesis firehose가 연동되어 특정 S3 버킷으로 데이터가 저장된 설정하에 확인할 수 있는 방법이다. 
만약에 AWS Kinesis firehose를 설정하지 않았다면 AWS Kinesis Data stream 모니터링 콘솔 화면에서 생성된 샤드에 데이터 입력이 되었는 지 확인하면 된다. 또는 Cloudwatch를 이용해 확인이 가능하며 해당 방법은 이 문서에서 기술하지 않는다. 

AWS Kinesis Firehose는 S3에 로그파일을 기록한다. AWS Kinesis Data stream에 정상적으로 로그가 입력되었는 지 확인하기 위해 AWS Kinesis Firehose에서 설정한 S3 버킷의 데이터를 확인한다. 로그파일의 경로는 해당 버킷 아래에 년, 월, 일, 시간으로 구분되어져 있다.
테스트에선 다음과 같은 S3 경로에 로그파일이 기록되었다.

*   [https://{AWS_DOMAIN_URL}/2019/11/12/10/test-seongwoo-firehose-2-2019-11-12-10-33-02-739b1c9d-cf07-4086-a1dd-bab0e60cd4cd](https://{AWS_DOMAIN_URL}/2019/11/12/10/test-seongwoo-firehose-2-2019-11-12-10-33-02-739b1c9d-cf07-4086-a1dd-bab0e60cd4cd)
    

해당 파일을 다운받아 내용을 확인한다. 

```
{"message":"sdasdsad"}
{"message":"asdasdsad"}
{"message":"ad"}
{"message":"sdasdsasdasdasdsdaad"}
{"message":"tesd"}
{"message":""}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasdsadasdsadadsasdasdatest4asdasdsasdad"}
{"message":"asdasddsaasdsaxzcvxcvcxv"}
{"message":"xzcv"}
```

입력한 내용이 예시와 같은 형태로 입력되어 있다면 정상적으로 동작 했다고 볼 수 있다. 

  

결론
==

* * *

이 테스트의 목적은 기존 진행된 Kinesis 테스트의 수집단계를 Fluentd로 연동 테스트하는 것이다.

테스트를 통해 Fluentd의 Output plugin으로 데이터를 수집해 AWS Kinesis Data stream으로 데이터가 정상적으로 입력됨을 확인했다.
