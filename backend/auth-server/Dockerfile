# 1. Node.js 18 베이스 이미지
FROM node:18-alpine AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 소스 복사 및 빌드
COPY . .
RUN npm run build

# 5. 경량 이미지로 복사
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# 6. 앱 실행
CMD ["node", "dist/main"]
