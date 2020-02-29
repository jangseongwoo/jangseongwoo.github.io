---
title:  "PyTest 프레임워크 기초 사용법"
excerpt: "이 문서는 Pytest framework에 관하여 학습한 내용을 정리하기 위해 작성되었다."

categories:
  - Test
tags:
  - Pytest
  - Python
  - Test

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---


목적
==

* * *

이 문서는 Pytest framework에 관하여 학습한 내용을 정리하기 위해 작성되었다.

Pytest [공식 가이드 문서](https://docs.pytest.org/en/latest/example/index.html) 내용 중 아래의 카테고리에 해당하는 내용을 정리했다.

*   [Asserting with the assert statement](https://docs.pytest.org/en/latest/assert.html#assert)
    
*   [pytest fixtures: explicit, modular, scalable](https://docs.pytest.org/en/latest/fixture.html#fixtures)
    
*   [Parametrizing fixtures and test functions](https://docs.pytest.org/en/latest/parametrize.html#parametrize)
    

학습 환경
=====

* * *

학습 환경은 다음과 같다.

*   Python 버전 : 3.7.4
    
*   PyTest 버전 : 5.2.1
    

환경 구성
=====

* * *

다음과 같이 가상환경을 구성하고 활성화한다.

```
$ mkdir pytest_tutorial
$ cd pytest_tutorial
$ virtualenv --python=python3.7 .venv
$ source .venv/bin/activate
```

  

다음 명령어를 입력해 Pytest 모듈을 설치한다.

```
$ pip install pytest
```

Pytest 실행 및 실행 결과 설명
====================

* * *

테스트 코드 실행하는 방법
--------------

다음과 같은 명령어를 입력 할 경우 실행된 디렉토리 안에서 Pytest가 정해진 규칙에 따라 Test 함수를 찾아 실행하게 된다.

```
$ pytest
```

  
Pytest가 어떤 규칙을 통해 Testcode를 찾아 실행하는 지에 대한 자세한 내용은 [문서](https://docs.pytest.org/en/latest/goodpractices.html#test-discovery)를 클릭하면 알 수 있다.

사용자가 지정한 규칙에 해당하는 테스트 코드 실행하는 방법
--------------------------------

여러 개의 파일로 이루어진 테스트 코드를 테스트 하고자 한다면 와일드 카드(\*)나 디렉터리 지정, 모듈 지정 등을 활용하면 된다.

```
# 와일드 카드 활용
$ pytest test_*.py

# 모듈 지정
$ pytest mymodule

# 현재 디렉터리 지정
$ pytest ./
```

  

다음과 같이 2개의 테스트 코드 test\_sample\_1.py, test\_sample\_2.py를 작성한다.

```
def func(x):
    return x + 1

def test_answer1():
    assert func(3) == 5 
```

  

```
def func(x):
    return x * 2

def test_answer2():
    assert func(3) == 6 
```

  

2개의 테스트 코드(test\_sample\_1.py, test\_sample\_2.py)를 실행하기 위하여 test\_sample\_\*로 지정하여 테스트를 실행한다.

```
$ pytest test_sample_*
==================================== test session starts ====================================
platform darwin -- Python 3.7.4, pytest-5.1.1, py-1.8.0, pluggy-0.12.0
rootdir: /Users/kelpin/dev/pytest_tutorial
collected 2 items

test_sample_1.py F                                                                    [ 50%]
test_sample_2.py .                                                                    [100%]

========================================= FAILURES ==========================================
_______________________________________ test_answer1 ________________________________________

    def test_answer1():
>       assert func(3) == 5
E       assert 4 == 5
E        +  where 4 = func(3)

test_sample_1.py:6: AssertionError
================================ 1 failed, 1 passed in 0.07s ================================
```

  

위의 결과를 통해 지정한 테스트 코드가 정상적으로 실행되었음을 알 수 있다.

참고한 문서는 다음과 같다.

*   [https://docs.pytest.org/en/latest/goodpractices.html#good-integration-practices](https://docs.pytest.org/en/latest/goodpractices.html#good-integration-practices)
    

Assert 기능과 Pytest 실행 결과 설명
==========================

* * *

assert 기능을 테스트 하기 위해 다음과 같은 테스트 코드를 작성한다.

```
def func(x):
    return x + 1

def test_answer():
    assert func(3) == 5 
```

  

Pytest framework는 이름의 prefix가 "test"인 함수만 인식하여 테스트 한다. 더 자세한 내용은 [Conventions for Python test discovery](https://docs.pytest.org/en/latest/goodpractices.html#test-discovery)에서 확인한다.

test\_answer를 실행하여 func(3)의 값과 5를 같은지 비교하고 같지 않다면 AssertionError를 발생시킨다.

```
$ pytest test_sample.py
==================================== test session starts ====================================
platform darwin -- Python 3.7.4, pytest-5.1.1, py-1.8.0, pluggy-0.12.0
rootdir: /Users/kelpin/dev/pytest_tutorial
collected 1 item
 
test_sample.py F                                                                      [100%]
 
========================================= FAILURES ==========================================
________________________________________ test_answer ________________________________________
 
    def test_answer():
>       assert func(3) == 5
E       assert 4 == 5
E        +  where 4 = func(3)
 
test_sample.py:6: AssertionError
===================================== 1 failed in 0.04s =====================================
```

  

테스트 결과를 설명하면 다음과 같다.

*   _collected 2 item_ : 2개의 테스트 코드가 테스트 대상으로 확인되었다는 것을 의미한다.
    
*   _test\_sample\_1.py F_ : test\_sample\_1.py에 있는 테스트 함수가 테스트 실패(F) 했음을 의미한다.
    
*   _test\_sample\_2.py . _: test\_sample\_2.py에 있는 테스트 함수가 테스트 통과(.) 했음을 의미한다.
    
*   _\== ...중략... == FAILURES == ...중략... ==_ : 테스트 통과 실패한 테스트 코드에 대하여 설명한다.
    
*   _def test\_answer1()_부터_ Assertion Error_까지의 내용: 실제 func(3) 결과값은 4이고 기대값은 5이기 때문에 AssertionError가 발생하였음을 의미한다.
    

  

참고한 문서는 다음과 같다.

*   [https://docs.pytest.org/en/latest/getting-started.html#create-your-first-test](https://docs.pytest.org/en/latest/getting-started.html#create-your-first-test)
    

AssertError 발생 시 출력되는 메시지
=========================

* * *

AssertError시 출력되는 메세지 추가하기
--------------------------

Pytest framework로 테스트 실패 시 출력되는 메세지를 추가할 수가 있다.

다음과 같이 짝수이면 테스트 통과하는 테스트 코드를 작성한다.

```
def test_even():
    a = 11
    assert a % 2 == 0, "value was odd, should be even"
```

  

실행 결과는 다음과 같다. 

```
$ pytest test_sample.py
============================================================================================================ test session starts ============================================================================================================
platform darwin -- Python 3.7.4, pytest-5.1.1, py-1.8.0, pluggy-0.12.0
rootdir: /Users/kelpin/dev/pytest_tutorial
collected 1 item                                                                                                                                                                                                                            

test_sample.py F                                                                                                                                                                                                                      [100%]

================================================================================================================= FAILURES ==================================================================================================================
_________________________________________________________________________________________________________________ test_even _________________________________________________________________________________________________________________

    def test_even():
        a = 11
>       assert a % 2 == 0, "value was odd, should be even"
E       AssertionError: value was odd, should be even
E       assert (11 % 2) == 0

test_sample.py:10: AssertionError
============================================================================================================= 1 failed in 0.05s =============================================================================================================
```

테스트 결과에서 에러 메시지 중 "value was odd, should be even"가 출력된 것을 통해 추가한 오류 메시지가 정상 출력된 것을 확인할 수 있다.

다음은 참고한 문서이다.

*   [https://docs.pytest.org/en/latest/assert.html#asserting-with-the-assert-statement](https://docs.pytest.org/en/latest/assert.html#asserting-with-the-assert-statement)
    

AssertError시 출력되는 메세지 변경하기
--------------------------

PyTest는 테스트 통과 실패시 아래 예시와 같은 형태로 테스트 통과 실패 이유를 알려준다.

```
========================================= FAILURES ==========================================
________________________________________ test_answer ________________________________________
 
    def test_answer():
>       assert func(3) == 5
E       assert 4 == 5
E        +  where 4 = func(3)
 
test_sample.py:6: AssertionError
===================================== 1 failed in 0.04s =====================================
```

  

간단한 테스트는 테스트 통과 실패 이유를 쉽게 찾을 수 있지만, 테스트 코드가 복잡해지거나 테스트 수가 많아진다면 테스트 통과 실패 이유를 확인하는 데에 많은 시간이 소모된다.

따라서 테스트 통과 실패 이유를 직관적으로 출력할 수 있다면 테스트 통과 실패 이유를 확인하는 데에 적은 시간을 소모할 수 있을 것이라 판단된다.

PyTest에서는 AssertionError 메세지를 변경하는 방법이 있다.

pytest\_assertrepr\_compare 함수에 AssertionError 출력 메세지를 작성하는 방법이다.

pytest\_assertrepr\_compare 함수를 작성하여 AssertionError 메세지를 작성해보자.

우선 테스트 코드와 동일한 디렉터리 레벨에 conftest.py를 생성하고 다음과 같이 작성한다.

```
from test_foocompare import Foo

def pytest_assertrepr_compare(op, left, right):
    if isinstance(left, Foo) and isinstance(right, Foo) and op == "==":
        return [
            "Comparing Foo instances:",
            "   vals: {} != {}".format(left.val, right.val),
        ]
```

  

pytest\_assertrepr\_compare 함수에 대하여 설명하면 다음과 같다.

AssertionError가 발생하였을 때, Assert문의 코드는 pytest\_assertrepr\_compare함수에 3개의 인자로 전달된다.

예를 들면 _assert foo(1) == foo(2)_ 와 같은 코드에서 AssertionError가 발생한다면 pytest\_assertrepr\_compare 함수 인자로 op = "==", left = foo(1), right=foo(2)가 전달 된다.

left가 Foo클래스의 인스턴스이고, right가 Foo클래스의 인스턴스이며, 연산자(op)가 "=="을 만족한다면 AssertionError 메세지를 "Comparing Foo instances:", " vals: {} != {}".format(left.val, right.val) 형태로 출력하겠다는 의미이다.

  

테스트를 위하여 test\_foocompare.py를 생성하고 다음과 같이 작성한다.

```
class Foo:
    def __init__(self, val):
        self.val = val

    def __eq__(self, other):
        return self.val == other.val


def test_compare():
    f1 = Foo(1)
    f2 = Foo(2)
    assert f1 == f2
```

  

PyTest framework로 test\_foocompare.py를 실행하면 다음과 같다.

```
$ pytest test_foocompare.py      
============================================================================================================ test session starts ============================================================================================================
platform darwin -- Python 3.7.4, pytest-5.2.1, py-1.8.0, pluggy-0.13.0
rootdir: /Users/kelpin/dev/pytest_tutorial/assert
collected 1 item                                                                                                                                                                                                                            

test_foocompare.py F                                                                                                                                                                                                                  [100%]

================================================================================================================= FAILURES ==================================================================================================================
_______________________________________________________________________________________________________________ test_compare ________________________________________________________________________________________________________________

    def test_compare():
        f1 = Foo(1)
        f2 = Foo(2)
>       assert f1 == f2
E       assert Comparing Foo instances:
E            vals: 1 != 2

test_foocompare.py:12: AssertionError
============================================================================================================= 1 failed in 0.04s =============================================================================================================
```

  

AssertionError가 발생한 코드 아래에 테스트 실패 이유가 conftest.py에 작성한 메세지 형태(_"Comparing Foo instances:", " vals: {} != {}".format(left.val, right.val)_)로 출력된다는 것을 알 수 있다.

  

다음은 참고한 문서이다.

*   [https://docs.pytest.org/en/latest/assert.html#defining-your-own-explanation-for-failed-assertions](https://docs.pytest.org/en/latest/assert.html#defining-your-own-explanation-for-failed-assertions)
    

ExceptionError 발생 테스트하기
=======================

* * *

테스트할 대상중에는 ExceptionError를 발생시키는 케이스에서 정상적으로 ExceptionError가 발생하는지 테스트 해야 하는 경우가 있다.

대표적으로 특정 함수가 특정한 경우에 Exception을 raise시키는 로직이 포함되어 있는 경우가 있다.

만약 ExceptionError를 발생시키는 인자를 입력하여 ExceptionError가 발생하면 ExceptionError가 발생한 테스트 코드 아래의 코드들은 실행되지 않는다.

ExceptioError 발생하는 코드를 try...catch...except로 감싸고 테스트하면 테스트 할 수 있다.

PyTest framework의 pytest.raises 함수를 이용하면 편리하게 ExceptionError를 발생하는 상황을 테스트 할 수 있다.

  

with 문과 pytest.raise 함수를 사용하여 ExceptionError가 발생하는 케이스를 테스트한다.

테스트를 위하여 test\_exception\_zero\_division.py를 생성하고 다음과 같은 코드를 작성한다.

```
import pytest


def test_zero_division_1():
    with pytest.raises(ZeroDivisionError):
        1 / 0


def test_zero_division_2():
    with pytest.raises(ZeroDivisionError):
        1 / 2
```

  

PyTest framework로 테스트 코드를 실행하고 결과를 확인한다. 

```
$ pytest test_exception_zero_division.py
============================================================================================================ test session starts ============================================================================================================
platform darwin -- Python 3.7.4, pytest-5.2.1, py-1.8.0, pluggy-0.13.0
rootdir: /Users/kelpin/dev/pytest_tutorial
collected 2 items                                                                                                                                                                                                                           

test_sample.py .F                                                                                                                                                                                                                     [100%]

================================================================================================================= FAILURES ==================================================================================================================
___________________________________________________________________________________________________________ test_zero_division_2 ____________________________________________________________________________________________________________

    def test_zero_division_2():
        with pytest.raises(ZeroDivisionError):
>           1 / 2
E           Failed: DID NOT RAISE <class 'ZeroDivisionError'>

test_sample.py:23: Failed
======================================================================================================== 1 failed, 1 passed in 0.06s ========================================================================================================
```

  

test\_zero\_division\_1 함수는 Divide Zero ExceptionError 발생하여 테스트 통과(.) 하였고, test\_zero\_division\_2 함수는 Divide Zero ExceptionError 발생하지 않았고 테스트 통과 실패(F) 하였다.

다음은 참고한 문서이다.

*   [https://docs.pytest.org/en/latest/assert.html#assertions-about-expected-exceptions](https://docs.pytest.org/en/latest/assert.html#assertions-about-expected-exceptions)
    

Pytest의 Fixture 설명
==================

* * *

Pytest framework에서는 입력 인자를 Fixture로 명명하여 관리할 수 있다.

Fixture를 사용하면 테스트 코드가 간결해지고, 재활용할 수 있어 효율적인 테스트를 할 수 있다.

Fixture는 데코레이터(@pytest.fixture)를 활용하여 사용한다. 해당 부분은 [Pytest 공식사이트 Fixture 문서](https://docs.pytest.org/en/latest/fixture.html#fixtures-as-function-arguments)를 참고해 기술했다.

Fixture를 이용해 함수를 변수처럼 사용하기
--------------------------

test\_square\_10.py를 생성하고 다음과 같이 작성한다.

```
import pytest

@pytest.fixture
def square_10():
    return 10 * 10


def test_square(square_10):
    assert square_10 == 100
    assert square_10 == 121
```

  

fixture로 명명한 square\_10은 변수처럼 사용할 수 있다.

PyTest framework로 test\_square\_10.py를 실행하면 다음과 같다.

```
$ pytest test_square_10.py
============================================================================================================ test session starts ============================================================================================================
platform darwin -- Python 3.7.4, pytest-5.2.1, py-1.8.0, pluggy-0.13.0
rootdir: /Users/kelpin/dev/pytest_tutorial/fixture
collected 1 item                                                                                                                                                                                                                            

test_square_10.py F                                                                                                                                                                                                               [100%]

================================================================================================================= FAILURES ==================================================================================================================
________________________________________________________________________________________________________________ test_square ________________________________________________________________________________________________________________

square_10 = 100

    def test_square(square_10):
        assert square_10 == 100
>       assert square_10 == 121
E       assert 100 == 121
```

테스트 결과를 확인하면 _assert square\_10 == 121_ 에서 테스트 통과 실패했다.

square\_10 함수를 실행하고 반환되는 값 100을 변수처럼 사용할 수 있다는 것을 알 수 있다.

  

fixture는 conftest.py에 정의하여 다수의 테스트 코드에서 사용할 수 있다.

다수의 테스트 코드에서 fixture를 사용해보자.

conftest.py를 생성하고 다음과 같이 작성한다.

```
import pytest

@pytest.fixture
def square_10():
    return 10 * 10

```

  

test\_fixture\_over.py, test\_fixture\_under.py를 생성하고 아래와 같이 작성한다.

```
def test_square_10_over(square_10):
    assert square_10 == 100
    assert square_10 == 121


```

  

```
def test_square_10_under(square_10):
    assert square_10 == 100
    assert square_10 == 81

```

  

  

test\_square\_10\_over, test\_square\_10\_under 함수는 sqaure\_10를 인자로 받아서 assert 문을 수행한다.

PyTest framework를 실행하고 결과를 확인한다.

```
$ pytest *er.py
============================================================================================================ test session starts ============================================================================================================
platform darwin -- Python 3.7.4, pytest-5.2.1, py-1.8.0, pluggy-0.13.0
rootdir: /Users/kelpin/dev/pytest_tutorial/fixture/over_under
collected 2 items                                                                                                                                                                                                                           

test_fixture_over.py F                                                                                                                                                                                                                [ 50%]
test_fixture_under.py F                                                                                                                                                                                                               [100%]

================================================================================================================= FAILURES ==================================================================================================================
____________________________________________________________________________________________________________ test_square_10_over ____________________________________________________________________________________________________________

square_10 = 100

    def test_square_10_over(square_10):
        assert square_10 == 100
>       assert square_10 == 121
E       assert 100 == 121

test_fixture_over.py:3: AssertionError
___________________________________________________________________________________________________________ test_square_10_under ____________________________________________________________________________________________________________

square_10 = 100

    def test_square_10_under(square_10):
        assert square_10 == 100
>       assert square_10 == 81
E       assert 100 == 81

test_fixture_under.py:3: AssertionError
============================================================================================================= 2 failed in 0.04s =============================================================================================================
```

  

conftest.py에서 정의한 fixture square\_10는 test\_square\_10\_over 함수와 test\_square\_10\_under 함수의 인자로 전달되었다.

Pytest fixture를 활용해 테스트코드 Setup, teardown 만들기
---------------------------------------------

Pytest의 fixture는 다음과 같은 경우 주로 사용한다.

*   테스트를 위한 데이터 셋업과 데이터 클리닝이 반복적, 독립적으로 사용 될 때
    

Fixture의 실제 사용 예는 다음과 같다.

*   테스트를 위한 특정 파일과 디렉토리를 만들고 테스트 종료 시 해당 파일과 디렉토리를 삭제한다.
    
*   DB를 연결하고 테스트 종료 시 DB 연결을 정상적으로 종료한다.
    

학습을 위해 다음과 같은 사용사례를 가정해 진행한다.

1.  테스트를 위한 임시 디렉토리와 파일을 생성한다.
    
2.  임시 파일에 데이터를 수집되었다는 것을 의미한다
    
3.  데이터를 입력 완료 후 임시 디렉토리와 파일을 삭제한다.
    
4.  테스트를 종료한다.
    

위의 사례를 직접 경험하기 위해 다음과 같이 코드를 작성한다.

```
import pytest
import os
import smtplib


# yield을 활용한 Teardown
@pytest.fixture
def make_directory_and_txt_file_yield():
    directory_name = "/data/"
    directory_path = os.getcwd()+directory_name
    try:
        if not(os.path.isdir(directory_path)):
            os.makedirs(os.path.join(directory_path))
            print("\nmake directory", directory_path)
    except Exception as e:
        print("make_directory() has error \n error message: {}".format(e))    
    
    file_name = "temp_data.txt"
    print("make file", file_name)
    f = open(directory_path+file_name, 'w')
    yield f

    f.close()
    os.remove(directory_path+file_name)
    print("\ndelete temp file ", directory_path+file_name)
    os.rmdir(directory_path)
    print("delete directory ", directory_path)
    print("teardown complete")


def test_file_write_yield(make_directory_and_txt_file_yield):
    file_pointer = make_directory_and_txt_file_yield
    file_pointer.write("data write")
    print("data write to file")


# request.addfinalizer을 활용한 Teardown
@pytest.fixture
def make_directory_and_txt_file_addfinalizer(request):
    directory_name = "/data/"
    directory_path = os.getcwd()+directory_name
    try:
        if not(os.path.isdir(directory_path)):
            os.makedirs(os.path.join(directory_path))
            print("\nmake directory", directory_path)
    except Exception as e:
        print("make_directory() has error \n error message: {}".format(e))    
    
    file_name = "temp_data.txt"
    print("make file", file_name)
    f = open(directory_path+file_name, 'w')

    def teardown():
        f.close()
        os.remove(directory_path+file_name)
        print("\ndelete temp file ", directory_path+file_name)
        os.rmdir(directory_path)
        print("delete directory ", directory_path)
        print("teardown complete")

    request.addfinalizer(teardown)

    return f

    
def test_file_write_addfinalizer(make_directory_and_txt_file_addfinalizer):
    file_pointer = make_directory_and_txt_file_addfinalizer
    file_pointer.write("data write")
    print("data write to file")
```

  

다음 명령어를 입력한다.

```
$ pytest pytest -v -s test_fixture.py
```

  

실행 결과는 다음과 같다.

```
================================================================================================================================================ test session starts ==============================================================================================================================
platform darwin -- Python 3.7.3, pytest-5.2.2, py-1.8.0, pluggy-0.13.0 -- /Users/st/test/pytest/.venv/bin/python3.7
cachedir: .pytest_cache
rootdir: /Users/st/test/pytest
collected 2 items                                                                                                                                                                                                                                                                                                    

tests/test_module.py::test_file_write_yield 
make directory /Users/st/test/pytest/data/
make file temp_data.txt
data write to file
PASSED
delete temp file  /Users/st/test/pytest/data/temp_data.txt
delete directory  /Users/st/test/pytest/data/
teardown complete

tests/test_module.py::test_file_write_addfinalizer 
make directory /Users/st/test/pytest/data/
make file temp_data.txt
data write to file
PASSED
delete temp file  /Users/st/test/pytest/data/temp_data.txt
delete directory  /Users/st/test/pytest/data/
teardown complete


================================================================================================================================================= 2 passed in 0.20s ===============================================================================================================================
```

  

위의 결과를 통해 정상적으로 테스트를 위한 디렉토리, 파일 생성과 테스트 완료 후 해당 디렉토리와 파일을 정상적으로 삭제가 되었다는 것을 알 수 있다.

Pytest fixture의 파라미터 인자 설정으로 다수의 fixture 생성하기
---------------------------------------------

Pytest fixture의 params 인수를 활용하면 다수의 fixture 값을 생성하여 테스트 할 수 있다.

다음은 다수의 fixture 값을 생성하는 테스트 코드이다.

```
import pytest


@pytest.fixture(params=[1, 2, 3])
def make_double_value(request):
    return (request.param, request.param * 2)


def test_double_value(make_double_value):
    assert make_double_value[1] == (make_double_value[0] * 2 + 1)ㅗ1
```

  

make\_double\_value 함수로 생성되는 fixture에 대하여 설명하면 requst.param = 1, request.param = 2, request.param = 3인 케이스 별로 fixture를 생성한다.

pytest framework로 test\_params.py를 실행하면 다음과 같다.

```
$ pytest test_params.py
============================================================================================================ test session starts ============================================================================================================
platform darwin -- Python 3.7.4, pytest-5.2.1, py-1.8.0, pluggy-0.13.0
rootdir: /Users/kelpin/dev/pytest_tutorial/fixture
collected 3 items                                                                                                                                                                                                                           

test_params.py FFF                                                                                                                                                                                                           [100%]

================================================================================================================= FAILURES ==================================================================================================================
___________________________________________________________________________________________________________ test_double_value[1] ____________________________________________________________________________________________________________

make_double_value = (1, 2)

    def test_double_value(make_double_value):
>       assert make_double_value[1] == (make_double_value[0] * 2 + 1)
E       assert 2 == ((1 * 2) + 1)

test_params.py:10: AssertionError
___________________________________________________________________________________________________________ test_double_value[2] ____________________________________________________________________________________________________________

make_double_value = (2, 4)

    def test_double_value(make_double_value):
>       assert make_double_value[1] == (make_double_value[0] * 2 + 1)
E       assert 4 == ((2 * 2) + 1)

test_params.py:10: AssertionError
___________________________________________________________________________________________________________ test_double_value[3] ____________________________________________________________________________________________________________

make_double_value = (3, 6)

    def test_double_value(make_double_value):
>       assert make_double_value[1] == (make_double_value[0] * 2 + 1)
E       assert 6 == ((3 * 2) + 1)

test_params.py:10: AssertionError
============================================================================================================= 3 failed in 0.04s =============================================================================================================
```

  

인자 \[ 1, 2, 3\]에 맞추어 make\_double\_value fixture가 \[(1, 2), (2, 4), (3, 6)\] 생성된 것을 알 수 있다.

다음은 참고한 문서이다.

*   [https://docs.pytest.org/en/latest/parametrize.html#pytest-mark-parametrize-parametrizing-test-functions](https://docs.pytest.org/en/latest/parametrize.html#pytest-mark-parametrize-parametrizing-test-functions)
    

파라미터 인자를 직접 테스트 코드에 전달하기
========================

* * *

@pytest.mark.parametrize 데코레이터를 사용하면 테스트 코드에 파라미터 인자를 전달할 수 있다.

리스트로 다수의 파라미터 인자를 전달하여 다수 케이스에 대한 테스트를 할 수도 있다.

@pytest.mark.parametrize 정의한 파라미터 명을 정확하게 적어야 하며, 순서는 관계가 없다.

아래의 test\_expectation.py는 연산을 입력받아 연산하고 기대값과 비교하는 테스트 코드이다.

```
import pytest


@pytest.mark.parametrize("test_input,expected", [("3+5", 8), ("2+4", 6), ("6*9", 42)])
def test_eval(test_input, expected):
    assert eval(test_input) == expected
```

  

아래와 같이 총 3가지 케이스가 발생하여 테스트 코드가 실행될 것이다.

*   test\_input = "3+5", expected = 8
    
*   test\_input = "2+4", expected = 6
    
*   test\_input = "6\*9", expected = 42 
    

  

Pytest framework를 실행하면 다음과 같다.

```
$ pytest test_expectation.py
============================================================================================================ test session starts ============================================================================================================
platform darwin -- Python 3.7.4, pytest-5.2.1, py-1.8.0, pluggy-0.13.0
rootdir: /Users/kelpin/dev/pytest_tutorial/fixture
collected 3 items                                                                                                                                                                                                                           

test_expectation.py ..F                                                                                                                                                                                                           [100%]

================================================================================================================= FAILURES ==================================================================================================================
_____________________________________________________________________________________________________________ test_eval[6*9-42] _____________________________________________________________________________________________________________

test_input = '6*9', expected = 42

    @pytest.mark.parametrize("test_input,expected", [("3+5", 8), ("2+4", 6), ("6*9", 42)])
    def test_eval(test_input, expected):
>       assert eval(test_input) == expected
E       AssertionError: assert 54 == 42
E        +  where 54 = eval('6*9')

test_expectation.py:7: AssertionError
======================================================================================================== 1 failed, 2 passed in 0.08s ========================================================================================================
```

  

3가지 케이스가 실행되었다는 것을 알 수 있다.

해당 기능에 대해 이해를 돕기 위해 실제 사용 레퍼런스를 발췌해 남긴다.

```
# content of test_time.py

import pytest

from datetime import datetime, timedelta

testdata = [
    (datetime(2001, 12, 12), datetime(2001, 12, 11), timedelta(1)),
    (datetime(2001, 12, 11), datetime(2001, 12, 12), timedelta(-1)),
]


@pytest.mark.parametrize("a,b,expected", testdata)
def test_timedistance_v0(a, b, expected):
    diff = a - b
    assert diff == expected


@pytest.mark.parametrize("a,b,expected", testdata, ids=["forward", "backward"])
def test_timedistance_v1(a, b, expected):
    diff = a - b
    assert diff == expected


def idfn(val):
    if isinstance(val, (datetime,)):
        # note this wouldn't show any hours/minutes/seconds
        return val.strftime("%Y%m%d")


@pytest.mark.parametrize("a,b,expected", testdata, ids=idfn)
def test_timedistance_v2(a, b, expected):
    diff = a - b
    assert diff == expected


@pytest.mark.parametrize(
    "a,b,expected",
    [
        pytest.param(
            datetime(2001, 12, 12), datetime(2001, 12, 11), timedelta(1), id="forward"
        ),
        pytest.param(
            datetime(2001, 12, 11), datetime(2001, 12, 12), timedelta(-1), id="backward"
        ),
    ],
)
def test_timedistance_v3(a, b, expected):
    diff = a - b
    assert diff == expected
```

다음은 참고한 문서이다.

*   [https://docs.pytest.org/en/latest/parametrize.html#pytest-mark-parametrize-parametrizing-test-functions](https://docs.pytest.org/en/latest/parametrize.html#pytest-mark-parametrize-parametrizing-test-functions)
