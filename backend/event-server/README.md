# Event Server

NestJS 기반 이벤트 및 보상 처리 서비스입니다.
이벤트 등록, 보상 등록, 유저의 보상 요청 처리 및 통계 관리 기능을 제공합니다.

## 프로젝트 구조

src/
├── events/ # 이벤트 등록, 조회, 수정, 삭제
├── rewards/ # 보상 등록, 조회, 수정, 삭제
├── reward-requests/ # 유저의 보상 요청 처리
├── user-stats/ # 유저별 통계 관리
├── user-rewards/ # 유저별 보상 이력 관리
├── common/ # 공통 유틸, 예외, 인터페이스 등
├── config/ # 환경 설정
└── main.ts # 앱 진입점

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
