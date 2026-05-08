# Primer Parcial

## Objetivo

Demostrar el funcionamiento de una aplicación Fullstack (FastAPI + React) que integre persistencia de datos, relaciones complejas, gestión de estado de servidor y navegación.

## Requerimientos del Video

- Duración máxima: 15 minutos
- Formato: Grabación de pantalla con voz en off (pueden usar herramientas como Loom, OBS o Clipchamp)
- Contenido: El video debe dividirse en tres secciones: Arquitectura Backend, Interfaz Frontend y Demo de Flujo Completo

## Estructura de la Presentación

### 1. Backend: El Corazón de la API (4-5 minutos)

**Módulos a realizar:** Categoría, ProductoCategoria, Producto, Ingrediente, ProductoIngrediente

- **Modelado de Datos:** Muestra tus clases de SQLModel. Explica cómo implementaste las relaciones, mencionando el uso de Relationship y back_populates.
- **Endpoints y Lógica:** Muestra un endpoint que utilice Annotated y Query para filtros o paginación. Explica brevemente cómo manejas las excepciones (HTTPException) y los códigos de estado.
- **Persistencia:** Breve vistazo a la conexión con PostgreSQL y cómo se ven las tablas reflejadas (puedes mostrar pgAdmin o DBeaver).

### 2. Frontend: Experiencia de Usuario y Estado (4-5 minutos)

**Módulos a realizar:** Categorías, Ingredientes y Productos. Cada módulo debe tener su respectiva página, con su tabla, botones de acciones y su respectivo modal con el formulario de alta y edición.

- **Estructura y Tipado:** Muestra un componente clave y su respectiva interfaz en TypeScript para las Props.
- **Server State (TanStack Query):** Explica una implementación de useQuery para el listado y una useMutation para la alta o edición. Muestra dónde haces la invalidación de la caché (invalidateQueries).
- **Navegación:** Muestra la configuración de react-router-dom y cómo pasas parámetros dinámicos a través de la URL (ej. el ID para ver el detalle).

### 3. Demo en Vivo: El Flujo Integrador (5 minutos)

- **CRUD Completo:** Crea un nuevo registro, edítalo y elimínalo mientras muestras la consola del navegador o la terminal del backend para validar las peticiones.
- **Validaciones:** Intenta cargar datos inválidos para demostrar que las validaciones de Pydantic y los mensajes de error en el Frontend funcionan correctamente.
- **Relaciones en la UI:** Muestra cómo se visualizan los datos relacionados (ej. "Este producto pertenece a la categoría X y tiene las etiquetas A y B").

## Criterios de Evaluación

1. **Claridad Técnica:** Uso correcto de la terminología vista en clase.
2. **Integración:** El frontend debe consumir datos reales del backend (no mock data).
3. **Diseño:** Aplicación coherente de Tailwind CSS para una interfaz limpia y responsive.
4. **Resolución de Problemas:** Explicación de algún desafío técnico que encontraron y cómo lo resolvieron.

## Entrega

- **Link:** Subir el video a YouTube (como oculto/unlisted) o Drive (con permisos de lectura).
- **Código:** Adjuntar link al repositorio de GitHub/GitLab con el README.md configurado y el archivo requirements.txt incluido.



python -m unittest tests/test_backend_unittest.py
