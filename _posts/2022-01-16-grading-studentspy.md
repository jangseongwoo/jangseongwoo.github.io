---
title: grading_students.py
categories:
- ETC
tags:
- Algorithm
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

문제링크: https://www.hackerrank.com/challenges/grading/problem?isFullScreen=true

```
#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'gradingStudents' function below.
#
# The function is expected to return an INTEGER_ARRAY.
# The function accepts INTEGER_ARRAY grades as parameter.
#

# constraints
# 0 <= Grade <= 100
# 1 <= n <= 60
# % 10 3~4 -> 5, 8~9 -> 0 + 10
# 40 under X


def gradingStudents(grades):
    results = list()
    for grade in grades:
        print(f'grade: {grade}')
        if grade > 35:
            print(f'grade: {grade}')
            if 3 <= (grade % 10) <= 4 or 8 <= (grade % 10) <= 9:
                grade = grade + (5 - (grade % 5))
                print(f'grade: {grade}')

            # elif (3 <= (grade % 10) <= 4):
            #     grade = grade + (10 - (grade % 10))
        results.append(grade)
    return results

if __name__ == '__main__':
    # fptr = open(os.environ['OUTPUT_PATH'], 'w')

    grades_count = int(input().strip())

    grades = []

    for _ in range(grades_count):
        grades_item = int(input().strip())
        grades.append(grades_item)

    result = gradingStudents(grades)

    print(result)
    # fptr.write('\n'.join(map(str, result)))
    # fptr.write('\n')
    #
    # fptr.close()
```
