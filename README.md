# Ferretería Central · Frontend

Panel web académico en React y Vite, conectado al backend de ferretería. Permite consultar el resumen, administrar productos y clientes, y registrar ventas con descuento de inventario. La pantalla solicita la URL y las credenciales Basic Auth, que se mantienen en memoria mientras la pestaña está abierta. El frontend está configurado localmente para usar GraphQL (`VITE_API_TRANSPORT=GRAPHQL` en `.env.local`).

## Ejecutar en desarrollo

1. Arranca primero el backend desde `ferreteria-api` con `npm.cmd run dev`.
2. En otra terminal, entra a esta carpeta e instala dependencias con `npm.cmd install`.
3. Inicia el frontend con `npm.cmd run dev`.
4. Abre `http://localhost:5173` y conecta con `http://localhost:3000`, usando `BASIC_AUTH_USER` y `BASIC_AUTH_PASS` del `.env` del backend.

La organización separa responsabilidades para que el flujo sea fácil de explicar:

- `src/App.jsx`: composición de la aplicación y estado de navegación.
- `src/components/ConnectionScreen.jsx`: conexión del usuario con la API.
- `src/components/InventoryComponents.jsx`: tarjetas, tablas, formularios y modal de inventario.
- `src/components/Icon.jsx`: iconografía compartida.
- `src/utils/formatters.js`: formato de moneda, fechas y nombres abreviados.
- `src/application/ports/ferreteriaApiPort.js`: contrato de operaciones que necesita la interfaz.
- `src/adapters/outbound/ferreteriaGateway.js`: conexión HTTP, autenticación Basic y conversión de operaciones a GraphQL o REST.
- `src/main.jsx`: punto de entrada React; inyecta el adaptador a la aplicación.
- `src/styles.css`: presentación visual.

La URL inicial se define con `VITE_API_URL`; el usuario puede cambiarla en el formulario de conexión. En desarrollo, si no se define, usa `http://localhost:3000`; en una compilación de producción el campo queda vacío para evitar apuntar por error al localhost de cada visitante. `.env.production.example` sirve de plantilla: cuando se despliegue el backend, define `VITE_API_URL` con su URL HTTPS pública en el entorno de compilación de la plataforma de hosting. No guardes usuario ni contraseña API en variables `VITE_*`: Vite las incorpora al JavaScript que recibe el navegador. Las credenciales se escriben en el formulario y viven solo en memoria.

Para volver a REST, cambia `VITE_API_TRANSPORT` a `REST` y reinicia Vite. Los componentes siguen usando el mismo puerto de aplicación.

No se usa ni se expone `MONGO_URI` en el navegador. Las operaciones del frontend van a la API HTTP.
