---
title:  "Shell script 기본 학습 정리 "
excerpt: "이 문서는 Bash shell sciprt에 대해 학습한 부분들을 정리하고 공유하기 위해 작성하였다. 이 문서는 Bash schell script를 기준으로 작성하였다."

categories:
  - Shell_script
tags:
  - Shell_script

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서 목적
=====

* * *

이 문서는 Bash shell sciprt에 대해 학습한 부분들을 정리하고 공유하기 위해 작성하였다. 이 문서는 Bash schell script를 기준으로 작성하였다. 

프로그래밍에 대한 기초적인 지식이 있다는 가정하에 문서를 작성했다. 해당 지식이 없을 경우 해당 지식을 미리 학습하고 문서를 읽을 것을 권장한다. 

터미널에 String 출력하기
================

* * *

shell script에서 터미널에 String을 출력하는 방법은 echo, printf 명령어를 이용한 2가지의 방법이 있다. echo 명령을 이용할 시 출력될 때 자동으로 줄바꿈이 된다.

test\_script.sh를 만들고 다음과 같이 생성된 파일에 내용을 입력한다. 

```
#!/bin/bash

echo "i love Mac!"
printf "i love Mac!"
```

Shell script를 실행하는 방법은 다음과 같이 3가지 방법이 있으며 문서의 가독성을 위해 실행하는 방법은 더이상 기술하지 않는다. 3가지 방법 중 적절한 것을 선택해 실행하도록 한다. 

```
$ bash test_script.sh

$ sh test_script.sh

$ chmod +x test_script.sh 
$ ./test_script.sh
```

실행 시 결과는 다음과 같다.

```
i love Mac!
i love Mac!
```

  

예시의 Shell script의 내용 중 "#!/bin/bash"의 의미는 다음과 같다. 

*   #!: 매직넘버, 파일의 가장 처음에 위치하고 있으며 스크립트를 실행할 프로그램을 지정할 수 있다.
    
*   따라서 "#!/bin/bash"의 의미는 bash로 해당 스크립트를 실행하도록 지정하는 것이다. 
    

  

변수 종류 및 사용 방법
=============

* * *

Shell script에서의 변수는 전역변수, 지역변수, 환경변수, 예약변수가 있다.

전역 변수, 지역 변수
------------

먼저 전역변수와 지역변수를 설명하면, Shell script에서 선언된 변수는 기본적으로 전역 변수로 되며 지역변수는 함수 내에서 선언할 때에만 사용할 수 있으며 변수명 앞에 local를 붙여주면 된다.

변수를 정의하는 방법은 "변수명=값"으로 할 수 있다. 선언 시 **공백을 넣지 않도록 조심**한다. 변수를 사용할 때에는 "${변수명}"으로 하면 된다. 

전역 변수와 지역변수를 사용하기 위해 variables.sh를 만들고 다음과 같이 생성된 파일에 내용을 입력하고 실행한다. 

```
#!/bin/bash

# 전역변수 선언
string="hello world"
echo ${string}

string_test(){
	# 지역변수 선언
    local string="local hello world"
    echo ${string}
}

string_test

echo ${string}
```

실행 결과는 다음과 같다. 

```
hello world
local hello world
hello world
```

결과를 통해 지역 변수는 함수 내에서 선언을 할 경우 함수가 종료되는 것과 동시에 삭제된다는 것을 알 수 있다. 

환경 변수
-----

Shell script에서 환경 변수도 이용할 수 있는데 export 명령어를 이용해 사용 가능하다. 

테스트를 위해 기존 variables.sh의 내용을 다음과 같이 수정한다. 내용 중 ${PWD}는 예약변수이며 다음 카테고리에 있으니 환경 변수에 대한 것만 보고 넘어가도록 한다. 

```
#!/bin/bash

string="hello world"
echo ${string}

string_test(){
    local string="local hello world"
    echo ${string}
}

string_test

echo ${string}

export hello_world="hello world_export"

bash ${PWD}/export_test.sh

echo ${hello_world}
```

export\_test.sh를 만들고 다음과 같이 내용을 입력한다. 

```
#!/bin/bash
echo ${hello_world}
```

variables.sh를 실행한 결과는 다음과 같다. 

```
hello world
local hello world
hello world
hello world_export
hello world_export
```

아래 2줄의 결과를 통해 variables.sh에서 export한 환경변수가 export\_test.sh에서 출력된 것을 확인할 수 있다. 

예약 변수
-----

예약 변수는 Shell script에서 미리 정의된 변수이다. 사용 방법은 Shell script에서 ${예약변수명}으로 사용하면 된다.

아래와 같은 예약 변수들이 있으며 더 많은 예약 변수들이 있지만 잦은 빈도로 사용하는 것 위주로 정리했다. 나머지 다른 예약변수는 [문서](https://blog.gaerae.com/2015/01/bash-hello-world.html)의 예약변수 카테고리를 참고한다. 

| 자   | 설명  |
| --- | --- |
| `HOME` | 사용자의 홈 디렉토리 |
| `PATH` | 실행 파일을 찾을 경로 |
| `PWD` | 사용자의 현재 작업중인 디렉토리 |
| `SECONDS` | 스크립트가 실행된 초 단위 시간 |
| `SHELL` | 로그인해서 사용하는 쉘 |
| `PPID` | 부모 프로세스의 PID |
| `BASH` | BASH 실행 파일 경로 |
| `BASH_ENV` | 스크립트 실행시 BASH 시작 파일을 읽을 위치 변수 |
| `BASH_VERSION` | 설치된 BASH 버전 |
| `BASH_VERSINFO` | `BASH_VERSINFO[0]`~`BASH_VERSINFO[5]`배열로 상세정보 제공 |
| `OSTYPE` | 운영체제 종류 |
| `EUID` | `su` 명령에서 사용하는 사용자의 유효 아이디 값(`UID`와 `EUID` 값은 다를 수 있음) |
| `GROUPS` | 사용자 그룹(`/etc/passwd` 값을 출력) |
| `PS1` | 기본 프롬프트 변수(기본값: `bash\$`) |
| `PS2` | 보조 프롬프트 변수(기본값: `>`), 명령을 "\\"를 사용하여 명령 행을 연장시 사용됨 |
| `PS3` | 쉘 스크립트에서 `select` 사용시 프롬프트 변수(기본값: `#?`) |
| `PS4` | 쉘 스크립트 디버깅 모드의 프롬프트 변수(기본값: `+`) |
| `TMOUT` | `0`이면 제한이 없으며 `time`시간 지정시 지정한 시간 이후 로그아웃 |

  

반복 실행문(for) 사용하기
================

* * *

반복 실행문 중 for 문은 다음과 같은 형태로 사용할 수 있다. 

```
for 변수 in list
do
	명령 
done
```

test\_for.sh 파일을 생성하고 아래의 내용을 입력한다. 

```
#!/bin/bash
for string in "hello" "world" "..." 
do
    echo ${string}
done 
```

실행하고 결과를 확인한다. 실행 결과는 다음과 같다. 

```
hello
world
...
```

  

제어문 사용하기
========

* * *

제어문은 프로그램내의 문장 실행 순서를 제어하는 것이다. 

제어문은 선택적 실행문과 반복 실행문이 있다. 이 카테고리에서는 선택적 실행문 중 if문에 대해 설명한다. 

if문은 다음과 같은 형태로 사용할 수 있다. 

```
if 조건명령 
then
	명령
else
	명령
fi
```

if.sh 파일을 만들고 다음과 같이 내용을 입력하고 실행한다. 

```
#!/bin/bash
x=3
y=4

echo ${x}
echo ${y}

if (( x < y ))
then
    echo "x is less than y"
else
    echo "y is less than x"
fi


```

실행 결과는 다음과 같다. 

```
3
4
x is less than y

```

if문은 다음과 같은 형태로 사용할 수 있다. 

  

함수
==

* * *

함수는 하나의 목적으로 사용되는 명령들의 집합이다. 

함수는 다음과 같은 형태로 사용할 수 있다. 

```
function 함수이름 
{
	명령들
}
```

funtion.sh 파일을 만들고 다음과 같이 내용을 입력하고 실행한다. 

```
#!/bin/bash
function_test(){
    echo "Hi!"
}

function abc(){
    echo "abc"
    echo "${@}"
}

function_test
abc

abc "abb" "para"

```

실행 결과는 다음과 같다. 

```
Hi!
abc

abc
abb para

```

  

참고 자료
=====

* * *

*   Unix shell script 학습 자료: [UNIX\_13\_bash\_shell\_script.pdf](http://wiki.stunitas.com:8443/download/attachments/25996925/UNIX_13_bash_shell_script.pdf?version=1&modificationDate=1576655112000&api=v2)
    
*   Bash 입문자를 위한 핵심 요약 정리 (Shell Script): [https://blog.gaerae.com/2015/01/bash-hello-world.html](https://blog.gaerae.com/2015/01/bash-hello-world.html)
