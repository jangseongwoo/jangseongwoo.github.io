---
title: Shell script export란?
excerpt: "Shell script에서 환경변수를 사용하기 위해서는 export 명령어를 사용하면 된다. "

categories:
  - Shell_script
tags:
  - Shell_script
  - Shell

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

# Shell script에서 환경변수를 사용하는 방법
Shell script에서 환경변수를 사용하기 위해서는 export 명령어를 사용하면 된다. 
```
export variable_name="test"
```
이렇게 변수를 export하게 되면 현재 실행하고 있는 프로세스에서 환경변수를 설정하게 되며, 이 아래에 생기게 되는 모든 자식프로세스에서도 export한 환경변수를 쓸 수 있는 장점이 있다.
물론 변수를 이렇게 하지 않고 선언해 아래와 같이 사용할 수 있다. 이럴 경우 현재 실행한 프로세스에서만 이 변수를 사용할 수 있다. 

```
variable_name="test"
```
