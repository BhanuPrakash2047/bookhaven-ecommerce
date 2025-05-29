# 📚 BookHaven — A Scalable, Microservices Bookstore

> 🎯 Solo-built, production-grade e-commerce platform with modern microservices, real-time architecture, and advanced user experience.

---
### 🖼️ Architecture Overview

![Screenshot 2025-05-15 213124](https://github.com/user-attachments/assets/ddd7eccc-ebaf-448a-9241-abbdb24fbe1d)

This system follows a **true microservices architecture**, where each service owns its own database and domain logic. Services communicate using **Kafka** for events and **OpenFeign** for direct coordination. WebSocket and Redis caching further enhance performance and user experience.

---

### ✅ What Makes BookHaven Stand Out

While the expected features were:

- Product listing, filtering, cart/wishlist
- Image gallery, checkout, login/signup
- Admin CRUD, responsive design, light/dark mode

**BookHaven exceeded them with:**

| Feature | Description |
|--------|-------------|
| 🔁 **Recommendation Engine** | Based on user orders (genres, authors, publishers) using Kafka |
| 🔔 **Real-Time Notifications** | Kafka + WebSockets used for instant updates (e.g., order status) |
| 📊 **Admin Order Control** | Admin can view, track, and update order statuses |
| 🔐 **Rate Limiting (Bucket4j + Redis)** | Protects API from abuse, production-safe |
| 📦 **Microservices with Kafka Events** | All services independently deployable |
| 🎙️ **Voice Search** | Integrated using Web Speech API |
| ⚡ **Redis Caching** | Fast access to popular books, cart, and wishlist |

---

### 🔧 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Tailwind CSS, ShadCN, Redux, Framer Motion |
| **Backend** | Spring Boot Microservices, Spring Security, OpenFeign |
| **Messaging** | Apache Kafka, WebSockets |
| **Caching/Rate Limiting** | Redis, Bucket4j |
| **Database** | MySQL (separate per service) |
| **Authentication** | JWT-based, Role-Based Access |

---

### 📁 Folder Structure


📦 backend_microservices/
┣ 📂 ApiGatewayAuth/
┣ 📂 sp_admin-service/
┣ 📂 sp_api-gateway/
┣ 📂 sp_notification-service/
┣ 📂 sp_order-payment-service/
┣ 📂 sp_product-service/
┣ 📂 sp_recommendation-service/
┣ 📂 sp_serviceregistry/
📦 frontend/sp-frontend/
┣ 📂 src/
┣ 📄 README.md, vite.config.js, tailwind.config.js ...


---

### 🔁 Kafka Flow Explained

- **Book Service** publishes `order.checkout` event on checkout.
- **Order Service** consumes the event → saves order & payment data.
- **Notification Service** consumes same event → sends real-time alerts via WebSocket.
- **Recommendation Service** consumes same event → learns user taste over time.

> This **fan-out event model** ensures loose coupling, scalability, and performance under load.

---

### 🛠️ How to Run Locally

```bash
# 1. Clone the project
git clone https://github.com/your-username/bookhaven-ecommerce

# 2. Start Redis & Kafka using Docker
docker-compose up -d

# 3. Run backend microservices (in separate terminals)
cd backend_microservices/sp_product-service && ./mvnw spring-boot:run
# Repeat for each service

# 4. Run frontend
cd frontend/sp-frontend && npm install && npm run dev

# 5. Access
http://localhost:5173


