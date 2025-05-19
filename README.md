<!-- markdownlint-disable MD033 -->
# Event Reward System (Nexon Assignment)

NestJS 기반 마이크로서비스 아키텍처로 구현된 **이벤트 보상 시스템**입니다.
인증 서버(auth-server), 게이트웨이 서버(gateway-server), 이벤트 서버(event-server)로 구성되어 있으며, MongoDB를 기반으로 데이터 저장소를 운영합니다.

<details>
<summary>## 프로젝트 구조</summary>

event-reward-system/backend
├── auth-server/ # 인증 및 유저/역할 관리 서비스
├── gateway-server/ # API 게이트웨이 및 인증/인가 프록시
├── event-server/ # 이벤트 등록 및 보상 처리 서비스
├── docker-compose.yml # 전체 서비스 구성용 Docker Compose
├── .env # 루트 공통 환경 변수 설정
└── README.md # 프로젝트 설명 파일 (현재 문서)
</details>

## 실행 방법 (Docker 기반)

### 전체 서비스 빌드 및 실행 (백그라운드)

docker compose up --build -d

### 컨테이너 상태 확인

docker ps

### 로그 확인

docker compose logs mongodb
docker compose logs gateway-server
docker compose logs auth-server
docker compose logs event-server

### 전체 서비스 중지 및 볼륨 제거

docker compose down -v

### Swagger API 문서

Gateway: <http://localhost:3000/docs>
Auth: <http://localhost:3001/docs>
Event: <http://localhost:3002/docs>

## 테스트 시나리오

테스트 코드는 일부 작성했으며, 실제 동작 확인은 아래 시나리오를 기반으로 수행했습니다.
초기 데이터는 `seed.ts`를 통해 삽입되며, 주요 데이터는 아래와 같습니다:

- 역할(Role): ADMIN, OPERATOR, AUDITOR, USER
- 유저(User): 각 역할에 맞는 테스트 계정 4개
- 이벤트(Event):
  1. 3일 이상 로그인 시 5000포인트 지급 (type: LOGIN_DAYS, reward: POINT)
  2. 누적 포인트 5000 이상 시 쿠폰 지급 (type: POINT, reward: COUPON)
- 보상(Reward): 각각 이벤트에 연결된 포인트 또는 쿠폰 보상

### 1. 로그인 테스트

- 각 역할별 계정으로 로그인 시 accessToken / refreshToken 정상 발급
- Swagger UI에서 Bearer Token 등록하여 후속 요청 테스트

### 2. 보상 요청 (USER 계정 사용)

#### 성공 케이스

- `/reward-requests` 요청 시 이벤트 조건 충족 → `status: SUCCESS`
  - 예: 로그인 3일 이상 or 누적 포인트 5000 이상

#### 실패 케이스

- 조건 미충족 시 → `status: FAILED` + reason 명시
- 중복 요청 시 → `status: FAILED` + reason: 중복 요청

### 보상 유형 테스트

- POINT 타입 보상: 포인트 지급 후 `user-stats.point` 업데이트 확인
- COUPON 타입 보상: 응답에 `couponCodes` 배열 포함되는지 확인

### 보상 요청 목록 조회

#### USER

- 본인 요청만 필터링되어 조회됨

#### OPERATOR / ADMIN

- 전체 요청 목록 확인 가능

### 권한 테스트

- 이벤트/보상 생성은 ADMIN 또는 OPERATOR만 가능
- 일반 USER 계정으로 등록 요청 시 → 403 Forbidden 응답

### 테스트 도구

- Swagger UI를 통해 전체 API 테스트 수행
- MongoDB Compass를 통해 보상 상태, 통계 변화 직접 확인
