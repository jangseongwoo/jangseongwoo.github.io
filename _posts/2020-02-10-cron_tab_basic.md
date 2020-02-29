---
title:  "Crontab 기본적인 사용법 정리"
excerpt: "이 문서는 Crontab에 대해 학습한 부분들을 정리하고 공유하기 위해 작성하였다."

categories:
  - Crontab
tags:
  - Crontab

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 목적
=====

* * *

이 문서는 Crontab에 대해 학습한 부분들을 정리하고 공유하기 위해 작성하였다.

Crontab 설명
==========

* * *

Crobtab에 대한 설명하면 다음과 같다. 

*   소프트웨어 유틸리티 Cron은 유닉스 계열 컴퓨터 운영 체제의 시간 기반 잡 스케줄러이다. 소프트웨어 환경을 설정하고 관리하는 사람들은 작업을 고정된 시간, 날짜, 간격에 주기적으로 실행할 수 있도록 스케줄링하기 위해 Cron을 사용한다. (출처- [위키백과](https://ko.wikipedia.org/wiki/Cron))
    

Crontab 기본적인 명령어
================

* * *

Contab에 등록된 작업을 보기 위해 다음과 같은 명령어를 입력한다. 

```
$ crontab -l

0 11 * * * /Users/st/test/mysql_to_mysql_shell_sciprt/etl.sh > /Users/st/test/mysql_to_mysql_shell_sciprt/logs.log
```

Crontab에 작업을 등록하기 위해서 다음과 같은 명령어를 입력한다. 다음과 같은 명령어를 입력시 편집화면으로 진입하는데 이 화면에서 등록할 작업을 설정하면 된다.

```
$ crontab -e
```

Crontab을 지우기 위해서는 다음과 같은 명령어를 입력하면 된다.

```
$ crontab -r
```

Crontab 시간 등록 형식
================

* * *

Crontab의 시간 등록 형식은 다음과 같다.

```
* * * * *  실행할 명령어
┬ ┬ ┬ ┬ ┬
│ │ │ │ │
│ │ │ │ │
│ │ │ │ └───────── 요일 (0 - 6) (0:일요일, 1:월요일, 2:화요일, …, 6:토요일)
│ │ │ └───────── 월 (1 - 12)
│ │ └───────── 일 (1 - 31)
│ └───────── 시 (0 - 23)
└───────── 분 (0 - 59)
```

Crontab 등록 예시
=============

* * *

Crontab에 1분마다 스크립트를 실행하는 작업을 등록하는 예시는 다음과 같다.

```
* * * * * /root/every_1min.sh
```

Crontab에 10분마다 스크립트를 실행하는 작업을 등록하는 예시는 다음과 같다.

```
*/10 * * * * /root/every_10min.sh
```

나머지 예시는 다음 링크를 참조한다.

*   [https://zetawiki.com/wiki/리눅스\_반복\_예약작업\_cron,\_crond,\_crontab](https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_%EB%B0%98%EB%B3%B5_%EC%98%88%EC%95%BD%EC%9E%91%EC%97%85_cron,_crond,_crontab) 
    

Crontab 로깅하는 방법
===============

* * *

Crontab에 등록된 작업이 실행된 기록을 남기고 싶다면 다음과 같이 Crontab에 작업을 등록하면 된다.

```
0 11 * * * 실행할 명령어 > 로그를 남길 파일 이름
```

참고 자료
=====

* * *

다음은 참고한 자료의 이름과 링크이다. 

*   Crontab 설명 위키백과: [https://ko.wikipedia.org/wiki/Cron](https://ko.wikipedia.org/wiki/Cron)
    
*   리눅스 반복 예약작업 cron, crond, crontab: [https://zetawiki.com/wiki/리눅스\_반복\_예약작업\_cron,\_crond,\_crontab](https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_%EB%B0%98%EB%B3%B5_%EC%98%88%EC%95%BD%EC%9E%91%EC%97%85_cron,_crond,_crontab)
    
*   리눅스 크론탭(Linux Crontab) 사용법: [https://jdm.kr/blog/2](https://jdm.kr/blog/2)
