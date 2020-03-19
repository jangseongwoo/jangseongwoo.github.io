---
title:  "Linux의 hard link, soft link"
excerpt: "이 문서는 Linux의 hard link, soft link에 대해 학습하고 학습한 내용을 정리하고 공유하기 위해 작성했다. "

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
===

* * *

이 문서는 Linux의 hard link, soft link에 대해 학습하고 학습한 내용을 정리하고 공유하기 위해 작성했다. 

  

Hard link, Soft link
====================

* * *

Linux에서는 윈도우로 비유하면 '바로가기'와 비슷한 개념의 Hard link, soft link가 있다. 특정 파일의 링크를 걸어 사용하는데 2개에 대한 개념과 차이점을 설명하려고 한다. 

아래 그림을 보면 Hard link는 inode에 직접 link가 되어 있어 실제 File name이 삭제 되어도 접근이 가능하나, Soft link는 File name이 삭제되면 inode에 접근이 불가하다. 

설명을 그림으로 표현하면 다음과 같다. 

```
                  Hard link                                            Soft link(Symbloic Link)


               +-------------+
               |  inode      |                                          +--------------+
               |             |                                          |  inode       |
               +---+-----+---+                                          |              |
                   ^     ^                                              +---+----------+
                   |     |                                                  ^
+-------------+    |     |         +---------------+                        |
| file name   |    |     |         |  hard link    |                        |
|             +----+     +---------+               |                        |
+-------------+                    +---------------+              +---------+--+
                                                                  | hard link  |
                                                                  |(file name) +<-----------+
                                                                  +------------+            |
                                                                                            |
                                                                                            |
                                                                                            |
                                                                                      +-----+------+
                                                                                      |  soft link |
                                                                                      |            |
                                                                                      +------------+
```

  

ln 명령어를 이용해 hard link, soft link 만들어보기 
=======================================

* * *

개념을 배웠으니 이제 실제로 테스트 파일을 만들어서 hard link와 soft link가 어떻게 작동 하는 지 테스트하려고 한다. 

순서는 아래와 같이 진행된다.

*   테스트 파일 생성
    
*   soft link 생성, hard link 생성
    
*   테스트 파일 지우기 
    
*   soft link, hard link 접근 가능한 지 테스트 
    

테스트 파일 생성
---------

아래와 같은 명령어를 이용해 테스트 파일을 생성한다. 

```
$ echo "test soft link and hard link" > test_file
```

파일이 정상적으로 생성 됬는 지 확인하기 위해 다음과 같은 명령어를 입력하고 결과를 확인한다. 

```
$ ls -ali

52569787 drwxr-xr-x   3 st  staff   96 Mar 16 10:21 .
21193622 drwxr-xr-x  31 st  staff  992 Mar 16 10:20 ..
52569831 -rw-r--r--   1 st  staff   29 Mar 16 10:21 test_file
```

soft link, hard link 생성 
------------------------

아래와 같은 명령어를 이용해 hard link와 soft link를 생성한다. 

```
$ ln -s test_file test_symbolic
$ ln test_file test_hard_link
```

파일이 정상적으로 생성 됬는 지 확인하기 위해 다음과 같은 명령어를 입력하고 결과를 확인한다. 

```
$ ls -ali

total 16
52569787 drwxr-xr-x   5 st  staff  160 Mar 16 10:21 .
21193622 drwxr-xr-x  31 st  staff  992 Mar 16 10:20 ..
52569831 -rw-r--r--   2 st  staff   29 Mar 16 10:21 test_file
52569831 -rw-r--r--   2 st  staff   29 Mar 16 10:21 test_hard_link
52569917 lrwxr-xr-x   1 st  staff    9 Mar 16 10:21 test_symbolic -> test_file
```

테스트 파일 지우기
----------

아래와 같은 명령어를 이용해 테스트 파일을 삭제한다. 

```
$ rm -rf test_file
```

파일이 정상적으로 삭제 됬는 지 확인하기 위해 다음과 같은 명령어를 입력하고 결과를 확인한다. 

```
$ ls -ali

total 8
52569787 drwxr-xr-x   4 st  staff  128 Mar 16 10:47 .
21193622 drwxr-xr-x  31 st  staff  992 Mar 16 10:20 ..
52569831 -rw-r--r--   1 st  staff   29 Mar 16 10:21 test_hard_link
52569917 lrwxr-xr-x   1 st  staff    9 Mar 16 10:21 test_symbolic -> test_file
```

soft link, hard link 접근 가능한 지 테스트 
----------------------------------

아래와 같은 명령어를 이용해 soft link, hard link를 통해 테스트파일에 접근이 가능한 지 확인한다. 

```
# hard link를 통한 접근
$ cat test_hard_link

test soft link and hard link

# soft link를 통한 접근
$ cat test_symbolic

cat: test_symbolic: No such file or directory
```

결과
--

테스트를 통해 soft link는 원본 파일이 삭제될 경우 접근이 불가능하나 hard link는 원본 파일이 삭제 되어도 파일 데이터에 접근이 가능하다. 

  

참고 문서
=====

참고 문서는 다음과 같다. 

*   hard link와 심볼릭 링크 개념잡기: [https://jybaek.tistory.com/578](https://jybaek.tistory.com/578)
    
*   What is the difference between a symbolic link and a hard link?: [https://medium.com/@hemant.heer/what-is-the-difference-between-a-symbolic-link-and-a-hard-link-7c1820f35623](https://medium.com/@hemant.heer/what-is-the-difference-between-a-symbolic-link-and-a-hard-link-7c1820f35623)
