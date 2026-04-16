# LibreAgro App: resumen de estado actual

## Objetivo de la app

LibreAgro App es un MVP mobile hecho con Expo + React Native para visualizar y operar hubs LibreAgro desde el celular. Hoy la app ya permite recorrer los hubs, entrar al home de un hub, ver sensores y actuadores, revisar alarmas, gestionar cultivos y consultar recomendaciones.

El objetivo actual no es integrarse todavía al backend real, sino validar pantallas, navegación y flujos de uso con datos mockeados que simulan el comportamiento esperado del producto.

## Cómo funciona hoy

- La app arranca en un listado de hubs.
- Desde ahí se puede alternar entre modo `directo` y `online`.
- Al tocar un hub conectado, se entra al Home del Hub.
- El menú hamburguesa permite navegar a Inicio, Sensores, Actuadores, Alarmas, Cultivos y Recomendaciones.
- Sensores, Actuadores y Alarmas usan el "hub activo" como contexto de navegación.

## Flujos principales disponibles

### 1. Listado y acceso a hubs

- Se muestran hubs mockeados con estado conectado/desconectado.
- Un hub desconectado no deja entrar y muestra una alerta.
- Un hub conectado se guarda como hub activo para que el menú pueda abrir sus secciones relacionadas.

### 2. Alta de hub

El flujo de alta ya es continuo dentro de un solo modal:

- Si el usuario está en modo `directo`, al tocar `+` la app busca el hub inmediatamente.
- Si el usuario está en modo `online`, primero aparece una confirmación para cambiar a modo directo.
- Si la búsqueda sale bien, el hub se agrega al listado.
- Si falla, el modal muestra error y permite reintentar.

Además, la respuesta de configuración del hub ahora tiene validación mínima estructural antes de usarse en el flujo de alta:

- valida formato del ID/hash
- valida nombre del hub
- valida estructura base de sensores, relays y campos numéricos principales

## Home del Hub

El Home del Hub ya cubre los casos de uso centrales del MVP:

- resumen de alarmas
- listado unificado de dispositivos
- filtro por tipo: Todos / Sensores / Actuadores
- filtro por zonas con selección múltiple

El filtro por zonas funciona como bottom sheet:

- muestra las zonas disponibles detectadas en los dispositivos
- permite seleccionar una o varias zonas
- permite limpiar selección
- combina correctamente con el filtro por tipo

## Menú hamburguesa

El menú actual ya quedó alineado con la versión funcional del alcance:

- Inicio
- Sensores
- Actuadores
- Alarmas
- Cultivos
- Recomendaciones

Comportamiento actual:

- Inicio, Cultivos y Recomendaciones siempre están disponibles.
- Sensores, Actuadores y Alarmas sólo se habilitan si existe un hub activo conectado.
- Si no hay hub activo, esos tres accesos aparecen deshabilitados.

## Alarmas

La pantalla de alarmas ya permite:

- ver alarmas ordenadas por fecha
- posponer una alarma
- reconocer una alarma

Hoy estas acciones actualizan estado en memoria local/mock.

## Cultivos

La pantalla de cultivos ya permite:

- listar cultivos
- crear un cultivo
- editarlo
- eliminarlo

Cada cultivo calcula automáticamente su fecha de cosecha a partir de fecha de inicio + período.

## Recomendaciones

La app ya muestra únicamente las 3 recomendaciones más recientes.

Esto hoy se resuelve en la capa de servicio:

- ordena por fecha descendente
- recorta a 3 resultados

## Estado técnico actual

- Frontend en React Native + Expo.
- Navegación con React Navigation.
- Estado local con Zustand.
- Toda la información sigue saliendo de mocks locales.
- No hay integración HTTP real con backend/hardware en esta versión.
- El proyecto usa validación de tipos con TypeScript y hoy compila limpio.

## Qué significa esto para negocio/producto

Hoy la app ya permite mostrar una demo coherente del producto y recorrer los flujos principales de usuario:

- ver hubs disponibles
- abrir un hub y recorrer su información
- filtrar dispositivos de forma útil
- usar navegación contextual desde el menú
- dar de alta un hub con un flujo más realista
- gestionar cultivos
- revisar recomendaciones y alarmas

En otras palabras: el producto ya tiene una base sólida de experiencia de uso y navegación, aunque todavía corre sobre datos simulados.

## Límites actuales

Lo que todavía no representa comportamiento productivo real:

- no hay backend real conectado
- no hay estados de conectividad dinámicos reales
- no hay persistencia robusta de sesión/estado entre reinicios
- varias acciones siguen siendo mockeadas
- la validación/manual QA UI depende todavía de pruebas humanas en dispositivo

## Resumen corto para compartir

La app ya está en un estado de MVP navegable y demostrable. Hoy cubre los flujos principales de hubs, home del hub, filtros por tipo y zona, alta de hub, menú contextual, cultivos, alarmas y recomendaciones. La experiencia ya está armada de punta a punta, pero la capa de datos sigue mockeada y la siguiente etapa natural sería conectar comportamiento real de red/backend y endurecer validaciones y persistencia.
