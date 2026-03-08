# RTM Class Frontend Deployment Guide

## 1) Local development with Docker (hot reload)
1. Copy env:
   - `cp .env.example .env.local`
2. Run:
   - `docker compose -f docker-compose.dev.yml up --build`
3. Open:
   - `http://localhost:3000`
4. Stop:
   - `docker compose -f docker-compose.dev.yml down`

Hot reload is enabled with bind mount + `WATCHPACK_POLLING=true`.

## 2) First-time VM setup
Target VM path:
- `/opt/rtm-class/rtm-class-frontend`

Run these commands in VM:
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

## 3) Manual production deployment in VM
```bash
mkdir -p /opt/rtm-class/rtm-class-frontend
cd /opt/rtm-class/rtm-class-frontend

# First clone only
git clone https://github.com/<your-org-or-user>/<your-repo>.git .

cp .env.example .env
# edit .env and set real values
nano .env

docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

Update deploy:
```bash
cd /opt/rtm-class/rtm-class-frontend
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## 4) GitHub Actions CI/CD setup
This repo already includes:
- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`

### Required GitHub Secrets
Set in `Settings > Secrets and variables > Actions`:
- `VPS_HOST` = `43.157.247.2`
- `VPS_USERNAME` = `jidan`
- `VPS_PASSWORD` = password user `jidan`
- `VPS_PORT` = `22`
- `VPS_APP_DIR` = `/opt/rtm-class/rtm-class-frontend`

## 5) CD flow
1. Push to `main`.
2. `CD` workflow SSH to VM.
3. It ensures folder `/opt/rtm-class/rtm-class-frontend` exists.
4. It pulls latest code.
5. It runs:
   - `docker compose -f docker-compose.prod.yml up -d --build`

## 6) Useful commands in VM
```bash
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml down
docker system df
```
