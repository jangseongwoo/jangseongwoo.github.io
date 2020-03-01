---
title:  "Python logging module 기초적인 사용법에 대한 학습"
excerpt: "이 문서는 Python Logging 모듈에 대한 공식 문서 중 아래와 같은 내용을 정리하고 공유하기 위하여 작성했다."

categories:
  - Logging
tags:
  - Python
  - Logging

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
=====

* * *

이 문서는 Python Logging 모듈에 대한 공식 문서 중 아래와 같은 내용을 정리하고 공유하기 위하여 작성했다.

*   [Logging HOWTO](https://docs.python.org/ko/3/howto/logging.html#logging-advanced-tutorial)
    
    *   튜토리얼
        
*   [Logging facility for Python](https://docs.python.org/ko/3/library/logging.html)
    
    *   로깅 모듈과 관련된 클래스, 메서드 등 설명이 나와있는 문서
        
*   [Logging cook book](https://docs.python.org/3/howto/logging-cookbook.html#logging-cookbook)
    
    *   다양한 사례가 나와 있는 문서
        

실행 환경
=====

* * *

다음과 같은 환경에서 학습을 진행했다.

*   Python 3.7.5
    
*   MacOS Catalina
    

학습한 내용
======

* * *

파이썬 로깅 모듈 중 다음과 같은 내용을 학습했다.

*   로거
    
*   핸들러
    
*   포메터
    
*   필터
    
*   멀티 핸들러 사용 (표준 출력, 파일 출력)
    
*   로그 로테이팅
    

Logging 기초 자습서
==============

* * *

[Logging 기초 자습서](https://docs.python.org/ko/3/howto/logging.html#basic-logging-tutorial)는 로깅 모듈에 대한 기본적인 기능을 다루고 있다. 따라서 해당 문서를 참조해 기본 기능을 학습하도록 한다.

해당 문서는 다음과 같은 내용을 포함하고 있다.

*   로깅을 사용할 때
    
*   로깅 사용의 간단한 예
    
*   파일에 로깅하기
    
*   여러 모듈에서의 로깅
    
*   변수 데이터 로깅
    
*   표시된 메시지의 포맷 변경
    
*   메시지에 날짜/시간 표시
    

필터
==

* * *

필터에 관한 자세한 설명은 [Logging facility for Python - Filter 객체](https://docs.python.org/ko/3/library/logging.html#filter-objects)를 참고한다.

해당 문서로 필터에 관하여 이해되지 않는 부분이 있어 [https://has3ong.tistory.com/382](https://has3ong.tistory.com/382)에서 발췌한 내용을 남겨두었다.

**Filter**

로그 레코드가 로거에서 핸들러로 넘겨질 때, 필터를 사용해서 로그 레코드에 추가적인 제어를 할 수 있다.

필터를 적용하면 로그 처리 기준을 추가할 수 있다.

예를 들어 필터를 추가하여 ERROR 메시지 중에서 특정 소스로부터 오는 메시지만 핸들러로 넘길 수 있습니다.

  

로그 레코드는 로거에서 로그를 기록할 때 호출되는 인스턴스이다.

자세한 내용은 [Logging facility for Python - LogRecord 객체](https://docs.python.org/ko/3/library/logging.html#logrecord-objects) 참고 한다.

아래는 [Logging cook book - 문맥 정보 전달에 필터 사용하기](https://docs.python.org/ko/3/howto/logging-cookbook.html#using-filters-to-impart-contextual-information)를 따라하며 실습한 내용이다.

```python
import logging
from random import choice

class ContextFilter(logging.Filter):
    USERS = ['wind', 'harry', 'kevin']
    IPS = ['123.231.231.123', '127.0.0.1', '192.168.0.1']

    def filter(self, record):

        record.ip = choice(ContextFilter.IPS)
        record.user = choice(ContextFilter.USERS)
        return True


if __name__ == '__main__':
    levels = (logging.DEBUG, logging.INFO, logging.WARNING,
              logging.ERROR, logging.CRITICAL)
    logging.basicConfig(level=logging.DEBUG,
                        format='%(asctime)-15s %(name)-5s %(levelname)-8s IP: %(ip)-15s User: %(user)-8s %(message)s')
    a1 = logging.getLogger('a.b.c')
    a2 = logging.getLogger('d.e.f')

    f = ContextFilter()

    a1.addFilter(f)
    a2.addFilter(f)

    a1.debug('A debug message')
    a1.info('An info message with %s', 'some parameters')

    for x in range(10):
        lvl = choice(levels)
        lvlname = logging.getLevelName(lvl)
        a2.log(lvl, 'A message at %s level with %d %s',
               lvlname, 2, 'parameters')
```

  

```bash
$ python3 main.py
2019-10-18 11:54:03,246 a.b.c DEBUG    IP: 192.168.0.1     User: wind     A debug message
2019-10-18 11:54:03,249 a.b.c INFO     IP: 123.231.231.123 User: harry    An info message with some parameters
2019-10-18 11:54:03,249 d.e.f ERROR    IP: 192.168.0.1     User: kevin    A message at ERROR level with 2 parameters
2019-10-18 11:54:03,250 d.e.f CRITICAL IP: 127.0.0.1       User: wind     A message at CRITICAL level with 2 parameters
2019-10-18 11:54:03,250 d.e.f WARNING  IP: 127.0.0.1       User: wind     A message at WARNING level with 2 parameters
2019-10-18 11:54:03,250 d.e.f DEBUG    IP: 192.168.0.1     User: kevin    A message at DEBUG level with 2 parameters
2019-10-18 11:54:03,250 d.e.f INFO     IP: 123.231.231.123 User: kevin    A message at INFO level with 2 parameters
2019-10-18 11:54:03,251 d.e.f INFO     IP: 127.0.0.1       User: wind     A message at INFO level with 2 parameters
2019-10-18 11:54:03,251 d.e.f ERROR    IP: 127.0.0.1       User: harry    A message at ERROR level with 2 parameters
2019-10-18 11:54:03,251 d.e.f ERROR    IP: 123.231.231.123 User: harry    A message at ERROR level with 2 parameters
2019-10-18 11:54:03,252 d.e.f CRITICAL IP: 127.0.0.1       User: wind     A message at CRITICAL level with 2 parameters
2019-10-18 11:54:03,252 d.e.f WARNING  IP: 192.168.0.1     User: harry    A message at WARNING level with 2 parameters
```

멀티 핸들러 사용
=========

* * *

로거 객체에 2종류의 핸들러(StreamHandler - 표준출력, FileHandler - 파일출력)를 추가하는 실습을 진행한다.

다음은 실습한 내용의 Python 코드이다.

```python
import logging

seong_logger = logging.getLogger("seongwoo")

seong_logger.setLevel(logging.DEBUG)

seong_logger.addHandler(logging.FileHandler("log/seong.log"))
seong_logger.addHandler(logging.StreamHandler())

seong_logger.info("test")
```

표준 출력과 파일 출력(seong.log)이 되는 지 확인하였다.

```bash
$ python3 main.py
test

$ cat seong.log
test
```

로그 로테이팅
=======

* * *

[logging.handlers](https://docs.python.org/ko/3/library/logging.handlers.html)를 보면 로그 로테이팅과 관련하여 다음과 같은 3가지 핸들러를 설명하고 있다.

*   BaseRotatingHandler
    
*   RotatingFileHandler
    
*   TimedRotatingFileHandler
    

이 중에서 RotatingFileHandler와 TimedRotatingFileHandler에 대해 학습 및 실습한다.

RotatingFileHandler
-------------------

```bash
class logging.handlers.RotatingFileHandler(filename, mode='a', maxBytes=0, backupCount=0, encoding=None, delay=False)
```

RotatingFileHandler의 자세한 설명은 [logging.handler - rotatingfilehandler](https://docs.python.org/ko/3/library/logging.handlers.html#rotatingfilehandler)를 참고한다. 문서 내용 중 기록될 필요가 있다고 생각되는 내용만 정리했다.

*   maxBytes 파라미터는 로그 파일 최대 허용 크기를 의미한다. maxBytes가 0일 경우 로그 로테이팅은 발생하지 않는다.
    
*   backupCount 파라미터는 롤오버(로그 로테이팅)가 발생하였을 때 백업 파일의 개수를 의미한다.   
    가장 최근에 발생한 로그는 filename 파일에 저장되어있으며 filename.1, filename.2 ... 형식로 저장된다.
    

다음은 [Logging cook book - 파일 회전하기](https://docs.python.org/ko/3/howto/logging-cookbook.html#using-file-rotation)에 코드를  일부 수정하여 실습한 코드이다.

```python
import glob
import logging
import logging.handlers

LOG_FILENAME = 'logging_rotatingfile_example.out'

my_logger = logging.getLogger("MyLogger")
my_logger.setLevel(logging.DEBUG)

handlers = logging.handlers.RotatingFileHandler(
    LOG_FILENAME, maxBytes=200, backupCount=2)
my_logger.addHandler(handlers)

for i in range(20):
    my_logger.debug('file log rotating test line %3d' % i)

logfiles = glob.glob('%s*' % LOG_FILENAME)

for filename in logfiles:
    print(filename)
```

아래의 코드를 여러번 실행할 경우에는 mode 인자의 디폴트 값이 'a'이므로 기존에 생성 되었던 로그 파일들을 삭제하고 실행 해야 한다.

```bash
$ python3 file_rotating_test.py
logging_rotatingfile_example.out.2
logging_rotatingfile_example.out.1
logging_rotatingfile_example.out
```

TimedRotatingFileHandler
------------------------

```bash
class logging.handlers.TimedRotatingFileHandler(filename, when='h', interval=1, backupCount=0, encoding=None, delay=False, utc=False, atTime=None)
```

TimeRotatingHandler의 자세한 설명은 [logging.handler - timerotatinghandler](https://docs.python.org/ko/3/library/logging.handlers.html#timedrotatingfilehandler)를 참고한다. 문서 내용 중 기록될 필요가 있다고 생각되는 내용만 정리했다.

*   1분마다 롤오버가 되도록 설정되어 있는데, 5분간 로그가 발생하지 않으면 롤오버가 발생하지 않는다.
    

다음과 같은 시나리오를 바탕으로 TimeRotatingHandler를 테스트했다.

1.  로거 인스턴스 생성후 시작시간 측정
    
2.  시작 시간으로 부터 1초, 5초, 6초뒤 현재 시간 로그 출력
    
3.  생성된 로그 파일명 출력
    

위의 시나리오를 바탕으로 다음과 같은 파이썬 코드를 작성하였다.

```python
import glob
import logging
import logging.handlers
from time import time, sleep

LOG_FILENAME = 'timerotating_logtest.out'


def main():
    my_logger = logging.getLogger("MyLogger")
    my_logger.setLevel(logging.DEBUG)

    handlers = logging.handlers.TimedRotatingFileHandler(
        LOG_FILENAME, when='s', interval=1, backupCount=10)
    my_logger.addHandler(handlers)

    start_time = time()

    delay_timetable = [1., 5., 6.]

    for delay_time in delay_timetable:
        while True:
            if start_time + delay_time < time():
                my_logger.debug('time log rotating test - %f' % time())
                break

    logfiles = glob.glob('%s*' % LOG_FILENAME)

    for filename in logfiles:
        print(filename)


if __name__ == "__main__":
    main()
```

  

```bash
$ python3 time_rotating_test.py
timerotating_logtest.out.2019-10-17_20-05-52
timerotating_logtest.out
timerotating_logtest.out.2019-10-17_20-05-56
timerotating_logtest.out.2019-10-17_20-05-51
```

실행 결과를 통해 시작 시간으로부터 1초, 5초, 6초뒤 로그가 출력된 것을 알 수 있으며 "timerotating\_logtest.out.2019-10-17\_20-05-51" 파일을 통하여 처음 로거를 생성하고 1초뒤 로그가 출력된 것을 알 수 있다.
