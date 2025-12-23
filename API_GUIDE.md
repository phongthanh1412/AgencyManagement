# Agency Management System - API Guide

**Base URL:** `http://localhost:3000`

---

## Authentication

### POST /api/auth/register

Create a new user account.

**Headers:**

- `Content-Type: application/json`

**Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "staff"
}
```

**Response (201):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "staff"
}
```

**Validations:**

- `fullName`, `email`, `password`, `role` are required
- `role` must be "admin" or "staff"
- Email must be unique

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Missing required fields |
| 400 | Invalid role |
| 400 | Email already exists |
| 500 | Server error |

---

### POST /api/auth/login

Authenticate and receive JWT token.

**Headers:**

- `Content-Type: application/json`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "role": "staff"
  }
}
```

**Validations:**

- Email and password must be correct

**Errors:**
| Status | Message |
|--------|---------|
| 401 | Invalid email or password |
| 500 | Server error |

---

## Agencies

**Authorization:** All endpoints require `Authorization: Bearer <token>`

### GET /api/agencies

List all agencies with optional filters.

**Query Parameters (all optional):**

- `name` - Filter by agency name (substring match)
- `typeId` - Filter by agency type ID
- `district` - Filter by district number
- `phone` - Filter by phone number (substring match)

**Example:** `GET /api/agencies?typeId=507f1f77bcf86cd799439011&district=5`

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Agency A",
    "type": "Type 1",
    "district": 5,
    "phone": "0123456789",
    "currentDebt": 5000000,
    "maxDebt": 10000000,
    "receiptDate": "2025-12-23T10:00:00.000Z"
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

### GET /api/agencies/:id

Get detailed agency information.

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Agency A",
  "typeId": {
    "_id": "507f1f77bcf86cd799439001",
    "name": "Type 1",
    "maxDebt": 10000000
  },
  "phone": "0123456789",
  "email": "agency@example.com",
  "address": "123 Main St",
  "district": 5,
  "currentDebt": 5000000,
  "receiptDate": "2025-12-23T10:00:00.000Z"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 404 | Agency not found |
| 500 | Server error |

---

### POST /api/agencies

Create a new agency. **(Admin only)**

**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Body:**

```json
{
  "name": "New Agency",
  "typeId": "507f1f77bcf86cd799439001",
  "phone": "0123456789",
  "email": "newagency@example.com",
  "address": "456 Oak St",
  "district": 5,
  "receiptDate": "2025-12-23"
}
```

**Response (201):** Returns created agency object

**Business Logic:**

- `district` must not exceed `maxDistrict` from system regulation
- Number of agencies in the district must not exceed `maxAgencyPerDistrict`

**Errors:**
| Status | Message |
|--------|---------|
| 400 | District exceeds limit |
| 400 | Too many agencies in district |
| 500 | Server error |

---

### PUT /api/agencies/:id

Update agency details. **(Admin only)**

**Body:** (all fields optional)

```json
{
  "name": "Updated Agency",
  "typeId": "507f1f77bcf86cd799439001",
  "phone": "9876543210",
  "email": "updated@example.com",
  "address": "789 New St",
  "district": 6,
  "receiptDate": "2025-12-24"
}
```

**Response (200):** Returns updated agency object

**Errors:**
| Status | Message |
|--------|---------|
| 400 | District exceeds limit / Too many agencies in district |
| 404 | Agency not found |
| 500 | Server error |

---

### DELETE /api/agencies/:id

Delete agency and all related receipts/debt history. **(Admin only)**

**Response (200):**

```json
{
  "message": "Agency deleted successfully"
}
```

**Business Logic:**

- Cascades to delete associated payment receipts, export receipts, and debt histories

**Errors:**
| Status | Message |
|--------|---------|
| 404 | Agency not found |
| 500 | Server error |

---

### GET /api/agencies/:id/payment-receipts

Get payment receipts for an agency.

**Response (200):**

```json
[
  {
    "receiptCode": "PAY-20251223-A1B2C",
    "date": "2025-12-23T10:00:00.000Z",
    "amountPaid": 2000000
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid agency ID |
| 500 | Server error |

---

### GET /api/agencies/:id/export-receipts

Get export receipts for an agency.

**Response (200):**

```json
[
  {
    "receiptCode": "EX-20251223-A1B2C",
    "date": "2025-12-23T10:00:00.000Z",
    "totalAmount": 5000000,
    "items": [
      {
        "productName": "Product A",
        "unit": "box",
        "quantity": 10,
        "unitPrice": 500000,
        "amount": 5000000
      }
    ]
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid agency ID |
| 500 | Server error |

---

### GET /api/agencies/:id/debt-histories

Get debt history for an agency.

**Response (200):**

```json
[
  {
    "date": "2025-12-23T10:00:00.000Z",
    "receiptType": "EXPORT",
    "receiptCode": "EX-20251223-A1B2C",
    "change": -5000000,
    "debtAfter": 7000000
  },
  {
    "date": "2025-12-22T10:00:00.000Z",
    "receiptType": "PAYMENT",
    "receiptCode": "PAY-20251222-X1Y2Z",
    "change": 2000000,
    "debtAfter": 2000000
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid agency ID |
| 500 | Server error |

---

## Agency Types

**Authorization:** All endpoints require `Authorization: Bearer <token>`

### GET /api/agency-types

List all agency types.

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439001",
    "name": "Type 1",
    "maxDebt": 10000000,
    "createdAt": "2025-12-01T10:00:00.000Z"
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

### POST /api/agency-types

Create a new agency type. **(Admin only)**

**Body:**

```json
{
  "name": "Premium Type",
  "maxDebt": 50000000
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439002",
  "name": "Premium Type",
  "maxDebt": 50000000
}
```

**Validations:**

- `name` and `maxDebt` are required

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Missing agency type data |
| 500 | Server error |

---

### PUT /api/agency-types/:id

Update agency type. **(Admin only)**

**Body:**

```json
{
  "name": "Updated Type",
  "maxDebt": 60000000
}
```

**Response (200):** Returns updated agency type

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid agency type id |
| 404 | Agency type not found |
| 500 | Server error |

---

### DELETE /api/agency-types/:id

Delete agency type. **(Admin only)**

**Response (200):**

```json
{
  "message": "Agency type deleted successfully"
}
```

**Business Logic:**

- Cannot delete if agencies are assigned to this type

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid agency type id |
| 400 | Agency type is in use |
| 404 | Agency type not found |
| 500 | Server error |

---

## Products

**Authorization:** All endpoints require `Authorization: Bearer <token>`

### GET /api/products

List all products.

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439003",
    "name": "Product A",
    "unit": "box",
    "unitPrice": 500000,
    "createdAt": "2025-12-01T10:00:00.000Z"
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

### POST /api/products

Create a new product. **(Admin only)**

**Body:**

```json
{
  "name": "New Product",
  "unit": "kg",
  "unitPrice": 250000
}
```

**Response (201):** Returns created product

**Validations:**

- `name`, `unit`, `unitPrice` are required

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Missing product data |
| 500 | Server error |

---

### PUT /api/products/:id

Update product. **(Admin only)**

**Body:**

```json
{
  "name": "Updated Product",
  "unit": "box",
  "unitPrice": 300000
}
```

**Response (200):** Returns updated product

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid product id |
| 404 | Product not found |
| 500 | Server error |

---

### DELETE /api/products/:id

Delete product. **(Admin only)**

**Response (200):**

```json
{
  "message": "Product deleted successfully"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid product id |
| 404 | Product not found |
| 500 | Server error |

---

## Export Receipts

**Authorization:** All endpoints require `Authorization: Bearer <token>`

### POST /api/export-receipts

Create export receipt and update agency debt. **(Staff only)**

**Body:**

```json
{
  "agencyId": "507f1f77bcf86cd799439012",
  "date": "2025-12-23",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439003",
      "quantity": 10
    },
    {
      "productId": "507f1f77bcf86cd799439004",
      "quantity": 5
    }
  ]
}
```

**Response (201):**

```json
{
  "receipt": {
    "_id": "507f1f77bcf86cd799439020",
    "receiptCode": "EX-20251223-A1B2C",
    "agencyId": "507f1f77bcf86cd799439012",
    "agencyName": "Agency A",
    "date": "2025-12-23T00:00:00.000Z",
    "totalAmount": 7500000,
    "items": [
      {
        "productId": "507f1f77bcf86cd799439003",
        "productName": "Product A",
        "unit": "box",
        "quantity": 10,
        "unitPrice": 500000,
        "amount": 5000000
      }
    ]
  },
  "agency": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Agency A",
    "currentDebt": 7500000
  }
}
```

**Business Logic:**

- All `productId` values must be valid
- All quantities must be > 0
- New debt must not exceed agency type's `maxDebt`
- Creates debt history record automatically

**Errors:**
| Status | Message |
|--------|---------|
| 400 | agencyId, items are required / Invalid input |
| 404 | Agency not found |
| 400 | Debt limit exceeded |
| 500 | Server error |

---

### GET /api/export-receipts

List all export receipts.

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "receiptCode": "EX-20251223-A1B2C",
    "agencyName": "Agency A",
    "date": "2025-12-23T00:00:00.000Z",
    "totalAmount": 7500000,
    "items": 2
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

### GET /api/export-receipts/:id

Get export receipt details.

**Response (200):**

```json
{
  "receiptCode": "EX-20251223-A1B2C",
  "agencyName": "Agency A",
  "date": "2025-12-23T00:00:00.000Z",
  "totalAmount": 7500000,
  "items": [
    {
      "productName": "Product A",
      "unit": "box",
      "quantity": 10,
      "unitPrice": 500000,
      "amount": 5000000
    }
  ]
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid receipt ID |
| 404 | Export receipt not found |
| 500 | Server error |

---

## Payment Receipts

**Authorization:** All endpoints require `Authorization: Bearer <token>`

### POST /api/payment-receipts

Create payment receipt and reduce agency debt. **(Staff only)**

**Body:**

```json
{
  "agencyId": "507f1f77bcf86cd799439012",
  "date": "2025-12-23",
  "amountPaid": 2000000
}
```

**Response (201):**

```json
{
  "receipt": {
    "_id": "507f1f77bcf86cd799439021",
    "receiptCode": "PAY-20251223-X1Y2Z",
    "agencyId": "507f1f77bcf86cd799439012",
    "agencyName": "Agency A",
    "date": "2025-12-23T00:00:00.000Z",
    "amountPaid": 2000000
  },
  "agency": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Agency A",
    "currentDebt": 5500000
  }
}
```

**Business Logic:**

- `amountPaid` must be positive and not exceed current debt
- Updates agency `currentDebt` and creates debt history automatically

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Invalid input data / Invalid agencyId |
| 404 | Agency not found |
| 400 | Amount paid exceeds current debt |
| 500 | Server error |

---

### GET /api/payment-receipts

List all payment receipts.

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "receiptCode": "PAY-20251223-X1Y2Z",
    "agencyName": "Agency A",
    "date": "2025-12-23T00:00:00.000Z",
    "amountPaid": 2000000
  }
]
```

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

## Reports

**Authorization:** All endpoints require `Authorization: Bearer <token>`

### GET /api/reports/revenue

Get revenue report by agency.

**Query Parameters:**

- `mode` - Time period: `week`, `month`, `year` (default: `month`)

**Example:** `GET /api/reports/revenue?mode=month`

**Response (200):**

```json
{
  "totalRevenue": 12500000,
  "totalExportReceipts": 2,
  "avgPerReceipt": 6250000,
  "revenueByAgency": [
    {
      "agencyName": "Agency A",
      "totalRevenue": 7500000
    },
    {
      "agencyName": "Agency B",
      "totalRevenue": 5000000
    }
  ],
  "detailedBreakdown": [
    {
      "agencyName": "Agency A",
      "numberOfExportSlips": 1,
      "totalValue": 7500000,
      "percentage": 60.0
    },
    {
      "agencyName": "Agency B",
      "numberOfExportSlips": 1,
      "totalValue": 5000000,
      "percentage": 40.0
    }
  ]
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

### GET /api/reports/debt

Get debt status report.

**Query Parameters:**

- `mode` - Time period: `week`, `month`, `year` (default: `month`)

**Example:** `GET /api/reports/debt?mode=week`

**Response (200):**

```json
{
  "totalDebt": 12500000,
  "totalBeginningDebt": 10000000,
  "totalEndingDebt": 12500000,
  "highRiskCount": 2,
  "debtByAgency": [
    {
      "agencyName": "Agency A",
      "type": "Type 1",
      "maxDebt": 10000000,
      "currentDebt": 8000000,
      "isHighRisk": false
    },
    {
      "agencyName": "Agency B",
      "type": "Type 2",
      "maxDebt": 15000000,
      "currentDebt": 14500000,
      "isHighRisk": true
    }
  ]
}
```

**Business Logic:**

- `isHighRisk` = true if current debt >= 80% of max debt
- Changes in period show net debt movement

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

## System Regulation

**Authorization:** All endpoints require `Authorization: Bearer <token>`

### GET /api/system-regulation

Get system regulation settings.

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439030",
  "maxDistrict": 20,
  "maxAgencyPerDistrict": 10,
  "createdAt": "2025-12-01T10:00:00.000Z"
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 500 | Server error |

---

### PUT /api/system-regulation

Update system regulation settings. **(Admin only)**

**Body:**

```json
{
  "maxDistrict": 25,
  "maxAgencyPerDistrict": 15
}
```

**Response (200):** Returns updated regulation

**Business Logic:**

- New `maxDistrict` must be >= highest district currently in use
- New `maxAgencyPerDistrict` must be >= highest count of agencies in any district

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Missing regulation data |
| 400 | maxDistrict must be >= current max district (X) |
| 400 | maxAgencyPerDistrict must be >= current max agencies per district (Y) |
| 500 | Server error |

---

## Common Headers

All endpoints (except `/api/auth/register` and `/api/auth/login`) require:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Role-Based Access

| Endpoint                     | Admin | Staff |
| ---------------------------- | :---: | :---: |
| POST /api/agencies           |   ✓   |   ✗   |
| PUT /api/agencies/:id        |   ✓   |   ✗   |
| DELETE /api/agencies/:id     |   ✓   |   ✗   |
| POST /api/agency-types       |   ✓   |   ✗   |
| PUT /api/agency-types/:id    |   ✓   |   ✗   |
| DELETE /api/agency-types/:id |   ✓   |   ✗   |
| POST /api/products           |   ✓   |   ✗   |
| PUT /api/products/:id        |   ✓   |   ✗   |
| DELETE /api/products/:id     |   ✓   |   ✗   |
| POST /api/export-receipts    |   ✗   |   ✓   |
| POST /api/payment-receipts   |   ✗   |   ✓   |
| PUT /api/system-regulation   |   ✓   |   ✗   |
| All GET endpoints            |   ✓   |   ✓   |

---

## Example Frontend Flow

1. **Register/Login:**

   ```
   POST /api/auth/register → POST /api/auth/login → receive JWT
   ```

2. **Set up agency:**

   ```
   POST /api/agency-types → POST /api/products → POST /api/agencies
   ```

3. **Create export receipt (incurs debt):**

   ```
   POST /api/export-receipts
   ```

4. **Create payment receipt (reduces debt):**

   ```
   POST /api/payment-receipts
   ```

5. **View reports:**
   ```
   GET /api/reports/revenue?mode=month → GET /api/reports/debt?mode=month
   ```
