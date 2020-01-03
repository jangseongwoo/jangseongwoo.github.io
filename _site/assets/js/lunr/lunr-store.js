var store = [{
        "title": "Fluentd로 데이터 수집해 AWS Kinesis firehose로 보내기",
        "excerpt":"목적 이 문서는 Fluentd에서 AWS Kinesis firehose로 데이터 보내는 테스트의 과정과 결과를 기록하기 위해 작성하였다. Elasticsearch, Fluentd, AWS Kinesis firehose에 대한 기초 지식에 대한 것은 이미 알고 있다는 가정하에 문서 작성을 한다. 모르는 경우 다른 블로그 문서들을 참고하도록 한다. 테스트 환경 테스트 환경은 다음과 같다. 로컬 환경 Python 3.7.4 Fluentd...","categories": ["Fluentd"],
        "tags": ["Fluentd","AWS_Kinesis_firehose","Elasticsearch","AWS"],
        "url": "http://localhost:4000/fluentd/fluentd_to_aws_kinesis/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Fluentd 기초 사용법",
        "excerpt":"목적 이 문서는 Fluentd(td-agent) 사용함에 있어 다음과 같은 사용법을 정리하기 위하여 작성 되었다. td-agent의 실행과 종료 td-agent 로그파일 td-agent 설정파일 경로를 변경하는 방법 환경 다음과 같은 환경에서 Fluentd를 구동하였다. OS : macOS Mojave 10.14.5 Fluentd : 1.0.2 (td-agent : 3.1.1.0) 사용법 실행, 종료 td-agent의 실행은 다음과 같은 명령으로 한다. $...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Fluentd - 입력 로그 파일 경로 설정",
        "excerpt":"테스트 목적 Fluentd(이하 td-agent)로 로그 파일의 로그를 수집할 때 파일 경로에 관하여 다음과 같은 케이스가 존재한다. 파일 경로를 지정하는 경우 (예 : log/access.log) 디렉터리와 확장자만 지정하는 경우 (예 : log/*.log) 디렉터리와 파일명의 prefix만 지정하는 경우 (예: log/access*) 이 테스트는 위와 같은 케이스에 대하여 td-agent를 실행하고 로그 파일을 생성할 때 td-agent의...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_file_path_test/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Fluentd(td-agent) Filter plugin",
        "excerpt":"테스트 목적 이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 Filter plugin의 단순 동작 확인에 목적을 두고 있다. 필드를 가공해야하는 경우 로그 값을 확인하여 필터링 하는 경우 로그를 파싱하여 저장하는 경우 테스트 환경 다음과 같은 환경에서 테스트 하였다. OS : masOS Mojave v10.14.6 Fluentd : 1.0.2 (td-agent :...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_filter_plugin_operation_check/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Fluentd(td-agent) 설치 및 실행 방법",
        "excerpt":"Td-agent 설치 및 확인 아래 내용은 Mac에서 td-agent를 설치하고 기본 동작을 확인하는 것을 기준으로 작성된 내용이다. 참고: https://docs.fluentd.org/installation/install-by-dmg 설치 완료되면 아래 경로에 td-agent가 설치된다. /opt/td-agent/usr/sbin/ $ ls -l /opt/td-agent/usr/sbin/ total 16 -rwxr-xr-x 1 root wheel 348 Feb 1 2018 td-agent -rwxr-xr-x 1 root wheel 177 Feb 1 2018 td-agent-gem 디폴트...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_install/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Fluentd(td-agent) output plugin",
        "excerpt":"테스트 목적 이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 단순 동작 확인에 목적을 두고 있다. 로그 파일을 읽고 표준 출력하기 로그 파일을 읽고 파일로 출력하기 로그 파일을 읽고 Elasticsearch에 Insert하기 로그 파일을 읽고 Amazone S3에 저장하기 테스트 환경 다음과 같은 환경에서 테스트 하였다. OS : macOS Mojave...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_output_plugin_operation_check/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Slackbot API 중 Webhooks,Web API를 이용한 메시지 보내기",
        "excerpt":"문서목적 이 문서는 Slackbot에 대해 학습한 부분을 정리하기 위해 작성하였다. 이 문서에서 Slackbot과 관련된 모든 내용을 정리하는 것은 아니며, 자세한 내용은 문서에 포함되어 있는 공식 사이트를 참고하도록 한다. 학습 범위 아래와 같은 내용 포함하고 있다. 특정 채널에 Slackbot으로 메시지 보내기 Webhooks API를 이용한 메시지 전달 Web API를 이용한 메시지 전달...","categories": ["Slack"],
        "tags": ["Slack_API","Slack"],
        "url": "http://localhost:4000/slack/slack_api_webhook/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Python logging module 기초적인 사용법에 대한 학습",
        "excerpt":"목적 이 문서는 Python Logging 모듈에 대한 공식 문서 중 아래와 같은 내용을 정리하고 공유하기 위하여 작성했다. Logging HOWTO 튜토리얼 Logging facility for Python 로깅 모듈과 관련된 클래스, 메서드 등 설명이 나와있는 문서 Logging cook book 다양한 사례가 나와 있는 문서 실행 환경 다음과 같은 환경에서 학습을 진행했다. Python 3.7.5...","categories": ["Logging"],
        "tags": ["Python","Logging"],
        "url": "http://localhost:4000/logging/python_logging_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Django framework를 이용해 게시판 만들고 AWS에 배포하기",
        "excerpt":"문서 목적 이 문서는 Django, python을 모르는 개발자를 대상으로 작성했으며 추후 다른 사람이 개발 할 경우 시행착오를 줄이는데 도움을 주기 위하여 작성하였다. 처음 배울 때 겪었던 시행착오와 찾아봤던 정보들, 사이트를 중심으로 기술하였다. 장고를 배우기 위해 토이프로젝트를 진행했으며 프로젝트의 목적은 Django와 AWS를 이용해 상용화 서버를 만드는 것이며 기능 구현 후 Test...","categories": ["Django"],
        "tags": ["Python","Django","AWS","AWS_EC2"],
        "url": "http://localhost:4000/django/django_make_board/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Python logging을 활용해 Flask에서 logging하는 방법",
        "excerpt":"Flask Logging 하는 방법 python logging 모듈을 사용하여 로그를 남겨봅시다. logging 모듈은 python에서 기본으로 제공하는 library입니다. 따라서 pip로 따로 설치할 필요가 없습니다. 가장 기본적인 방식은 아래와 같습니다. from flask import Flask import logging   logging.basicConfig(filename = \"logs/project.log\", level = logging.DEBUG) application=Flask(__name__)   @application.route(\"/\") def hello(): return \"hello\" if __name__==\"__main__\": application.run(host=\"0.0.0.0\",...","categories": ["Logging"],
        "tags": ["Python","Logging","Flask"],
        "url": "http://localhost:4000/logging/flask_logging/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "New Relic 교육 - 오버뷰",
        "excerpt":"문서목적 New Relic에서 제공하는 기능에 대한 간단한 오버뷰 교육과 관련되어 사전 학습 내용과 교육 내용 일부를 개인적으로 정리한 문서이다. New Relic 전반적인 내용을 다루는 상세 문서가 아니므로 정확하고, 구체적인 내용은 New Relic 공식 사이트나 다른 자료를 확인하도록 한다. New Relic이 말하는 New Relic(오버뷰) New Relic에서 제공하는 다양한 제품을 통해 데이터 기반...","categories": ["Monitoring"],
        "tags": ["Newrelic","Monitoring"],
        "url": "http://localhost:4000/monitoring/newrelic_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Boto3를 이용한 Amazon S3, Kinesis Data Firehose 사용하기",
        "excerpt":"테스트 목적 AWS를 Python 개발환경에서 사용하기 위한 방법중 하나는 Boto3 라이브러리를 이용하는 것이다. 이 테스트는 Boto3를 이용하여 아래의 서비스에 접근하여 사용하는 방법을 공유하기 위한 목적이 있다. Amazon S3 Kinesis Firehose 테스트 환경 테스트 환경은 다음과 같다. OS : macOS mojave 10.14.6 Python 버전 : 3.7.3 Boto3 버전 : 1.9.215 AWS CLI...","categories": ["Boto3"],
        "tags": ["Boto3","AWS_S3","AWS_Kinesis_firehose"],
        "url": "http://localhost:4000/boto3/boto3_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Docker 공식 사이트 Chapter 1~3 학습 내용 정리",
        "excerpt":"목적 이 문서는 2019. 9. 2 기준 Docker 시작하기를 따라하며 개인적인 학습과 추후 이 내용을 리마인드 할 때 참고하려는 목적을 가지고 있다. 진행 Docker 시작하기는 6개의 part로 나뉘어져 있으며 다음과 같다. 이 중 part 3까지만 진행한다. 오리엔테이션 컨테이너 서비스 스웜 스택 앱 배포 스웜의 경우 쿠버네티스를 사용하는 트렌드 비춰 학습에서 제외한다. 스택, 6. 앱...","categories": ["Docker"],
        "tags": ["Docker"],
        "url": "http://localhost:4000/docker/docker_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Docker 컨테이너간 볼륨 공유에 대한 학습",
        "excerpt":"문서 목적 다수의 Docker 컨테이너(이하 컨테이너)를 운영하다가 보면 컨테이너 간에 볼륨 공유가 필요할 상황이 있다. 예를 들면 Apache 서버 컨테이너의 로그 파일을 Fluentd 컨테이너로 수집하는 경우이다. 이 경우 Fluentd가 Apache 서버의 로그 파일을 접근하려면 다음과 같이 두 가지 방법이 존재한다. Fluentd가 Apache 서버 컨테이너 볼륨에 접근하여 로그 파일을 수집하는 방법 호스트...","categories": ["Docker"],
        "tags": ["Docker"],
        "url": "http://localhost:4000/docker/docker_volume_mount/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "PyTest 프레임워크 기초 사용법",
        "excerpt":"목적 이 문서는 Pytest framework에 관하여 학습한 내용을 정리하기 위해 작성되었다. Pytest 공식 가이드 문서 내용 중 아래의 카테고리에 해당하는 내용을 정리했다. Asserting with the assert statement pytest fixtures: explicit, modular, scalable Parametrizing fixtures and test functions 학습 환경 학습 환경은 다음과 같다. Python 버전 : 3.7.4 PyTest 버전 : 5.2.1 환경...","categories": ["Test"],
        "tags": ["Pytest","Python","Test"],
        "url": "http://localhost:4000/test/pytest_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "AWS Chalice - Tutorial 기초 학습 정리",
        "excerpt":"목적 이 문서는 AWS Chalice Github README 문서를 학습하며 개인적인 학습정리를 위하여 작성되었다. 문서의 내용을 따라한 내용들을 정리한 내용이 주를 이루며 추후 학습이 더 필요한 부분은 그린으로 표시하였다. 테스트 환경 OS : macOS Mojave 10.14.6 Chalice 1.11.0 Python 3.6.5 darwin 18.7.0 학습에 필요한 사전 정보 AWS Lambda 다음과 같은 문서의 내용의 숙지가...","categories": ["Lambda"],
        "tags": ["Lambda","AWS_Chalice"],
        "url": "http://localhost:4000/lambda/chalice_tutorial/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "JMeter 기본 사용법",
        "excerpt":"JMeter란?  JMeter는 java로 만들어진 성능 테스트 툴이다. 구매한 솔루션의 Spec을 확인하거나 서버의 스케일링을 위해 사용한다. 설치하기 oracle site ( https://www.oracle.com/technetwork/java/javase/downloads/index.html ) 에서 java (version : 8+) 을 다운받는다. java를 설치한다. apach jmeter site( https://jmeter.apache.org/download_jmeter.cgi ) 로 이동한다. binary file 을 다운받는다. ( zip 또는 tgz ) 압축을 푼다. 실행하기 JMeter에는 GUI mode 와  CLI...","categories": ["Test"],
        "tags": ["JMeter","Test"],
        "url": "http://localhost:4000/test/jmeter_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "AWS CLI 기초 학습 공유",
        "excerpt":"문서 목적 이 문서는 AWS Command Line Interface 사용 설명서를 살펴보며 AWS CLI에 대한 학습했던 내용을 개인적으로 정리하기 위하여 작성되었다. AWS Command Line Interface 사용 설명서에서 필요한 부분만 정리하였다. macOS로 진행하였고 이와 관련 된 것만 정리하였다. AWS CLI란? AWS CLI는 Amazon Web Service Command Line Interface의 약자로 셸의 명령을 사용하여 AWS 서비스와 상호...","categories": ["AWS_CLI"],
        "tags": ["AWS_CLI"],
        "url": "http://localhost:4000/aws_cli/aws_cli_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Kubernetes 입문자를 위한 기초 내용 정리",
        "excerpt":"문서목적 이 문서는 Kuberetes에 대한 기초 내용을 개인적으로 내용을 정리하기 위하여 작성되었다. 자세한 내용이나 특정 항목에 대한 서비스의 구체적인 정보는 공식사이트 자료를 참고하도록 한다. Docker 기초 개념 가상화의 정의 동일한 또는 상이한 여러 개의 운영체제를 완전히 독립된 방식으로 동시에 실행하는 것 (ex. 하나의 머신 위에 Linux와 Window 운영 체제를 동시에 실행)...","categories": ["Kubernetes"],
        "tags": ["Kubernetes"],
        "url": "http://localhost:4000/kubernetes/kubernetes_basic/",
        "teaser":"http://localhost:4000/assets/images/logo.png"}]
