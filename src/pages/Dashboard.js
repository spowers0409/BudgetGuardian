import React from "react";
import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";

const Dashboard = () => {
    return (
      <div className="dashboard">
        <h1 className="page-title">Dashboard</h1>

        <div className="dashboard-widgets">
          <DashboardCard title="Total Balance" amount="12,345.67" change="+5% from last month" />
          <DashboardCard title="Income This Month" amount="4,200.00" change="+2% from last month" />
          <DashboardCard title="Expenses This Month" amount="2,300.00" change="-1% from last month" />
          <DashboardCard title="Net Savings" amount="1,900.00" change="+4% from last month" />
        </div>
      </div>
    );
};

export default Dashboard;

