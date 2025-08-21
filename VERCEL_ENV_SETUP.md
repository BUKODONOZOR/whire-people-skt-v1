# 🚀 Configuración de Variables de Entorno en Vercel

## Pasos para configurar en Vercel:

1. **Ve a tu proyecto en Vercel:** https://vercel.com/dashboard
2. **Selecciona tu proyecto:** whire-people-skt-v1
3. **Ve a Settings → Environment Variables**
4. **Agregar nueva variable:**
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://1e0689e09dab.ngrok-free.app/api`
   - **Environment:** Production (y Preview si quieres)

5. **Click "Save"**
6. **Redeploy tu proyecto:**
   - Ve a Deployments
   - Click en los 3 puntos del último deployment
   - Click "Redeploy"

## ⚠️ Importante:

La URL de ngrok que tienes es:
```
https://1e0689e09dab.ngrok-free.app
```

Pero tu API probablemente esté en:
```
https://1e0689e09dab.ngrok-free.app/api
```

## 🧪 Verificar que funciona:

1. **Abrir ngrok web interface:** http://127.0.0.1:4040
2. **Hacer una petición de prueba:**
   ```bash
   curl https://1e0689e09dab.ngrok-free.app/api/v1/students
   ```

3. **Ver en los logs de ngrok si llegan las peticiones**

## 🔄 Alternativa rápida:

Si no quieres configurar en Vercel ahora, puedes probar localmente:

```bash
# En tu proyecto frontend
npm run dev
```

Con el .env.local configurado, tu desarrollo local debería conectarse a ngrok.
