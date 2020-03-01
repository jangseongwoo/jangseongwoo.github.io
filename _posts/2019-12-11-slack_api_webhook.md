---
title:  "Slackbot API 중 Webhooks,Web API를 이용한 메시지 보내기"
excerpt: "이 문서는 Slackbot에 대해 학습한 부분을 정리하기 위해 작성하였다."

categories:
  - Slack
tags:
  - Slack_API
  - Slack

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

문서목적
====

* * *

이 문서는 Slackbot에 대해 학습한 부분을 정리하기 위해 작성하였다.  
이 문서에서 Slackbot과 관련된 모든 내용을 정리하는 것은 아니며, 자세한 내용은 문서에 포함되어 있는 공식 사이트를 참고하도록 한다.

학습 범위
=====

* * *

아래와 같은 내용 포함하고 있다.

*   특정 채널에 Slackbot으로 메시지 보내기
    
    *   Webhooks API를 이용한 메시지 전달
        
    *   Web API를 이용한 메시지 전달
        
*   특정 채널에 예약 메시지 보내기
    

  

본 문서에 포함된 테스트는 워크 스페이스에 test-slackbot이라는 채널을 만들어 진행하였다. 아래 정리한 내용은 공식 사이트에 관련 내용이 문서로 있으며 문서 참고 시 필요한 내용을 위주로 기록하였다.

특정 채널에 Slackbot으로 메시지 보내기
=========================

* * *

Slackbot webhook API를 통한 메시지 전달
-------------------------------

Slackbot webhook API로 특정 채널에 메시지를 보내기 위해서는 아래와 같은 작업을 진행해야 한다.

1.  메시지를 보내고 싶은 슬랙 워크스페이스에 슬랙앱을 생성한다.
    
2.  슬랙앱에 Webhook을 추가한다.
    
3.  생성한 Webhook을 슬랙 워크스페이스의 특정 채널에 추가한다.
    

  

위의 작업을 완료하면 설정한 채널에 Webhook API를 이용하여 메시지를 보낼 수 있다. 슬랙 앱 Webhook 콘솔에 보면 Sample curl request이 있는데 이것을 복사해 메시지가 정상적으로 보내지는 지 확인 할 수 있다.

위에 기술된 작업 내용은 [슬랙 공식 사이트 Webhook](https://api.slack.com/messaging/webhooks) 문서를 참조해 진행하도록 한다.

이 문서의 내용 중 **Getting started with Incoming Webhooks** 항목의 1~4번 내용을 따라하면 된다.

위의 링크 문서 내용 중 슬랙으로 Webhook API를 이용해 메시지 보내는 샘플 명령어와 결과는 아래와 같다. 

```bash
$ curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/{token}

```

결과는 다음과 같다. 슬랙 채널 #test-slackbot에 가면 결과를 바로 볼 수 있다. 

![](/assets/images/webhook1.jpg)

Slackbot web API를 통한 메시지 전달
---------------------------

Slackbot web API로 특정 채널에 메시지를 보내기 위해서는 아래와 같은 작업을 진행해야 한다.

1.  메시지를 보내고 싶은 슬랙 워크스페이스에 슬랙앱을 생성한다.
    
2.  슬랙앱에 채널 메시지 읽기, 쓰기에 대한 권한을 부여한다.
    
3.  발급된 토큰을 가지고 Message payload를 만들어 전송한다.
    

  

위의 작업을 통해 설정한 채널에 Web API를 이용하여 메시지를 보낼 수 있다. 위에 기술된 작업과 관련된 자세한 설명은  [슬랙 공식 사이트 Web API](https://api.slack.com/messaging/sending) 문서를 참조해 진행하도록 한다.

Web API, Webhook API 차이점은 web API가 더 많은 부분들을 커스터마이징해 메시지를 보낼 수 있다는 것이다. 기본적인 메시지 기능을 주로 쓴다고 하면 Webhook API를 이용하는 것이 편리하다.

아래의 명령어는 실제 메시지를 채널에 보낼 때 Slackbot의 이름과 채널을 변경할 수 있는데 권한과 다양한 옵션들을 통해 여러 가지 기능들을 수행할 수 있다.

위의 링크 문서 내용 중 슬랙으로 Web API를 이용해 메시지 보내는 샘플 명령어와 결과는 아래와 같다. 

```bash
$ curl -X POST -d "token={token}3&channel=#test-slackbot&text=“asdasd”&username=seongwoo" https://slack.com/api/chat.postMessage

```

결과는 다음과 같다. 슬랙 채널 #test-slackbot에 가면 결과를 바로 볼 수 있다. 

![](/assets/images/webhook2.jpg)

특정 채널에 Slackbot으로 예약 메시지 보내기
============================

* * *

특정 채널에 Slackbot으로 메시지를 보낼 수 있는 방법에 대한 구체적인 설명은  [슬랙 공식 사이트 스케줄링 메시지 전송](https://api.slack.com/messaging/scheduling) 문서를 참고하도록 한다.

메시지를 보낼 때 유의해야 되는 부분은 chat.scheduleMessage API의 필수 파라미터 중 "post\_at" 필드는 Unix EPOCH timestamp이므로 메시지 예약하고자 하는 시간을 Unix EPOCH timestamp으로 변환해 값을 넣어야 한다는 것이다.

위의 링크 문서 내용 중 슬랙으로 예약된 메시지를 보내는 샘플 명령어와 결과는 아래와 같다. 

```bash
$ curl -X POST -H 'Authorization: Bearer {token}' \
-H 'Content-type: application/json' \
--data '{"channel":"#test-slackbot","text":"I hope the tour went well, Mr. Wonka.", "post_at":"1571730289"}' \
https://slack.com/api/chat.scheduleMessage
```

결과는 다음과 같다. 슬랙 채널 #test-slackbot에서 예약된 시간에 결과를 볼 수 있다. 

![](/assets/images/webhook3.jpg)
