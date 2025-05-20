<!-- markdownlint-disable MD040 -->

# Event Server

NestJS 기반 이벤트 및 보상 처리 서비스입니다.
이벤트 등록, 보상 등록, 유저의 보상 요청 처리 및 통계 관리 기능을 제공합니다.

## 프로젝트 구조

```
src/
├── events/ # 이벤트 등록, 조회, 수정, 삭제
├── rewards/ # 보상 등록, 조회, 수정, 삭제
├── reward-requests/ # 유저의 보상 요청 처리
├── user-stats/ # 유저별 통계 관리
├── user-rewards/ # 유저별 보상 이력 관리
├── common/ # 공통 유틸, 예외, 인터페이스 등
├── config/ # 환경 설정
└── main.ts # 앱 진입점
```

## 실행 방법

### 의존성 설치

npm install

### 환경변수 설정 (.env)

PORT=3002
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/auth-service
AUTH_SERVICE_URL=<http://localhost:3001>

### 실행

npm run start:dev

### 빌드

npm run build

### 배포 서버 실행

npm run start:prod

### Swagger API 문서

[http://localhost:3002/docs](http://localhost:3002/docs)

## 테스트 코드 실행 방법

일부 핵심 로직에 대한 단위 테스트가 작성되어 있습니다.

### 테스트 실행

npm run test

### 테스트 시나리오

다음과 같은 보상 요청 흐름에 대해 단위 테스트를 수행했습니다:

1. 조건을 충족한 유저의 요청은 SUCCESS 상태로 저장된다.
   예: 로그인 일수 조건, 누적 포인트 조건 만족 시 보상 정상 지급
2. 조건을 충족하지 못한 유저의 요청은 FAILED 상태로 저장된다.
   예외를 발생시키지 않고 상태와 사유(reason)를 함께 기록
3. 이미 같은 이벤트에 보상을 받은 유저는 중복 요청 시 FAILED로 처리된다.
   중복 요청에 대한 방어 로직이 정상 동작하는지 확인

테스트는 reward-requests.service.spec.ts 파일에 작성되어 있으며, MongoDB 모델은 mocking 처리되어 독립적으로 실행됩니다.
