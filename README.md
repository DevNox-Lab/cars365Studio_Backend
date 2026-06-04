# Cars365 Studio Backend

A professional, serverless-ready Node.js Express backend using MongoDB and Mongoose, optimized for Vercel.

## Features

- **MVC Architecture**: Separated models, controllers, and services for clean, maintainable code.
- **Serverless Optimized**: Configured to run as Vercel serverless functions.
- **MongoDB Integration**: Robust data storage using Mongoose.
- **Professional Structure**: Organized folder format.

## API Endpoints

### Orders

- **GET `/api/orders`**: Retrieve all order records.
- **POST `/api/orders`**: Create a new order record.

#### Sample POST Data

```json
{ 
   "customerName": "Ahmed Al Rashid", 
   "phoneNumber": "+971501234567", 
   "visitDate": "2026-06-15", 
   "visitTime": "10:30", 
   "vehicleInfo": { 
     "model": "Nissan Patrol", 
     "carType": "SUV", 
     "yearOfManufacture": 2024, 
     "color": "Pearl White" 
   }, 
   "plateInfo": { 
     "city": "Dubai", 
     "plateType": "private", 
     "plateLetter": "A", 
     "plateNumber": "12345" 
   }, 
   "services": { 
     "selectedServiceIds": ["ext-wash", "int-detailing"], 
     "selectedServices": [ 
       { 
         "serviceId": "ext-wash", 
         "serviceName": "Exterior Wash", 
         "price": 150, 
         "multiplier": 1.2, 
         "finalPrice": 180 
       }, 
       { 
         "serviceId": "int-detailing", 
         "serviceName": "Interior Detailing", 
         "price": 300, 
         "multiplier": 1.2, 
         "finalPrice": 360 
       } 
     ], 
     "totalPrice": 540, 
     "currency": "AED" 
   } 
}
```

## Getting Started

### Prerequisites

- Node.js installed.
- MongoDB Atlas account and connection string.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example` and add your `MONGODB_URI`.

3. Run locally:
   ```bash
   npm run dev
   ```

## Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root directory.
3. Add your `MONGODB_URI` to Vercel Environment Variables in the dashboard.
