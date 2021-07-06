---
title: Str, Byte, Encode, Decode
categories:
- Python
tags:
- Python 
- Encode 
- Decode
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

# Unicode

유니코드는 전 세계의 모든 문자를 컴퓨터에서 일관되게 표현하고 다룰 수 있도록 설계된 산업 표준이다.

아래의 목표를 가지고 세계의 모든 문자를 Unicode로 변환을 진행하고 있다. 

- 전세계의 모든 문자들을 하나의 규칙안에 일관되게 표현할 수 있게 하려고 함
- Everyone in the world should be able to use their own language on phones and computers.

유니코드는 하나의 문자 - 하나의 코드로 매핑하며 코드는 0부터 0x10FFFF (십진수 1,114,111)의 범위를 갖는다.

# UTF-8

UTF-8은 유니코드를 위한 가변 길이 문자 인코딩 방식

- UTF-8은 Universal Coded Character Set + Transformation Format – 8-bit 의 약자

유니코드 문자열을 바이트 시퀀스로 변환하는 규칙을 문자 인코딩(character encoding), 또는 인코딩(encoding)

모든 문자를 1Byte(8bit)로 고정되어 처리하는 것은 알파벳 같은 문자를 표현하는데 있어서 굉장히 비효율적

그래서 UTF-8을 사용한다.

# Python에서의 Unicode

Python에서 str은 unicode 문자를 저장한다. 어떤 file을 읽을 때도 Read mode로 읽게 되면 unicode로 읽는다. 이것을 다시 파일로 쓰거나 다른데 전송할때는 byte로 변환(encoding)해야 한다. 

bytes로 된 것을 다시 unicode로 읽을 때에는 decoding하면 된다. 

code로 표현하면 다음과 같다. 

```python
def to_str(bytes_or_str):
    if isinstance(bytes_or_str, bytes):
        value = bytes_or_str.decode('utf-8')
    else:
        value = bytes_or_str

    return value # str instance

def str_to_byte(bytes_or_str):
    if isinstance(bytes_or_str, str):
        value = bytes_or_str.encode('utf-8')
    else:
        value = bytes_or_str
    
    return value # byte instance
```
