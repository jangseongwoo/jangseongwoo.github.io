---
title:  "AWS Chalice - Tutorial 기초 학습 정리"
excerpt: "이 문서는 AWS Chalice Github README 문서를 학습하며 개인적인 학습정리를 위하여 작성되었다."

categories:
  - Lambda
tags:
  - Lambda
  - AWS_Chalice

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

이 문서는 [AWS Chalice Github README 문서](https://github.com/aws/chalice)를 학습하며 개인적인 학습정리를 위하여 작성되었다.

문서의 내용을 따라한 내용들을 정리한 내용이 주를 이루며 추후 학습이 더 필요한 부분은 그린으로 표시하였다.

테스트 환경
======

*   OS : macOS Mojave 10.14.6
    
*   Chalice 1.11.0
    
*   Python 3.6.5
    
*   darwin 18.7.0
    

학습에 필요한 사전 정보
=============

AWS Lambda
----------

다음과 같은 문서의 내용의 숙지가 선행되어야 한다.

*   [https://docs.aws.amazon.com/ko\_kr/lambda/latest/dg/with-userapp.html](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/with-userapp.html)
    
*   [https://docs.aws.amazon.com/ko\_kr/lambda/latest/dg/getting-started-create-function.html](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/getting-started-create-function.html)
    

HTTP
----

원할한 테스트를 위하여 다음과 같이 http 라이브러리를 설치한다.

```
$ pip install http
```

CURL
----

원할한 테스트를 위하여 다음과 같이 curl 라이브러리를 설치한다.

```
$ brew install curl
```

  

  

학습 진행
=====

Quick Start
-----------

다음과 같이 Quick start를 위한 디렉터리를 구성한다.

```
$ mkdir chalice-demo
$ cd chlice-demo
```

  

다음과 같이 Virtual env를 구성하고 활성화 한다.

```
$ virtualenv --python=3.6 .venv
$ source .venv/bin/activate
```

  

Chalice를 설치하고, chalice 프로젝트를 생성한다.

```
$ pip install chalice
$ chalice new-project andro-test-chalice
```

  

Tutorial: Local Mode
--------------------

로컬 빌드를 위하여 다음과 같이 app.py를 수정한다.

```
from chalice import Chalice

app = Chalice(app_name='helloworld')


@app.route('/')
def index():
    return {'hello': 'world'}

```

  

다음과 같은 명령어로 로컬 빌드를 한다.

```
$ chalice local --port=8080
Restarting local dev server.
Serving on http://127.0.0.1:8080
```

  

다음과 같은 명령어로 로컬 빌드의 동작을 확인한다.

```
$ http localhost:8080
HTTP/1.1 200 OK
Content-Length: 17
Content-Type: application/json
Date: Tue, 17 Sep 2019 06:12:51 GMT
Server: BaseHTTP/0.6 Python/3.6.5

{
    "hello": "world"
}
```

  

Deploying
---------

배포를 위하여 다음과 같이 config.json 파일을 수정한다.
{iam_role_arn}은 각자 람다 사용을 위해 생성한 iam의 arn를 입력한다.

```
$ vim .chalice/config.json
{
  "version": "2.0",
  "app_name": "andro-test-chalice",
  "api_gateway_stage": "api",
  "lambda_timeout": 120,
  "lambda_memory_size": 1024,
  "stages": {
    "qa": {
      "api_gateway_stage": "qa",
      "autogen_policy": false,
      "iam_role_arn": "{iam_role_arn}"
    },
    "prod": {
      "api_gateway_stage": "prod",
      "autogen_policy": false,
      "iam_role_arn": "{iam_role_arn}"
    }
  },
  "manage_iam_role":false,
  "iam_role_arn":"{iam_role_arn}"
}
```

  

다음과 같이 배포한다.

```
$ chalice deploy
Creating deployment package.
Updating lambda function: andro-test-chalice-dev
Updating rest API
Resources deployed:
  - Lambda ARN: 
  - Rest API URL: {lambda_url}
```

  

배포된 lambda가 동작하는지 다음과 같이 확인한다.

```
$ curl -XGET {lambda_url}
{"hello":"world"}%
```

  

Tutorial: URL Parameters
------------------------

경로에 따라 다르게 보이기 위하여 다음과 같이 app.py를 수정한다.

```
from chalice import Chalice

app = Chalice(app_name='helloworld')

CITIES_TO_STATE = {
    'seattle': 'WA',
    'portland': 'OR',
}


@app.route('/')
def index():
    return {'hello': 'world'}

@app.route('/cities/{city}')
def state_of_city(city):
    return {'state': CITIES_TO_STATE[city]}
```

  

배포한다.

  

배포된 lambda가 동작하는지 다음과 같이 확인한다.

```
$ curl -XGET {lambda_url}
{"hello":"world"}%

$ curl -XGET {lambda_url}cities/seattle
{"state":"WA"}%

$ curl -XGET {lambda_url}cities/portland
{"state":"OR"}%

$ curl -XGET {lambda_url}cities/vancouver
{"Code":"InternalServerError","Message":"An internal server error occurred."}%
```

  

Tutorial: Error Messages
------------------------

에러가 발생하였을 때 처리하기 위하여는 디버그 모드를 활성화 해야한다.

또한 에러가 발생할 것으로 예측되는 함수나 구문에서 try~except 구문으로 예외처리한다.

위의 app.py를 다음과 같이 수정한다.

```
from chalice import Chalice
from chalice import BadRequestError

app = Chalice(app_name='helloworld')
app.debug = True

CITIES_TO_STATE = {
    'seattle': 'WA',
    'portland': 'OR',
}


@app.route('/')
def index():
    return {'hello': 'world'}


@app.route('/cities/{city}')
def state_of_city(city):
    try:
        return {'state': CITIES_TO_STATE[city]}
    except KeyError:
        raise BadRequestError("Unknown city '%s', valid choices are: %s" % (
            city, ', '.join(CITIES_TO_STATE.keys())))


```

  

배포한다.

  

배포된 lambda가 동작하는지 다음과 같이 확인한다.

```
$ curl -XGET {lambda_url}
{"hello":"world"}%

$ curl -XGET {lambda_url}cities/seattle
{"state":"WA"}%

$ curl -XGET {lambda_url}cities/portland
{"state":"OR"}%

$ curl -XGET {lambda_url}cities/vancouver
{"Code":"BadRequestError","Message":"BadRequestError: Unknown city 'vancouver', valid choices are: seattle, portland"}%
```

  

Tutorial: Additional Routing
----------------------------

GET method이외에 PUT, POST를 추가해본다.

데코레이션 /myview는 method에 따라 다른 응답을 제공하고자 한다.

다음과 같이 app.py를 수정한다.

```
from chalice import Chalice

app = Chalice(app_name='helloworld')


@app.route('/')
def index():
    return {'hello': 'world'}


@app.route('/resource/{value}', methods=['PUT'])
def put_test(value):
    return {"value": value}


@app.route('/myview/{value}', methods=['POST'])
def myview_post(value):
    return {"value": value, "method", "post"}


@app.route('/myview/{value}', methods=['PUT'])
def myview_put(value):
    return {"value": value, "method", "put"}
```

  

배포한다.

  

배포된 lambda가 동작하는지 다음과 같이 확인한다.

```
$ curl -XPUT {lambda_url}/resource/foo
{"value":"foo"}%

$ curl -XPUT {lambda_url}/myview/foo
{"value":"foo","mothod":"put"}%

$ curl -XPOST {lambda_url}/myview/foo
{"value":"foo","mothod":"post"}%
```

  

Tutorial: Request Metadata
--------------------------

메타데이터를 활용하기 위한 섹터이다.

우선 메소드 종류에 따라 다른 응답을 위하여 다음과 같이 app.py를 수정한다.

```
from chalice import Chalice
from chalice import NotFoundError

app = Chalice(app_name='helloworld')


@app.route('/')
def index():
    return {'hello': 'world'}


OBJECTS = {
}


@app.route('/objects/{key}', methods=['GET', 'PUT'])
def myobject(key):
    request = app.current_request
    if request.method == 'PUT':
        OBJECTS[key] = request.json_body
    elif request.method == 'GET':
        try:
            return {key: OBJECTS[key]}
        except KeyError:
            raise NotFoundError(key)

```

  

배포한다.

  

배포된 lambda의 동작을 확인하기 위하여 다음과 같이 커널 명령으로 확인한다.

```
$ curl -XGET {lambda_url}/objects/banana
{"Code":"NotFoundError","Message":"NotFoundError: banana"}%

$ curl -X PUT -H "Content-Type: application/json; charset=utf-8" -d '"yellow"' {lambda_url}/objects/banana
null%

$ curl -XGET {lambda_url}/objects/banana
{"banana":"yellow"}%
```

  

위의 코드에서 app.current\_request 인스턴스에 관하여 다음과 같은 속성들이 존재하고 속성들에 대한 설명은 [Github AWS-Chalice README 페이지](https://github.com/aws/chalice/tree/1791175cb30eaa3fd89a177e21dbba654d352b0c)를 참고한다.

*   `current_request.query_params`
    
*   `current_request.headers`
    
*   `current_request.uri_params`
    
*   `current_request.method`
    
*   `current_request.json_body`
    
*   `current_request.raw_body`
    
*   `current_request.context`
    
*   `current_request.stage_vars`
    

  

  

  

current\_request.to\_dict()를 이용하여 메타데이터를 확인하기 위하여 다음과 같이 app.py를 수정한다.

```
from chalice import Chalice

app = Chalice(app_name='helloworld')


@app.route('/')
def index():
    return {'hello': 'world'}


@app.route('/introspect')
def introspect():
    return app.current_request.to_dict()

```

  

배포한다.

배포된 lambda의 동작을 확인하기 위하여 다음과 같이 커널 명령으로 확인한다.

```
$ http '{lambda_url}/introspect?query1=value1&query2=value2' 'X-TestHeader: Foo'
```

  

Tutorial: Request Content Types
-------------------------------

컨텐트 타입에 따른 응답을 지정할 수 있다.

app.py를 다음과 같이 수정한다.

```
import sys

from chalice import Chalice
if sys.version_info[0] == 3:
    # Python 3 imports.
    from urllib.parse import urlparse, parse_qs
else:
    # Python 2 imports.
    from urlparse import urlparse, parse_qs


app = Chalice(app_name='helloworld')


@app.route('/', methods=['POST'],
           content_types=['application/x-www-form-urlencoded'])
def index():
    parsed = parse_qs(app.current_request.raw_body.decode())
    return {
        'states': parsed.get('states', [])
    }

```

  

배포한다.

배포된 lambda는 다음과 같이 확인한다.

```
### Content-Type application/json
$ http POST {lambda_url} states=WA states=CA --debug
```

  

```
### ContentType application/x-www-form-urlencoded
$ http --form POST {lambda_url} states=WA states=CA --debug
```

  

*   \-form은 Content-Type 헤더를 application/x-www-form-urlencoded로 세팅하는 것의 의미한다.
    

  

app.current\_request.json\_body는 ContentType application/json에서 정상적인 dict 객체가 존재하고, ContentType application/json 아닐 경우는 None이다.

Tutorial: Customizing the HTTP Response
---------------------------------------

커스터 마이징한 응답으로 응답할 수 있다.

app.py를 다음과 같이 수정한다.

```
from chalice import Chalice, Response

app = Chalice(app_name='custom-response')


@app.route('/')
def index():
    return Response(body='hello world!',
                    status_code=200,
                    headers={'Content-Type': 'text/plain'})
    }

```

  

배포한다.

배포된 lambda는 다음과 같이 확인한다.

```
$ http {lambda_url}
```

Tutorial: GZIP compression for json
-----------------------------------

이 섹터는 사용빈도가 낮을 것으로 판단되어 스킵한다.

Tutorial: CORS Support
----------------------

이 섹터는 전반적으로 추후 내용 보충이 필요하다.

CORS(Cross-Origin Resource Share)의 개념은 [HTTP 접근 (CORS)](https://developer.mozilla.org/ko/docs/Web/HTTP/Access_control_CORS)을 참고하면 된다.

  

  

다음과 같이 app.py를 수정한다.

```
from chalice import CORSConfig

cors_config = CORSConfig(
    allow_origin='https://foo.example.com',
    allow_headers=['X-Special-Header'],
    max_age=600,
    expose_headers=['X-Special-Header'],
    allow_credentials=True
)

@app.route('/custom_cors', methods=['GET'], cors=cors_config)
def supports_custom_cors():
    return {'cors': True}

```

  

배포한다.

배포한 lambda를 확인하면 다음과 같다.

```
$ http {lambda_url}custom_cors
HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key,X-Special-Header
Access-Control-Allow-Origin: https://foo.example.com
Access-Control-Expose-Headers: X-Special-Header
Access-Control-Max-Age: 600
...
중략
...

{
    "cors": true
}
```

  

  

다음과 같이 app.py를 수정한다.

```
from chalice import Chalice, Response

app = Chalice(app_name='multipleorigincors')

_ALLOWED_ORIGINS = set([
    'http://allowed1.example.com',
    'http://allowed2.example.com',
])


@app.route('/cors_multiple_origins', methods=['GET', 'OPTIONS'])
def supports_cors_multiple_origins():
    method = app.current_request.method
    if method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Method': 'GET,OPTIONS',
            'Access-Control-Allow-Origin': ','.join(_ALLOWED_ORIGINS),
            'Access-Control-Allow-Headers': 'X-Some-Header',
        }
        origin = app.current_request.headers.get('origin', '')
        if origin in _ALLOWED_ORIGINS:
            headers.update({'Access-Control-Allow-Origin': origin})
        return Response(
            body=None,
            headers=headers,
        )
    elif method == 'GET':
        return 'Foo'

```

  

배포한다.

배포한 lambda를 확인하면 다음과 같다. Access-Control-Allow-\*를 살펴보면 된다.

```
$ http OPTIONS {lambda_url}cors_multiple_origins
HTTP/1.1 200 OK
Access-Control-Allow-Headers: X-Some-Header
Access-Control-Allow-Method: GET,OPTIONS
Access-Control-Allow-Origin: http://allowed2.example.com,http://allowed1.example.com
...
중략
...

null
```

  

Tutorial: Policy Generation
---------------------------

다음과 같이 app.py를 수정한다.

```
import json
import boto3
from botocore.exceptions import ClientError

from chalice import NotFoundError, Chalice

app = Chalice(app_name="boto3_test")

S3 = boto3.client('s3', region_name='us-east-1')
BUCKET = {bucket}
PATH = 'andro-chalice-test'


@app.route('/objects/{key}', methods=['GET', 'PUT'])
def s3objects(key):
    fullpath_key = "/".join([PATH, key])
    request = app.current_request
    if request.method == 'PUT':
        S3.put_object(Bucket=BUCKET, Key=fullpath_key,
                      Body=json.dumps(request.json_body))
    elif request.method == 'GET':
        try:
            response = S3.get_object(Bucket=BUCKET, Key=fullpath_key)
            return json.loads(response['Body'].read())
        except ClientError as e:
            raise NotFoundError(key)



```

  

로컬 빌드나 배포하여 확인하나 기능상 차이가 없기에 로컬 빌드로 확인한다. 로컬로 빌드한다.

  

다음과 같이 로컬 chalice의 동작을 확인한다.

```
$ echo '{"foo":"bar"}' | http PUT localhost:8080/objects/banana
HTTP/1.1 200 OK
Content-Length: 4
Content-Type: application/json
Date: Tue, 17 Sep 2019 06:38:28 GMT
Server: BaseHTTP/0.6 Python/3.6.5

null

$ http localhost:8080/objects/banana
HTTP/1.1 200 OK
Content-Length: 13
Content-Type: application/json
Date: Tue, 17 Sep 2019 06:38:33 GMT
Server: BaseHTTP/0.6 Python/3.6.5

{
    "foo": "bar"
}
```

  

aws cli로 실제 버킷에 저장되었는지 확인한다.

```
$ s3 ls s3://{s3_address}/andro-chalice-test --recursive
2019-09-17 15:38:28         14 andro-chalice-test/banana
```

  

배포한다.

배포한 lambda의 동작을 확인한다.

```
$ echo '"red"' | http PUT {lambda_url}objects/apple
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 4
Content-Type: application/json
...
하략

null

$ http {lambda_url}objects/apple
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 3
Content-Type: application/json
Date: Tue, 17 Sep 2019 07:13:51 GMT
...
하략
```

  

  

수동으로 정책을 제공할 수 있다. 다음과 같은 경로에 정책에 관하여 정의해주면 된다. 이 부분은 추후 학습하여 수정할 예정이다.

```
<projectdir>/.chalice/policy.json
```

예) andro-chalice-test/policy-dev.json

  

Tutorial: Using Custom Authentication
-------------------------------------

문서에서 소개하는 인증방법은 다음과 같고, 이 중 Cognito User Pools를 제외한 내용을 실습한다.

*   API Key
    
*   AWS IAM
    
*   Cognito User Pools
    
*   Custom Auth Handler
    

  

app.py를 다음과 같이 수정한다.

```
from chalice import Chalice, IAMAuthorizer, CustomAuthorizer

app = Chalice(app_name="boto3_test")

iam_authorizer = IAMAuthorizer()
custom_authorizer = CustomAuthorizer(
    'MyCustomAuth', header='Authorization',
    authorizer_uri=('arn:aws:apigateway:region:lambda:path/2015-03-31'
                    '/functions/arn:aws:lambda:region:account-id:'
                    'function:FunctionName/invocations'))


@app.route('/authenticated', methods=['GET'], api_key_required=True)
def authenticated():
    return {"secure": True}


@app.route('/iam-role', methods=['GET'], authorizer=iam_authorizer)
def authenticated():
    return {"secure": True}


@app.route('/custom-auth', methods=['GET'], authorizer=custom_authorizer)
def authenticated():
    return {"secure": True}


```

  

다음과 같이 로컬 chalice의 동작을 확인한다.

```
$ http localhost:8080/authenticated
HTTP/1.1 200 OK
Content-Length: 15
Content-Type: application/json
Date: Tue, 17 Sep 2019 08:57:24 GMT
Server: BaseHTTP/0.6 Python/3.6.5
{
    "secure": true
}


$ http localhost:8080/iam-role
HTTP/1.1 200 OK
Content-Length: 15
Content-Type: application/json
Date: Tue, 17 Sep 2019 08:57:35 GMT
Server: BaseHTTP/0.6 Python/3.6.5
{
    "secure": true
}


$ http localhost:8080/custom-auth
HTTP/1.1 200 OK
Content-Length: 15
Content-Type: application/json
Date: Tue, 17 Sep 2019 08:57:40 GMT
Server: BaseHTTP/0.6 Python/3.6.5

{
    "secure": true
}
```

  

참고 자료
=====

*   AWS Chalice 기본 학습 공유
