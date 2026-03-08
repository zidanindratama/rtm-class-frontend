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
# set NEXT_PUBLIC_CLIENT_DOMAIN=https://app.rtm-corndog.my.id

docker compose -p rtm-class-frontend -f docker-compose.prod.yml up -d --build
docker compose -p rtm-class-frontend -f docker-compose.prod.yml ps
```

Update deploy:
```bash
cd /opt/rtm-class/rtm-class-frontend
git pull origin main
docker compose -p rtm-class-frontend -f docker-compose.prod.yml up -d --build
```

## 4) GitHub Actions CI/CD setup
This repo already includes:
- `.github/workflows/ci-cd.yml`

### Required GitHub Secrets
Set in `Settings > Secrets and variables > Actions`:
- `VPS_HOST` = `<your-vps-ip-or-domain>`
- `VPS_USERNAME` = `<your-vps-user>`
- `VPS_PASSWORD` = `<your-vps-password>`
- `VPS_PORT` = `<your-ssh-port>` (usually `22`)
- `VPS_APP_DIR` = `<deploy-directory>` (example: `/opt/rtm-class/rtm-class-frontend`)

## 5) CD flow
1. Push to `main`.
2. `CI/CD` workflow validates build, then SSH to VM.
3. It ensures folder `/opt/rtm-class/rtm-class-frontend` exists.
4. It pulls latest code.
5. It runs:
   - `docker compose -p rtm-class-frontend -f docker-compose.prod.yml up -d --build`

## 6) Useful commands in VM
```bash
docker compose -p rtm-class-frontend -f docker-compose.prod.yml logs -f
docker compose -p rtm-class-frontend -f docker-compose.prod.yml restart
docker compose -p rtm-class-frontend -f docker-compose.prod.yml down
docker system df
```

## 7) Setup domain `app.rtm-corndog.my.id` with Nginx
### A. Point DNS
At DNS provider, create record:
- Type: `A`
- Host/Name: `app`
- Value: `<your-vps-ip>`
- TTL: default

### B. Install Nginx + Certbot in VM
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo ufw allow 'Nginx Full'
# optional (recommended): close direct app port from public internet
# sudo ufw delete allow 3000
```

### C. Create Nginx reverse proxy config
```bash
sudo tee /etc/nginx/sites-available/app.rtm-corndog.my.id >/dev/null <<'EOF'
server {
    listen 80;
    server_name app.rtm-corndog.my.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
EOF
```

Enable site:
```bash
sudo ln -sf /etc/nginx/sites-available/app.rtm-corndog.my.id /etc/nginx/sites-enabled/app.rtm-corndog.my.id
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### D. Enable HTTPS (Let's Encrypt)
After DNS propagated:
```bash
sudo certbot --nginx -d app.rtm-corndog.my.id
```

Choose redirect to HTTPS when prompted.

### E. Verify
```bash
curl -I http://app.rtm-corndog.my.id
curl -I https://app.rtm-corndog.my.id
sudo systemctl status nginx --no-pager
```
