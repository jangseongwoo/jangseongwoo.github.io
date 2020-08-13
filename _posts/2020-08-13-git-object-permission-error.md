---
title: Git object permission error
excerpt: "Git object permission 에러를 겪고 해결 방법과 에러 메시지를 기술해 추후 같은 에러 시 빠른 대응을 할 수 있도록 하기 위해 이 문서를 작성한다. "

categories:
  - Github
tags:
  - Github
  - Error

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

# 목적
Git object permission 에러를 겪고 해결 방법과 에러 메시지를 기술해 추후 같은 에러 시 빠른 대응을 할 수 있도록 하기 위해 이 문서를 작성한다. 

# 에러 발생 환경 
에러가 발생한 환경은 다음과 같다. 
- OS: Ubuntu 16.04 
- 사용자 계정의 Git repository


# 에러 메시지
에러 메시지는 다음과 같다. (비슷한 유형을 같이 명시한다)
- 저장소 데이터베이스 .git/objects 에 객체를 추가 할 수있는 권한이 충분하지 않습니다
- nsufficient permission for adding an object to repository database
- error: unable to write file ./objects/foo/bar: Permission denied. 
-  git commit error: insufficient permission for adding an object to repository database .git/objects error:

# 에러 원인과 해결 방법
## 에러 원인
에러 원인은 다음과 같다. 
- Root 계정 혹은 다른 권한을 가진 계정으로 Git repository에서 명령을 실행할 경우 .git/object 안에 있는 폴더에 대한 권한이 변경된다. 
- 따라서, 기존 계정 권한에서 다른 계정(그룹)으로 권한이 변경되었으므로 해당 권한이 없는 계정으로 Git 명령어(commit, push)를 할 경우 오류가 발생하게 된다. (object 관련 어떤 작업을 수행할 때 발생한다.)

## 해결 방법
해결 방법은 다음과 같다. 
```
# Git repository root directory에서 아래의 명령을 수행한다. 
$ cd .git/object 

# 권한을 확인한다. 
$ ls -al 

# 현재 Directory의 모든 directory와 파일들의 권한을 변경한다. (yourname:yourgroup은 다른 디렉토리의 기존 계정의 권한을 확인하고 동일하게 한다.)
$ sudo chown -R yourname:yourgroup *
```

이러한 문제를 방지하기 위해 리눅스에서는 계정에 따라 권한이 다르므로 이 부분에 유의해 명령어를 입력하도록 한다.  혹은 Sudo 명령어 입력할때는 해당 명령어를 수행하기 위해 꼭 관리자 권한이 필요한 지 고민해보고 유의해 사용하도록 한다. 

# 참고 문서
참고 문서는 다음과 같다. 
- https://stackoverflow.com/questions/6448242/git-push-error-insufficient-permission-for-adding-an-object-to-repository-datab
