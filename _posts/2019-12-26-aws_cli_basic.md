---
title:  "AWS CLI 기초 학습 공유"
excerpt: "이 문서는 AWS Command Line Interface 사용 설명서를 살펴보며 AWS CLI에 대한 학습했던 내용을 개인적으로 정리하기 위하여 작성되었다."

categories:
  - AWS_CLI
tags:
  - AWS_CLI

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 목적
=====

이 문서는 [AWS Command Line Interface 사용 설명서](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-welcome.html)를 살펴보며 AWS CLI에 대한 학습했던 내용을 개인적으로 정리하기 위하여 작성되었다.

[AWS Command Line Interface 사용 설명서](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-welcome.html)에서 필요한 부분만 정리하였다.

macOS로 진행하였고 이와 관련 된 것만 정리하였다.

  

  

AWS CLI란?
=========

AWS CLI는 Amazon Web Service Command Line Interface의 약자로 셸의 명령을 사용하여 AWS 서비스와 상호 작용할 수 있는 오픈 소스 도구이다.

AWS Management 콘솔과 동일한 기능을 제공을 해준다. 

 자세한 내용은 [AWS Command Line Interface이란 무엇입니까?](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-welcome.html)를 참고한다.

  

  

설치방법
====

macOS
-----

다음과 같은 환경에서 AWS CLI 설치를 진행하였다.

*   macOS Mojave 버전 10.14.6(18G87)
    

  

AWS CLI를 설치하기 위하여 아래의 Python 버전이상이 설치 되어 있어야 한다.

2019\. 8. 27 기준   

Python 2 버전 2.6.5+ 또는 Python 3 버전 3.3+

  

Python이 설치 되어있지 않다면 설치방법에 대하여 구글링을 하거나 다음과 같은 brew 명령을 활용하여 설치하면 된다.

```
$ brew intall python3
```

  

다른 설치 방법도 있지만 AWS CLI의 기본 배포 방법은 pip이며, 그중 pip3로 설치하는 것을 권장하고 있으므로 pip3로 설치를 진행한다.

다음과 같이 AWS CLI를 설치를 진행한다.

```
$ pip3 install awscli --upgrade --user
```

  

다음과 같은 명령으로 AWS CLI 설치 확인겸 버전 확인을 한다.

```
$ aws --version
aws-cli/1.16.222 Python/2.7.16 Darwin/18.7.0 botocore/1.12.212
```

  
더 자세한 내용은 [AWS CLI 설치 - macOS](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-install.html)를 참고한다.

다른 OS
-----

[AWS CLI 설치](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-install.html)에서 OS에 맞는 설치법으로 설치하면 된다.

  

  

구성 및 자격 증명 저장
=============

AWS CLI는 자주 사용하는 구성 및 자격 증명을 파일로 저장하여 관리할 수 있다.

구성 및 자격 증명의 구조
--------------

구성 및 자격 증명은 다음과 같은 구조로 저장된다.

```
Users/user/.aws/
├── config
└── credentials
```

  

각각의 파일에 담기는 내용은 다음과 같다.

config

*   output : aws cli로 부터 응답을 받는 형식 (예 : json, text)
    
*   region : aws region을 의미한다. region 코드표는 [AWS 서비스 엔드포인트](https://docs.aws.amazon.com/ko_kr/general/latest/gr/rande.html)를 참고하여 설정해주면 된다.
    

credentials

*   aws\_access\_key\_id : 액세스 키 아이디를 입력한다.
    
*   aws\_secret\_access\_key : 시크릿 액세스 키를 입력한다.
    

  

자세한 내용은 [구성 및 자격 증명 파일](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-files.html)을 참고한다.

프로필 파일
------

AWS CLI에서는 프로필 별로 구성 및 자격 증명을 설정할 수 있다.

프로필 별로 구성 및 자격증명을 지정하는 방법은 다음과 같다.

```
$ aws configure --profile "프로필명"
```

  

설정된 프로필을 확인하면 다음과 같다.

```
$ cat ~/.aws/config
[default]
region=us-west-2
output=json
[profile user1]
region=us-east-1
output=text
 
$ cat ~/.aws/credential
[default]
aws_access_key_id="디폴트 엑세스 키 아이디"
aws_secret_access_key="디폴트 시크릿 엑세스 키"
[프로필명]
aws_access_key_id="프로필명 엑세스 키 아이디"
aws_secret_access_key="프로필명 시크릿 엑세스 키"
```

  

AWS CLI 사용 : Amazon S3
======================

[AWS CLI에서 상위 수준(s3) 명령 사용](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-services-s3-commands.html)을 참고하여 문서에서 기술한대로 동작하는 지 확인했다.

각 명령어 별로 케이스 염두하여 테스트 하였다.

### cp 명령어

케이스 : 로컬 파일을 s3로 복사

```
$ ls
cp                local_cp_test.txt

$ aws s3 ls s3://bucket/user-s3-cli-test/
2019-08-22 21:10:50          0

$ aws s3 cp local_cp_test.txt s3://bucket/user-s3-cli-test/s3_cp_test.txt
upload: ./local_cp_test.txt to s3://bucket/user-s3-cli-test/s3_cp_test.txt

$ aws s3 ls s3://bucket/user-s3-cli-test/
2019-08-22 21:10:50          0
2019-08-22 22:23:05         21 s3_cp_test.txt
```

  

케이스 : s3 파일을 로컬로 복사

```
$ ls -al
total 16
drwxr-xr-x  3 user  staff    96  8 22 22:25 .
drwxr-xr-x  7 user  staff   224  8 22 20:59 ..
-rw-r--r--@ 1 user  staff  6148  8 22 22:19 .DS_Store

$ aws s3 ls s3://bucket/user-s3-cli-test/
2019-08-22 21:10:50          0
2019-08-22 22:23:05         21 s3_cp_test.txt

$ aws s3 cp s3://bucket/user-s3-cli-test/s3_cp_test.txt ./local_cp_test.txt
download: s3://bucket/user-s3-cli-test/s3_cp_test.txt to ./local_cp_test.txt

$ ls
local_cp_test.txt
```

  

케이스 : s3 파일을 s3로 복사

```
$ aws s3 ls s3://bucket/user-s3-cli-test/
2019-08-22 21:10:50          0
2019-08-22 22:23:05         21 s3_cp_test.txt

$ aws s3 cp s3://bucket/user-s3-cli-test/s3_cp_test.txt s3://bucket/user-s3-cli-test/s3_cp_test_copy.txt
copy: s3://bucket/user-s3-cli-test/s3_cp_test.txt to s3://bucket/user-s3-cli-test/s3_cp_test_copy.txt

$ aws s3 ls s3://bucket/user-s3-cli-test/
2019-08-22 21:10:50          0
2019-08-22 22:23:05         21 s3_cp_test.txt
2019-08-22 22:30:43         21 s3_cp_test_copy.txt
```

  

케이스 : 로컬 디렉터리를 s3로 복사

```
$ ls ./cp_dir_test/
local_cp_test.txt

$ aws s3 ls s3://bucket/user-s3-cli-test/
2019-08-22 21:10:50          0
2019-08-22 22:23:05         21 s3_cp_test.txt
2019-08-22 22:30:43         21 s3_cp_test_copy.txt

$ aws s3 cp ./cp_dir_test s3://bucket/user-s3-cli-test/s3_cp_dir_test --recursive
upload: cp_dir_test/local_cp_test.txt to s3://bucket/user-s3-cli-test/s3_cp_dir_test/local_cp_test.txt

$ aws s3 ls s3://bucket/user-s3-cli-test/s3_cp_dir_test
                           PRE s3_cp_dir_test/

$ aws s3 ls s3://bucket/user-s3-cli-test/s3_cp_dir_test/
2019-08-22 22:34:48         21 local_cp_test.txt
```

### ls, mv, rm 명령

[AWS CLI에서 상위 수준(s3) 명령 사용](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-services-s3-commands.html)을 참고하여 테스트한다.

  

  

참고 자료
=====

*   [AWS Command Line Interface 사용 설명서](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-welcome.html)
    
*   [AWS CLI 설치](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-chap-install.html)
    
*   [AWS CLI에서 상위 수준(s3) 명령 사용](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-services-s3-commands.html)
