
# Microservices Project (Node.js + Docker + Kubernetes)

## 📌 Overview

This project is a **microservices-based architecture** built using **Node.js (Express)** and **MySQL**, containerized with **Docker**, and designed to run on **Kubernetes**. Each service is independent, scalable, and communicates via HTTP APIs.

Currently included services:

* **User Service** – Handles users, roles, authentication, orders, checklists, etc.
* **Payment Service** – Handles payments, Stripe integration, and webhooks

---

## 🧱 Architecture

```
Client
  │
  ├──▶ User Service (Node.js + Express)
  │         │
  │         └── MySQL (User DB)
  │
  └──▶ Payment Service (Node.js + Express)
            │
            └── MySQL (Payment DB)
```

Each service:

* Has its own codebase
* Has its own database
* Is deployed independently

---

## 📁 Folder Structure

```
microservices-project/
│
├── services/
│   ├── user-service/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── models/
│   │   │   ├── modules/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── server.js
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── payment-service/
│       ├── src/
│       │   ├── config/
│       │   ├── models/
│       │   ├── modules/
│       │   ├── routes/
│       │   └── app.js
│       ├── package.json
│       └── Dockerfile
│
├── docker-compose.yml
├── k8s/
│   ├── user-service.yaml
│   ├── payment-service.yaml
│   └── mysql.yaml
│
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MySQL
* **ORM / Query:** Sequelize
* **Containerization:** Docker
* **Orchestration:** Kubernetes (Minikube)
* **API Docs:** Swagger
* **Payments:** Stripe
* **Version Control:** Git + GitHub

---

## 🔐 Environment Variables

❗ **Never commit `.env` files**

Use `.env.example` as reference.

### Example (`.env.example`)

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=user_service
STRIPE_SECRET_KEY=sk_test_xxx
```

---

## 🐳 Docker (Local Setup)

### Build and run all services

```bash
docker-compose up --build
```

### Build a single service

```bash
docker build -t user-service ./services/user-service
```

---

## ☸️ Kubernetes (Minikube)

### Start Minikube

```bash
minikube start --driver=docker
```

### Deploy services

```bash
kubectl apply -f k8s/
```

### Check status

```bash
kubectl get pods
kubectl get services
```

---

## 🔁 Service Communication

Services communicate via **REST APIs** using internal Kubernetes service names:

```
http://user-service:3000
http://payment-service:3001
```

---

## 🧪 API Documentation

Swagger is available at:

* User Service: `/api-docs`
* Payment Service: `/api-docs`

---

## 🛡️ Security Best Practices

* Secrets managed via `.env` / Kubernetes Secrets
* `.env` files are ignored using `.gitignore`
* GitHub Push Protection enabled
* Stripe keys never committed

---

## 🚀 Future Improvements

* API Gateway (NGINX / Kong)
* Service-to-service auth (JWT / mTLS)
* Centralized logging (ELK)
* CI/CD with GitHub Actions
* Helm charts

---

## 👨‍💻 Author

**Navneet Ajay Dubey**
Full Stack Developer (Node.js / NestJS)

---

## 📜 License

This project is for learning and internal use.
