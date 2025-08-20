# 📦 Módulo de Procesos - Wired People

## ✅ Estado de la Implementación

El módulo de procesos está **COMPLETO Y FUNCIONAL** con todas las características implementadas.

## 🎯 Funcionalidades Implementadas

### ✅ CRUD Completo
- **Crear Proceso**: Modal completo con validación
- **Listar Procesos**: Con filtros y paginación
- **Ver Detalle**: Página de detalle con toda la información
- **Actualizar Estado**: Cambio de estado con validación de transiciones
- **Eliminar Proceso**: Con confirmación

### ✅ Características Avanzadas
- **Filtros Avanzados**: Por estado, prioridad, ubicación, salario
- **Paginación**: Navegación fluida entre páginas
- **Estadísticas en Tiempo Real**: Dashboard con métricas
- **Gestión de Skills y Lenguajes**: Agregar requisitos al proceso
- **Tags**: Organización con etiquetas
- **Clean Architecture + DDD**: Arquitectura escalable y mantenible
- **Server Actions**: Mejor rendimiento y validación

## 🚀 Cómo Usar

### 1. Configurar Token
Primero, ve a `/token` y configura un token JWT válido del backend.

### 2. Acceder al Módulo
```
http://localhost:3000/processes
```

### 3. Crear un Proceso
1. Click en "Create Process"
2. Llenar el formulario:
   - Nombre del proceso (requerido)
   - Descripción
   - Número de vacantes (requerido)
   - Skills requeridas (mínimo 1)
   - Lenguajes (opcional)
   - Salario, ubicación, etc.
3. Click en "Create Process"

### 4. Ver Detalle de un Proceso
Click en cualquier tarjeta de proceso para ver sus detalles completos.

### 5. Cambiar Estado
En la página de detalle, usa el panel "Status Management" para cambiar el estado.

## 🔑 Configuración Importante

### Company ID de Wired People
```typescript
// src/features/processes/shared/constants/process.constants.ts
export const WIRED_PEOPLE_COMPANY_ID = "166c4bfc-1c2b-4ddd-866c-fbdfed07d6a3";
```

**IMPORTANTE**: Este ID está configurado y todos los procesos se crean automáticamente para esta compañía.

## 📊 Estados del Proceso

| Estado | Valor | Icono | Descripción |
|--------|-------|-------|-------------|
| DRAFT | 0 | 📝 | Borrador inicial |
| ACTIVE | 1 | ✅ | Activo y recibiendo candidatos |
| IN_PROGRESS | 2 | ⚡ | En proceso de evaluación |
| COMPLETED | 3 | 🎯 | Proceso completado |
| CANCELLED | 4 | ❌ | Proceso cancelado |
| ON_HOLD | 5 | ⏸️ | En pausa temporal |

### Transiciones Permitidas
- **DRAFT** → ACTIVE, CANCELLED
- **ACTIVE** → IN_PROGRESS, ON_HOLD, CANCELLED
- **IN_PROGRESS** → COMPLETED, ON_HOLD, CANCELLED
- **ON_HOLD** → ACTIVE, CANCELLED
- **COMPLETED** → (ninguna)
- **CANCELLED** → (ninguna)

## 🎨 Prioridades

| Prioridad | Valor | Icono |
|-----------|-------|-------|
| LOW | 1 | ➖ |
| MEDIUM | 2 | ➕ |
| HIGH | 3 | ⚠️ |
| URGENT | 4 | 🔥 |

## 🏗️ Arquitectura

```
Clean Architecture + DDD
├── Domain Layer: Entidades y lógica de negocio
├── Application Layer: Casos de uso
├── Infrastructure Layer: Implementación técnica
└── Presentation Layer: UI y Server Actions
```

## 🔧 Endpoints del Backend Utilizados

- `GET /api/v1/processes` - Listar procesos
- `GET /api/v1/processes/{id}` - Obtener proceso
- `POST /api/v1/processes` - Crear proceso
- `PATCH /api/v1/processes/{id}` - Actualizar proceso
- `DELETE /api/v1/processes/{id}` - Eliminar proceso
- `GET /api/v1/skills` - Obtener skills disponibles
- `GET /api/v1/languages` - Obtener lenguajes

## 🐛 Solución de Problemas

### Error: "No token found"
```bash
1. Ve a http://localhost:3000/token
2. Pega un token JWT válido
3. Click en "Save Token"
```

### Los procesos no se crean
1. Verifica que el backend esté corriendo en `http://localhost:5162`
2. Revisa la consola del navegador para errores
3. Asegúrate de que al menos un skill esté seleccionado

### No veo ningún proceso
- Los procesos se filtran automáticamente por la compañía Wired People
- Crea un proceso nuevo para verlo en la lista

## ✨ Características Destacadas

1. **Modal de Creación Completo**
   - Validación en tiempo real
   - Gestión de skills y lenguajes
   - Configuración de salario y ubicación

2. **Página de Detalle Rica**
   - Vista completa del proceso
   - Gestión de estados
   - Estadísticas de candidatos
   - Panel de acciones

3. **Filtros Inteligentes**
   - Múltiples criterios de búsqueda
   - Filtros combinables
   - Contador de filtros activos

4. **Server Actions**
   - Validación en el servidor
   - Revalidación automática de caché
   - Manejo de errores robusto

## 📈 Próximas Mejoras Sugeridas

- [ ] Gestión de candidatos (asignar/remover)
- [ ] Exportación a Excel/PDF
- [ ] Notificaciones en tiempo real
- [ ] Gráficos y analytics avanzados
- [ ] Plantillas de procesos
- [ ] Historial de cambios

## 🤝 Para Desarrolladores

### Agregar un nuevo caso de uso
```typescript
// src/features/processes/application/use-cases/mi-caso-uso.use-case.ts
export class MiCasoUsoUseCase {
  constructor(private readonly repository: IProcessRepository) {}
  
  async execute(params: any): Promise<any> {
    // Lógica del caso de uso
  }
}
```

### Crear un Server Action
```typescript
// src/features/processes/presentation/actions/process.actions.ts
export async function miNuevaAction(data: any) {
  const useCase = new MiCasoUsoUseCase();
  return await useCase.execute(data);
}
```

---

**Módulo completamente funcional con arquitectura empresarial** 🚀

## 🏗️ Estructura del Módulo

```
src/features/processes/
├── domain/                    # Núcleo del negocio
│   ├── entities/             # Entidades del dominio
│   │   ├── process.entity.ts
│   │   └── process-candidate.entity.ts
│   ├── value-objects/        # Objetos de valor
│   │   ├── process-status.vo.ts
│   │   └── process-priority.vo.ts
│   └── repositories/         # Interfaces de repositorio
│       └── process.repository.interface.ts
│
├── application/              # Casos de uso
│   └── use-cases/
│       ├── list-processes.use-case.ts
│       ├── get-process.use-case.ts
│       ├── create-process.use-case.ts
│       ├── update-process.use-case.ts
│       ├── delete-process.use-case.ts
│       └── assign-candidates.use-case.ts
│
├── infrastructure/           # Implementación técnica
│   └── repositories/
│       └── process.repository.impl.ts
│
├── presentation/             # Capa de presentación
│   ├── components/
│   │   ├── process-list.tsx
│   │   ├── process-card.tsx
│   │   └── process-filters.tsx
│   ├── actions/
│   │   └── process.actions.ts  # Server Actions
│   └── hooks/
│       └── use-processes.ts
│
└── shared/                   # Recursos compartidos
    ├── types/
    │   └── process.types.ts
    └── constants/
        └── process.constants.ts
```

## 🚀 Cómo Usar

### 1. Acceder a la página de procesos

```bash
http://localhost:3000/processes
```

**IMPORTANTE**: Primero debes tener un token configurado. Ve a `/token` si no lo tienes.

### 2. Usar en otros componentes

```tsx
import { useProcesses } from "@/features/processes";

function MyComponent() {
  const { processes, loading, error, createProcess } = useProcesses();
  
  // Usar los procesos...
}
```

### 3. Server Actions disponibles

```tsx
import {
  getProcessesAction,
  getProcessAction,
  createProcessAction,
  updateProcessAction,
  deleteProcessAction,
  assignCandidatesToProcessAction
} from "@/features/processes";
```

## 🔑 Características Implementadas

- ✅ **Clean Architecture + DDD**: Separación clara de responsabilidades
- ✅ **Server Actions**: Todas las operaciones CRUD
- ✅ **Filtros Avanzados**: Por estado, prioridad, ubicación, salario, etc.
- ✅ **Paginación**: Con controles de navegación
- ✅ **Estadísticas**: Dashboard con métricas en tiempo real
- ✅ **Compatibilidad con Riwi Talent**: Usa el backend existente temporalmente
- ✅ **Company ID Fijo**: Solo muestra procesos de Wired People

## 🔧 Configuración

### Company ID de Wired People
El ID está configurado en `shared/constants/process.constants.ts`:

```typescript
export const WIRED_PEOPLE_COMPANY_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
export const WIRED_PEOPLE_COMPANY_NAME = "Wired People Inc.";
```

### Token de Autenticación
El módulo utiliza el sistema de autenticación existente. El token se inyecta automáticamente desde `authService`.

## 📊 Estados de Proceso

- `DRAFT` (0): Borrador
- `ACTIVE` (1): Activo
- `IN_PROGRESS` (2): En Progreso
- `COMPLETED` (3): Completado
- `CANCELLED` (4): Cancelado
- `ON_HOLD` (5): En Espera

## 🎯 Prioridades

- `LOW` (1): Baja ➖
- `MEDIUM` (2): Media ➕
- `HIGH` (3): Alta ⚠️
- `URGENT` (4): Urgente 🔥

## 🐛 Solución de Problemas

### Error: "No token found"
- Ve a `/token` y configura un token válido
- El token debe ser un JWT válido del backend

### Error: "Process not found"
- Verifica que el proceso pertenezca a Wired People
- El Company ID debe coincidir con el configurado

### Los procesos no cargan
1. Verifica el token
2. Revisa la consola del navegador
3. Confirma que el backend esté corriendo en `http://localhost:5162`

## 🔄 Próximas Mejoras

- [ ] Modal de creación de procesos
- [ ] Página de detalle del proceso
- [ ] Asignación masiva de candidatos
- [ ] Exportación a Excel/PDF
- [ ] Notificaciones en tiempo real
- [ ] Gráficos y analytics

## 📝 Notas de Desarrollo

- El módulo está preparado para migrar a un backend propio
- Solo necesitas cambiar la implementación del repositorio
- Las entidades y casos de uso no necesitan cambios
- Utiliza Server Actions para mejor rendimiento

## 🤝 Contribuir

Para agregar nuevas funcionalidades:

1. Sigue la estructura de carpetas existente
2. Mantén la separación de capas (Domain, Application, Infrastructure, Presentation)
3. Crea casos de uso para la lógica de negocio
4. Usa Server Actions para operaciones del servidor
5. Documenta los cambios

## 📚 Referencias

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

---

**Módulo desarrollado con arquitectura limpia y mejores prácticas de desarrollo**