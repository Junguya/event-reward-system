# Gateway Server

NestJS 기반 API Gateway 서비스입니다.
클라이언트 요청을 적절한 내부 서비스로 프록시하며, JWT 인증 및 역할 기반 인가 처리를 담당합니다.

## 인증 구조

- 클라이언트가 로그인 시 Gateway를 통해 auth-server에 요청
- Gateway는 `accessToken`, `refreshToken`을 받아 쿠키/헤더 처리
- 이후 요청마다 `accessToken`을 검증하고, 필요한 경우 `refreshToken`으로 갱신
- 인증 통과 시, 내부 서비스(auth-server, event-server)로 요청을 프록시 처리

## 디렉토리 구조

src/
├── auth/ # 인증 관련 프록시 (로그인, 회원가입, 토큰 갱신 등)
├── roles/ # 역할 관리 프록시
├── users/ # 유저 정보 관리 프록시
├── events/ # 이벤트 프록시
├── rewards/ # 보상 프록시
├── reward-requests/ # 보상 요청 프록시
├── user-stats/ # 유저 통계 프록시
├── common/ # 공통 전략, 데코레이터, 가드 등
├── config/ # 환경 설정
└── main.ts # 앱 진입점

## 실행 방법

### 의존성 설치

npm install

### 환경변수 설정 (.env)

PORT=3000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_EXPIRES_IN=7d
AUTH_SERVICE_URL=<http://localhost:3001>
EVENT_SERVICE_URL=<http://localhost:3002>

### 실행

npm run start:dev

### 빌드

npm run build

### 배포 서버 실행

npm run start:prod

### Swagger API 문서

[http://localhost:3000/docs](http://localhost:3000/docs)

## 주의사항

이 Gateway는 인증/인가 처리만 처리하며, 실제 데이터는 내부 서비스(auth-server, event-server)에서 관리됩니다.
Swagger에서 테스트할 경우, 반드시 accessToken을 Bearer 형식으로 입력해야 합니다.
