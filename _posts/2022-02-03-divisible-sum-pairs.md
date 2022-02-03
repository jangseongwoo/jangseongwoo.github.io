---
title: Divisible Sum Pairs
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
- https://www.hackerrank.com/challenges/divisible-sum-pairs/problem?isFullScreen=false


```
#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'divisibleSumPairs' function below.
#
# The function is expected to return an INTEGER.
# The function accepts following parameters:
#  1. INTEGER n
#  2. INTEGER k
#  3. INTEGER_ARRAY ar
#

def divisibleSumPairs(n, k, ar):
    """
     1. INTEGER n
     2. INTEGER k
     3. INTEGER_ARRAY ar

     loop and divide the sum(i, j)
     if sum_number % k is 0
     so count += 1
     else continue

     end of loop
     return count
    """
    count = 0
    for i, v in enumerate(ar):
        for num in range(i+1, n):
            if (v + ar[num]) % k == 0:
                count += 1

    return count


if __name__ == '__main__':

    first_multiple_input = input().rstrip().split()

    n = int(first_multiple_input[0])

    k = int(first_multiple_input[1])

    ar = list(map(int, input().rstrip().split()))

    result = divisibleSumPairs(n, k, ar)
    print(result)
```
