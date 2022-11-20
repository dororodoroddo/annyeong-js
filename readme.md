# annyeong-js
## Introduction
학습용 javascript/typescript로 작성된 SPA 라이브러리

### TODO (구조 계획)
* 상태변화 -> state 싱크 프로세스 -> getter 싱크 프로세스 -> 렌더 프로세스 순서를 유지하며 nextTick을 호출할 수 있는 구조 생성
  * 여러 스테이트를 호출하는 게터가 있을 수 있으므로 스테이트 변화를 모아 게터는 한번만 호출한다.
  * 여러 스테이트 및 게터를 호출하는 렌더가 있을 수 있으므로 변화 이후 렌더는 한번만 호출한다.
  * 모든 프로세스 이후 다음 각 프로세스를 쌓을 수 있는 nextTick 함수 구현
  * 렌더 함수는 과도한 호출을 막도록 requestAnimationFrame으로 비워주기
  * 동시성을 위한 프로세스 큐를 만들어 제너레이터로 쪼갠 함수를 렌더 프로세스가 비워질 때마다(비어있다면 계속 호출) 실행하도록 한다.
* key를 사용한 컴포넌트 트리 최적화
  * 리스트를 통한 컴포넌트 트리 렌더시 키값이 들어간다.
  * 키가 같다면 컴포넌트 내부 스테이트를 변화시키고 다르면 컴포넌트 생성을 다시 하는 방식으로 최적화한다.
  * props의 수정과 스테이트 변화 반응형 연동
* 라우터
* 스토어 모듈화
  
* 1.0 나오기 전까진 커밋 기록 유지 후 rebase 하기

### 특징
* dom element의 속성값과 상태의 변화를 this와 반응형으로 연결하여 사용하기 편합니다.
* .fullSize(), .flexRow() 와 같이 이터러블 프로토콜과 같은 형식으로 스타일을 지정할 수 있다.
* frame단위 렌더링을 통한 최적화 및 활용


## 기록
* 22/11/19 - 신 구조로 개편(구버전은 구버전 브랜치로 이동)
* 22/10/10 - 프로젝트 시작