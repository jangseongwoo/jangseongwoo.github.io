---
title:  "Python에서 LDAP인증을 사용할 수 있는 방법에 대한 조사 및 테스트"
excerpt: "이 문서의 목적은 Python에서 LDAP인증을 사용할 수 있는 방법에 대한 조사를 정리하고 기록하기 위해 작성했다. "

categories:
  - Ldap
tags:
  - Ldap

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 문서의 목적은 Python에서 LDAP인증을 사용할 수 있는 방법에 대한 조사를 정리하고 기록하기 위해 작성했다. 

Python-ldap library
===================

* * *

구글 검색 결과 시 첫번째로 나오는 LDAP Python library이다. 

[공식 사이트](https://github.com/python-ldap/python-ldap)를 참조하면 다음과 같이 사용 예를 제시하고 있다. 

```
import ldap
l = ldap.initialize("ldap://my_ldap_server.my_domain")
l.simple_bind_s("","")
l.search_s("o=My Organisation, c=AU", ldap.SCOPE_SUBTREE, "objectclass=*")
```

  

사용예에서 보듯이 simple\_bind\_s API를 통해 인증을 할 수 있다. 공식 문서의 설명은 다음과 같다.

LDAPObject.simple\_bind\_s(\[who=None\[, cred=None\[, serverctrls=None\[, clientctrls=None\]\]\]\]) → None

  

After an LDAP object is created, and before any other operations can be attempted over the connection, a bind operation must be performed. This method attempts to bind with the LDAP server using either simple authentication, or Kerberos (if available). The first and most general method, bind(), takes a third parameter, method which can currently solely be AUTH\_SIMPLE. serverctrls and clientctrls like described in section Arguments for LDAPv3 controls. The who and cred arguments are text strings; see The bytes mode. Changed in version 3.0: simple\_bind() and simple\_bind\_s() now accept None for who and cred, too.

  

Python-ldap 공식사이트의 사용 예는 다음과 같다.

```
import ldap

con = ldap.initialize('ldap://localhost:389', bytes_mode=False)
con.simple_bind_s(u'login', u'secret_password')
results = con.search_s(u'ou=people,dc=example,dc=org', ldap.SCOPE_SUBTREE, u"(cn=Raphaël)")
```

  

Python-ldap을 활용한 간단 인증 테스트
==========================

* * *

Python-ldap을 활용해 사용자의 ID, PW 정보를 받아 인증하는 방법에 대해 테스트를 진행한다. 

테스트를 위해 아래와 같이 코드를 입력한다. 아래 코드는 Python-ldap API 중 simple\_bind\_s API를 이용해서 인증한다. 입력 후 결과를 확인한다. 

```
import ldap


def authenticate(ldap_object, ldap_address, user_name, password):
    try:
        print(ldap_object.simple_bind_s(user_name, password))
    except ldap.INVALID_CREDENTIALS:
       ldap_object.unbind()
       return 'Wrong username ili password'
    except Exception as e:
        print(e)
        return "error"

    return "Succesfully authenticated"


def initialize_ldap(ldap_address):
    ldap_object = ldap.initialize(ldap_address)
    
    return ldap_object


def main():
    ldap_address = "ldap://" # {address}
    user_name = "insert your email"
    password = "insert your password"

    ldap_object = initialize_ldap(ldap_address)
    print(authenticate(ldap_object, ldap_address, user_name, password))


if __name__ == '__main__':
    main()
```

  

성공 시 응답 메시지는 다음과 같다.

```
(97, [], 1, [])
Succesfully authenticated
```

  

실패 시 응답 메시지는 다음과 같다. 사용자아이디로 사용되는 이메일정보나 패스워드를 틀리게 입력하여 테스트하면 아래와 같은 메시지가 반환되는 것을 확인할 수 있다.

```
Wrong username ili password
```

  

테스트에서 사용된 코드를 기준으로 설명하자면, simple\_bind\_s 메소드에 전달된 크레덴셜정보가 LDAP에 존재하지 않거나 틀린 정보로 전달되면 INVALID\_CREDENTIALS 예외가 발생된다.

  

참고 문서
=====

* * *

참고한 문서들은 다음과 같다. 
   
*   Python-ldap 공식문서: [https://www.python-ldap.org/en/latest/reference/ldap.html#ldap.LDAPObject.simple\_bind\_s](https://www.python-ldap.org/en/latest/reference/ldap.html#ldap.LDAPObject.simple_bind_s)
    
*   Python-ldap 사용 사례 코드: [https://gist.github.com/ibeex/1288159](https://gist.github.com/ibeex/1288159)
    
*   LDAP Programming in Python: [https://www.linuxjournal.com/article/6988](https://www.linuxjournal.com/article/6988)
