---
title:  "Python logging을 활용해 Flask에서 logging하는 방법"
excerpt: "Flask Logging 하는 방법"

categories:
  - Logging
tags:
  - Python
  - Logging
  - Flask

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---


Flask Logging 하는 방법
===================

python logging 모듈을 사용하여 로그를 남겨봅시다.
----------------------------------

*   logging 모듈은 python에서 기본으로 제공하는 library입니다. 따라서 pip로 따로 설치할 필요가 없습니다.
    
*   가장 기본적인 방식은 아래와 같습니다.
    

```
from flask import Flask
import logging
 
logging.basicConfig(filename = "logs/project.log", level = logging.DEBUG)
application=Flask(__name__)
 
@application.route("/")
def hello():
	return "hello"
  

if __name__=="__main__":
    application.run(host="0.0.0.0", debug=True) 


```

*   basicConfig 안에 filename은 로그파일을 저장할 경로입니다.
    
*   level은 CRITICAL, ERROR, WARNING, INFO, DEBUG 가 있습니다. 
    
*   CRITICAL로 지정하면 CRITICAL한 상황일 때만 로그로 기록됩니다.
    
*   WARNING로 지정하면 CRITICAL, ERROR, WARNING한 상황일 때만 로그로 기록됩니다.
    
*   위 처럼 설정했을 때 아래와 같이 로그가 남게됩니다.
    

INFO:werkzeug:127.0.0.1 - - \[14/Feb/2019 14:40:42\] "POST /{project}/api/v1.0/test HTTP/1.1" 200 -

INFO:werkzeug: \* Detected change in '/{project_path}/app.py', reloading

INFO:werkzeug: \* Restarting with stat

WARNING:werkzeug: \* Debugger is active!

  

*   위 로그는 내가 원하는 정보가 아닐 수 있습니다. 로그를 남길때 원하는 정보만 남기고 싶다면 커스텀하면 됩니다.
    

```
import logging
import datetime
from pytz import timezone

logging.basicConfig(filename = "logs/test.log", level = logging.DEBUG)

def log(request, message):
    log_date = get_log_date()
    log_message = "{0}/{1}/{2}".format(log_date, str(request), message)
    logging.info(log_message)
def error_log(request, error_code, error_message):
    log_date = get_log_date()
    log_message = "{0}/{1}/{2}/{3}".format(log_date, str(request), error_code, error_message)
    logging.info(log_message)

def get_log_date():
    dt = datetime.datetime.now(timezone("Asia/Seoul"))
    log_date = dt.strftime("%Y%m%d_%H:%M:%S")
    return log_date


```

*   위에서 커스텀한 로그를 사용하면 됩니다.
    

```
from flask import Flask
import log


logging.basicConfig(filename = "logs/test.log", level = logging.DEBUG)
application=Flask(__name__)


@application.route("/")
def hello():
	log.log(request, "hello route")
	return "hello"
  

if __name__=="__main__":
    application.run(host="0.0.0.0", debug=True) 
```

*   실행을 하면 아래와 같이 원하는 정보를 남길 수 있습니다.
    

INFO:werkzeug: \* Restarting with stat

WARNING:werkzeug: \* Debugger is active!

INFO:werkzeug: \* Debugger PIN: 137-884-933

INFO:root:20190218\_16:08:42/<Request '[http://localhost:5000/project/api/v1.0/test](http://localhost:5000/project/api/v1.0/test)' \[POST\]>/

INFO:root:20190218\_16:08:51/<Request '[http://localhost:5000/projectct/api/v1.0/test](http://localhost:5000/project/api/v1.0/test)' \[POST\]>/500/(17, 'File exists')
`
INFO:werkzeug:127.0.0.1 - - \[18/Feb/2019 16:08:51\] "POST /project/api/v1.0/test HTTP/1.1" 500 -

INFO:werkzeug: \* Detected change in '/Users/ns/project/project\_ml/project.py', reloading`
