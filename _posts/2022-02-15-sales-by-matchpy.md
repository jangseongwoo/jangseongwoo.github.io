---
title: sales_by_match.py
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
- https://www.hackerrank.com/challenges/sock-merchant/problem?isFullScreen=false

```
#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'sockMerchant' function below.
#
# The function is expected to return an INTEGER.
# The function accepts following parameters:
#  1. INTEGER n
#  2. INTEGER_ARRAY ar
#

def sockMerchant(n, ar):
    """
    :param n: int n: the number of socks in the pile
    :param ar: int ar[n]: the colors of each sock
    :return: int: the number of pairs
    """
    sock_set = set()
    for i in ar:
        sock_set.add(i)

    count_pairs = 0
    for val in sock_set:
        count_pairs += int(ar.count(val) / 2)

    return count_pairs


if __name__ == '__main__':
    n = int(input().strip())

    ar = list(map(int, input().rstrip().split()))

    result = sockMerchant(n, ar)
    print(result)

```
