---
title:  "Github page와 jekyll을 이용해 개발 블로그 만들기 - 테마 적용하고 설정 바꾸기"
excerpt: "이 포스트에서는 기술 블로그에 테마를 적용하고 기본 설정에서 바꿔 원하는 블로그로 바꿀 수 있게 설명한다. "

categories:
  - Jekyll
tags:
  - Jekyll

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---

목적
==

* * *

이 문서의 목적은 이전의 글에 이어 Github page와 Jekyll을 이용해 개발 블로그 만드는 법을 정리하고 공유하기 위해 작성했다.

테스트 환경
======

* * *

테스트 환경은 다음과 같다. 

*   iMac Catalina 10.15.3
    

사전 필요
=====

* * *

이 문서 가이드에 따라 진행하기 위해서는 다음과 같은 것들은 미리 설치가 되어 있어야 한다. 

*   Xcode
    
*   Terminal
    
*   Jekyll
    

Jykell 테마 커스텀하기
===============

* * *

이제 블로그 포스팅을 하기 전 테마를 적용해 디자인적 요소가 가미된 블로그를 생성할 것이다. 테마를 적용한 결과물은 다음과 같다.

![](/assets/images/blog4.jpg))

Minimal 테마 설치하기
---------------

테마를 적용하기 위해 터미널에서 다음과 같은 명령어를 입력한다.

```
$ gem "minimal-mistakes-jekyll"

$ bundle
```

입력 완료 후 Jekyll 프로젝트 안의 \_config.yml파일의 내용 중 theme를 다음과 같이 수정한다.

```
theme: minimal-mistakes-jekyll
```

수정 후 다음 명령어를 입력한다.

```
bundle update
```

\_config.yml 파일 수정하기
--------------------

\_config.yml을 수정해야 우리가 원하는 모습의 블로그로 변화가 가능하다. 다음 \_config.yml을 참고해 \_config.yml 파일을 각자 상황에 맞게 수정한다. 설정 적용 시 [https://jangseongwoo.github.io](https://jangseongwoo.github.io) 접속 시 보이는 것과 동일하게 된다.

```
# Welcome to Jekyll!
#
# This config file is meant for settings that affect your entire site, values
# which you are expected to set up once and rarely need to edit after that.
# For technical reasons, this file is *NOT* reloaded automatically when you use
# `jekyll serve`. If you change this file, please restart the server process.

# Theme Settings
#
# Review documentation to determine if you should use `theme` or `remote_theme`
# https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/#installing-the-theme

# theme                  : "minimal-mistakes-jekyll"
# remote_theme           : "mmistakes/minimal-mistakes"
minimal_mistakes_skin    : "default" # "air", "aqua", "contrast", "dark", "dirt", "neon", "mint", "plum", "sunrise"

# Site Settings
locale                   : "ko"
title                    : "kelpin's blog" # 블로그 이름
title_separator          : "-"
subtitle                 : "To the best" # site tagline that appears below site title in masthead
name                     : "kelpin"
description              : "kelpin의 블로그입니다. 학습했던 것을 정리해 블로그에 올리고 있습니다." # 블로그 설명
url                      : https://jangseongwoo.github.io/ # the base hostname & protocol for your site e.g. "https://mmistakes.github.io"
baseurl                  : # the subpath of your site, e.g. "/blog"
repository               : # GitHub username/repo-name e.g. "mmistakes/minimal-mistakes"
teaser                   : # path of fallback teaser image, e.g. "/assets/images/500x300.png"
logo                     : "/assets/images/logo_temp.png" # path of logo image to display in the masthead, e.g. "/assets/images/88x88.png"
masthead_title           : "kelpin's blog" # overrides the website title displayed in the masthead, use " " for no title
breadcrumbs              : true # true, false (default)
words_per_minute         : 200
comments:
  provider               : "disqus" # false (default), "disqus", "discourse", "facebook", "staticman", "staticman_v2", "utterances", "custom"
  disqus:
    shortname            :  # shortname은 다음 링크 참조해 입력한다. https://help.disqus.com/customer/portal/articles/466208-what-s-a-shortname-
  discourse:
    server               : # https://meta.discourse.org/t/embedding-discourse-comments-via-javascript/31963 , e.g.: meta.discourse.org
  facebook:
    # https://developers.facebook.com/docs/plugins/comments
    appid                :
    num_posts            : # 5 (default)
    colorscheme          : # "light" (default), "dark"
  utterances:
    theme                : # "github-light" (default), "github-dark"
    issue_term           : # "pathname" (default)
staticman:
  allowedFields          : # ['name', 'email', 'url', 'message']
  branch                 : # "master"
  commitMessage          : # "New comment by {fields.name}"
  filename               : # comment-{@timestamp}
  format                 : # "yml"
  moderation             : # true
  path                   : # "/_data/comments/{options.slug}" (default)
  requiredFields         : # ['name', 'email', 'message']
  transforms:
    email                : # "md5"
  generatedFields:
    date:
      type               : # "date"
      options:
        format           : # "iso8601" (default), "timestamp-seconds", "timestamp-milliseconds"
  endpoint               : # URL of your own deployment with trailing slash, will fallback to the public instance
reCaptcha:
  siteKey                :
  secret                 :
atom_feed:
  path                   : # blank (default) uses feed.xml
search                   : true #, false (default)
search_full_content      : # true, false (default)
search_provider          : # lunr (default), algolia, google
algolia:
  application_id         : # YOUR_APPLICATION_ID
  index_name             : # YOUR_INDEX_NAME
  search_only_api_key    : # YOUR_SEARCH_ONLY_API_KEY
  powered_by             : # true (default), false
google:
  search_engine_id       : # YOUR_SEARCH_ENGINE_ID
  instant_search         : # false (default), true
# SEO Related
google_site_verification :
bing_site_verification   :
yandex_site_verification :
naver_site_verification  :

# Social Sharing
twitter:
  username               :
facebook:
  username               :
  app_id                 :
  publisher              :
og_image                 : # Open Graph/Twitter default site image
# For specifying social profiles
# - https://developers.google.com/structured-data/customize/social-profiles
social:
  type                   : # Person or Organization (defaults to Person)
  name                   : # If the user or organization name differs from the site's name
  links: # An array of links to social media profiles

# Analytics
analytics:
  provider               : false # false (default), "google", "google-universal", "custom"
  google:
    tracking_id          :
    anonymize_ip         : # true, false (default)

header:
  image: /assets/images/header.jpg

# Site Author
author:
  name             : "kelpin"
  avatar           : "/assets/images/avata.png" # path of avatar image, e.g. "/assets/images/bio-photo.jpg"
  bio              : "There are no masterpieces made by lazy artists."
  location         : "Seoul, South of korea"
  email            : "seongwoo.dev@gmail.com"
  links:
    - label: "Email"
      icon: "fas fa-fw fa-envelope-square"
      # url: mailto:seongwoo.dev@gmail.com
    - label: "Website"
      icon: "fas fa-fw fa-link"
      # url: "https://your-website.com"
    - label: "Twitter"
      icon: "fab fa-fw fa-twitter-square"
      # url: "https://twitter.com/"
    - label: "Facebook"
      icon: "fab fa-fw fa-facebook-square"
      # url: "https://facebook.com/"
    - label: "GitHub"
      icon: "fab fa-fw fa-github"
      # url: "https://github.com/jangseongwoo"
    - label: "Instagram"
      icon: "fab fa-fw fa-instagram"
      # url: "https://instagram.com/"
    - label: "linkedin"
      icon: "fab fa-linkedin"
      url: "https://www.linkedin.com/in/seongwoo-jang-64607515b/"
      

# Site Footer
footer:
  links:
    - label: "Twitter"
      icon: "fab fa-fw fa-twitter-square"
      # url:
    - label: "Facebook"
      icon: "fab fa-fw fa-facebook-square"
      # url:
    - label: "GitHub"
      icon: "fab fa-fw fa-github"
      # url: "https://github.com/jangseongwoo"
    - label: "GitLab"
      icon: "fab fa-fw fa-gitlab"
      # url:
    - label: "Bitbucket"
      icon: "fab fa-fw fa-bitbucket"
      # url:
    - label: "Instagram"
      icon: "fab fa-fw fa-instagram"
      # url:


# Reading Files
include:
  - .htaccess
  - _pages
exclude:
  - "*.sublime-project"
  - "*.sublime-workspace"
  - vendor
  - .asset-cache
  - .bundle
  - .jekyll-assets-cache
  - .sass-cache
  - assets/js/plugins
  - assets/js/_main.js
  - assets/js/vendor
  - Capfile
  - CHANGELOG
  - config
  - Gemfile
  - Gruntfile.js
  - gulpfile.js
  - LICENSE
  - log
  - node_modules
  - package.json
  - Rakefile
  - README
  - tmp
  - /docs # ignore Minimal Mistakes /docs
  - /test # ignore Minimal Mistakes /test
keep_files:
  - .git
  - .svn
encoding: "utf-8"
markdown_ext: "markdown,mkdown,mkdn,mkd,md"


# Conversion
markdown: kramdown
highlighter: rouge
lsi: false
excerpt_separator: "\n\n"
incremental: false


# Markdown Processing
kramdown:
  input: GFM
  hard_wrap: false
  auto_ids: true
  footnote_nr: 1
  entity_output: as_char
  toc_levels: 1..6
  smart_quotes: lsquo,rsquo,ldquo,rdquo
  enable_coderay: false
  syntax_highlighter_opts:
    default_lang: python
    


# Sass/SCSS
sass:
  sass_dir: _sass
  style: compressed # https://sass-lang.com/documentation/file.SASS_REFERENCE.html#output_style


# Outputting
permalink: /:categories/:title/
paginate: 8 # amount of posts to show
paginate_path: /page:num/
timezone: # https://en.wikipedia.org/wiki/List_of_tz_database_time_zones


# Plugins (previously gems:)
plugins:
  - jekyll-paginate
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache

# mimic GitHub Pages with --safe
whitelist:
  - jekyll-paginate
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache


# Archives
#  Type
#  - GitHub Pages compatible archive pages built with Liquid ~> type: liquid (default)
#  - Jekyll Archives plugin archive pages ~> type: jekyll-archives
#  Path (examples)
#  - Archive page should exist at path when using Liquid method or you can
#    expect broken links (especially with breadcrumbs enabled)
#  - <base_path>/tags/my-awesome-tag/index.html ~> path: /tags/
#  - <base_path>/categories/my-awesome-category/index.html ~> path: /categories/
#  - <base_path>/my-awesome-category/index.html ~> path: /
category_archive:
  type: liquid
  path: /categories/
tag_archive:
  type: liquid
  path: /tags/
# https://github.com/jekyll/jekyll-archives
# jekyll-archives:
#   enabled:
#     - categories
#     - tags
#   layouts:
#     category: archive-taxonomy
#     tag: archive-taxonomy
#   permalinks:
#     category: /categories/:name/
#     tag: /tags/:name/


# HTML Compression
# - https://jch.penibelst.de/
compress_html:
  clippings: all
  ignore:
    envs: development


# Defaults
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
    values:
      layout: single
      #classes: wide
      author_profile: true
      read_time: false
      comments: true
      share: false
      related: true
      sidebar:
        nav: "docs"
```

포스트 작성하기
========

* * *

포스트를 작성하는 방법을 설명한다. 포스트는 블로그 폴더 내에 있는 \_posts 폴더에 파일을 생성해 작성하면 된다. 파일의 생성 규칙은 다음과 같다.

*   year-month-day-{post\_name}.md
    

예시는 다음과 같다.

*   2019-12-09-fluentd\_to\_aws\_kinesis.md
    

이 부분을 쉽게 하기 위해 프로젝트 폴더에 post\_create.sh 파일을 만들고 다음과 같이 내용을 입력한다.

```
#!/bin/bash
echo "post create start"

touch $PWD/_posts/$(date +%Y-%m-%d)-$1.md

echo "post create end"
```

실행 방법은 다음과 같다.

```
# 예시 : sh post_create.sh 포스트 이름

$ sh post_create.sh ldap_python
```

작성하려는 내용의 포스트를 만든다. 포스트 제일 앞 부분에는 이 포스트의 메타정보를 Jykell 형식에 맞게 입력해야되는데 다음 예시를 참조해 작성하도록 한다.

```
---
title:  "Python에서 LDAP인증을 사용할 수 있는 방법에 대한 조사 및 테스트"  # 포스트 이름
excerpt: "이 문서의 목적은 Python에서 LDAP인증을 사용할 수 있는 방법에 대한 조사를 정리하고 기록하기 위해 작성했다. " # 포스트 간단 설명, 검색 시 이 내용까지 나오게 된다.

# 아래의 카테고리 및 태그는 블로그의 카테고리 별, 태그 별 글 보기 할 때 아래에 입력한 내용이 나오므로 잘 입력한다. 
categories:
  - Ldap
tags:
  - Ldap
  
# 아래는 글의 목차를 보여주기 위한 설정이다. 고정되어 보이는게 싫다면 toc_sticky 항목을 False로 하면 된다. 

toc: true
toc_label: "Index"
toc_icon: "cog"
toc_sticky: true
---
```

위의 내용 이후에 작성하려는 포스트의 내용을 입력한다.

포스트 업로드하기
=========

* * *

포스트 업로드하는 것은 일반적인 소스코드 업로드하는 것과 동일하다. 작업의 반복적인 부분이 있어 쉘 스크립트로 자동화가 가능하며 자동화하는 방법은 다음과 같다.

프로젝트 폴더에 post\_upload.sh 파일을 만들고 다음과 같이 내용을 입력한다.

```
echo `git status`
echo `git add _posts/*`
echo `git commit -m "post upload"`
echo `git push origin master`
```

실행 명령어는 다음과 같다.

```
$ sh post_upload.sh
```

이렇게 하면 자동으로 Github에 업로드 되어 사이트에 들어가면 작성한 포스트를 볼 수 있다.

참고 문서
=====

* * *

참고 문서는 다음과 같다.

*   사용 테마 공식 홈페이지: [https://mademistakes.com/work/minimal-mistakes-jekyll-theme/](https://mademistakes.com/work/minimal-mistakes-jekyll-theme/)
    

  

===
