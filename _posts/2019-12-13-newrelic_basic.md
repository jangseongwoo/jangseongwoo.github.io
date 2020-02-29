---
title:  "New Relic 교육 - 오버뷰"
excerpt: "New Relic에서 제공하는 기능에 대한 간단한 오버뷰 교육과 관련되어 사전 학습 내용과 교육 내용 일부를 개인적으로 정리한 문서이다.  "

categories:
  - Monitoring
tags:
  - Newrelic
  - Monitoring

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서목적
====

[New Relic](https://newrelic.com/)에서 제공하는 기능에 대한 간단한 오버뷰 교육과 관련되어 사전 학습 내용과 교육 내용 일부를 개인적으로 정리한 문서이다.  
New Relic 전반적인 내용을 다루는 상세 문서가 아니므로 정확하고, 구체적인 내용은 [New Relic 공식 사이트](https://newrelic.com/)나 다른 자료를 확인하도록 한다.

  

* * *

New Relic이 말하는 New Relic(오버뷰)
=============================

New Relic에서 제공하는 다양한 제품을 통해 데이터 기반 분석과 대응이 가능하다.

New Relic 활용
------------

*   애플리케이션 및 관련 인프라스트럭처의 모니터링 데이터를 같이 확인할 수 있어 문제 확인 시간을 단축할 수 있다.
    
*   애플리케이션/서비스의 code flow 기반 추적이 가능하다.
    
*   대시보드를 통해 가시적인 데이터 확인과 공통 대시보드를 통해 관련 팀원들이 동일한 뷰로 문제를 바라볼 수 있다.
    
*   New Relic query language(NRQL)를 사용하여 데이터를 살펴볼 수 있으며, 직관적으로 대시보드를 구성하는 것이 가능하다.
    
*   CloudWatch가 제공하는 모니터링 기능 이상의 기능을 통해 좀더 상세한 서비스 분석과 기능, 비기능 관련 원인 추적이 가능하다.
    

Agent 방식
--------

New Relic은 기본적으로 Agent 방식으로 모니터링을 위한 데이터를 수집한다.

*   APM agent
    
*   Infrastructure agent
    

  
Application과 Application 관련 호스트(서버)의 정보와 연결성을 대략적으로 확인 가능하여, 앱이 설치된 호스트이 상태와 앱의 전반적인 상태 정보를 같이 볼 수 있다.  
인프라 모니터링은 인프라스트럭처 에이전트 설치하여 사용

*   ssh접근, 패키지 설치 등과 같은 사용자 행위에 대한 추적도 가능하다.
    
*   동일 세션에서 어떤 작업이 있었는지 시간대별로 추적 가능.
    

Service Map

*   설치된 Agent를 통해 front - back - storage 와 같은 서비스 레이어에 다른 의존성관계를 파악할 수 있다.
    
*   서비스별 맵을 만들어서 특정 서비스 경로에 대해 모니터링 하는 것도 가능하다.
    

  

* * *

New Relic Products
==================

크게 6가지 제품으로 나누어진다.

*   [New Relic - APM](https://newrelic.com/products/application-monitoring)
    
*   [New Relic - Browser](https://newrelic.com/products/browser-monitoring)
    
*   [New Relic - Infrastructure](https://newrelic.com/products/infrastructure)
    
*   [New Relic - Insights](https://newrelic.com/products/insights)
    
*   [New Relic - Mobile](https://newrelic.com/products/mobile-monitoring)
    
*   [New Relic - Synthetics](https://newrelic.com/products/synthetics)
    

[New Relic - APM](https://newrelic.com/products/application-monitoring)
-----------------------------------------------------------------------

SaaS 기반 APM 툴을 제공한다.

*   관리 목적으로 논리적 그룹을 구성하여 관리할 수 있다.
    
*   개발 언어별(Java, .Net, Python, Ruby, Node.js 등) 모니터링 뿐만 아니라 다양한 프레임워크(framework)에 대하여 지원한다.
    
*   특정 코드 세그먼트 및 SQL문이 애플리케이션 혹은 서비스 성능에 영향을 주는지 drill-down 확인이 가능하다.
    
    *   코드레벨 트랜잭션 : ex> xx.jsp app code processing time
        
    *   호출 과정에 대하여 원하는 클래스, 메소드 레벨 추적이 가능하다.
        
    *   thread profiler 지원
        

[New Relic - Browser](https://newrelic.com/products/browser-monitoring)
-----------------------------------------------------------------------

*   백엔드, 페이지로드 또는 그 외에서 발생하는 고객 경험 및 성능 관련 문제를 확인하고 진단하는데 도움을 준다.
    
*   브라우저 버전 및 사용자 기기 유형 등 브라우저 유형별로 프런트엔드 성능 분류를 확인할 수 있다.
    
*   사용자의 지리적 위치(도시)까지 파악하여 최종 사용자에 대한 경험 분석을 지원한다.
    
*   Session Trace를 활용하여 서비스를 위한 resource(이미지, css 등) 로딩, AJAX 요청, 사용자 상호작용에 대하여 시간축을 기준으로 시각화하여 확인할 수 있는 기능을 제공한다.
    
*   요청 대기열, 앱 코드, 네트워크 대기시간, DOM 처리 및 페이지 렌더링 별로 각 페이지의 로드시간 성능을 분석할 수 있다.
    

[New Relic - Infrastructure](https://newrelic.com/products/infrastructure)
--------------------------------------------------------------------------

기본적으로 인프라 전반의 호스트 및 인스턴스의 기본정보에 대한 모니터링이을 지원한다.

*   [New Relic](https://newrelic.com/)은 (AWS, Docker, Bare Metal 또는 위 모든 인프라 등) 다양한 인프라 전반에 걸쳐 호스트에 대한 모든 지표 및 이벤트에 대해 실시간으로 가시성을 제공한다.
    
*   New Relic은 빠른 확장, 스마트한 배포, 사전 모니터링을 수월하게 이행할 수 있도록 지원한다.
    
*   주요 호스트 상태 지표 (CPU, 메모리, 디스크, 네트워크) 5 초마다 새로 고침
    
*   커스터 쿼리와 태그기반 경고 및 대시보드를 통한 관리
    
*   라벨, 이미지 및 기타 메타데이터 별 Docker 컨테이너 분할
    

  
AWS EC2와 긴밀하게 통합되어 EC2 관련되어 다양한 모니터링이 기능하다.  
New Relic Infrastructure Essentials 및 Pro는 Amazon EC2와 Docker에 대한 기본 지원과 함께 제공된다.  
New Relic Infrastructure Pro는 다음과 같은 인기 있는 AWS 서비스에 대하여 기본 모니터링의 확장형 서비스를 제공한다.

*   AWS IAM
    
*   Amazon CloudFront
    
*   Amazon DynamoDB
    
*   Amazon EBS
    
*   AWS Route 53
    
*   AWS ElastiCache
    
*   AWS Elastic Load Balancing
    
*   AWS Elasticsearch
    
*   AWS Kinesis
    
*   Amazon Kinesis Firehose
    
*   Amazon SNS
    
*   Amazon RDS
    
*   Amazon ECR
    
*   Amazon SQS
    
*   Amazon VPC
    
*   Amazon ECS
    

  
이러한 통합서비스를 통해 AWS사용량을 쉽게 보고 이해할 수 있다.  
즉, AWS지출 분석,분기별 예산 검토 또는 전망 준비, 서비스 확장에 따른 영향 평가 또는 사용량과 데이터 흐름의 급등 및 급락 파악 등이 가능하기 때문에 AWS 인프라 및 앱관리를 미세조정할 수 있다.

[New Relic - Insights](https://newrelic.com/products/insights)
--------------------------------------------------------------

New Relic의 실시간 분석 플랫폼이다.  
New Relic query language(NRQL)를 사용하여 New Relic으로 수집된 데이터에 대하여 질의가 가능하다.  
쿼리 결과를 그래프로 가시화 하고 대시보드에 포함시키는 것이 가능하다.  
코호트(cohort) 분석, 퍼널(funnel) 분석이 가능하다.

New Relic query language(NRQL)의 기본 기능

*   조회 조건 필터링 설정
    
*   결과 버킷팅(bucket) 지원
    
*   히스토그램
    
*   조회 결과와 필터링을 그래프와 연동
    

[New Relic - Mobile](https://newrelic.com/products/mobile-monitoring)
---------------------------------------------------------------------

앱에 대한 사용자 활동 분석  
앱 크래시 리포트 : 관련 지표, 빈도, 스택트레이스  
크래시 발생시 이메일 알림등 연동

[New Relic - Synthetics](https://newrelic.com/products/synthetics)
------------------------------------------------------------------

사전 모니터링, 테스팅에 대한 용도로 활용할 수 있다.

  

* * *

기타 교육중 확인한 내용
-------------

다음은 기타 교육 설명에서 확인한 내용이나 질문을 통해 확인한 내용들이다.

*   기본적으로 New Relic은 Agent 설치가 필요하다. 다양한 용도의 agent를 지원하는 것으로 보인다.
    
*   NRQL(New Relic Query Language)는 SQL과 유사하게 보일 수 있으나 일반적인 SQL이 아니다. 표준 ANSI SQL과 동일한 수준의 질의 기능을 제공하는 것은 아니다.
    
*   모니터링 데이터는 timestamp에 대한 처리는 기본적으로 UTC 기반이며, New Relic query나 New Relic 관리 console에서 timezone을 설정할 수 있다.
    
*   Permalink 정보를 선택하여 전달하면 문의 대응에 더 좋다. Permalink에는 조회 시간범위까지 포함되어 있다.
    
*   커스텀 메트릭을 New Relic쪽으로 적재(insert)하는 것이 가능하며, 적재 요청시 insert용 api key를 사용하여 적재한다.
    
*   CloudWatch로 전달되는 aws resource 서비스 메트릭을 New Relic쪽으로 가져와서 활용할 수 있다.
    
*   서비스 코드에 New Relic쪽으로 데이터를 수집하기 위한 용도의 코드를 심어서 데이터 수집, 분석이 가능하다.
    
*   로컬 Browser단에 JavaScript를 추가하여 테스트 목적의 데이터를 수집하여 볼 수 있다.
    
*   서비스 응답시간 기준으로 satisfied, tolerating, frustrated 버킷으로 나누어 메트릭을 분류할 수 있다.
    
*   서비스 DB query 분석과 힌트(가이드) 제공 기능을 일부 포함하고 있다.
    
*   time marking : 어느 시점에 중요하게 어떤 이벤트가 있었는지 표시를 하여 지표 분석이나 가시화 처리에 도움을 줄 수 있다.
    
*   New Relic Alarm은 by policy, by condition, by condition and entity 3가지 형태로 동작 방식이 나누어질 수 있으며, 각 방식에 따른 동작방식을 잘 이해하고 사용해야 한다.
    
*   New Relic Alarm은 Amazon CloudWatch의 Alarm과 유사하게 특정조건을 만족하여 최초 알람이 발생한 이후, 동일한 조건을 만족하는 알람 상황이 지속되는 경우 동일 알람 설정으로 다시 알람 액션이 발생하지는 않는다.
    

  

* * *

참고자료
====

New Relic에 대한 최신 한글자료는 검색이 잘 안된다. 사이트문서와 YouTube - New Relic 채널의 자료를 참고하는 것이 좋을 것으로 보인다.  
공식 사이트 문서

*   [New Relic site](https://newrelic.com/)
    
*   [New Relic Documents](https://docs.newrelic.com/)
    
*   APM: [https://docs.newrelic.com/docs/apm/new-relic-apm/guides/new-relic-apm-best-practices-guide](https://docs.newrelic.com/docs/apm/new-relic-apm/guides/new-relic-apm-best-practices-guide)
    
*   Browser: [https://docs.newrelic.com/docs/browser/new-relic-browser/guides/new-relic-browser-best-practices-guide](https://docs.newrelic.com/docs/browser/new-relic-browser/guides/new-relic-browser-best-practices-guide)
    
*   Mobile: [https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile/guides/new-relic-mobile-best-practices-guide](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile/guides/new-relic-mobile-best-practices-guide)
    
*   Insights: [https://docs.newrelic.com/docs/insights/use-insights-ui/guides/new-relic-insights-best-practices-guide](https://docs.newrelic.com/docs/insights/use-insights-ui/guides/new-relic-insights-best-practices-guide)
    
*   Synthetics: [https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/getting-started/new-relic-synthetics](https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/getting-started/new-relic-synthetics)
    
*   Infrastructure: [https://docs.newrelic.com/docs/infrastructure/new-relic-infrastructure/guides/new-relic-infrastructure-best-practices-guide](https://docs.newrelic.com/docs/infrastructure/new-relic-infrastructure/guides/new-relic-infrastructure-best-practices-guide)
