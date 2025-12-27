# Inventory Management System

A full-stack inventory management system built with **Next.js (React)** for the frontend and **Node.js + Express** for the backend, with **MongoDB** as the database. The system allows users to manage products, track stock levels, handle dead stock, and monitor recent sales.  

**Live Demo:** [https://inventory-management-system-indol-eta.vercel.app/](https://inventory-management-system-indol-eta.vercel.app/)

---

## Features

- Add, edit, and delete inventory items
- Track product quantity and reorder level
- Mark items as:
  - **Healthy**: sufficient stock
  - **Low Stock**: quantity below reorder level
  - **Dead Stock**: not sold for 90+ days
  - **Recently Sold**: sold in the last 7 days
- Display last sold date
- Real-time inventory table with color-coded status
- Integration with MongoDB Atlas for cloud storage
- Frontend deployed on **Vercel** and backend on **Render**

---

## Technology Stack

| Layer       | Technology                   |
|------------|-------------------------------|
| Frontend   | Next.js, React                |
| Backend    | Node.js, Express              |
| Database   | MongoDB Atlas                 |
| Deployment | Vercel (Frontend), Render (Backend) |

---


---

## Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/SohaSk/inventory-management-system.git
cd inventory-management-system
```
### 2. Backend Setup
```bash
cd backend
npm install
```

Create a .env file with your MongoDB URI:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/inventory
PORT=5000
```

Run the server:
```bash
npm start
```
### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Access the app at http://localhost:3000

### Deployment
  - Backend: Render (Node.js service)
     - Set environment variables (MONGO_URI, PORT)
  - Frontend: Vercel
     - Set API_BASE to the deployed backend URL
  - Live link: https://inventory-management-system-indol-eta.vercel.app/

### Screenshots
<img width="800" height="500" alt="image" src="https://github.com/user-attachments/assets/58fd58c2-ee1e-48a2-9635-0cc25b689a92" />
<img width="800" height="500" alt="image" src="https://github.com/user-attachments/assets/ebb8d100-3a23-49e5-a73d-754837707070" />

