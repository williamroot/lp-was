# LP estática da WAS — servida por nginx (Alpine, imagem enxuta)
FROM nginx:1.27-alpine

# Configuração do servidor
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Conteúdo do site
COPY index.html /usr/share/nginx/html/index.html
COPY styles/   /usr/share/nginx/html/styles/
COPY scripts/  /usr/share/nginx/html/scripts/
COPY assets/   /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
