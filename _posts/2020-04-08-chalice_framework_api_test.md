---
title:  "Chalice framework API 통합테스트하는 방법과 각 각의 방법을 사용할 경우의 문제점"
excerpt: "이 문서는 Chalice framework API의 API 레벨에서 테스트할 경우 어떻게 해야되는 지 정리하기 위해 작성했다. "

categories:
  - Chalice
tags:
  - Chalice

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---


문서 작성 목적 
=========

* * *

이 문서는 Chalice framework API의 API 레벨에서 테스트할 경우 어떻게 해야되는 지 정리하기 위해 작성했다. 

  

테스트 환경 
=======

* * *

테스트 환경은 다음과 같다.

*   macOS Catalina v10.15.2
    
*   Chalice 1.13.0
    
*   Python 3.7
    

  

API Test 
=========

* * *

Chalice framework를 이용해 만든 API를 Test할 수 있는 방법은 두 가지가 있다. 

실제 테스트 하기 전 테스트를 위한 사전 준비를 진행한다. 

Test용 Project setting 
----------------------

Test용 Project setting을 위해서 다음과 같이 진행한다. 

```
$ mkdir {project_folder}
$ cd {project_folder}

$ virtualenv --python=python3.7 .venv

$ pip install chalice 
$ chalice new-project helloworld && cd helloworld
```

프로젝트 생성이 정상적으로 된 것을 확인하고 app.py의 내용을 다음과 같이 수정한다. 

```
from chalice import Chalice

app = Chalice(app_name='chalice-unit-test')


@app.route('/')
def index():
    return {'hello': 'world'}
```

다음 명령어를 이용해 작성한 코드가 정상적으로 작동 되는 지 확인한다. 

```
$ chalice local
Serving on 127.0.0.1:8000
```

새로운 터미널을 실행해 다음과 같은 명령어를 입력하고 결과를 확인한다. 

```
$ curl 127.0.0.1:8000
{"hello": "world"}
```

Test code는 Pytest library를 이용해 진행하기 때문에 아래와 같은 명령어를 이용해 Pytest library 설치를 진행한다. 

```
$ pip install pytest
```
  

Pytest-chalice Library를 이용한 테스트
-------------------------------

pytest-chalice를 이용해 API 테스트를 진행할 수 있다. Test code 작성을 위해 다음과 같은 명령어를 입력한다. 

```
# in project root directory
$ mkdir tests
$ cd tests
$ touch test_code.py 
$ touch conftest.py
$ pip install pytest-chalice
```

이후 주석을 참고해 각각의 파일에 대해 아래와 같이 내용을 입력한다. 

```
# in conftest.py

from chalice import Chalice

import os,sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from test_code.app import app as chalice_app


@pytest.fixture
def app() -> Chalice:
    return chalice_app

  

# in test_code.py

from http import HTTPStatus
from pytest_chalice.handlers import RequestHandler


def test_index(client: RequestHandler) -> None:
    response = client.get('/')
    assert response.status_code == HTTPStatus.OK
    assert response.json == {'hello': 'world'}
```

아래의 명령어를 입력해 테스트 코드를 실행하고 테스트 코드 Coverage를 확인한다. 

```
$ pytest --cov=test_code tests/test_chalice.py -v

==================================================================== test session starts =====================================================================
platform darwin -- Python 3.7.1, pytest-5.3.5, py-1.8.1, pluggy-0.13.1 -- /Users/st/test/chalice_pytest/.venv/bin/python3.7
cachedir: .pytest_cache
rootdir: /Users/st/test/chalice_pytest
plugins: chalice-0.0.4, cov-2.8.1
collected 1 item

tests/test_chalice.py::test_index PASSED                                                                                                               [100%]

---------- coverage: platform darwin, python 3.7.1-final-0 -----------
Name               Stmts   Miss  Cover
--------------------------------------
test_code/app.py       6      0   100%


===================================================================== 1 passed in 0.03s ======================================================================
```

결과를 통해 app.py의 api가 테스트되어 Coverage 100%가 나온 것을 확인할 수 있다. 

  

Chalice LocalGateway를 이용한 테스트 
------------------------------

Chalice framework에서 제공하는 LocalGateway를 이용해 테스트하기 위해 아래와 같이 test_code.py의 파일을 수정한다. 

```
# in test_code.py

import json
from unittest import TestCase

from chalice.config import Config
from chalice.local import LocalGateway

import os,sys
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from test_code.app import app


class TestApp(TestCase):
    def setUp(self):
        self.lg = LocalGateway(app, Config("prod"))

    def test_api(self):
        #print(Config("prod"))
        response = self.lg.handle_request(method='GET',
                                          path='/',
                                          headers={},
                                          body='')

        print(response)
        assert response['statusCode'] == 200
```

수정 후 아래와 같이 명령어를 입력해 테스트 코드를 실행하고 테스트 코드 Coverage를 확인한다. 

```
$ pytest --cov=test_code tests/test_other_way.py -v

==================================================================== test session starts =====================================================================
platform darwin -- Python 3.7.1, pytest-5.3.5, py-1.8.1, pluggy-0.13.1 -- /Users/st/test/chalice_pytest/.venv/bin/python3.7
cachedir: .pytest_cache
rootdir: /Users/st/test/chalice_pytest
plugins: chalice-0.0.4, cov-2.8.1
collected 1 item

tests/test_other_way.py::TestApp::test_api PASSED                                                                                                      [100%]

---------- coverage: platform darwin, python 3.7.1-final-0 -----------
Name               Stmts   Miss  Cover
--------------------------------------
test_code/app.py       6      0   100%
```

결과를 통해 app.py의 api가 테스트되어 Coverage 100%가 나온 것을 확인할 수 있다. 

  

실제 프로젝트 테스트코드로 적용시 생긴 이슈
========================

* * *

실제 프로젝트 적용 시 아래와 같은 이슈가 발생했다. 

환경변수 설정에 대한 이슈
--------------

이슈 사항: 환경변수 설정이 안되는 이슈가 발생

Chalice local을 사용해 API 테스트할 경우에는 환경변수가 os.getenv로 접근해 셋팅될 수 있지만 위의 설명된 방법으로 할 경우 다른 방법으로 환경변수를 셋팅해야 된다. 

Chalicelib import에 대한 이슈
------------------------

이슈 사항: 기존 Chalicelib import error 발생 

위 이슈와 마찬가지로 Chalice framework에서 설정된 경로로 library 파일을 생성해 사용하고 있었으나 위의 두 방법으로 할 경우 Error가 발생한다. 

  

결론
--

* * *

결론은 다음과 같다. 

*   App.py의 Test coverage 측정이 안되어 할 수 있는 방법을 조사해 테스트까지 진행했으나 실제 프로젝트 적용 시 생기는 이슈들로 인해 적용이 어렵다고 판단된다.
    

  

참고 문서
=====

* * *

참고 문서는 다음과 같다. 

*   Pytest-chalice github: [https://github.com/studio3104/pytest-chalice](https://github.com/studio3104/pytest-chalice)
    
*   참고 블로그: [https://github.com/brianjbeach/chalice-unit-test/blob/master/README.md](https://github.com/brianjbeach/chalice-unit-test/blob/master/README.md)
    
*   Chalice GitHub test 관련 이슈 링크: [https://github.com/aws/chalice/issues/289](https://github.com/aws/chalice/issues/289)