# Inventory Sync Service API

A small REST API service for inventory tracking and synchronization with external warehouse systems (Mocked). Built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL** (via Prisma ORM). Includes Swagger for API documentation and exploration.

---

## Features

- Retrieve inventory information by SKU.
- Trigger inventory synchronization with external warehouse systems (mocked).
- Logging and error handling for sync operations.
- Swagger UI documentation at `/docs`.
- Rate-limited sync endpoint.
- Unit testing for core API endpoints.
- Dockerized PostgreSQL setup.
- Easy setup via a single `setup-and-run.sh` script.

---

## Technologies

- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma
- Jest + Supertest (for testing)
- Swagger/OpenAPI documentation
- Docker (for local database)

---

## Prerequisites

- [Docker](https://www.docker.com/)

---

## Setup & Run

1. **Clone the repository**
- Execute:
git clone https://github.com/your-username/inventory-sync-service-api.git

cd inventory-sync-service-api

cp .env.example .env

---

2. **Run the app**
- Execute:

./setup-and-run.sh

This script will:

Start a PostgreSQL Docker container.

Install Node.js dependencies.

Generate Prisma client.

Run migrations and reset the database.

Seed the database with initial inventory items.

Start the development server.

After running, the API will be available at http://localhost:3000

---

3. **Database**

Database: inventory (PostgreSQL)

Tables: InventoryItem, SyncLog

Seeded example items:

| sku       | quantity | location    | lastUpdated           |
|-----------|----------|------------|----------------------|
| ABC-1234  | 35       | Warehouse-A| 2025-08-01 12:00:00  |
| XYZ-5678  | 10       | Warehouse-B| 2025-08-01 11:00:00  |

---

4. **API Endpoints**

- GET /inventory/:sku

Retrieve inventory information for a specific SKU, example:

curl http://localhost:3000/inventory/ABC-1234

Should return:

{"sku":"ABC-1234","quantity":35,"location":"Warehouse-A","lastUpdated":"2025-08-01T12:00:00.000Z"}

Errors:

400 → Invalid SKU format

404 → SKU not found

- POST /inventory/sync

Trigger a sync operation that updates inventory from an external warehouse system (mocked), example:

curl -X POST http://localhost:3000/inventory/sync \
  -H "Content-Type: application/json" \
  -d '{"provider":"mock-wms","skuList":["ABC-1234","XYZ-5678"]}'

Should return:

{"synced":2,"errors":[],"timestamp":"2025-08-28T10:10:45.378Z"}

Errors:

500 → External system failure

---

5. **Swagger Documentation**

Swagger UI is available at:

http://localhost:3000/docs

---

6. **Testing**

Unit and integration tests are written with Jest and Supertest.

Run tests:

npm test

Tests cover:

GET /inventory/:sku success, not found, and validation cases

---

7. **Docker Notes**

PostgreSQL runs in a container named inventory-db on port 5432.

To connect manually:

docker exec -it inventory-db psql -U inventory -d inventory

Database reset and seeding:

npx prisma migrate reset



