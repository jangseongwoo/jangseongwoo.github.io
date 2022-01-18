---
title: breaking_the_records.py
categories:
- ETC
tags:
- Algorithm
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

hacker_rank problem link
- https://www.hackerrank.com/challenges/breaking-best-and-worst-records/problem?isFullScreen=false

code
```
#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'breakingRecords' function below.
#
# The function is expected to return an INTEGER_ARRAY.
# The function accepts INTEGER_ARRAY scores as parameter.
#

def breakingRecords(scores):
    '''
        if score > higher_score:
        high_count++
        set higher_score = score
        elif score < lower_score:
        lower_count++
        set lower_score = score
    '''
    lower_count = 0
    higher_count = 0
    for num, score in enumerate(scores):
        if num == 0:
            lower_score = score
            higher_score = score
        else:
            if score < lower_score:
                lower_count += 1
                lower_score = score
            elif score > higher_score:
                higher_count += 1
                higher_score = score
        print(f'lower_score:{lower_score}, higher_score:{higher_score}')

    return [higher_count, lower_count]


if __name__ == '__main__':
    n = int(input().strip())

    scores = list(map(int, input().rstrip().split()))

    result = breakingRecords(scores)
    print(result)

```
