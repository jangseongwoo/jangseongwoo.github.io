---
title: between_two_sets.py
categories:
- ETC
tags:
- Algorithm
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

문제
- https://www.hackerrank.com/challenges/between-two-sets/problem?isFullScreen=true

해답
/code
```
#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'getTotalX' function below.
#
# The function is expected to return an INTEGER.
# The function accepts following parameters:
#  1. INTEGER_ARRAY a
#  2. INTEGER_ARRAY b
#

def getTotalX(a, b):
    # Write your code here
    result_count = 0
    smaller_number = 100000000
    divide_list = list()
    for num in b:
        if num < smaller_number:
            smaller_number = num

    print(f'smaller_number: {smaller_number}')

    for number in range(1, smaller_number+1):
        is_answer = True
        for num in a:
            if number % num != 0 or num > number:
                is_answer = False
                continue
            print(f"is_answer, number, num: {is_answer}, {number}, {num}")
        if is_answer:
            divide_list.append(number)
            # result_count += 1
        # print(f"result_count: {result_count}")
        print("---------------------------------")

    for divide_number in divide_list:
        is_answer = True
        for num in b:
            if num % divide_number != 0:
                is_answer = False
        if is_answer:
            result_count += 1

    return result_count



if __name__ == '__main__':
    first_multiple_input = input().rstrip().split()

    n = int(first_multiple_input[0])

    m = int(first_multiple_input[1])

    arr = list(map(int, input().rstrip().split()))

    brr = list(map(int, input().rstrip().split()))

    total = getTotalX(arr, brr)
    print(total)

```
