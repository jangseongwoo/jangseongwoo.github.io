---
title: subarray_division.py
categories:
- ETC
tags:
- Algorithm
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

problem link
- https://www.hackerrank.com/challenges/the-birthday-bar/problem?isFullScreen=true

```
#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'birthday' function below.
#
# The function is expected to return an INTEGER.
# The function accepts following parameters:
#  1. INTEGER_ARRAY s
#  2. INTEGER d
#  3. INTEGER m
#

def sum_array(a, start, end):
    sum_array_num = 0
    for num in range(start, end):
        sum_array_num += s[num]

    print(f"sum_array_num: {sum_array_num}, start: {start}, end:{end}")
    return sum_array_num


def birthday(s, d, m):
    """
    :param s: int s[n], the numbers on each of the squares of chocolate
    :param d: int d, Ron's birth day
    :param m: int m, Ron's birth month
    :return: int: the number of ways the bar can be divided

    for loop first to end
    call sum_subarray() function
    if sum == d -> count plus one else go ahead
    return count
    """
    count = 0
    for i, v in enumerate(s):
        print(f"i: {i}, v: {v}")
        if i >= m - 1:
            if sum_array(s, i - (m-1), i+1) == d:
                count += 1

    return count


if __name__ == '__main__':
    n = int(input().strip())

    s = list(map(int, input().rstrip().split()))

    first_multiple_input = input().rstrip().split()

    d = int(first_multiple_input[0])

    m = int(first_multiple_input[1])

    result = birthday(s, d, m)

    print(result)

```
