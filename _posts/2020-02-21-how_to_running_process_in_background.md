---
title:  "Linux환경에서 Process background에서 실행하는 방법, 프로세스 확인, 종료하는 방법"
excerpt: "이 문서는 Linux환경에서 Process background에서 실행하는 방법에 대해 정리하기 위해 작성했다."

categories:
  - Linux
tags:
  - Linux

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 문서는 Linux환경에서 Process background에서 실행하는 방법에 대해 정리하기 위해 작성했다. 

  

Linux환경에서 Process background에서 실행하는 방법
======================================

* * *

Linux 환경에서 터미널을 이용해 특정 작업을 실행할 경우 Foreground, Background로 Process를 실행할 수 있다. Foreground로 실행할 경우에는 중간에 터미널을 종료하게 되면 실행한 Process도 같이 종료하게 된다. 

터미널을 종료할 경우에도 Process가 계속 실행되게 하고 싶다면 Process를 Background 방식으로 실행해야 되며 실행하는 명령어는 다음과 같다. 

```
your_command &
```

명령어 입력할 시 응답 예시는 다음과 같다. 

```
[1] 27255
```

  

Linux환경에서 background로 실행되고 있는 특정 Process를 확인하는 방법
=================================================

* * *

다음과 같은 명령어로 Linux환경에서 background로 실행되고 있는 특정 Process를 확인할 수 있다. 

```
ps -ef | grep "your process name"
```

명령어 입력할 시 응답 예시는 다음과 같다. 

```
501 26652     1   0 12:00PM ttys001    0:00.27 /Users/st/test/celery_chord_test/.venv/bin/python3.7 /Users/st/test/celery_chord_test/.venv/bin/celery -A celery_scheduler beat --loglevel=debug -f logs/celery_beat.log
501 27255 15184   0 12:01PM ttys001    0:00.45 /Users/st/test/celery_chord_test/.venv/bin/python3.7 /Users/st/test/celery_chord_test/.venv/bin/celery -A celery_worker worker --loglevel=debug --queues=test_model_build_q --concurrency=3 -f logs/celery_worker.log
501 27270 27255   0 12:01PM ttys001    0:00.04 /Users/st/test/celery_chord_test/.venv/bin/python3.7 /Users/st/test/celery_chord_test/.venv/bin/celery -A celery_worker worker --loglevel=debug --queues=test_model_build_q --concurrency=3 -f logs/celery_worker.log
501 27271 27255   0 12:01PM ttys001    0:00.01 /Users/st/test/celery_chord_test/.venv/bin/python3.7 /Users/st/test/celery_chord_test/.venv/bin/celery -A celery_worker worker --loglevel=debug --queues=test_model_build_q --concurrency=3 -f logs/celery_worker.log
501 27272 27255   0 12:01PM ttys001    0:00.04 /Users/st/test/celery_chord_test/.venv/bin/python3.7 /Users/st/test/celery_chord_test/.venv/bin/celery -A celery_worker worker --loglevel=debug --queues=test_model_build_q --concurrency=3 -f logs/celery_worker.log
501 27408 15184   0 12:01PM ttys001    0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn celery
```

  

Linux환경에서 background로 실행되고 있는 특정 Process를 종료하는 방법
=================================================

* * *

다음과 같은 명령어로 Linux환경에서 background로 실행되고 있는 특정 Process를 종료할 수 있다. 

```
pkill -9 -f "celery"
```

명령어 입력시 응답이 아무것도 안나오는 경우가 있다.  

제대로 종료됬는 지 확인하고 싶다면 위에 설명한 grep 명령어를 이용해 확인하도록 한다. 

  
참고 자료
========

* * *

참고 자료는 다음과 같다.

*   [https://linuxhandbook.com/run-process-background/](https://linuxhandbook.com/run-process-background/)
