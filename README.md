<<<<<<< HEAD
# test
=======
# 만들고싶은거 만드는 프로젝트

- 진짜 만들고 싶은 것 만듬

---

## 2. VerGrid

 - 대충 내가 쓰는 캘린더/시트/알람 사용하는 프로그램을 내 취향에 시트 위주로 통합한것
 - 내가 쓰는 캘린더/시트/알람을 버리고 이걸 사용하면 와 이거지 하면서 쓸 수 있게 만들기가 목표

### 주제

 - versatile grid (다용도 그리드)
 - 시트라고 안 한건 시트가 주라고 했지 시트만 쓸게 아니기 때문

### 백엔드

 - 여전히 서버가 좁고 비루하기 때문에 이번에도 시작은 가볍고 소켓도 사용해본 경험이 있는 fastapi

### 이전 기획으로부터 반성할 점

 - 너무? 잡다한? 기능에 집착한 나머지 큰걸 놓친 느낌
 - 이 리드미도 아무도 안 볼 프로젝트인데 집착하지말고 내 편한대로
 - 타협하기 시작하면 끝이없다
 - 일정을 너무 러프하게 했다
 - 커피를 적당히
 - 추석이 껴있으므로 쉬는게 아니라 추석까지 완성하는 느낌으로(러프한가?)
 - 사 용 성 제 발 개 떡 같 이 말 고 진 짜 개 선
 - 대충 부트스트랩썼다 말다 iframe썼다 말다 reveal썼다 말다 react대충 쓰다 꽥 한 느낌이 없잖아 있으니 부트스트랩으로 fix
 - 테스트를 나만해봤으니... 테스트좀 해보자

### 기능 개발 기획(마인드맵)

1. 1차 아이디어
	 - 셀에서 기본 연산식(Ref기반 사칙연산과 if and or) 지원
	 - 셀 입력 우선순위는 데이터베이스식으로
	 - 셀을 다중 사용자와 사용할 수 있게
	 - 셀에 대한 권한 제약 만들기
	 - 셀에 예약 걸어서 초기화? 동작도 설정할 수 있으면 좋을듯
	 - 개인용도는 로컬스토리지에 하는것으로 하고
	 - 협업용도는 서버 추가하는것으로 해보자
	 - 디자인도 배워서 신경써보자
 2. 추후 아이디어
	 - 더 이어진다면 셀 시트 대신 캘린더 시트도 사용할 수 있게
	 - 그래픽 시트도 있다면 좋을텐데 이건 배운다면
	 - 협업용
 3. 1차 기능 우선순위 정리
	 - 셀 시트 구현
<<<<<<< HEAD
		 - 셀 시트 데이터 로컬스토리지 저장
		 - 셀 시트 데이터 ref기반 연산식 확인
		 - 셀 시트 기반 기본함수 구현
		 - 셀 예약동작 구현(동작 아이디어 생각중...)
>>>>>>> 7fcc45c ([PAPER] readme and skeleton)
=======
	 - 셀 시트 데이터 로컬스토리지 저장
	 - 셀 시트 데이터 ref기반 연산식 확인
	 - 셀 시트 기반 기본함수 구현
	 - 셀 예약동작 구현(동작 아이디어 생각중...)
<<<<<<< HEAD
>>>>>>> 7115bb2 ([PAPER] fix typo)
=======

### 개발 노트

 - react-data-grid ? 하루종일 cell select기능이 안돼서 유기
 - ag-grid ? 이야 이거 쓸만하다~ 하는 기능이 유료라 유기
 - react-data-grid ? 다시 시도해보겠음...
<<<<<<< HEAD
>>>>>>> e64640e ([PAPER] today noted)
=======
 - 이것도 e버전 유료라 유기
 - css 신경 안쓰려고 mui material 갖다쓰려고 만져보는중
 - 시트 구성은 어떻게?
 	 - 10x10에 왼쪽과 위쪽에 tab selector가 있고 각 셀을 그리드로 구현
	 - 다행히 Textfield가 multiline과 fullwidth로 내가 원하는 구현이 가능
	 - 시트 기능 우선순위 설정이 필요한데 뭘 할 수 있는지 모르니 일단 구현부터
 - 시트 입력 Button과 TextField의 스위칭은 했는데 이걸 display:none으로 구현해버려서 TextField에 값을 넣어도 다시 Button을 클릭하기 전까지 TextField의 값을 알 수 없는 현상이 있음. 이걸 구조를 바꿔서 해결해야함 두개의 z-index를 바꾼다던지 하는 식으로...
<<<<<<< HEAD
>>>>>>> 906b586 ([PAPER] dev noted)
=======
	 - 스위칭이 아니라 버튼에 TextField의 값을 넣는 것으로
 - 시트에 함수를 넣는건 구현 우선순위 잠시 뒤로 미룸
 - 시트 계산이 사칙연산만 됨(괄호계산도 안됨)
 - 시트의 row와 column을 관리하는 탭이 필요할까?
   - 일단 구현해보고 추후에 지우는것으로
	 - 그러면 이게 Sheets 컴포넌트에 같이 있을 필요가 있나? 가뜩이나 코드가 길긴함
>>>>>>> 0ffe2c9 ([PAPER] dev noted)
