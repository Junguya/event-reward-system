# Event Reward System (Nexon Assignment)

NestJS 기반 마이크로서비스 아키텍처로 구현된 **이벤트 보상 시스템**입니다.
인증 서버(auth-server), 게이트웨이 서버(gateway-server), 이벤트 서버(event-server)로 구성되어 있으며, MongoDB를 기반으로 데이터 저장소를 운영합니다.

## 프로젝트 구조

event-reward-system/backend
├── auth-server/ # 인증 및 유저/역할 관리 서비스
├── gateway-server/ # API 게이트웨이 및 인증/인가 프록시
├── event-server/ # 이벤트 등록 및 보상 처리 서비스
├── docker-compose.yml # 전체 서비스 구성용 Docker Compose
├── .env # 루트 공통 환경 변수 설정
└── README.md # 프로젝트 설명 파일 (현재 문서)

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
