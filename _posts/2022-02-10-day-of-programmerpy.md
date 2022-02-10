---
title: day_of_programmer.py
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
- https://www.hackerrank.com/challenges/day-of-the-programmer/problem?isFullScreen=false


```
#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'dayOfProgrammer' function below.
#
# The function is expected to return a STRING.
# The function accepts INTEGER year as parameter.
#

def dayOfProgrammer(year):
    sum_of_day_september = 243
    changed_yaer_to_gregorian_calender = 1918
    if year > changed_yaer_to_gregorian_calender:
        programmer_day = 256 - sum_of_day_september
        if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):
            programmer_day = programmer_day - 1
    elif year == changed_yaer_to_gregorian_calender:
        programmer_day = 256 - sum_of_day_september + 13
        if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):
            programmer_day = programmer_day - 1
    else:
        programmer_day = 256 - sum_of_day_september
        if year % 4 == 0:
            programmer_day = programmer_day - 1

    # if programmer_day < 10:
    #     programmer_day = f'0{programmer_day}'
    return f"{programmer_day}.09.{year}"


if __name__ == '__main__':
    year = int(input().strip())

    result = dayOfProgrammer(year)
    print(result)

```
