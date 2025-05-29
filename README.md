# 📚 BookHaven — A Scalable, Microservices Bookstore

> 🎯 A production-grade e-commerce platform with modern microservices, real-time architecture, and advanced user experience.

---
### 🖼️ Architecture Overview

![Screenshot 2025-05-15 213124](https://github.com/user-attachments/assets/ddd7eccc-ebaf-448a-9241-abbdb24fbe1d)

![image](https://github.com/user-attachments/assets/9153d4e5-26c1-48c8-b203-4e959bc328a1)

![Screenshot 2025-05-25 111842](https://github.com/user-attachments/assets/6bb3a51f-313c-4e6d-9d20-64a812681aa2)



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
| 🔁 **Recommendation Engine** | Based on user orders (genres, authors, publishers) over time using Kafka |
| 🔔 **Real-Time Notifications** | Kafka + WebSockets used for instant updates (e.g., order created) |
| 📊 **Admin Order Control** | Admin can view, and update order statuses |
| 🔐 **Rate Limiting (Redis with Gateway)** | Protects API from abuse, production-safe |
| 📦 **Microservices with Kafka Events** | All services independently deployable |
| 🎙️ **Voice Search** | Integrated using Web Speech API |
| ⚡ **Redis Caching** | Fast access to popular books service(need to be implemnted to all services) |

---

### 🔧 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Tailwind CSS, Redux, Framer Motion |
| **Backend** | Spring Boot Microservices, Spring Security, OpenFeign |
| **Messaging** | Apache Kafka, WebSockets |
| **Caching/Rate Limiting** | Redis, Bucket4j |
| **Database** | MySQL (separate per service) |
| **Authentication** | JWT-based, Role-Based Access |

---

### 📁 Folder Structure


📦 backend_microservices/
- ┣ 📂 sp-authservice/
- ┣ 📂 sp_admin-service/
- ┣ 📂 sp_api-gateway/
- ┣ 📂 sp_notification-service/
- ┣ 📂 sp_order-payment-service/
- ┣ 📂 sp_product-service/
- ┣ 📂 sp_recommendation-service/
- ┣ 📂 sp_serviceregistry/

📦 frontend/sp-frontend/
- ┣ 📂 src/
- ┣ 📄 README.md, vite.config.js, tailwind.config.js ...


---

### 🔁 Kafka Flow Explained

- **Book Service** publishes `order.checkout` event on checkout.
- **Order Service** consumes the event → saves order & payment data.
- **Notification Service** consumes same event → sends real-time alerts via WebSocket.
- **Recommendation Service** consumes same event → learns user taste over time.

> This **fan-out event model** ensures loose coupling, scalability, and performance under load.

---


### 🔮 Future Improvements

If I had more time, I would enhance BookHaven with the following features to further improve scalability, reliability, and user experience:

- **Circuit Breaker Implementation:** To improve fault tolerance and prevent cascading failures between microservices.
- **Distributed Tracing:** For better observability and debugging across service calls in this distributed architecture.
- **Expand Notifications Coverage:** Currently, notifications are sent only when an order is created. I plan to implement real-time notifications for all critical events across all services.
- **Advanced Recommendation Algorithms:** Upgrade the recommendation engine with machine learning or collaborative filtering techniques for more personalized user suggestions.
- **Docker Build Automation:** Add Dockerfiles and multi-stage builds for each microservice and frontend to simplify deployment and ensure consistent environments.



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


