---
title:  "Metabase Health check api 관련 조사"
excerpt: "이 글의 목적은 Metabase의 모니터링 자동화를 위해 서비스의 정상 작동 여부를 알 수 있는 API 관련해 조사한 것을 남기기 위해 작성했다. "

categories:
  - Metabase
tags:
  - Metabase
  - Metabase_Health_check_API

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 글의 목적은 Metabase의 모니터링 자동화를 위해 서비스의 정상 작동 여부를 알 수 있는 API 관련해 조사한 것을 남기기 위해 작성했다. 

정상 작동 여부 체크 API 조사
==================

* * *

정확하게 공식문서에서 정상 작동 여부를 체크할 수 있는 API는 나와있지 않다. 그러나 구글 검색 결과 아래와 같은 API가 있다는 것을 확인했다. 

```
API: /api/health
사용 예: http://localhost:port-number-here/api/health
```

아래와 같은 명령어를 입력해 로컬에서 Metabase를 Docker로 실행한다.

```
$ docker run -d -p 3000:3000 --name metabase metabase/metabase:v0.32.4
```

API 테스트를 위해 아래와 같은 명령어를 입력하고 결과를 확인한다. 

```
$curl http://localhost:3000/api/health

{"status":"ok"}
```

해당 API가 정상 작동 여부를 알려주는 API인지 정확한 확인을 위해 공식문서를 조사했고 아래와 같은 내용을 확인했다. 

```
발췌 1: The Application health check URL is how Elastic Beanstalk knows when the application is ready to run. You must set this to /api/health.


발췌 2: The internal port isn’t being remapped correctly
How to detect this:
Run docker ps and look at the port mapping Run curl http://localhost:port-number-here/api/health. This should return a response with a JSON response like:

{"status":"ok"}
```

공식문서를 통해 /api/health API가 정상 작동 여부를 확인하는 용도의 API라는 것을 추정할 수 있으나 정확하지 않아 추후 조사가 더 필요하다. 

링크는 다음과 같다. 

*   발췌 1 링크: [https://www.metabase.com/docs/latest/operations-guide/running-metabase-on-elastic-beanstalk.html](https://www.metabase.com/docs/latest/operations-guide/running-metabase-on-elastic-beanstalk.html)
    
*   발췌 2 링크: [https://www.metabase.com/docs/latest/troubleshooting-guide/docker.html](https://www.metabase.com/docs/latest/troubleshooting-guide/docker.html)
    

참고문서
====

* * *

*   Metabase 공식 문서: [https://www.metabase.com/docs](https://www.metabase.com/docs/latest/troubleshooting-guide/docker.html)