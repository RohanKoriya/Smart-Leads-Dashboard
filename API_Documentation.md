# Smart Leads Dashboard API Documentation

Base URL:

```http
http://localhost:5000/api
```

---

# Authentication

## Register User

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "name": "Rohan",
  "email": "rohan@gmail.com",
  "password": "123456",
  "role": "sales"
}
```

### Success Response

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "123",
    "name": "Rohan",
    "email": "rohan@gmail.com",
    "role": "sales"
  }
}
```

---

## Login User

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "rohan@gmail.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "123",
    "name": "Rohan",
    "email": "rohan@gmail.com",
    "role": "sales"
  }
}
```

---

# Authentication Header

Protected routes require:

```http
Authorization: Bearer YOUR_TOKEN
```

---

# Leads APIs

---

## Create Lead

### Endpoint

```http
POST /leads
```

### Request Body

```json
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "status": "New",
  "source": "Instagram"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Lead created successfully"
}
```

---

## Get All Leads

### Endpoint

```http
GET /leads
```

---

# Query Parameters

| Parameter | Description             |
| --------- | ----------------------- |
| search    | Search by name or email |
| status    | Filter by lead status   |
| source    | Filter by lead source   |
| sort      | latest or oldest        |
| page      | Pagination page         |

---

# Example

```http
GET /leads?search=rahul&status=Qualified&source=Instagram&page=1
```

---

# Success Response

```json
{
  "success": true,
  "currentPage": 1,
  "totalPages": 2,
  "totalRecords": 15,
  "leads": []
}
```

---

## Get Single Lead

### Endpoint

```http
GET /leads/:id
```

---

## Update Lead

### Endpoint

```http
PUT /leads/:id
```

### Request Body

```json
{
  "status": "Qualified"
}
```

---

## Delete Lead

### Endpoint

```http
DELETE /leads/:id
```

### Access

Admin only.

---

# Error Responses

## Validation Error

```json
{
  "message": "All fields are required"
}
```

---

## Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

## Invalid Token

```json
{
  "message": "Invalid token"
}
```

---

# Roles

| Role  | Permissions    |
| ----- | -------------- |
| admin | Full access    |
| sales | Limited access |

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT Authentication
- Mongoose
