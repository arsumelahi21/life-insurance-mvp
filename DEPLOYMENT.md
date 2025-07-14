



````markdown
## DevOps & Deployment

### Local Docker Development

1. Clone the repo and run:
   ```bash
   docker-compose up --build
````

This will spin up PostgreSQL, the backend, and the frontend in Docker containers.

---

### Deploying to AWS

#### Option 1: **Amazon ECS**

1. **Push Docker images to Amazon ECR:**

   * Authenticate with ECR:

     ```bash
     aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
     ```
   * Tag and push your frontend/backend images to ECR.

2. **Provision an RDS PostgreSQL instance** (recommended for production).

   * Save the hostname, username, password, and db name for use in backend env variables.

3. **Create ECS Task Definitions** for both frontend and backend containers.

   * Set environment variables for your backend (e.g., `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`)
   * Set `NEXT_PUBLIC_API_URL` for frontend.

4. **Set up ECS Services and an Application Load Balancer** (ALB) for the frontend (and optionally backend).

5. **Point your domain (Route 53) to the ALB**, enable HTTPS (ACM).

6. **Monitor logs** in AWS CloudWatch.

---

#### Option 2: **Elastic Beanstalk (Docker Compose)**

1. **Install the EB CLI:**

   ```bash
   pip install awsebcli
   ```
2. **Initialize Elastic Beanstalk in your project directory:**

   ```bash
   eb init
   eb create --single
   ```
3. **Configure environment variables** in the EB dashboard.
4. **Deploy:**

   ```bash
   eb deploy
   ```
5. **Update security groups** to allow required ports.

**Note:** Elastic Beanstalk can run Docker Compose files directly for multi-container apps.

---

#### Option 3: **(Optional) Quick Demo with Vercel & Render**

* **Frontend:** Deploy `/frontend` to [Vercel](https://vercel.com/), set the environment variable `NEXT_PUBLIC_API_URL` to your backend URL.
* **Backend:** Deploy `/backend` to [Render](https://render.com/) or [Railway](https://railway.app/), connect to a managed Postgres database.

---

### Environment Variables

* **Backend:**
  `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
* **Frontend:**
  `NEXT_PUBLIC_API_URL`

---

### Deployment Notes

* For production, always use managed Postgres (RDS, Render, etc.).
* Set proper security group rules and secrets management.
* Use logging/monitoring services (CloudWatch, etc.).
* Enable HTTPS for user-facing endpoints.
