# Caja Beneficio — ClauNet

Caja registradora simple para eventos y beneficios. Sin base de datos, sin backend — funciona directo en el navegador del celular.

## Cómo usar

1. Editar `config.js` con el nombre del evento y los productos/precios
2. Deployar en Vercel → apuntar `caja.claunet.cl` en Cloudflare
3. Compartir el link al cajero antes del evento

## Estructura

```
index.html   — Estructura HTML
config.js    — ⚙️  EDITAR AQUÍ: nombre evento, productos y precios
app.js       — Lógica de la caja (no tocar)
style.css    — Estilos (no tocar)
vercel.json  — Config Vercel
```

## Deploy

Conectar repo en Vercel → agregar dominio `caja.claunet.cl` → en Cloudflare apuntar CNAME a Vercel.

---
Desarrollado por [ClauNet](https://claunet.cl)
