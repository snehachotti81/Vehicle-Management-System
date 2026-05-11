# Vehicle Service Management System

A full-stack MVP for managing vehicle components, vehicle service records, simulated billing, and revenue reporting.

## Features

- Component CRUD with stock quantity and repair/replacement pricing
- Vehicle CRUD with search by vehicle number and status filters
- Service record creation with repair/replace billing logic
- Automatic bill calculation: `(component_price x quantity) + labor_charge`
- Replacement stock validation and stock deduction
- Payment summary / invoice screen
- Daily, monthly, and yearly revenue APIs and charts
- Responsive React dashboard with Tailwind CSS
- Loading states, status badges, and toast notifications
- Django unit tests for models, APIs, and bill calculation logic

## Tech Stack

- Backend: Django, Django REST Framework, SQLite, django-cors-headers
- Frontend: React.js, Vite, Axios, React Router DOM, Tailwind CSS, Recharts

## Project Structure

```text
backend/
  components/
  dashboard/
  services/
  vehicles/
  vehicle_service/
  manage.py
  requirements.txt
frontend/
  src/
    components/
    pages/
    api.js
    App.jsx
  package.json
  tailwind.config.js
README.md
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

If your backend uses a different URL, create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## API Endpoints

### Components

- `GET /api/components/`
- `POST /api/components/`
- `GET /api/components/{id}/`
- `PUT /api/components/{id}/`
- `DELETE /api/components/{id}/`

Query filters:

- `GET /api/components/?search=brake`
- `GET /api/components/?type=engine`

### Vehicles

- `GET /api/vehicles/`
- `POST /api/vehicles/`
- `GET /api/vehicles/{id}/`
- `PUT /api/vehicles/{id}/`
- `DELETE /api/vehicles/{id}/`

Query filters:

- `GET /api/vehicles/?search=MH12`
- `GET /api/vehicles/?status=Pending`

### Services

- `GET /api/services/`
- `POST /api/services/`
- `GET /api/services/{id}/`
- `PUT /api/services/{id}/`
- `DELETE /api/services/{id}/`

Query filters:

- `GET /api/services/?vehicle=1`
- `GET /api/services/?service_type=Repair`

### Revenue

- `GET /api/revenue/daily/`
- `GET /api/revenue/monthly/`
- `GET /api/revenue/yearly/`

## Service Billing

For `Repair`, the API uses `repair_price`.

For `Replace`, the API uses `purchase_price`.

Final total:

```text
(component_price x quantity) + labor_charge
```

## Tests

```bash
cd backend
python manage.py test
```

## Screenshots

Add screenshots here after running the application:

- Dashboard
- Components
- Vehicles
- Services
- Invoice
