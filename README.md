# ViajesUCAB: Sistema de Gestión para Agencia de Viajes

Panel administrativo y modelo relacional para una agencia de viajes, desarrollado como proyecto académico en la Universidad Católica Andrés Bello (UCAB). Este repositorio documenta el diseño de la base de datos y la interfaz de gestión para el control de inventario de servicios, promociones y tasas de cambio.

## Base de Datos y Modelado (Backend)

El núcleo de mi trabajo en este proyecto consistió en el diseño y estructuración del modelo relacional, garantizando la integridad de los datos y la escalabilidad del sistema:

- **Estructuración de Esquemas:** Diseño del modelo Entidad-Relación (ER) para la gestión integral de la agencia.
- **Módulos de Datos:**
  - **Inventario:** Control de servicios turísticos (vuelos, tours, cruceros), capacidad disponible/reservada y trazabilidad de cambios.
  - **Promociones:** Gestión de descuentos, vigencia y asociación de destinos.
  - **Tasas de Cambio:** Registro histórico y actualización de valores por moneda frente al bolívar.
- **Tipado y Contratos:** Definición de interfaces en **TypeScript** (`types/`) que reflejan fielmente el esquema relacional de la base de datos.

## Tecnologías del Proyecto

| Área | Herramientas |
|------|--------------|
| Lenguaje | TypeScript |
| Frontend | Next.js 14 (App Router) + React 18 |
| Estilos & Componentes | Tailwind CSS 4 + shadcn/ui |
| Modelado | SQL / Relational Data Modeling |

## Cómo ejecutar la interfaz

**Requisitos:** Node.js 18+ y [pnpm](https://pnpm.io/).

```bash
git clone [https://github.com/lausofiii/Proyecto-ViajesUCAB.git](https://github.com/lausofiii/Proyecto-ViajesUCAB.git)
cd Proyecto-ViajesUCAB
pnpm install
pnpm dev
