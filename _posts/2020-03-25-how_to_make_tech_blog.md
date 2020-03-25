---
title:  "Github page와 jekyll을 이용해 개발 블로그 만들기 - Jekyll 설치하는 방법과 블로그 생성하기"
excerpt: "이 포스트에서는 어떻게 기술 블로그를 Github과 Jekyll을 이용해서 만들 수 있는 지 설명한다. "

categories:
  - Jekyll
tags:
  - Jekyll

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---


목적
==

* * *

이 문서의 목적은 Github page와 Jekyll을 이용해 개발 블로그 만드는 법을 정리하고 공유하기 위해 작성했다.

  

테스트 환경
======

* * *

테스트 환경은 다음과 같다. 

*   iMac Catalina 10.15.3
    

사전 필요
=====

* * *

이 문서 가이드에 따라 진행하기 위해서는 다음과 같은 것들은 미리 설치가 되어 있어야 한다. 

*   Xcode
    
*   Terminal
    

Jekyll 설치하기 
============

* * *

Jekyll을 설치하기 위해 다음과 같은 순서로 설치를 진행한다.

*   루비 설치 
    
*   Jekyll 사이트 생성 
    

루비 설치
-----

다음과 같은 명령어를 입력한다. 

```
$ brew install ruby
$ echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.bash_profile
```

다음과 같은 명령어를 입력한다. 정상적인 설치가 됬는 지 확인한다. 설치한 시점에 따라 버전은 바뀔 수 있으니 결과는 참고만 한다. 

```
$ ruby -v

ruby 2.6.3p62 (2019-04-16 revision 67580) [universal.x86_64-darwin19]
```

Jekyll 사이트 생성
-------------

다음과 같은 명령어를 입력한다. 

```
$ gem install jekyll bundler

$ jekyll new myblog
$ cd myblog

$ bundle exec jekyll serve # jekyll 사이트 실행 명령
```

이제 브라우저로 [http://localhost:4000](http://localhost:4000/)에 접속한다.  정상적으로 블로그가 나오는 지 확인한다. 

Github 저장소, Pages 만들기 
======================

* * *

Github에서 저장소를 만들기 위해 Github에 접속한 후 저장소를 생성한다. 저장소는 [username.github.io](http://username.github.io) 형태로 이름을 지정해 생성한다. 아래 그림을 참고해 진행한다.

![](/assets/images/blog3.jpg)

저장소를 만든 이후에는 저장소의 설정에 들어가면 Github Pages 항목이 있는데 Source 부분을 Master branch로 설정하고 저장한다.

![](/assets/images/blog2.jpg)

저장이 완료되면 다음과 같이 화면이 바뀐다.

![](/assets/images/blog.jpg)

이 후 다시 터미널로 들어와서 다음과 같은 명령어를 통해 Github 저장소를 만들고 만든 프로젝트 소스코드를 업로드한다. 

```
$ cd myblog

$ git init
$ git remote add origin {저장소URL}

$ git add *
$ git commit -m "Initialize commit blog"
$ git push origin master
```

Github에 Push한 이후 2~3분 지나서 Publish된 사이트 주소(ex. https://username.github.io/)로 들어가면 만든 블로그로 접속 될 것이다.

참고 문서
=====

* * *

참고 문서는 다음과 같다.

*   Jekyll 한글 문서: [https://jekyllrb-ko.github.io](https://jekyllrb-ko.github.io)
