# 🏥 HealthCoach

A full-stack web application for managing health coach applications, reviews, and user roles. Applicants can submit applications and track their status, while reviewers and admins can review, approve, or reject them.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![JWT](https://img.shields.io/badge/Auth-JWT-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Features

- User registration, login, and JWT-based authentication
- Role-based access control (Applicant, Reviewer, Admin)
- Application submission and document upload
- Application review, approval, and rejection
- Status tracking and dashboard for all roles
- Notifications for users and reviewers
- Search and filter applications by status, name, or email
- Download and view uploaded documents

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios |
| Styling | Bootstrap, Tailwind CSS |
| Charts | Chart.js |
| Alerts | SweetAlert2 |
| Backend | Spring Boot 3, Spring Security, Spring Data JPA |
| Database | MySQL |
| Auth | JWT (jjwt), BCrypt |
| Utilities | Lombok |
| Testing | Jest, React Testing Library, JUnit, Mockito |

---

## 📁 Folder Structure

```
HealthCoach/
├── springapp/          # Spring Boot backend
│   ├── src/main/java/
│   │   ├── controller/ # REST controllers
│   │   ├── service/    # Business logic
│   │   ├── repository/ # Data access
│   │   ├── entity/     # JPA entities
│   │   └── security/   # JWT & Spring Security config
│   └── src/main/resources/
│       └── application.properties
└── reactapp/           # React frontend
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Role-based pages
    │   ├── api.jsx     # Axios API calls
    │   └── App.jsx
    └── public/
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- Java 17+
- Maven
- MySQL (running locally)
- Node.js & npm

---

## 🚀 Backend Setup (Spring Boot)

1. **Clone the repository:**
```bash
   git clone https://github.com/srija0501/HealthCoach.git
   cd HealthCoach/springapp
```

2. **Configure MySQL** in `src/main/resources/application.properties`:
```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/healthcoach
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   spring.jpa.hibernate.ddl-auto=update
```

3. **Build and run:**
```bash
   ./mvnw spring-boot:run
```

The backend runs at **http://localhost:8080**

---

## 💻 Frontend Setup (React)

1. **Navigate to the frontend folder:**
```bash
   cd HealthCoach/reactapp
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Start the app:**
```bash
   npm start
```

The frontend runs at **http://localhost:3000**

---

## 📡 API Overview

### User
| Method | Endpoint | Description |
|---|---|---|
| POST | `/user/login` | Login and get JWT token |
| POST | `/user/register` | Register a new user |
| GET | `/user/get` | Get all users |
| GET | `/user/role/{role}` | Get users by role |

### Application
| Method | Endpoint | Description |
|---|---|---|
| POST | `/application/submit/{userId}` | Submit a new application |
| GET | `/application/pending` | Get pending applications |
| GET | `/application/{id}` | Get application by ID |
| GET | `/application/filterByStatus` | Filter by status |
| GET | `/application/search` | Search applications |
| GET | `/application/status-counts` | Get status counts |

### Document
| Method | Endpoint | Description |
|---|---|---|
| POST | `/documents/upload/{applicationId}` | Upload a document |
| GET | `/documents/view/{docId}` | View a document |
| GET | `/documents/download/{docId}` | Download a document |

### Notification
| Method | Endpoint | Description |
|---|---|---|
| GET | `/notification/user/{userId}` | Get notifications for a user |

> 💡 Use **Postman** or **Thunder Client** to test the endpoints.

---

## 🔐 Authentication & Authorization

- All API requests are secured with **JWT-based authentication**
- **Role-based access control** is handled via Spring Security
- Roles: `APPLICANT`, `REVIEWER`, `ADMIN`
- JWT tokens are stored in `localStorage` and attached to every API request via Axios interceptors

---

## ▶️ Running the Full Project

1. Start **MySQL** and create the `healthcoach` database
2. Start the **backend**: `./mvnw spring-boot:run` inside `/springapp`
3. Start the **frontend**: `npm start` inside `/reactapp`
4. Access the app at **http://localhost:3000**

---

## 👩‍💻 Author

**Srija Velusamy** — [GitHub](https://github.com/srija0501)