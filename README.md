# Life Insurance Recommendation Engine

A simple full-stack web prototype to educate users about life insurance and provide a personalized policy recommendation based on their profile.

## Features

- Modern, responsive frontend (Next.js + Material UI)
- Node.js/Express backend with extensible, rules-based logic
- User submissions stored securely in PostgreSQL
- Fully dockerized local development environment
- **Security:** Backend API is rate limited to prevent abuse

## Requirements

- [Docker](https://www.docker.com/) & Docker Compose
- Node.js (optional, for local frontend/backend development outside Docker)
- (Optional) [PgAdmin](https://www.pgadmin.org/) or `psql` for database inspection

## Getting Started

### 1. Clone the Repository

```bash
mkdir life-insurance-app
cd life-insurance-app
git clone (https://github.com/arsumelahi21/life-insurance-mvp.git)

````

### 2. Start the Stack

```bash
docker-compose up --build
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:4000/recommendation](http://localhost:4000/recommendation)
* **Database:** localhost:5555 (user: `lifeuser`, password: `lifepass`, db: `lifedb`)

### 3. Use the App

* Open [http://localhost:3000](http://localhost:3000)
* Fill out the form (age, income, dependents, risk tolerance)
* Get your personalized life insurance recommendation!

### 4. Inspect Data (Optional)

To view stored submissions:

```bash
# Using psql (install locally if needed)
PGPASSWORD=lifepass psql -h localhost -U lifeuser -d lifedb

# In psql prompt:
SELECT * FROM user_submissions;
```

---

## Project Structure

```
/frontend      # Next.js/React frontend (Material UI)
/backend       # Node.js/Express API, connects to Postgres
/docker-compose.yml
/README.md
```

---

## Security

* **Rate limiting:** The backend API is protected with [express-rate-limit], limiting each IP to 20 requests per minute.
* All inputs are validated on the backend.
* CORS enabled only for development.

---

## Development Notes

* All sensitive config (DB credentials) are stored in environment variables (see `docker-compose.yml`).
* Logs are output to Docker stdout.

---

## Deployment (Optional/Advanced)

* see Deployment.md

---

## Author

* [Arsum Elahi]([https://github.com/YOUR-USERNAME](https://github.com/arsumelahi21/life-insurance-mvp#))
* For assignment/interview/demo use

---
