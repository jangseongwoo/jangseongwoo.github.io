---
title:  "GitLab Testing, coverage 측정 자동화"

categories:
  - Gitlab
tags:
  - Gitlab
  - Test

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 문서의 목적은 GitLab에서 GitLab Testing, coverage 측정 자동화에 대한 내용을 정리하고 공유하기 위해 작성했다. 

  

기술 스택
=====

* * *

사용한 기술 스택은 다음과 같다. 

*   Python 3.7
    
*   Pytest 5.1.1
    

  

GitLab Testing, coverage 측정 자동화
===============================

* * *

GitLab Testing, coverage 측정 자동화를 하기 위해 사전 필요한 지식에 대해서 설명을 진행한다. 

GitLab Runner
-------------

Gitlab Runner는 Gitlab에서 Continuous integration service를 위해 제공해주는 오픈소스이다. Gitlab Runner는 Go언어를 이용해 개발되었으며 Single binary로 구동되기 때문에 특정 언어에 대한 Requirements가 없다. GNU/Linux, MacOS, Windows OS에서 작동하도록 설계 되어 있다. 

우리는 Continuous integration를 구축하기 위해 Gitlab Runner를 사용할 것이다. [Continuous integration](https://ko.wikipedia.org/wiki/%EC%A7%80%EC%86%8D%EC%A0%81_%ED%86%B5%ED%95%A9)에 대한 것은 링크를 참고한다. 

  

GitLab Runner를 이용해 Test 자동화하기 
------------------------------

GitLab Runner를 이용해 Test 자동화하기 위해서 다음과 같은 순서로 진행한다. 

*   .gitlab-ci.yml 파일 작성하기 
    
*   .gitlab-ci.yml 파일 원격 저장소에 푸쉬하기 
    
*   GitLab Parser 설정해 Readme.md에서 테스트 커버리지 볼 수 있게 하기 
    

  

**.gitlab-ci.yml 파일 작성하기** 

다음과 같은 명령어를 이용해 파일을 생성하고 내용을 입력한다.

```
$ touch .gitlab-ci.yml
```

  

```
image: python:3.7

stages:
  - test

before_script:
  - python -V
  - pip install -r $(pwd)/requirements.txt

test:
  stage: test
  script:
    - pytest -v $(pwd)/tests/chalicelib
    - pytest --cov=$(pwd)/chalicelib $(pwd)/tests/chalicelib
```

위의 코드 내용을 설명하자면 다음과 같다.

*   Image: 생성할 컨테이너 이미지 
    
*   stage: CI에서 진행되는 1개의 단계, 이 이름으로 설정된 작업이 생성되어 차례대로 진행된다. 
    
*   sciprt: sciprt에서 지정한 명령어들은 순서대로 실행된다.
    

  

**.gitlab-ci.yml 파일 원격 저장소에 푸쉬하기** 

```
$ git add .gitlab-ci.yml
$ git commit -m "add .gitlab-ci.yml"
$ git push origin master 
```

  

**GitLab Parser 설정해** [**Readme.md**](http://readme.md/)**에서 테스트 커버리지 볼 수 있게 하기** 

GitLab Parser는 Project의 메뉴 중 Settings → CI/CD → General pipelines의 하위 항목들 중 Test coverage parsing에서 해당 Test library 혹은 언어에 맞는 정규식을 복사해 붙여넣고 저장하면 된다. 

README.md에서 아이콘으로 Pipeline 성공 여부와 Coverage report를 보고 싶다면 General pipelines의 하위 항목 중 Pipeline status, Coverage report의 Markdown의 내용을 복사해 README.md에 붙여넣기 하면 된다. 

그림은 다음과 같다. 

![](/assets/images/gitlab1.jpg)
![](/assets/images/gitlab2.jpg)
![](/assets/images/gitlab3.jpg)



  

참고 문서
=====

* * *

참고 문서는 다음과 같다. 

*   GitLab Runner 공식 문서: [https://docs.gitlab.com/runner/](https://docs.gitlab.com/runner/)
