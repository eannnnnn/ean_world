# Ean world

테스트용 API 모음집

> 아래 설정이 필요 합니다.

.env 파일 생성

```bash
# Not essential
# APP_PORT 서버를 실행 할 포트
APP_PORT=3000

# 비밀번호 SALT 관련
SALT_ROUNDS=10

# JWT SECRET KEY
JWT_SECRET="jwtSecret"

# File save path
FILE_SAVE_PATH="/"
# Essential ENV

# DB ( postgresql 을 사용 중 입니다. )
DB_PORT=5432
DB_USERNAME="postgres"
DB_PASSWORD="postgres"
DB_ENDPOINT="localhost"
DB_DATABASE_NAME="postgres"

# Development essential ENV
# SSH ssh tunneling 이 필요 한 경우 입력하세요.
SSH_USERNAME="ssh-user"
SSH_PASSWORD="ssh-password"
SSH_HOST="localhost"
SSH_PORT=22
```

- DB 측 ssh tunneling 이 필요한 경우 실행하세요.

```bash
pnpm run ssh-tunnel
```
