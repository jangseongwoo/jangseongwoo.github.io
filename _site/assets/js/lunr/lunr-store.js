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
        "title": "[테스트] Fluentd - 입력 로그 파일 경로 설정에 관한 테스트",
        "excerpt":"테스트 목적 Fluentd(이하 td-agent)로 로그 파일의 로그를 수집할 때 파일 경로에 관하여 다음과 같은 케이스가 존재한다. 파일 경로를 지정하는 경우 (예 : log/access.log) 디렉터리와 확장자만 지정하는 경우 (예 : log/*.log) 디렉터리와 파일명의 prefix만 지정하는 경우 (예: log/access*) 이 테스트는 위와 같은 케이스에 대하여 td-agent를 실행하고 로그 파일을 생성할 때 td-agent의...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_file_path_test/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "[테스트] Fluentd(td-agent) output plugin 동작 확인",
        "excerpt":"테스트 목적 이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 Filter plugin의 단순 동작 확인에 목적을 두고 있다. 필드를 가공해야하는 경우 로그 값을 확인하여 필터링 하는 경우 로그를 파싱하여 저장하는 경우 테스트 환경 다음과 같은 환경에서 테스트 하였다. OS : masOS Mojave v10.14.6 Fluentd : 1.0.2 (td-agent :...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_filter_plugin_operation_check/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "Fluentd(td-agent) 설치 및 실행 방법",
        "excerpt":"Td-agent 설치 및 확인 아래 내용은 Mac에서 td-agent를 설치하고 기본 동작을 확인하는 것을 기준으로 작성된 내용이다. 참고: https://docs.fluentd.org/installation/install-by-dmg 설치 완료되면 아래 경로에 td-agent가 설치된다. /opt/td-agent/usr/sbin/ $ ls -l /opt/td-agent/usr/sbin/ total 16 -rwxr-xr-x 1 root wheel 348 Feb 1 2018 td-agent -rwxr-xr-x 1 root wheel 177 Feb 1 2018 td-agent-gem 디폴트...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_install/",
        "teaser":"http://localhost:4000/assets/images/logo.png"},{
        "title": "[테스트] Fluentd(td-agent) output plugin 동작 확인",
        "excerpt":"테스트 목적 이 문서는 Fluentd의 학습 차원에서 다음과 같은 테스트 케이스 별 단순 동작 확인에 목적을 두고 있다. 로그 파일을 읽고 표준 출력하기 로그 파일을 읽고 파일로 출력하기 로그 파일을 읽고 Elasticsearch에 Insert하기 로그 파일을 읽고 Amazone S3에 저장하기 테스트 환경 다음과 같은 환경에서 테스트 하였다. OS : macOS Mojave...","categories": ["Fluentd"],
        "tags": ["Fluentd"],
        "url": "http://localhost:4000/fluentd/fluentd_output_plugin_operation_check/",
        "teaser":"http://localhost:4000/assets/images/logo.png"}]
