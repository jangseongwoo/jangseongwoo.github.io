---
title:  "Celery를 활용한 ML 모델 빌드, 모델 정확성 평가, 배포"
excerpt: "이 글은 ML 모델 기반의 API서비스를 만든 후, 추가적으로 고도화에 대해 공부하고 개발한 부분을 남기고 공유하기 위해 작성했다. "

categories:
  - Celery
tags:
  - Celery

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 글은 ML 모델 기반의 API서비스를 만든 후, 추가적으로 고도화에 대해 공부하고 개발한 부분을 남기고 공유하기 위해 작성했다. 

이 문서는 Celery에 대해 기본적인 지식이 있다는 가정하에 문서가 진행된다. [Celery](https://docs.celeryproject.org/en/latest/index.html)를 모를 경우 링크를 참고한다. 

  

개발 환경
=====

* * *

테스트 환경은 다음과 같다.

*   Mac OS: Catalina 10.15.3
    
*   Python 3.7
    
*   Celery 4.4.0
    

  

개발 진행 목적
========

* * *

개발 진행 목적은 다음과 같은 기능을 가장 간단한 모델로 개발해 추후 ML 모델 빌드 기능의 고도화를 할 경우 참고할 수 있도록 개발해보는 것이다. 

*   Celery를 이용해 각기 다른 3가지 알고리즘이 적용된 ML 모델을 병렬로 3개 빌드한다.
    
*   3개 빌드된 모델에 대한 정확성을 평가 후 제일 높은 정확성을 가진 ML 모델을 서비스에 적용한다. 
    
*   적용된 모델에 대해 슬랙으로 리포팅을 받는다. 
    

  

개발 셋팅 과정
========

* * *

모델 빌드의 트리거는 Celery 스케줄러를 이용해 진행한다. 

Celery 스케줄러를 만들기 위해 프로젝트 폴더에 celery\_scheduler.py 파일을 만들고 다음과 같이 입력한다. 

```
from celery import Celery
from celery.schedules import crontab
import os
from dotenv import load_dotenv
from os.path import join, dirname

# env setting
try:
    if os.path.isfile('.env') == True:
        dotenv_path = join(dirname(__file__), '.env')
        load_dotenv(dotenv_path)
except Exception as e:
    print(e)

CRON_JOB_TIME_HOUR = int(os.getenv("CRON_JOB_TIME_HOUR", "5"))
CRON_JOB_TIME_MINUTE = int(os.getenv("CRON_JOB_TIME_MINUTE", "0"))
ENV_NAME = str(os.getenv("ENV_NAME"))
REDIS_URL = str(os.getenv("REDIS_URL"))

print("----------------------")
print("CRON_JOB_TIME_HOUR : {}, CRON_JOB_TIME_MINUTE: {}".format(CRON_JOB_TIME_HOUR, CRON_JOB_TIME_MINUTE))
print("ENV_NAME : {}".format(ENV_NAME))
print("REDIS_URL : {}".format(REDIS_URL))
print("----------------------")

if ENV_NAME == "test":
    app = Celery('celery_test', backend='redis://localhost', broker='redis://localhost')
else:    
    app = Celery('celery_test', backend=REDIS_URL, broker=REDIS_URL)

app.conf.timezone = 'Asia/Seoul'

# Set the beat scheduler.
app.conf.beat_schedule = {
    'test_models': {
        'task': 'task_ml_first.make_ml_model_build_job',
        'schedule': crontab(hour=CRON_JOB_TIME_HOUR, minute=CRON_JOB_TIME_MINUTE),
        'options' : { "queue": "test_model_build_q" },
    }
}

if __name__ == "__main__":
    print("start as main")
    app.start()
```

Celery 스케줄러가 스케줄링 잡을 Broker에 등록하면 Worker가 직접 태스크를 받아 처리해준다. Worker를 만들기 위해 celery\_worker.py 파일을 만들고 아래와 같이 파일의 내용을 입력한다. 

```
from celery import Celery
from dotenv import load_dotenv
from os.path import join, dirname
import os

# env setting
if os.path.isfile('.env') == True:
    dotenv_path = join(dirname(__file__), '.env')
    load_dotenv(dotenv_path)

CRON_JOB_TIME_HOUR = int(os.getenv("CRON_JOB_TIME_HOUR", "5"))
CRON_JOB_TIME_MINUTE = int(os.getenv("CRON_JOB_TIME_MINUTE", "0"))
ENV_NAME = str(os.getenv("ENV_NAME"))
REDIS_URL = str(os.getenv("REDIS_URL"))

# set celery work
if ENV_NAME == "test":
    app = Celery("celery_worker",
                        backend="redis://localhost",
                        broker="redis://localhost",
                        include=["task_ml_first"])
else:
    app = Celery("celery_worker",
                        backend=REDIS_URL,
                        broker=REDIS_URL,
                        include=["task_ml_first"])

# task routing config test
app.conf.update = {
    'generate_models': {
        'task': 'task_ml_first.complete_message_print_model_build',
        'options' : { "queue": "test_model_build_q" },
    },
}

app.conf.timezone = "Asia/Seoul"

if __name__ == "__main__":
    app.start()
```

Worker가 실제 어떤 작업을 실행하는 지 정의하기 위한 task\_ml\_first.py 파일을 만들고 내용을 다음과 같이 입력한다. 

```
import os
import time
from datetime import datetime
from celery_worker import app
from celery import group, chord
from os.path import join, dirname
from dotenv import load_dotenv
import random
from slack_fucntion import send_message_to_slack

if os.path.isfile('./.env') == True:
    dotenv_path = join(dirname(__file__), '.env')
    load_dotenv(dotenv_path)

ENV_NAME = str(os.getenv("ENV_NAME"))


def deploy_model(model_name):
    print("{} is deploy".format(model_name))
    send_message_to_slack({"text":"{} is deployed".format(model_name)})



@app.task(name='task_ml_first.build_ml_models')
def build_ml_models(results):
    print("{} test model build".format(results))
    max_num = 0

    for result in results:
        if max_num < result['value']:
            max_num = result['value']
    
    print(max_num)

    for result in results:
        if max_num == result['value']:
            model_name = result['model_name']
        
    deploy_model(model_name)

    return True


@app.task(name='task_ml_first.first_method_ml_model_build')
def first_method_ml_model_build():
    random_number = random.randrange(1,10)

    print("first_method_ml_model_build() start!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    time.sleep(random_number)
    print("first_method_ml_model_build() end!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    return {"model_name" : "first_method_ml_model_build", "value": random_number}


@app.task(name='task_ml_first.second_method_ml_model_build')
def second_method_ml_model_build():
    random_number = random.randrange(1,10)

    print("second_method_ml_model_build() start!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    time.sleep(random_number)
    print("second_method_ml_model_build() end!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    return {"model_name" : "second_method_ml_model_build", "value": random_number}


@app.task(name='task_ml_first.third_method_ml_model_build')
def third_method_ml_model_build():
    random_number = random.randrange(1,10)

    print("third_method_ml_model_build() start!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    time.sleep(random_number)
    print("third_method_ml_model_build() end!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    return {"model_name" : "third_method_ml_model_build", "value": random_number}


@app.task(name='task_ml_first.make_ml_model_build_job')
def make_ml_model_build_job():
    task_signature_list = []
    
    try:
        print("make_ml_model_build_job executed")
        
        task_signature_list.append(first_method_ml_model_build.signature())
        task_signature_list.append(second_method_ml_model_build.signature())
        task_signature_list.append(third_method_ml_model_build.signature())

        model_build_work_chord = chord(task_signature_list, build_ml_models.s())
        model_build_work_chord.apply_async(queue="test_model_build_q")  # queue 지정
        print("make_ml_model_build_job.apply_async() called")
    except Exception as e:
        print(e)
```

슬랙 메시지를 보내기 위해 slack\_fucntion.py 파일을 만들고 미리 작성한 코드를 아래와 같이 입력한다. webhook\_url은 미리 각자 생성한 url를 입력하면 된다. 

```
import json
import requests
import os


def send_message_to_slack_channel_using_slack_api(message, webhook_url):
    response = requests.post(
            webhook_url, data=json.dumps(message),
            headers={'Content-Type': 'application/json'}
    )
    
    return response


def send_message_to_slack(message):
    webhook_url = ""
    response = send_message_to_slack_channel_using_slack_api(message, webhook_url)

    if response.text != 'ok':
        print('error_function_name', 'send_message_to_slack')
        print('error_message', response.text)
        raise Exception
```

  

Celery 실행 명령
============

* * *

Celery 스케줄러 실행 명령은 다음과 같다. 

```
$ celery -A celery_scheduler beat --loglevel=debug
```

Celery worker 실행 명령은 다음과 같다. 

```
$ celery -A celery_worker worker --loglevel=debug --queues=test_model_build_q --concurrency=3
```

결과
==

* * *

결과는 미리 설정된 스케줄링 시간에 다음과 같은 형태의 메시지가 슬랙에 온다.

```
{}_method_ml_model_build is deployed
```

이로써 Celery를 활용해 가장 정확도가 높은 모델을 서비스에 적용하고 슬랙으로 알림 받는 기능을 가장 간단한 형태로 개발을 완료했다. 추후 프로덕션 개발 시 참고해 진행하면 될 것 같다.
