# Agency Management System

A comprehensive web-based application for managing agencies, tracking export/payment receipts, monitoring debt, and generating reports.

## Overview

The Agency Management System is designed to streamline agency operations by providing tools for:
- Agency directory management (create, view, edit, delete agencies)
- Export receipt creation and tracking
- Payment receipt processing
- Debt monitoring and reporting
- Revenue analysis and reporting
- System regulations configuration (agency types, products, constraints)

## Features

### Core Features
- **Agency Management**: Add, edit, view, and delete agencies with detailed information
- *Export Receipts**: Create and track export receipts with product details
- **Payment Receipts**: Process payments and automatically update agency debt
- **Debt Reporting**: Monitor agency debts with visual charts and status indicators
- **Revenue Reports**: Analyze revenue by agency with bar charts and detailed breakdowns
-  **System Regulations**: Configure agency types, products, and system constraints

### User Roles
- **Admin**: Full access to all features including delete operations and system regulations
- **Staff**: Limited access (view and create operations only)

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AgencyManagement
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Seed the database with sample data (optional)
node seed.js

# Start the backend server
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will run on `http://localhost:5173` (or `http://localhost:5174` if 5173 is in use)

## Running the Project

### Development Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Project Structure

```
AgencyManagement/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route controllers
│   │   ├── agency.controller.js
│   │   ├── auth.controller.js
│   │   ├── exportReceipt.controller.js
│   │   ├── paymentReceipt.controller.js
│   │   └── ...
│   ├── middlewares/
│   │   └── auth.middleware.js    # JWT authentication
│   ├── models/                   # Mongoose schemas
│   │   ├── Agency.js
│   │   ├── User.js
│   │   ├── ExportReceipt.js
│   │   └── ...
│   ├── routes/                   # API routes
│   │   ├── agency.routes.js
│   │   ├── auth.routes.js
│   │   └── ...
│   ├── services/                 # Business logic
│   ├── index.js                  # Server entry point
│   ├── seed.js                   # Database seeder
│   └── package.json
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Images, icons
│   │   ├── components/           # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── General.jsx
│   │   │   ├── AgencyDirectory.jsx
│   │   │   ├── AddAgency.jsx
│   │   │   ├── EditAgency.jsx
│   │   │   ├── AgencyDetails.jsx
│   │   │   ├── ExportReceipt.jsx
│   │   │   ├── ExportReceiptList.jsx
│   │   │   ├── PaymentReceipt.jsx
│   │   │   ├── PaymentReceiptList.jsx
│   │   │   ├── DebtReport.jsx
│   │   │   ├── RevenueReport.jsx
│   │   │   └── SystemRegulation.jsx
│   │   ├── services/             # API service functions
│   │   │   ├── apiClient.js
│   │   │   ├── authService.js
│   │   │   ├── agencyService.js
│   │   │   └── ...
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── postcss.config.js          # PostCSS configuration
│   ├── vite.config.mjs            # Vite configuration
│   └── package.json
│
├── API_GUIDE.md                   # API documentation
└── README.md                      # This file
```



## API Documentation

For detailed API endpoints and usage, refer to [API_GUIDE.md](./API_GUIDE.md)

## Features by Page

### 1. Agency Directory
- View all agencies with filtering (name, type, district, phone)
- Add new agencies (Admin only)
- Edit/Delete agencies (Admin only)
- View agency details

### 2. Export Receipt
- Create export receipts with multiple products
- Automatic total calculation
- Updates agency debt automatically

### 3. Payment Receipt
- Process payments for agencies
- Search agencies with debt display
- Reduces agency debt on payment

### 4. Debt Report
- Visual debt summary cards
- Debt status indicators (High Risk, Warning, Normal)
- Sortable debt table
- Generate PDF reports

### 5. Revenue Report
- Revenue bar charts by agency
- Date range filtering
- Detailed revenue breakdown table
- Export to PDF

### 6. System Regulations
- Configure maximum districts
- Set max agencies per district
- Manage agency types and debt limits
- Product catalog management

## Configuration

### Backend Configuration

Edit `backend/config/db.js` to configure MongoDB connection:

```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agencymanagement';
```

### Frontend Configuration

API base URL is configured in `frontend/src/services/apiClient.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

