---
title: Schema on read, schema on write에 대한 설명
excerpt: Schema on read는 문자 그대로, 데이터를 읽을 때 스키마가 정의되어 읽는다는 것이다. 이와 다르게 schema on write는
  데이터를 처음 저장할때 스키마를 정의하고 데이터를 저장하는 것이다. 이 두개는 대부분 많이 쓰는 RDB(관계형 데이터베이스)를 생각하면 이해하기
  쉬운데, 예로 MySQL 같은 RDB는 어떤 데이터를 저장하기 전에 스키마부터 정의해야 데이터를 저장할 수 있다. Schema on read는
  주로 하둡에서 많이 등장하는데 저장할 때 스키마와 상관없이 저장할 수 있으며 읽을 때 스키마가 정의되어 데이터를 읽을 수 있다.
categories:
- Hadoop
tags:
- Schema
- Schema_on_read
- Schema_on_write
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

# Schema on read, schema on write에 대한 설명

Schema on read는 문자 그대로, 데이터를 읽을 때 스키마가 정의되어 읽는다는 것이다. 이와 다르게 schema on write는 데이터를 처음 저장할때 스키마를 정의하고 데이터를 저장하는 것이다.

이 두개는 대부분 많이 쓰는 RDB(관계형 데이터베이스)를 생각하면 이해하기 쉬운데, 예로 MySQL 같은 RDB는 어떤 데이터를 저장하기 전에 스키마부터 정의해야 데이터를 저장할 수 있다.

Schema on read는 주로 하둡에서 많이 등장하는데 저장할 때 스키마와 상관없이 저장할 수 있으며 읽을 때 스키마가 정의되어 데이터를 읽을 수 있다.

## Schema on read, schema on write 장단점

아래 그림을 보면 각 각의 장단점을 알 수 있다. 

![](/assets/images/schemaonread-vs-schemaonwrite-3-638.jpg)



빅데이터 관점에서의 Schema on read의 장점은 데이터를 원본 그대로 저장할 수 있다는 것이다. 예를 들면 Datalake에 Raw data를 저장하고, 이후의 ETL이나 실시간 스트리밍 프로세싱을 통하여 BI 혹은 AI 등에 사용할 수 있는 것이다. 

만약에 schema on write라면, 데이터를 저장하는 과정에서부터 데이터가 변형되어야 하며 이 변형 자체가 원본 데이터의 부분적인 유실이 될 수 있기 때문이다. 

데이터를 잘 알고, 자주 사용한다고 했을 경우에는 schema on write가 적합할 수도 있다. 그러나 빅데이터에서는 정형, 비정형 데이터가 실시간으로 굉장히 많이 들어오기 때문에 스키마를 정의하기 어려운 경우도 있으므 Schema on read를 사용하는게 더 좋을 수도 있다.

# 참고 문서

https://www.slideshare.net/awadallah/schemaonread-vs-schemaonwrite
## 이미지 출처
https://image.slidesharecdn.com/openmic-schema-on-readvsschema-on-write-amr-140123082808-phpapp01/95/schemaonread-vs-schemaonwrite-3-638.jpg?cb=1390466357
