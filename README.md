<<<<<<< HEAD
# test
=======
# 만들고싶은거 만드는 프로젝트

- 진짜 만들고 싶은 것 만듬

---

## 2. VerGrid

 - 대충 내가 쓰는 캘린더/시트/알람 사용하는 프로그램을 내 취향에 시트 위주로 통합한것
 - 내가 쓰는 캘린더/시트/알람을 버리고 이걸 사용하면 와 이거지 하면서 쓸 수 있게 만들기가 목표
 - "내"가 클라이언트이기 때문에 만들면서 타협할 기능이 절대 없음

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
 - ~~추석이 껴있으므로 쉬는게 아니라 추석까지 완성하는 느낌으로(러프한가?)~~ 러프했다
 - 몇일 연속으로 하는게 안되니 할 수 있는 날에 진짜 개 집중해서 하는걸로
 - 사 용 성 제 발 개 떡 같 이 말 고 진 짜 개 선
 - 대충 부트스트랩썼다 말다 iframe썼다 말다 reveal썼다 말다 react대충 쓰다 꽥 한 느낌이 없잖아 있으니 부트스트랩으로 fix -> mui material로 선회
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
<<<<<<< HEAD
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
=======
	 - ~~셀 시트 구현~~
	 - ~~셀 시트 데이터 로컬스토리지 저장~~
	 - ~~셀 시트 데이터 ref기반 연산식 확인~~
>>>>>>> fb2fa14 ([PAPER] dev noted)
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
<<<<<<< HEAD
   - 일단 구현해보고 추후에 지우는것으로
	 - 그러면 이게 Sheets 컴포넌트에 같이 있을 필요가 있나? 가뜩이나 코드가 길긴함
>>>>>>> 0ffe2c9 ([PAPER] dev noted)
=======
	 - 일단 구현해보고 추후에 지우는것으로
	 - 그러면 이게 Sheets 컴포넌트에 같이 있을 필요가 있나? 가뜩이나 코드가 길긴함
 - 문제 발생. TextChange가 최신화와 데이터 동기화를 겸하는중이라 입력시 렌더링이 무진장 길다
 	 - TextField의 value를 useState로 잡은 focusTargetValue로 만들고 이걸 useRef로 잡아다 관리하기
	 - refMode의 셀 편집 기능 사용 시 useRef로 잡은 타겟이 변경되는 문제가 발생...
	 - focusTargetValue를 value가 아니라 defaultValue로 변경했음
	 - TextField의 value는 관리를 focusTargetRef로 따로 관리함(데이터 저장은 cellValues, 객체 저장은 focusTargetRef가)
<<<<<<< HEAD
>>>>>>> 1d7698c ([DEV] dev noted)
=======
 - 문제 발생. TextChange를 바꿨더니 reference모드가 아닌데도 클릭 셀의 데이터를 가져온다
	 - 완료. static/object/TextField 세 값을 모두 관리해야했는데 중간에 섞인 문제였음
<<<<<<< HEAD
>>>>>>> 7e87735 ([PAPER] dev noted)
=======
 - css 지금 이상한거 알지? 이거 해결하려면 탭 넣을지 빨리 결정해야함
	 - 안넣는게 좋을거같은데 이게 완전 시트로 구현하는게 아니라서
	 - 안넣을거면 Shift + 클릭으로 currentRegion구현해야함
	 - 그리고 안넣는거 확정이라면 스크롤부분 문제있는거 고치고 개발을 시작하십시오
	 - 스크롤은 개선됨, currentRegion 남음
 - 사칙연산 외에 괄호 계산과 함수 넣는거 시작해보자
	 - 일단이중 레퍼런스 문제 해결해야함
	 - &는 텍스트 붙이기전용으로(지금은 +로 사용중임)
	 - 괄호는 괄호임
	 - : 콜론 붙여서 여러 셀을 인식할 수 있어야함
	 - 함수기본적인것 if and or sum average product 순으로 해보자
 - 시트 save&load 구현 중 발생한 문제 처리
	 - 구현하다 tab change 이후 데이터가 없는 탭에서 시트 생성하면 이전 탭의 셀 데이터가 남아있는 오류 발생
	 - if문에 걸려있는 null때문에 넘어가나 하고 false로 바꿔줌 -> 간략해지긴했는데 문제는 그대로
	 - useEffect쓰면 렌더링될때마다 되겠다 하고 inheritData를 useEffect로 상시 초기화하도록함 -> 순환 오류 발생
<<<<<<< HEAD
	 - 찾아보니 useState는 "최초 렌더링" 할 때만 초기화하고 그 이후는 useEffect로 하기 때문에 `const initData = inheritData || {}; const [cellValues, setCellValues] = useState(initData)`대신 `const [cellValues, setCellValues] = useState(inheritData || {});`로 조정하고 useEffect 내에서 다시 setCellValues를 호출하는것으로 변경
	 - SheetPage에서 데이터가 없을 때 tc는 inheritData를 null로, confirm때는 inheritData를 false로 하도록 하여 inheritData의 변경점을 설정함(어차피 inheritData가 null이면 무조건 사용자가 confirm을 해야 새 시트가 나오게 되어있음)
>>>>>>> 807772f ([PAPER] dev noted)
=======
	 - 찾아보니 useState는 "최초 렌더링" 할 때만 초기화하고 그 이후는 useEffect로 하기 때문에 useEffect 초기화 시점으로 로 조정하고 useEffect 내에서 다시 setCellValues를 호출하는것으로 변경
	 - SheetPage에서 데이터가 없을 때 tc는 inheritData를 null로, confirm때는 inheritData를 false로 하도록 하여 inheritData의 변경점을 설정함(어차피 inheritData가 null이면 무조건 사용자가 confirm을 해야 새 시트가 나오게 되어있음)
	 - TabValue의 useState 초기화시점에서 loadData 실행하도록 해서 해결함(loadData가 useEffect로 묶이면 loadData에서 또다른 useState값들을 건드리는바람에 useEffect를 사용시 오류가 발생해서 이렇게 하는것으로)
 - tab change에서 발견된 문제 처리
	 - sheet의 데이터가 로딩되기 전에 tab change를 하게 되는것을 반복하면 시트의 inheritData를 로딩하는중에 tabChange가 되어 다른 탭에 데이터가 덮여쓰기됨
	 - loading을 추가함 SheetPage에도 Sheets에도. 그런데 결국 저장되는 데이터는 Sheets에 있는 CellValues이기 때문에 SheetPage에 있는 loading은 제거함
	 - 문제가 inheritData를 로딩하는중에 tabChange가 가능한것이기 때문에 로딩이 끝난 후(inheritData가 CellValues에 들어간 후) 로딩이 종료되도록 하고 로딩 중에 tabChange를 할 수 없도록 tab에 `disabled={loading}`을 설정함
 - tab 변경 간 사라지지 않던 이전 탭 CellValues를 제거함
<<<<<<< HEAD
>>>>>>> fb2fa14 ([PAPER] dev noted)
=======
 - 정규식 작성중. 다른 방법은 많지만 정규식으로 하고싶음. 고집인가? 그래도 도전~
>>>>>>> d923d5e ([PAPER] dev noted)
