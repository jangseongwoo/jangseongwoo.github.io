var store = [{
        "title": "Fluentd로 데이터 수집해 AWS Kinesis firehose로 보내기",
        "excerpt":"목적 이 문서는 Fluentd에서 AWS Kinesis firehose로 데이터 보내는 테스트의 과정과 결과를 기록하기 위해 작성하였다. Elasticsearch, Fluentd, AWS Kinesis firehose에 대한 기초 지식에 대한 것은 이미 알고 있다는 가정하에 문서 작성을 한다. 모르는 경우 다른 블로그 문서들을 참고하도록 한다. 테스트 환경 테스트 환경은 다음과 같다. 로컬 환경 Python 3.7.4 Fluentd...","categories": ["Fluentd"],
        "tags": ["Fluentd","AWS_Kinesis_firehose","Elasticsearch","AWS"],
        "url": "http://localhost:4000/fluentd/fluentd_to_aws_kinesis/",
        "teaser":null},{
        "title": "Fluentd 기초 사용법",
        "excerpt":"목적 이 문서는 Fluentd(td-agent) 사용함에 있어 다음과 같은 사용법을 정리하기 위하여 작성 되었다. td-agent의 실행과 종료 td-agent 로그파일 td-agent 설정파일 경로를 변경하는 방법 환경 다음과 같은 환경에서 Fluentd를 구동하였다. OS : macOS Mojave 10.14.5 Fluentd : 1.0.2 (td-agent : 3.1.1.0) 사용법 실행, 종료 td-agent의 실행은 다음과 같은 명령으로 한다. $...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_basic/",
        "teaser":null},{
        "title": "Fluentd - 입력 로그 파일 경로 설정",
        "excerpt":"테스트 목적 Fluentd(이하 td-agent)로 로그 파일의 로그를 수집할 때 파일 경로에 관하여 다음과 같은 케이스가 존재한다. 파일 경로를 지정하는 경우 (예 : log/access.log) 디렉터리와 확장자만 지정하는 경우 (예 : log/*.log) 디렉터리와 파일명의 prefix만 지정하는 경우 (예: log/access*) 이 테스트는 위와 같은 케이스에 대하여 td-agent를 실행하고 로그 파일을 생성할 때 td-agent의...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_file_path_test/",
        "teaser":null},{
        "title": "Fluentd(td-agent) Filter plugin",
        "excerpt":"테스트 목적 이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 Filter plugin의 단순 동작 확인에 목적을 두고 있다. 필드를 가공해야하는 경우 로그 값을 확인하여 필터링 하는 경우 로그를 파싱하여 저장하는 경우 테스트 환경 다음과 같은 환경에서 테스트 하였다. OS : masOS Mojave v10.14.6 Fluentd : 1.0.2 (td-agent :...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_filter_plugin_operation_check/",
        "teaser":null},{
        "title": "Fluentd(td-agent) 설치 및 실행 방법",
        "excerpt":"Td-agent 설치 및 확인 아래 내용은 Mac에서 td-agent를 설치하고 기본 동작을 확인하는 것을 기준으로 작성된 내용이다. 참고: https://docs.fluentd.org/installation/install-by-dmg 설치 완료되면 아래 경로에 td-agent가 설치된다. /opt/td-agent/usr/sbin/ $ ls -l /opt/td-agent/usr/sbin/ total 16 -rwxr-xr-x 1 root wheel 348 Feb 1 2018 td-agent -rwxr-xr-x 1 root wheel 177 Feb 1 2018 td-agent-gem 디폴트...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_install/",
        "teaser":null},{
        "title": "Fluentd(td-agent) output plugin",
        "excerpt":"테스트 목적 이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 단순 동작 확인에 목적을 두고 있다. 로그 파일을 읽고 표준 출력하기 로그 파일을 읽고 파일로 출력하기 로그 파일을 읽고 Elasticsearch에 Insert하기 로그 파일을 읽고 Amazone S3에 저장하기 테스트 환경 다음과 같은 환경에서 테스트 하였다. OS : macOS Mojave...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_output_plugin_operation_check/",
        "teaser":null},{
        "title": "Slackbot API 중 Webhooks,Web API를 이용한 메시지 보내기",
        "excerpt":"문서목적 이 문서는 Slackbot에 대해 학습한 부분을 정리하기 위해 작성하였다. 이 문서에서 Slackbot과 관련된 모든 내용을 정리하는 것은 아니며, 자세한 내용은 문서에 포함되어 있는 공식 사이트를 참고하도록 한다. 학습 범위 아래와 같은 내용 포함하고 있다. 특정 채널에 Slackbot으로 메시지 보내기 Webhooks API를 이용한 메시지 전달 Web API를 이용한 메시지 전달...","categories": ["Slack"],
        "tags": ["Slack_API","Slack"],
        "url": "http://localhost:4000/slack/slack_api_webhook/",
        "teaser":null},{
        "title": "Python logging module 기초적인 사용법에 대한 학습",
        "excerpt":"목적 이 문서는 Python Logging 모듈에 대한 공식 문서 중 아래와 같은 내용을 정리하고 공유하기 위하여 작성했다. Logging HOWTO 튜토리얼 Logging facility for Python 로깅 모듈과 관련된 클래스, 메서드 등 설명이 나와있는 문서 Logging cook book 다양한 사례가 나와 있는 문서 실행 환경 다음과 같은 환경에서 학습을 진행했다. Python 3.7.5...","categories": ["Logging"],
        "tags": ["Python","Logging"],
        "url": "http://localhost:4000/logging/python_logging_basic/",
        "teaser":null},{
        "title": "Django framework를 이용해 게시판 만들고 AWS에 배포하기",
        "excerpt":"문서 목적 이 문서는 Django, python을 모르는 개발자를 대상으로 작성했으며 추후 다른 사람이 개발 할 경우 시행착오를 줄이는데 도움을 주기 위하여 작성하였다. 처음 배울 때 겪었던 시행착오와 찾아봤던 정보들, 사이트를 중심으로 기술하였다. 장고를 배우기 위해 토이프로젝트를 진행했으며 프로젝트의 목적은 Django와 AWS를 이용해 상용화 서버를 만드는 것이며 기능 구현 후 Test...","categories": ["Django"],
        "tags": ["Python","Django","AWS","AWS_EC2"],
        "url": "http://localhost:4000/django/django_make_board/",
        "teaser":null},{
        "title": "Python logging을 활용해 Flask에서 logging하는 방법",
        "excerpt":"Flask Logging 하는 방법 python logging 모듈을 사용하여 로그를 남겨봅시다. logging 모듈은 python에서 기본으로 제공하는 library입니다. 따라서 pip로 따로 설치할 필요가 없습니다. 가장 기본적인 방식은 아래와 같습니다. from flask import Flask import logging   logging.basicConfig(filename = \"logs/project.log\", level = logging.DEBUG) application=Flask(__name__)   @application.route(\"/\") def hello(): return \"hello\" if __name__==\"__main__\": application.run(host=\"0.0.0.0\",...","categories": ["Logging"],
        "tags": ["Python","Logging","Flask"],
        "url": "http://localhost:4000/logging/flask_logging/",
        "teaser":null},{
        "title": "New Relic 교육 - 오버뷰",
        "excerpt":"문서목적 New Relic에서 제공하는 기능에 대한 간단한 오버뷰 교육과 관련되어 사전 학습 내용과 교육 내용 일부를 개인적으로 정리한 문서이다. New Relic 전반적인 내용을 다루는 상세 문서가 아니므로 정확하고, 구체적인 내용은 New Relic 공식 사이트나 다른 자료를 확인하도록 한다. New Relic이 말하는 New Relic(오버뷰) New Relic에서 제공하는 다양한 제품을 통해 데이터 기반...","categories": ["Monitoring"],
        "tags": ["Newrelic","Monitoring"],
        "url": "http://localhost:4000/monitoring/newrelic_basic/",
        "teaser":null},{
        "title": "Boto3를 이용한 Amazon S3, Kinesis Data Firehose 사용하기",
        "excerpt":"테스트 목적 AWS를 Python 개발환경에서 사용하기 위한 방법중 하나는 Boto3 라이브러리를 이용하는 것이다. 이 테스트는 Boto3를 이용하여 아래의 서비스에 접근하여 사용하는 방법을 공유하기 위한 목적이 있다. Amazon S3 Kinesis Firehose 테스트 환경 테스트 환경은 다음과 같다. OS : macOS mojave 10.14.6 Python 버전 : 3.7.3 Boto3 버전 : 1.9.215 AWS CLI...","categories": ["Boto3"],
        "tags": ["Boto3","AWS_S3","AWS_Kinesis_firehose"],
        "url": "http://localhost:4000/boto3/boto3_basic/",
        "teaser":null},{
        "title": "Docker 공식 사이트 Chapter 1~3 학습 내용 정리",
        "excerpt":"목적 이 문서는 2019. 9. 2 기준 Docker 시작하기를 따라하며 개인적인 학습과 추후 이 내용을 리마인드 할 때 참고하려는 목적을 가지고 있다. 진행 Docker 시작하기는 6개의 part로 나뉘어져 있으며 다음과 같다. 이 중 part 3까지만 진행한다. 오리엔테이션 컨테이너 서비스 스웜 스택 앱 배포 스웜의 경우 쿠버네티스를 사용하는 트렌드 비춰 학습에서 제외한다. 스택, 6. 앱...","categories": ["Docker"],
        "tags": ["Docker"],
        "url": "http://localhost:4000/docker/docker_basic/",
        "teaser":null},{
        "title": "Docker 컨테이너간 볼륨 공유에 대한 학습",
        "excerpt":"문서 목적 다수의 Docker 컨테이너(이하 컨테이너)를 운영하다가 보면 컨테이너 간에 볼륨 공유가 필요할 상황이 있다. 예를 들면 Apache 서버 컨테이너의 로그 파일을 Fluentd 컨테이너로 수집하는 경우이다. 이 경우 Fluentd가 Apache 서버의 로그 파일을 접근하려면 다음과 같이 두 가지 방법이 존재한다. Fluentd가 Apache 서버 컨테이너 볼륨에 접근하여 로그 파일을 수집하는 방법 호스트...","categories": ["Docker"],
        "tags": ["Docker"],
        "url": "http://localhost:4000/docker/docker_volume_mount/",
        "teaser":null},{
        "title": "PyTest 프레임워크 기초 사용법",
        "excerpt":"목적 이 문서는 Pytest framework에 관하여 학습한 내용을 정리하기 위해 작성되었다. Pytest 공식 가이드 문서 내용 중 아래의 카테고리에 해당하는 내용을 정리했다. Asserting with the assert statement pytest fixtures: explicit, modular, scalable Parametrizing fixtures and test functions 학습 환경 학습 환경은 다음과 같다. Python 버전 : 3.7.4 PyTest 버전 : 5.2.1 환경...","categories": ["Test"],
        "tags": ["Pytest","Python","Test"],
        "url": "http://localhost:4000/test/pytest_basic/",
        "teaser":null},{
        "title": "AWS Chalice - Tutorial 기초 학습 정리",
        "excerpt":"목적 이 문서는 AWS Chalice Github README 문서를 학습하며 개인적인 학습정리를 위하여 작성되었다. 문서의 내용을 따라한 내용들을 정리한 내용이 주를 이루며 추후 학습이 더 필요한 부분은 그린으로 표시하였다. 테스트 환경 OS : macOS Mojave 10.14.6 Chalice 1.11.0 Python 3.6.5 darwin 18.7.0 학습에 필요한 사전 정보 AWS Lambda 다음과 같은 문서의 내용의 숙지가...","categories": ["Lambda"],
        "tags": ["Lambda","AWS_Chalice"],
        "url": "http://localhost:4000/lambda/chalice_tutorial/",
        "teaser":null},{
        "title": "JMeter 기본 사용법",
        "excerpt":"JMeter란?  JMeter는 java로 만들어진 성능 테스트 툴이다. 구매한 솔루션의 Spec을 확인하거나 서버의 스케일링을 위해 사용한다. 설치하기 oracle site ( https://www.oracle.com/technetwork/java/javase/downloads/index.html ) 에서 java (version : 8+) 을 다운받는다. java를 설치한다. apach jmeter site( https://jmeter.apache.org/download_jmeter.cgi ) 로 이동한다. binary file 을 다운받는다. ( zip 또는 tgz ) 압축을 푼다. 실행하기 JMeter에는 GUI mode 와  CLI...","categories": ["Test"],
        "tags": ["JMeter","Test"],
        "url": "http://localhost:4000/test/jmeter_basic/",
        "teaser":null},{
        "title": "AWS CLI 기초 학습 공유",
        "excerpt":"문서 목적 이 문서는 AWS Command Line Interface 사용 설명서를 살펴보며 AWS CLI에 대한 학습했던 내용을 개인적으로 정리하기 위하여 작성되었다. AWS Command Line Interface 사용 설명서에서 필요한 부분만 정리하였다. macOS로 진행하였고 이와 관련 된 것만 정리하였다. AWS CLI란? AWS CLI는 Amazon Web Service Command Line Interface의 약자로 셸의 명령을 사용하여 AWS 서비스와 상호...","categories": ["AWS_CLI"],
        "tags": ["AWS_CLI"],
        "url": "http://localhost:4000/aws_cli/aws_cli_basic/",
        "teaser":null},{
        "title": "Kubernetes 입문자를 위한 기초 내용 정리",
        "excerpt":"문서목적 이 문서는 Kuberetes에 대한 기초 내용을 개인적으로 내용을 정리하기 위하여 작성되었다. 자세한 내용이나 특정 항목에 대한 서비스의 구체적인 정보는 공식사이트 자료를 참고하도록 한다. Docker 기초 개념 가상화의 정의 동일한 또는 상이한 여러 개의 운영체제를 완전히 독립된 방식으로 동시에 실행하는 것 (ex. 하나의 머신 위에 Linux와 Window 운영 체제를 동시에 실행)...","categories": ["Kubernetes"],
        "tags": ["Kubernetes"],
        "url": "http://localhost:4000/kubernetes/kubernetes_basic/",
        "teaser":null},{
        "title": "Elasticsearch delete API 관련 테스트 및 정리",
        "excerpt":"테스트 개요 Elasticsearch에 indexing된 document를 특정 필드의 값을 기준으로 삭제하는 기능에 대하여 테스트 한다. Elasticsearch의 Delete API는 문서의 id값을 기준으로 삭제하기 때문에 일반적으로 데이터를 삭제하는 방식으로 사용하기 어렵다. Elasticsearch에서 document를 indexing하면서 document의 id를 특정 값으로 직접 부여하지 않고 indexing한 경우, Elasticsearch의 내부 정책에 따라 hash 형태의 값을 문서의 id값으로 부여하기 때문에...","categories": ["Elasticsearch"],
        "tags": ["Elasticsearch"],
        "url": "http://localhost:4000/elasticsearch/elasticsearch_delete_api/",
        "teaser":null},{
        "title": "Elasticsearch - 여러 개의 Index와 연결된 Alias를 대상으로 Indexing 요청을 하는 경우 동작 확인",
        "excerpt":"목적 이 문서는 Elasticsearch Alias에 대하여 아래와 같은 경우에 대한 동작을 확인하기 위한 테스트 과정과 결과를 정리하기 위하여 작성되었다. 2개 이상의 Index가 설정된 Alias에 indexing할 경우 정상적으로 indexing 되는지 여부 확인 만일 정상적으로 indexing된다면 데이터가 어떤 Index에 저장되는지 확인 이 테스트는 Elasticsearch와 Kibana 사용에 대한 기본적인 내용을 알고 있다는 가정하에...","categories": ["Elasticsearch"],
        "tags": ["Elasticsearch"],
        "url": "http://localhost:4000/elasticsearch/elasticesarch_alias_index_test/",
        "teaser":null},{
        "title": "Amazon Elasticsearch 인덱스 복구",
        "excerpt":"목적 이 문서는 AWS Elasticsearch를 복구하는 과정을 정리한 문서이다. 인덱스 복구에 대한 자세한 내용은 Amazon Elasticsearch Service - 인덱스 스냅샷 작업을 통해 확인한다. 환경 Amazon Elasticsearch 버전 : 6.7 인스턴스 유형 : t2.small.elasticsearch 인스턴스 개수 : 2 볼륨 크기 : 10 GB 복구할 인덱스 : test_index 복구 과정 스냅샷 존재 여부 확인 Amazon Elasticsearch의 스냅샷 정책은 다음과...","categories": ["Elasticsearch"],
        "tags": ["Elasticsearch"],
        "url": "http://localhost:4000/elasticsearch/elasticesarch_recovery/",
        "teaser":null},{
        "title": "Fluentd의 Read from head option에 대해 알아보기",
        "excerpt":"테스트 목적 Fluentd(이하 td-agent)로 로그를 수집할 때 디렉터리 워치로 파일 로그를 수집하는 경우가 있다. (예시 : 날짜별 파일 로그 수집) 이러한 경우에서 로그 파일 생성 시점에 따라 다음과 같은 케이스로 분류할 수 있다. 파일 생성 시점과 로그 저장 시점이 다른 경우 파일 생성 시점과 로그 저장 시점이 같은 경우 위의...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_file_created_time/",
        "teaser":null},{
        "title": "Fluentd로 데이터 수집해 AWS Kinesis Data stream으로 보내기",
        "excerpt":"문서 작성의 목적 이 문서는 AWS Kinesis에 대한 학습 중 Fluentd와 AWS Kinesis Data stream을 연동 하여 데이터를 처리하는 방법에 대해 테스트하고 공유하기 위해 작성했다. Fluentd에 대한 기초적인 지식 및 설치에 대한 것은 알고 있다는 것으로 가정해 문서를 작성했다. 해당 부분을 모르는 경우 Fluentd 기초 문서를 참고한다. 테스트 환경 테스트 환경은...","categories": ["Fluentd"],
        "tags": ["Fluentd","AWS_Kinesis_data_stream","AWS"],
        "url": "http://localhost:4000/fluentd/fluentd_to_aws_kinesis_data_stream/",
        "teaser":null},{
        "title": "Kinesis Data Firehose에서 Amazon Elasticsearch와 S3 데이터 전달하기",
        "excerpt":"테스트 목적 Amazon Kinesis Data Firehose - Delivery Stream의 destination을 Amazon Elasticsearch Service domain으로 지정하고 S3 backup 설정을 하여 Firehose로 전달된 데이터가 Amazon Elasticsaerch와 S3로 저장되는지 확인한다. 테스트 환경 테스트 리전: 서울 리전 테스트 관련 서비스: Amazon Kinesis Data Firsehose Amazon Elasticsearch Service(이하 Amazon ES) Amazon S3 +----------------------+ +---------+ |...","categories": ["AWS_Kinesis_firehose"],
        "tags": ["AWS_Kinesis_firehose","AWS_s3","Elasticsearch"],
        "url": "http://localhost:4000/aws_kinesis_firehose/firehose_to_es_s3/",
        "teaser":null},{
        "title": "Kinesis Data stream의 제약조건 및 리샤딩 테스트",
        "excerpt":"문서 목적 이 문서는 AWS Kinesis Data stream의 제약조건과 리샤딩에 대한 테스트 결과를 남기기 위해 작성하였다. 내용 중 실제 응답 결과에 대해 … 으로 표기한 부분은 가독성을 위해 생략한 것이다. 해당 부분 참고해 진행한다. 테스트 결론 테스트가 많고 문서의 가독성을 위해 결론을 서두에 적는다. 이 테스트에서는 AWS Kinesis의 제약조건을 테스트했으며...","categories": ["AWS_Kinesis_data_stream"],
        "tags": ["AWS_Kinesis_data_stream","AWS"],
        "url": "http://localhost:4000/aws_kinesis_data_stream/kinesis_resharding_test/",
        "teaser":null},{
        "title": "Crontab 기본적인 사용법 정리",
        "excerpt":"문서 목적 이 문서는 Crontab에 대해 학습한 부분들을 정리하고 공유하기 위해 작성하였다. Crontab 설명 Crobtab에 대한 설명하면 다음과 같다.  소프트웨어 유틸리티 Cron은 유닉스 계열 컴퓨터 운영 체제의 시간 기반 잡 스케줄러이다. 소프트웨어 환경을 설정하고 관리하는 사람들은 작업을 고정된 시간, 날짜, 간격에 주기적으로 실행할 수 있도록 스케줄링하기 위해 Cron을 사용한다. (출처- 위키백과)...","categories": ["Crontab"],
        "tags": ["Crontab"],
        "url": "http://localhost:4000/crontab/cron_tab_basic/",
        "teaser":null},{
        "title": "Elasticsearch multi_match 기본 사용법 및 Type에 대한 설명 정리",
        "excerpt":"문서 목적 이 문서는 Elasticsearch에서 Multi_match query를 사용할 경우 필요한 지식에 대해 정리하고 공유하기 위해 작성했다. 가독성을 위해 Elasticsearch는 ES로 표기한다.  테스트 환경 테스트 환경은 다음과 같다.  ES, Kibana: 7.1  MacOS Catalina 10.15.2 Multi_match 기본 설정에 대한 설명 아래와 같이 Query를 실행할 경우 기본값으로 설정되는 항목에 대해 설명한다.  { \"query\": { \"multi_match\"...","categories": ["Elasticsearch"],
        "tags": ["Elasticsearch"],
        "url": "http://localhost:4000/elasticsearch/elasticsearch_multi_match/",
        "teaser":null},{
        "title": "Shell script 기본 학습 정리 ",
        "excerpt":"문서 목적 이 문서는 Bash shell sciprt에 대해 학습한 부분들을 정리하고 공유하기 위해 작성하였다. 이 문서는 Bash schell script를 기준으로 작성하였다.  프로그래밍에 대한 기초적인 지식이 있다는 가정하에 문서를 작성했다. 해당 지식이 없을 경우 해당 지식을 미리 학습하고 문서를 읽을 것을 권장한다.  터미널에 String 출력하기 shell script에서 터미널에 String을 출력하는 방법은...","categories": ["Shell_script"],
        "tags": ["Shell_script"],
        "url": "http://localhost:4000/shell_script/shell_script_basic/",
        "teaser":null},{
        "title": "Celery를 활용한 ML 모델 빌드, 모델 정확성 평가, 배포",
        "excerpt":"목적 이 글은 ML 모델 기반의 API서비스를 만든 후, 추가적으로 고도화에 대해 공부하고 개발한 부분을 남기고 공유하기 위해 작성했다.  이 문서는 Celery에 대해 기본적인 지식이 있다는 가정하에 문서가 진행된다. Celery를 모를 경우 링크를 참고한다.  개발 환경 테스트 환경은 다음과 같다. Mac OS: Catalina 10.15.3 Python 3.7 Celery 4.4.0 개발 진행 목적...","categories": ["Celery"],
        "tags": ["Celery"],
        "url": "http://localhost:4000/celery/celery_ml_model_build/",
        "teaser":null},{
        "title": "Linux환경에서 Process background에서 실행하는 방법, 프로세스 확인, 종료하는 방법",
        "excerpt":"목적 이 문서는 Linux환경에서 Process background에서 실행하는 방법에 대해 정리하기 위해 작성했다.  Linux환경에서 Process background에서 실행하는 방법 Linux 환경에서 터미널을 이용해 특정 작업을 실행할 경우 Foreground, Background로 Process를 실행할 수 있다. Foreground로 실행할 경우에는 중간에 터미널을 종료하게 되면 실행한 Process도 같이 종료하게 된다.  터미널을 종료할 경우에도 Process가 계속 실행되게 하고...","categories": ["Linux"],
        "tags": ["Linux"],
        "url": "http://localhost:4000/linux/how_to_running_process_in_background/",
        "teaser":null},{
        "title": "Kafka 설치 및 간단 사용법",
        "excerpt":"목적 이 글의 목적은 Apache Kafka 공식 사이트의 Quick start 를 따라하면서 학습했던 부분을 정리하고 공유하기 위해 작성했다. 이 이문서에서는 Quick start에 포함된 가장 간단한 부분에 대하여 직접 실행한 내용만 포함되어 있으며, Apache Kafka에 대한 자세한 내용은 공식 사이트 문서를 참고하도록 한다. 설치 설치를 하기 위해 링크에서 2.4.0 버전의 kafka를 다운받는다. 다운받고 해당 폴더에서 다음 명령어를...","categories": ["Kafka"],
        "tags": ["Kafka"],
        "url": "http://localhost:4000/kafka/kafka_quick_start_guide/",
        "teaser":null},{
        "title": "Kafka 공식문서",
        "excerpt":"목적 이 글은 Kafka 공식 문서를 번역하기 위해 작성한 글이다. 전체 문서 번역이 아닌 일부분 중요하다고 생각하는 부분에 대해서 작성을 진행한다. 번역하기 어려운 기술용어에 대해서는 원문이 의미 전달에 더 용이할 것이라 판단해 그대로 작성한다. 이 문서는 Kafak 2.4.0의 공식문서를 기준으로 작성했다.  Introduction  Apach Kafka는 분산 streaming platform이다.  Streaming platform은 3가지 특징이...","categories": ["Kafka"],
        "tags": ["Kafka"],
        "url": "http://localhost:4000/kafka/kafka_official_documents/",
        "teaser":null}]
