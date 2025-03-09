# 🏦 BudgetGuardian

**BudgetGuardian** is a simple and efficient budget management application designed to help users track their expenses, categorize transactions, and manage budgets effortlessly.

## Pre-Production Deployment

- **Frontend:** [BudgetGuardian on Vercel](https://budget-guardian.vercel.app)
- **Backend:** [BudgetGuardian API on Render](https://budgetguardian-backend.onrender.com)

## Screenshots

*I will be adding relevant screenshots here to showcase the UI, settings page, transactions, and any graphs when the app is fully finished (MVP).*

## Features Implemented

- ✅ **User Authentication:** JWT-based authentication for login and registration.
- ✅ **Budget Management:** Create and update budget categories.
- ✅ **Transaction Tracking:** Log transactions with date, category, place, and amount.
- ✅ **User Settings:** Currency selection, dark mode toggle, and email notification preferences.
- ✅ **Full-Stack Deployment:** Hosted frontend on Vercel and backend on Render.
- ✅ **Enhanced User Profile:** Ability to update name, email, and password.
- ✅ **Dashboard & Graphs:** Adding data visualization for spending trends.

## Features In Progress

- 🚧 **Performance Optimizations:** Improving API response times and database indexing.
- 🚧 **Error Handling & Notifications:** Displaying user-friendly error messages.
- 🚧 **Security Enhancements:** Password hashing for better security.

## Technologies Used

### Frontend:
- React.js
- React Router
- CSS Modules

### Backend:
- Node.js
- Express.js
- PostgreSQL (hosted on Render)
- JWT Authentication
- CORS

### Deployment:
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Render PostgreSQL

## 💻 Local Development Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/spowers0409/BudgetGuardian.git
cd BudgetGuardian
```

### 2️⃣ Install Dependencies
```sh
npm install  # Installs frontend dependencies
cd server    # Navigate to backend folder
npm install  # Installs backend dependencies
```
### 3️⃣ Create a .env File
####     Create a .env file in the backend directory and add the following:
```sh
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
JWT_SECRET=your_secret_key
```
### 4️⃣ Start the Backend Server
```sh
cd server
npm start
```

### 5️⃣ Start the Frontend
```sh
cd client
npm start
```
#### The frontend will be accessible at [http://localhost:3000]() and the backend at [http://localhost:5000]()

## Contributing
#### This project is currently under development for an MVP release. If you'd like to contribute, feel free to submit issues or pull requests.

## Contact
#### For questions or suggestions, reach out:
- 📧 Email: spowers0409@gmail.com
- :octocat: GitHub: spowers0409

## 📜 License
### This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
























