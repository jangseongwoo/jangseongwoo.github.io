---
title: Nifi 설치, Nifi single node로 샘플 데이터 수집해보기
excerpt: 이 글의 작성 목적은 Nifi 설치, Nifi single node로 샘플 데이터 수집해보기를 진행하며 공부했던 것을 정리하고 공유하는
  것이다.
categories:
- Nifi
tags:
- Nifi
- GCP
toc: true
toc_label: Index
toc_icon: cog
toc_sticky: true
---

# 목적

이 글의 작성 목적은 Nifi 설치, Nifi single node로 샘플 데이터 수집해보기를 진행하며 공부했던 것을 정리하고 공유하는 것이다.

# 진행 사항

이 글에서 진행하는 작업은 다음과 같다. 

- Nifi 설치

- Nifi single node로 샘플 데이터 수집해보기(Root 빼고 Disk 2개로 해보기, 빅쿼리에 넣어보기)

# 인스턴스 스펙, Nifi 버전 정보

인스턴스 스펙은 다음과 같다. 

- GCP VM Instance 

	- 일반 용도, E2시리즈, e2-medium(vCPU 2개, 4GB 메모리)

- CentOS 7

	- CentOS Linux release 7.8.2003 (Core)

- 20GB Disk

Nifi 버전 정보는 다음과 같다. 

- Nifi 1.12.0

- Java-1.8.0-openjdk-devel.x86_64

# Instance setup, nifi 설치

## Instance setup
여기서 부터 각자의 컴퓨터 상황과 셋팅 정보에 따라서 다르게 입력되어야 하는 부분은 "{}" 기호를 이용해 넣어야되는 값을 설명했다. 이 부분 참고해서 진행한다. 
아래의 명령어로 Instance에 접속한다. 
```
gcloud compute ssh --zone "{put zone name}" "{put instance name}" --project "{put project name}"
```
접속 후 아래의 명령어를 입력한다. 
```
# Timezone을 Seoul로 설정한다. 
$ timedatectl set-timezone Asia/Seoul

# local 설정을 KR로 변경한다. 
$ localectl set-locale LANG=ko_KR.utf8

# version 확인
$ cat /etc/redhat-release   
CentOS Linux release 7.8.2003 (Core)
```

명령어 입력 후 접속 종료한 다음에 아래의 명령어를 입력하면 변경된 locale을 확인할 수 있다. 
```
$ locale
```
아래와 같은 오류 메시지가 나오는 경우가 있다. 
```
-bash: warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): ?׷? ?????̳? ???͸??? ?????ϴ?
```
이럴 경우 기존 터미널에서 아래의 명령어를 입력하고 다시 접속하면 해결된다. 
```
$ export LANG="ko_KR.UTF-8"
```
위와 같이 오류 발생하는 이유는 터미널의 기본 설정이 GCP Instance의 기본 설정 정보를 변경하게 되면서 발생하는 오류다. 

터미널 Setup하는 방법은 다음과 같다.
```
# zsh 설치
$ yum install zsh

# 아래 명령어 안될 경우 다음 명령어로 진행한다.
$ chsh -s /bin/zsh

# 직접 바꿔줌.
$ vi /etc/passwd

$ yum install git
$ curl -L https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh | sh
$ vi ./zshrc
# ZSH_THEME="agnoster" 변경

$ yum install zsh-syntax-highlighting
$ source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

재접속하면 터미널이 변경되어 나온다.

## Nifi setup

Nifi의 경우 공식문서에 아래와 같이 써있다.  
```
Java 8 (or newer) JDK for the 1.x NiFi line.
```
아래와 같은 명령어를 통해 JDK와 Nifi 설치를 진행한다.
```
# JDK install 
$ sudo yum install java-1.8.0-openjdk-devel.x86_64

# 설치 확인
$ rpm -qa java*jdk-devel

# 설치 파일 다운로드를 위해 wget 설치
$ sudo yum install wget

# Nifi 파일 다운로드, 아래 링크가 안될 경우 버전 업그레이드가 된 것이라 Apache Nifi 공식 홈페이지의 다운로드 링크를 참고한다.
$ sudo wget http://apache.mirror.cdnetworks.com/nifi/1.12.0/nifi-1.12.0-bin.tar.gz
$ sudo tar xvfz nifi-1.12.0-bin.tar.gz 
$ cd nifi-1.12.0

# 아래는 JAVA HOME 설정을 위해 했지만 설정이 안됬다. 그러나 실행은 잘됌. 
$ which javac
$ readlink -f /usr/bin/javac
$ cd /opt/nifi-1.12.0/bin
$ sudo vi nifi-env.sh
# 아래 내용을 파일에 입력한다. 
# export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.262.b10-0.el7_8.x86_64

$ sudo ./bin/nifi.sh start
Java home: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.262.b10-0.el7_8.x86_64
NiFi home: /opt/nifi-1.12.0

Bootstrap Config File: /opt/nifi-1.12.0/conf/bootstrap.conf

# /etc/rc.local 파일을 편집해 아래 내용을 추가한다.
su - nifi /opt/nifi-1.12.0/bin/nifi.sh start
```
이제 http://{ip}:8080/nifi/ 에 접속해 Nifi 홈 화면을 볼 수 있다. 

기본적인 설치 후 다음에 진행하는 것은 Disk를 Mount하고 Nifi 설정을 변경하는 것이다. 이렇게 하는 이유는 기존 Instance 할당 된 Disk보다 더 많은 용량을 Mount해서 사용할 수 있으며, Nifi의 Content, Flowfiles 등의 저장소를 나눠서 이용함으로써 더욱 더 효율적인 수집을 하기 위해서이다. 

영구적으로 Disk를 Instance에 Mount하는 방법은 아래 링크에 자세히 나와있으니 따라 진행한다. 

https://cloud.google.com/compute/docs/disks/add-persistent-disk?hl=ko#formatting

최종적으로는 아래 2개의 명령어를 이용해 2개 Disk를 Mount했다. 
```
$ echo UUID=`sudo blkid -s UUID -o value /dev/sdb` /mnt/disks/nifi_disk2 ext4 discard,defaults,NOFAIL_OPTION 0 2 | sudo tee -a /etc/fstab
$ echo UUID=`sudo blkid -s UUID -o value /dev/sdc` /mnt/disks/nifi_disk3 ext4 discard,defaults,NOFAIL_OPTION 0 2 | sudo tee -a /etc/fstab
```
이 후 Nifi의 설정을 변경해 Disk 2개를 사용하도록 한다. 
```
$ /opt/nifi-1.12.0/conf
$ vi nifi.properties

# 아래 해당하는 부분들을 수정한다. 
nifi.database.directory=/mnt/disks/nifi_disk2
nifi.flowfile.repository.directory=/mnt/disks/nifi_disk2
nifi.content.repository.directory.default=/mnt/disks/nifi_disk3
nifi.provenance.repository.directory.default=/mnt/disks/nifi_disk3
```
변경한 후 Nifi 재시작을 하면 설정해준 경로에 새롭게 파일들을 생성하는 것을 확인할 수 있다. 

# Nifi single node로 샘플 데이터 수집해보기

## RDS에서 데이터 수집하는 프로세서 만들기

여기서 진행하는 MySQL은 이미 준비되어 있다는 가정하에 진행한다. MySQL Driver를 설치한다. 
```
$ wget https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.19/mysql-connector-java-8.0.19.jar
```
Mysql connector 8.0.19 version을 사용할 경우 driver를 load할 수 없다는 오류가 발생한다. 

구글링 해보니 version을 바꿔주면 된다고 해서 version을 5.1 version으로 진행한다. 
```
# Download
$ sudo wget https://downloads.mysql.com/archives/get/p/3/file/mysql-connector-java-5.1.48.zip

$ sudo yum install unzip
$ sudo unzip mysql-connector-java-5.1.48.zip
```
설정 정보는 다음과 같다. 
```
Database Connection Pooling Service: DBCPConnectionPool

Database Type: MySQL

Table Name: {table_name}

DBCPConnectionPool

Database Connection URL: jdbc:mysql:{db_endpoint}:{port}/{table_name}

Database Driver Class Name: com.mysql.jdbc.Driver 

Database Driver Location(s): /opt/nifi-1.12.0/drivers/mysql-connector-java-5.1.24/mysql-connector-java-5.1.24-bin.jar 
```

## BigQuery에 데이터 넣는 프로세서 만들기 

왼쪽 위 상단에 있는 프로세서 아이콘을 클릭해서 드래그한다. 그러면 창이 뜨는데 거기서 Bigquery를 검색하고 PutBigQueryBatch를 선택해 만든다. 설정은 다음 내용을 참고해 진행한다. 
```
Project ID: {project_name}

GCP Credentials Provider Service

Use Application Default Credentials: false

Use Compute Engine Credentials: false

Service Account JSON File: 인증용 Json 파일 경로  

Dataset: test

Table Name: test_seong

Ignore Unknown Values: false

Load file type: Avro

Create Disposition: Create if needed

Write Disposition: write_truncate
```
이후 먼저 만들어 놓은 QueryDatabaseTable 프로세서의 Output을 PutBigQueryBatch에 연결하면 설정은 완료되서 정상적으로 우리가 원하던 데이터 적재가 된다. 

# 진행하면서 모르는 것들 정리

## Linux locale

로캘은 리눅스에서 사용자가 어떤 언어를 사용하는지 지정하는 데 사용된다. 로캘은 사용될 문자 집합을 같이 지정하기 때문에 로캘을 바르게 설정하는 것이 특히 언어에 비아스키 문자가 있을 경우에 매우 중요하다. 

로캘은 다음과 같은 형식으로 지정된다. 
```
<언어>_<지역>.<코드집합>[@<변형>]
```

# 참고 문서

참고 문서는 다음과 같다. 

- linux locale: https://wiki.archlinux.org/index.php/Locale_(한국어)

- Nifi 설치: https://m.blog.naver.com/ikikikiko_o/221658388386

- Nifi MySQL driver connection error: https://stackoverflow.com/questions/52377364/nifi-unable-to-connect-to-local-mysql
