# 🍔 FoodStore - Frontend

Bienvenido al repositorio del frontend de **FoodStore**, desarrollado como proyecto integrador para la cátedra de Programación 4 (UTN Mendoza).

## 🚀 Tecnologías Principales (Stack)
- **Core:** React 18 + TypeScript + Vite.
- **Enrutamiento:** React Router DOM v6.
- **Server State:** TanStack Query v5 (React Query).
- **Estilos:** Tailwind CSS v4.
- **Peticiones HTTP:** Fetch API nativo (encapsulado en un `apiService`).

## 🏗 Arquitectura del Proyecto (Nivel 2)

El proyecto implementa la arquitectura exigida en el documento *"Estructuras de Trabajo en React"*, específicamente el **Nivel 2: Arquitectura basada en Features (Dominios)**.

Esta estructura agrupa el código según el dominio de negocio (Productos, Categorías, Ingredientes), logrando una alta cohesión y evitando el acoplamiento ("código espagueti"):

```text
src/
├── features/               # Módulos separados por dominio de negocio
│   ├── categorias/         # -> Todo lo relacionado a Categorías
│   ├── ingredientes/       # -> Todo lo relacionado a Ingredientes
│   └── productos/          # -> Todo lo relacionado a Productos
│       ├── components/     # Componentes visuales específicos del dominio
│       ├── hooks/          # Custom hooks (TanStack Query)
│       ├── services/       # Llamadas a la API (fetch)
│       └── types/          # Interfaces de TypeScript (Modelos)
├── shared/                 # Código global reutilizable
│   ├── components/         # Tablas genéricas, Modales, Spinners, Paginación
│   ├── layout/             # Componentes de estructura (Navbar, Layout base)
│   └── services/           # Interceptores y wrappers genéricos (apiService.ts)
└── routers/                # Configuración global de rutas de la aplicación
```

## ⚙️ Principios y Patrones Aplicados

### 1. Principio DRY (Don't Repeat Yourself)
Se abstrajo la lógica repetitiva de la interfaz de usuario en la carpeta `shared/components/`. 
Por ejemplo, en lugar de armar la tabla HTML en cada feature, se creó un `<GenericTable />` que recibe las cabeceras y la data como `props`. Lo mismo se aplicó para los diálogos de confirmación (`<ConfirmDialog />`), la barra de búsqueda/ordenamiento (`<FilterSortBar />`) y la paginación (`<PaginationBar />`).

### 2. Gestión de Estado Asíncrono (Server State)
Se utilizó **TanStack Query** para separar el estado del servidor del estado local del componente:
- Las llamadas de lectura (`GET`) utilizan `useQuery` con su respectivo caché.
- Las operaciones de escritura (`POST`, `PUT`, `DELETE`) utilizan `useMutation`. Tras un éxito, se invalida el caché (`queryClient.invalidateQueries()`) para mantener la interfaz sincronizada automáticamente con la base de datos, sin necesidad de manipular arrays locales manualmente.

### 3. Rendimiento y Memoización
Para la búsqueda y ordenamiento en las tablas se implementó filtrado del lado del cliente utilizando el hook `useMemo`. Esto previene re-renderizados costosos al tipear en la barra de búsqueda, ya que el cálculo solo se vuelve a ejecutar si la lista de elementos, el término de búsqueda o el criterio de ordenamiento cambian.

## 📦 Inicialización del Proyecto

1. Clonar el repositorio.
2. Instalar las dependencias usando pnpm:
   ```bash
   pnpm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```
4. El backend de FastAPI debe estar corriendo en el puerto 8000. (Configurable vía archivo `.env` en la variable `VITE_API_URL`).
