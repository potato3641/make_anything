# 만들고싶은거 만드는 프로젝트

- 진짜 만들고 싶은 것 만듬

---

## 1. t2w (2024.05.18~)

- 대충 간단한 발표용 자료 만들기 귀찮고 어디 저장하기도 싫고 공유도 괜히 내 구글 슬라이드 웹 공유하는것도 번거로워서 텍스트파일만 띡 올리면 알아서 프레젠테이션 나오는거 만들려고... 겸사겸사 일단 재밌어보임

### 주제

- 텍스트 파일 보내면 웹 페이지 하나 프레젠테이션해서 반환(redirect)해주는 서버 만들기

### 백엔드

- fastapi(초기) -> spring boot(오라클이 버틴다면)

### 상세 조사 후기 

- reveal.js를 개발자가 만지작 거리는게 아니라 좀 더 덜 귀찮은 방향으로(몰라도 버튼 하나로) 만드는 것

<details open>
<summary><h3>"기능"에 대한 세부 계획</h3></summary>
<div markdown="1">   

- [X] 1. 가이드용 ppt 제너레이터 만들기(사용설명서) <- 완

- [X] 2. 왼쪽 위에 대주제 써주는 기능 <- 이거 하려면 지금 마크다운 서식 고쳐야하는데...

- [X] 3. 그림 추가 기능(전체/왼/오/위/아래) <- 이거 하려면 지금 마크다운 서식 고쳐야하는데...

- [X] 4. nginx 앞에 둬서 gunicorn로 돌리는 구성 <- 완

- [X] 5. 깃허브 파이프라인 만들어두기 <- <U>**now**</U> 수동 파이프라인 : `cd make_anything;git pull origin master;ps -ef | grep gunicorn | awk 'NR==1 {print $2}' | xargs kill;`으로 구성완료

- [X] 6. 현재 텍스트파일 업로드 후 변환 이 순서로 돌아가는데 이걸 변경해볼것 예전에 봤던 DB없는 사이트처럼 파일내용을 url에 DB처럼 축약시키게 하고 내용은 textarea같은거로 받거나 url로만 만드는 제너레이터 비슷하게 변경해보자 <- 완

- [X] 7. 프레젠테이션 템플릿을 서버에서 내용 축약후 200자 이내라면 URL로도 볼 수 있게 만들어보기 <- 완

- [X] 8. text 페이지에서 프레젠테이션 제작 도움을 위한 버튼만들기(거창한거 아닌것 같았는데 기획하다보니 거창해짐 <U>**1번 기능**</U>과 연관있음) <- 폐기됨

- [X] 9. t2w 브랜치 분리할때 t2w페이지도 분기해서 새 index 페이지 만들기 <- 새 index페이지 완성

- [X] 10. 앗싸리 완전 revealjs 도배하는 종속 페이지 만드는것도 괜찮겠음 다만 iframe분리시켜서 외부에 네비게이터 추가할 수 있게 고민해보기 <- 폐기됨


</div>
</details>

<details open>
<summary><h3>현재까지 향후 계획</h3></summary>
<div markdown="1">   

- [X] 1. html 쓰기도 싫을 수 있으니 reveal.js를 아예 안보이게 <- 완

- [X] 2. 다른 기능도 제공하게 향후 계획을 세워보기 <- 세웠지만 변경중

- [X] 3. reveal.js를 대체해서 내가 해보기? <- 이거 하지 말라고함

- [X] 4. 서버에 올릴땐 CORS 확인, docs 막기, presentation 좀 만져놓기 <- 결론적으로 서버만 막으면 프론트는 머리싸맬 필요가 없다. 하지만 할수있는것만 해두자!

- [ ] 5. 나중에 t2w 브랜치 분리하기

- [X] 6. gunicorn에 대해 좀 알아둬야할 필요가 있다. 모니터링 도구가 필요할 수 있음 <- gunicorn 로그 기록은 완료

- [X] 7. 프로젝트가 커질수나 있을진 모르겠지만 아무튼 도메인도 생각해보기. 없다면 githubio나... <- 프로젝트 3개 이상 된다면 고려해볼것

- [ ] 8. 다음 프로젝트 구상하기

- [X] 9. 예외처리 <- 완

- [ ] 10. 갑작스러운 리액트 공부
  * 리액트 기본 공부 <- 겉햝기 완
  * TextPage 변환 <- 완
  * 조언 듣기
    - 페이지 이동은 훅으로 해라 <- 조사 완
    - settimeout은 지양하라 <- 아직도 해결할 수 없음
    - useEffect가 정말 필요한 곳인지 고민 <- 실적용해보며 체험한듯
    - bootstrap말고 다른것도 찾아보기 <- 테일윈드
  * FilePage 변환 <- 완
  * Index 변환 <- t2w전용으로 통합 완
  * Guide Markdown 변환 <- 완
  * Guide Custom 변환 <- 완
  * (가능하다면) css 발전시키기
  * 라이브용 빌드 변환
  * 라이브 테스트
  * 라이브 환경에 연결

</div>
</details>

<details open>
<summary><h4>발생한 문제에 대한 처리</h4></summary>
<div markdown="1">   

- [X] 1. 종속패키지 starlette에 인코딩방식이 latin-1로 되어있어 한글 인코딩이 되지 않는 문제
  * datastructures.py의 __getitem__ 함수에서 header_value decode방식을 latin-1에서 utf-8로 변경
  * responses.py의 Response클래스 set_cookie함수에서 마지막 cookie_val의 encode방식을 latin-1에서 utf-8로
  * 위 작업이 매우 꼽지만 자료 찾아본 결과 최종 답변은 꼬우면 네가 패키지 올려라 입니다
  * 서버에서는 홈의 .local폴더에 있으니 헛짓거리 말기...

- [X] 2. 위 문제를 해결하며 관찰한 결과 venv에 있는 starlette패키지가 아니라 내 컴퓨터에 설치된 python의 starlette패키지를 갖다 쓰는것을 발견(???)
  * vscode의 문제로 가상환경이 아님에도 (venv)가 남아있는 오류가 있으니 가상환경 체크하고 할 것

- [X] 3. 평가판 종료
  * 30일이라면서 왜 7일컷인지는 모르겠지만 아무튼 비용발생은 0

- [X] 4. 서비스로 gunicorn 돌리고있었는데 restart를하면 이전 fastapi는 꺼지지 않는 문제가 있다
  * service restart 대신 수동 재기동 1줄 명령어로 대체함
  * 업데이트된 코드 가져와서 현재 실행중인 gunicorn이 reload상태니까 마스터를 종료시키는 것
  * ps의 pid는 가장 늦고 워커 둘도 마스터보다 늦게 생성되므로 NR==1일 때 gunicorn인 프로세스는 항상 마스터
  * 이것도 프로젝트 늘어나면 서버 늘릴 때 같이 파이프라인 만들 서버 하나 더 만들 예정 그전까진 수동으로 유지

- [X] 5. README.md의 가독성이 처참해서 정리가 필요함 <- 이거로할거임

- [X] 6. 클립보드 복사 메서드가 https에서만 동작하는 메서드임. certbot 돌리기 or clipboard.js사용하기 선택은 충분히 고민
  * 일단 clipboard.js 추가해두고 주석으로 추후 수정될 부분 표시하기 <- 완
  * 나중에 certbot돌리긴 해야함 <- 도메인 사고 해야할것
  * 그래서 도메인 언제 사지? <- 프로젝트 늘어나면 해야할것

- [X] 7. 악의에 찬 .env를 찾기위한 엄청난 로그들... 이런것들을 대처할만한 보안관련 정보를 찾아볼 것
  * nginx geoip설정으로 해외ip차단 완료
  * 국내 이용자만 사용할 예정 어차피 해외 타겟이 아닌 프로젝트다

- [X] 8. 도움말/돌아가기 변환 시 하단 프로그레스 바와 네비게이터가 변하지 않는게 좀 불편
  * 고쳐보려고했는데 iframe으로 돌리니까 iframe에서 한 동작이 외부에 영향을 끼칠 수 없다.
  * 이게 보안상 동작하면 안된다. 할거면 iframe계획을 폐기해야하는데 iframe을 폐기하면 revealjs로 사용중이던 틀을 들어내야한다.
  * 어차피 iframe 쓰나 안쓰나 text에서 guide 슬라이드 전환 동작 안되는거 불편하긴했다...
  * 다음 작업 때 index.html 따로 빼면서 동시에 구조를 다시 잡아보겠음
  * 백엔드는 구조 잡고 잘 진행해놓고 왜 프론트는 무지성으로 했냐 반성좀
  * iframe은 example만 남기고 제거하고 슬라이드 넣어보자...
  * 해보다가 이거 안되겠다 이 프로젝트 미완성할거 아니면 뷰쓰거나 기왕 할거 리액트를 배워야겠다

- [X] 9. url 관련 문제
  * 첫 번째 문제, fastapi가 `/potato/api` 를 `/`처럼 받아야하는데 `/potato/api`로 받고 있음
  * `rewrite ^/potato/api(.*)$ /$1 break;` 추가해서 `/potato/api`로 들어가면 `/`로 다시 url을 쓰도록 만듦
  * 두 번째 문제, 루트로 진입하면 리액트가 아니라 500에러가 반겨줌
  * `cat /var/log/nginx/error.log` 찾아보니 권한 문제라고함
  * `sudo chmod -R 755 /home/ubuntu/make_anything/t2w-react/build` 권한을 올려주고
  * `sudo vi /etc/nginx/nginx.conf` 상단에 user를 www-data가 아니라 ubuntu로 바꿔줌
  * `sudo nginx -s reload` nginx 재시작
  * 세 번째 문제, 해결한 줄 알았는데 `/potato/api`가 `/`까지는 잘 가는데 이후로 `//`로 들어감
  * `rewrite ^/potato/api(.*)$ $1 break;`로 변경
  * 네 번째 문제, form으로 전송한 `/uploadText/`(fastapi기준 발송)가 그대로 `/result/`(react기준 실행)로 가도록 반환시켜서 발생
  * fastapi의 해당 부분을 모두 yaml로 변수화시켜 관리할 예정
  * nginx에서 url에 변경이 생기면 yaml파일 하나만 바꾸면 됨
</div>
</details>