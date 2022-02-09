---
title: migratory_birds.py
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
- https://www.hackerrank.com/challenges/migratory-birds/problem?isFullScreen=false

```
#!/bin/python3

import math
import os
import random
import re
import sys


def migratoryBirds(arr):
    """
    Constraints
    It is guaranteed that each type is 1,2 ,3 4,5
    :param arr: int arr[n]: the types of birds sighted
    :return: int: the lowest type id of the most frequently sighted birds
    """
    count_number_list = list()
    max_count = 0
    result_num = 0
    arr.sort()

    for i in range(0, 5):
        count_i = arr.count(i + 1)
        if count_i > len(arr)/2:
            return i + 1

        if max_count < count_i:
            max_count = count_i
            result_num = i + 1

    return result_num


if __name__ == '__main__':
    arr_count = int(input().strip())

arr = list(map(int, input().rstrip().split()))

result = migratoryBirds(arr)
print(result)

```
