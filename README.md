# Waste Management System App

![EcoTrack Logo](https://via.placeholder.com/150x150/22c55e/ffffff?text=EcoTrack)

A comprehensive web application promoting sustainable waste management through technology. Built with React, Node.js, and modern web technologies.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Features

- **User Authentication** 🔐
  - Secure registration and login
  - JWT-based authentication
  - Password encryption

- **Waste Categorization Guide** ♻️
  - 5 waste categories: Plastic, Paper, Glass, Metal, Organic
  - Detailed disposal instructions
  - Environmental impact information
  - Visual examples for each category

- **Recycling Center Locator** 📍
  - GPS-enabled nearby center search
  - Center details (address, phone, hours)
  - Google Maps integration
  - Filter by waste type accepted

- **Reward Points System** 🎁
  - Earn 10 points per kg recycled
  - Multiple reward levels
  - Points redemption for benefits
  - Activity history tracking

- **Educational Content** 📚
  - Daily eco-friendly quotes
  - Recycling tips and best practices
  - Environmental statistics

- **Feedback System** 💬
  - Multiple feedback types
  - Star rating system
  - Community feedback display

---

## Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400/22c55e/ffffff?text=Home+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/10b981/ffffff?text=Dashboard)

### Waste Categories
![Waste Categories](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Waste+Categories)

### Recycling Centers
![Recycling Centers](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Recycling+Centers)

### Rewards
![Rewards](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Rewards)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
  ```bash
  node --version
  ```

- **npm** (comes with Node.js) or **yarn**
  ```bash
  npm --version
  ```

- **Git** (for cloning the repository)
  ```bash
  git --version
  ```

### System Requirements

| Component | Minimum Requirement |
|-----------|-------------------|
| OS | Windows 10/11, macOS, or Linux |
| RAM | 4 GB |
| Storage | 1 GB free space |
| Browser | Chrome, Firefox, Safari, Edge (latest versions) |

---

## Installation

### Step 1: Download/Extract the Project

Extract the project files to your desired location:

```bash
cd /path/to/waste-management-system
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- React and React DOM
- Express.js backend
- Tailwind CSS
- shadcn/ui components
- Additional utilities (framer-motion, react-router-dom, etc.)

### Step 3: Verify Installation

Check that all dependencies are installed:

```bash
npm list
```

---

## Running the Application

The application consists of two parts:
1. **Backend Server** (Node.js/Express) - Runs on port 5000
2. **Frontend Client** (React/Vite) - Runs on port 5173

### Method 1: Run Both (Recommended for Development)

Open two terminal windows:

**Terminal 1 - Start Backend:**
```bash
npm run server
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

### Method 2: Run Individually

**Start Backend Server Only:**
```bash
node server.js
```
Server will start at: http://localhost:5000

**Start Frontend Only:**
```bash
npm run dev
```
Frontend will start at: http://localhost:5173

### Accessing the Application

Once both servers are running:

| Service | URL |
|---------|-----|
| Frontend Application | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |

### Default Test Account

You can create a new account or use the following after registration:
- Register with any email and password
- The system will automatically log you in

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Recycling Centers Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recycling-centers` | Get all centers |
| GET | `/api/recycling-centers/nearby` | Get nearby centers |

### Waste Categories Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/waste-categories` | Get all categories |

### Rewards Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rewards` | Get user rewards |
| POST | `/api/rewards/recycle` | Record recycling |
| POST | `/api/rewards/redeem` | Redeem points |

### Feedback Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feedback` | Get all feedback |
| POST | `/api/feedback` | Submit feedback |

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/eco-quotes` | Get eco quotes |
| GET | `/api/eco-quotes/random` | Get random quote |
| GET | `/api/leaderboard` | Get top recyclers |
| GET | `/api/stats` | Get system stats |
| GET | `/api/health` | Health check |

---

## Project Structure

```
waste-management-system/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── Footer.tsx           # Footer component
│   ├── context/                  # React context
│   │   └── AuthContext.tsx      # Authentication context
│   ├── pages/                    # Application pages
│   │   ├── Home.tsx             # Home page
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Registration page
│   │   ├── Dashboard.tsx        # User dashboard
│   │   ├── WasteCategories.tsx  # Waste guide
│   │   ├── RecyclingCenters.tsx # Center locator
│   │   ├── Rewards.tsx          # Rewards page
│   │   ├── Feedback.tsx         # Feedback page
│   │   └── Profile.tsx          # User profile
│   ├── services/                 # API services
│   │   └── api.ts               # API functions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── data/                         # JSON database files
│   ├── users.json               # User data
│   ├── recycling-centers.json   # Center data
│   ├── feedback.json            # Feedback data
│   ├── rewards.json             # Rewards data
│   ├── eco-quotes.json          # Quotes data
│   └── waste-categories.json    # Categories data
├── server.js                     # Backend server
├── package.json                  # Dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
└── README.md                     # This file
```

---

## Technologies Used

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **cors** - Cross-origin requests
- **uuid** - Unique identifiers

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

---

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Error: Port 5000 or 5173 is already in use
# Solution: Kill the process or change the port

# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in server.js
const PORT = process.env.PORT || 5001;
```

**2. Module Not Found Error**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. CORS Error**
```bash
# Ensure backend server is running
# Check CORS configuration in server.js
```

**4. Build Errors**
```bash
# Clear cache and rebuild
npm cache clean --force
npm run build
```

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify all prerequisites are installed
4. Try clearing browser cache
5. Restart both servers

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- **Sharon Wanjiku** - Project Developer
- **University Supervisor** - Guidance and support
- **Open Source Community** - Tools and libraries used

---

## Contact

For questions or support:

- Email: support@ecotrack.co.ke
- Phone: +254 712 345 678
- Website: www.ecotrack.co.ke

---

**Project Information:**
- Name: Waste Management System App (EcoTrack)
- Version: 1.0.0
- Developer: Sharon Wanjiku (22YAD106769)
- Date: March 2025
- License: MIT

---

<p align="center">
  Made with 💚 for a greener Kenya
</p>
