---
title: bill_division.py
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
- https://www.hackerrank.com/challenges/bon-appetit/problem?isFullScreen=false

```
#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'bonAppetit' function below.
#
# The function accepts following parameters:
#  1. INTEGER_ARRAY bill
#  2. INTEGER k
#  3. INTEGER b
#

def bonAppetit(bill, k, b):
    """
    if paid money is equal to actual money, return bon Appétit
    :param bill: INTEGER_ARRAY bill
    :param k: INTEGER k
    :param b: INTEGER b
    :return:
    """
    sum_bill = 0
    for index, val in enumerate(bill):
        if index != k:
            sum_bill += val

    if int(sum_bill / 2) == b:
        print("Bon Appetit")
    else:
        print(b - int(sum_bill / 2))


if __name__ == '__main__':
    first_multiple_input = input().rstrip().split()

    n = int(first_multiple_input[0])

    k = int(first_multiple_input[1])

    bill = list(map(int, input().rstrip().split()))

    b = int(input().strip())

    print(bonAppetit(bill, k, b))

```
