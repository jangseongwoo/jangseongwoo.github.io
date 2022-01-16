---
title: apple_and_orange.py
categories:
- ETC
tags:
- Algorithm
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

문제링크
https://www.hackerrank.com/challenges/apple-and-orange/problem?isFullScreen=false


```
#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'countApplesAndOranges' function below.
#
# The function accepts following parameters:
#  1. INTEGER s
#  2. INTEGER t
#  3. INTEGER a
#  4. INTEGER b
#  5. INTEGER_ARRAY apples
#  6. INTEGER_ARRAY oranges
#

def countApplesAndOranges(s, t, a, b, apples, oranges):
    house_start_point = s
    house_end_point = t
    apple_tree_point = a
    orange_tree_point = b
    count_apples_in_house = 0
    count_oranges_in_house = 0

    for apple in apples:
        if house_start_point <= apple + apple_tree_point <= house_end_point:
            count_apples_in_house += 1

    for orange in oranges:
        if house_start_point <= orange + orange_tree_point <= house_end_point:
            count_oranges_in_house += 1

    print(count_apples_in_house)
    print(count_oranges_in_house)


if __name__ == '__main__':
    first_multiple_input = input().rstrip().split()

    s = int(first_multiple_input[0])

    t = int(first_multiple_input[1])

    second_multiple_input = input().rstrip().split()

    a = int(second_multiple_input[0])

    b = int(second_multiple_input[1])

    third_multiple_input = input().rstrip().split()

    m = int(third_multiple_input[0])

    n = int(third_multiple_input[1])

    apples = list(map(int, input().rstrip().split()))

    oranges = list(map(int, input().rstrip().split()))

    countApplesAndOranges(s, t, a, b, apples, oranges)
```
