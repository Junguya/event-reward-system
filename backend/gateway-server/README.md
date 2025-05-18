# Gateway Server

이 프로젝트는 **이벤트 보상 시스템의 API 게이트웨이 서버**로,
Auth Server 및 Event Server 등 내부 서비스들과의 **프록시 역할**을 수행합니다.

NestJS 기반으로 구축되었으며, 인증/인가 처리를 담당하고,
역할(Role)에 따른 API 접근 제어를 수행합니다.

---

## 인증 구조

- 클라이언트가 로그인 시 Gateway를 통해 auth-server에 요청
- Gateway는 `accessToken`, `refreshToken`을 받아 쿠키/헤더 처리
- 이후 요청마다 `accessToken`을 검증하고, 필요한 경우 `refreshToken`으로 갱신
- 인증 통과 시, 내부 서비스(auth-server 등)로 요청 프록시

---

## 디렉토리 구조

src/
├── auth/ # 로그인, 회원가입, 토큰 갱신 프록시
├── roles/ # 역할 생성/조회/수정/삭제 프록시
├── users/ # 유저 정보 관리 프록시
├── common/ # 공통 전략, 가드, 데코레이터, 유틸
└── config/ # JWT 및 환경 설정

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정 (.env)

```.env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. 실행

npm run start:dev

### 4. Swagger API 문서

[http://localhost:3000/docs](http://localhost:3000/docs)

## 주의사항

이 Gateway는 인증만 처리하며, 실제 데이터는 auth-server / event-server 등에서 관리합니다.
Swagger에서 테스트할 경우, 반드시 accessToken을 Bearer 형식으로 입력해야 합니다.
