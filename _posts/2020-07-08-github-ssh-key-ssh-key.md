---
title: Github ssh key 생성과 ssh key 등록하는 방법
excerpt: "Github를 이용해 소스코드 형상관리를 하다보면 매번 아이디와 비밀번호를 입력하는 것이 매우 귀찮고 비효율적이라는 것을 느끼게 된다. 이럴 경우 ssh key를 등록하면 더 이상 매번 아이디와 비밀번호를 입력하지 않아도 된다.
이유는 Github의 원격 저장소에 연결할 때 보안상의 이유로 자격 증명을 해야되는데 ssh key를 등록함으로써 자격 증명을 하는 것이기 때문이다. "

categories:
  - Github
tags:
  - Github
  - SSH_key

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

# Github ssh key 등록하는 이유 
Github를 이용해 소스코드 형상관리를 하다보면 매번 아이디와 비밀번호를 입력하는 것이 매우 귀찮고 비효율적이라는 것을 느끼게 된다. 이럴 경우 ssh key를 등록하면 더 이상 매번 아이디와 비밀번호를 입력하지 않아도 된다.
이유는 Github의 원격 저장소에 연결할 때 보안상의 이유로 자격 증명을 해야되는데 ssh key를 등록함으로써 자격 증명을 하는 것이기 때문이다. 

# Github ssh key 생성하는 방법 
서버 혹은 자신의 PC에 ssh key가 생성되어 있지 않을 경우 아래의 명령어를 이용해 ssh key를 생성하면 된다.

```
$ ssh-keygen
```

이 명령어를 입력하면 개인 home 디렉토리에 .ssh 폴더가 생기며 그 안에 ssh key가 생성된다. 명령어 입력했을 때 다른 경로로도 가능하나 대부분 Default 경로로 설정한다. 
키를 복사하기 위해 다음 명령어를 입력하고 키를 복사한다.

```
$ cd
$ cat .ssh/id_rsa.pub

# 위의 명령어를 입력하면 아래와 같은 형식으로 나오게 된다. 
ssh-rsa {key} user_name
```

# Github ssh key 등록하는 방법 
1. Github 페이지에 접속한다. 
2. Github 페이지에서 오른쪽 상단에 보면 접속한 아이디에 설정된 아이콘 그림이 보이게 되는데 눌러서 setting 메뉴를 클릭한다. 
3. 왼쪽 메뉴 중 SSH and GPG Keys를 클릭한다. 
4. New SSH Key 버튼을 눌러 SSH 키를 등록한다. 이름은 아무거나 입력해도 되며 Key 입력하는 데에 아까 복사한 키를 붙여넣기 한다.
