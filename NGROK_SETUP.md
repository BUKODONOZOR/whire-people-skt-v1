# 🚀 Configuración de ngrok para desarrollo

## ❌ Problema Actual

Tu frontend en Vercel (`https://whire-people-skt-v1-h63u.vercel.app`) no puede conectarse a tu backend local (`http://localhost:5162`) debido a:

1. **CORS**: HTTPS → HTTP está bloqueado
2. **Red**: Vercel no puede acceder a localhost
3. **Seguridad**: Los navegadores bloquean mixed content

## ✅ Solución: ngrok

### **Paso 1: Instalar ngrok**

```bash
# Opción 1: NPM
npm install -g ngrok

# Opción 2: Descargar desde https://ngrok.com/
```

### **Paso 2: Configurar tu backend**

1. **Asegúrate de que tu backend .NET esté corriendo:**
   ```bash
   # En tu proyecto backend
   dotnet run
   ```
   Debería estar en: `http://localhost:5162`

2. **Configurar CORS en tu backend .NET:**
   ```csharp
   // En Program.cs o Startup.cs
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowNgrok", policy =>
       {
           policy.AllowAnyOrigin()
                 .AllowAnyMethod()
                 .AllowAnyHeader();
       });
   });

   // Usar el policy
   app.UseCors("AllowNgrok");
   ```

### **Paso 3: Exponer tu backend con ngrok**

```bash
# En una nueva terminal
ngrok http 5162
```

**Output esperado:**
```
Session Status                online
Account                       tu-cuenta
Version                       3.0.0
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok.io -> http://localhost:5162
```

### **Paso 4: Configurar tu frontend**

1. **Copia la URL de ngrok** (ej: `https://abc123-def456.ngrok.io`)

2. **Opción A: Variable de entorno en Vercel**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agregar: `NEXT_PUBLIC_API_URL = https://abc123-def456.ngrok.io/api`
   - Redeploy

3. **Opción B: Archivo .env.local (para testing local)**
   ```env
   NEXT_PUBLIC_API_URL=https://abc123-def456.ngrok.io/api
   ```

### **Paso 5: Verificar que funciona**

1. **Abrir la interfaz web de ngrok:** http://127.0.0.1:4040
2. **Ver requests en tiempo real**
3. **Testear desde Vercel**

## 🔧 Comandos Útiles

### **Desarrollo Local + ngrok:**
```bash
# Terminal 1: Backend
cd tu-backend
dotnet run

# Terminal 2: ngrok
ngrok http 5162

# Terminal 3: Frontend (opcional, para testing local)
cd tu-frontend
npm run dev
```

### **Configuración automática:**
```bash
# Crear script en package.json
"scripts": {
  "dev:ngrok": "concurrently \"npm run dev\" \"ngrok http 5162\"",
  "start:backend": "cd ../backend && dotnet run",
  "tunnel": "ngrok http 5162"
}
```

## ⚠️ Consideraciones Importantes

### **Seguridad:**
- ✅ ngrok es seguro para desarrollo
- ✅ Las URLs de ngrok expiran cuando cierras el túnel
- ✅ Solo tu backend local está expuesto, no tu máquina completa

### **Limitaciones ngrok gratuito:**
- 🔄 La URL cambia cada vez que reinicias ngrok
- 🕐 Sesiones limitadas en tiempo
- 👥 Conexiones concurrentes limitadas

### **Para evitar cambiar URL constantemente:**
```bash
# Autenticarse con ngrok (cuenta gratuita)
ngrok authtoken TU_TOKEN_AQUI

# Usar subdominio fijo (plan pago)
ngrok http 5162 --subdomain=tu-nombre-fijo
```

## 📋 Checklist de Verificación

- [ ] Backend .NET corriendo en localhost:5162
- [ ] CORS configurado en el backend
- [ ] ngrok instalado y funcionando
- [ ] URL de ngrok copiada
- [ ] Variable NEXT_PUBLIC_API_URL actualizada en Vercel
- [ ] Redeploy realizado en Vercel
- [ ] Peticiones funcionando sin errores CORS

## 🎯 Resultado Final

Una vez configurado correctamente:

**Antes:**
```
❌ Frontend (Vercel) → Backend (localhost) = CORS Error
```

**Después:**
```
✅ Frontend (Vercel) → ngrok (HTTPS) → Backend (localhost) = Success!
```

## 🔄 Alternativas Futuras

1. **Backend en la nube:** Railway, Heroku, Azure, AWS
2. **Localhost tuneling:** Cloudflare Tunnel, Bore, LocalTunnel
3. **Desarrollo local:** Usar frontend local con backend local
