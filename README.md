# WAS — Landing Page (was.dev.br)

Landing page da **WAS Soluções em Tecnologia** — consultoria em desenvolvimento,
inteligência artificial e automação de processos, com foco em inteligência no uso
de recursos.

Construída sobre os tokens do [`was-design-system`](../was-design-system):
identidade monocromática (preto/branco) com acento cobalto (`#2F5BFF`),
tipografia Bricolage Grotesque / Hanken Grotesk / Spline Sans Mono, raios
arredondados e temas claro/escuro.

## Stack

Site estático, sem build. HTML + CSS + um arquivo JS sem dependências.

```
lp-was/
  index.html          # página única (header, hero, serviços, processo, diferenciais, contato, footer)
  styles/
    tokens.css        # espelho de was-design-system/src/tokens/tokens.css
    reset.css         # reset base + scroll suave
    main.css          # estilos da landing
  scripts/
    main.js           # tema claro/escuro, menu mobile, reveal on scroll, ano do rodapé
```

## Rodar localmente

Basta abrir `index.html` no navegador. Para servir via HTTP (recomendado):

```bash
python3 -m http.server 5173
# abre em http://localhost:5173
```

## Deploy com Docker Compose

O site é servido por nginx (imagem estática enxuta). A publicação é feita via
**Cloudflare Tunnel** — sem abrir portas no servidor.

```
lp-was/
  Dockerfile           # nginx:alpine servindo o conteúdo estático
  nginx.conf           # gzip, cache, headers de segurança, /healthz
  docker-compose.yml   # serviços: web (nginx) + cloudflared (tunnel)
  .env.example         # modelo para o TUNNEL_TOKEN
```

### 1. Configurar o túnel

No painel **Cloudflare Zero Trust → Networks → Tunnels**, crie um tunnel,
copie o token do conector e aponte o *public hostname* `was.dev.br` para o
serviço interno **`http://web:80`**.

```bash
cp .env.example .env
# edite .env e cole o TUNNEL_TOKEN
```

### 2. Subir

```bash
docker compose up -d --build
```

- `web` — nginx servindo a LP (porta interna `80`; exposta localmente em `8080`
  para teste direto: http://localhost:8080).
- `cloudflared` — conecta ao túnel e publica `was.dev.br`.

### 3. Atualizar após mudanças

```bash
docker compose up -d --build web
```

### Parar

```bash
docker compose down
```

> Para um teste local sem o túnel, suba só o web: `docker compose up -d --build web`.

## Contato

E-mail é o **único** canal oficial de contato: **contato@was.dev.br**

## Manutenção

- A paleta e a tipografia vêm de `styles/tokens.css`. Para manter paridade com o
  Design System, copie deste arquivo quando os tokens mudarem em `was-design-system`.
- O acento da marca é controlado por `--was-brand` / `--was-brand-strong`.
