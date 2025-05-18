# Auth Service (Nexon Assignment)

NestJS 기반 인증 및 유저 관리 서비스입니다.
유저 등록, 로그인, 역할 관리, JWT 기반 인증/인가 기능을 제공합니다.

---

## 프로젝트 구조

src/
├── auth/ # 로그인, 토큰 발급, 인증 관련 로직
├── users/ # 유저 등록, 수정, 비밀번호 변경 등
├── roles/ # 역할 등록 및 관리
├── common/ # 공통 유틸, 인터페이스, 데코레이터 등
├── config/ # 환경 설정 및 JWT 설정
└── main.ts # 앱 진입점

---

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정 (.env)

```.env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/auth-service
```

### 3. 실행

npm run start:dev

### 4. Swagger API 문서

[http://localhost:3001/docs](http://localhost:3001/docs)
