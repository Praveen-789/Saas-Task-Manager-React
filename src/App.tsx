// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Button } from './components/ui/button'
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent
// } from "@/components/ui/card"

// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription
// } from "@/components/ui/dialog"
// import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
// import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register';
import { Toaster } from './components/ui/toaster';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import Organizations from './pages/Organizations';
import { AppProvider, useAppContext } from "./context/AppContext";
import AssignUserToOrg from './pages/AssignUserToOrg';
import OrgUsers from './pages/OrgUsers';
function AppRoutes() {
  // const [count, setCount] = useState(0)
  // const token = localStorage.getItem("token")
   const { token } = useAppContext();
  return (
    <>

    <BrowserRouter>
  <Routes>

    {/* Default */}
    <Route
      path="/"
      element={
        token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      }
    />

    {/* Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgotpassword" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
   
    {/* <Route path="/organizations" element={<Organizations />} /> */}
    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/organizations" element={<Organizations />} />
      <Route path="/assign-user/:orgId" element={<AssignUserToOrg />} />
      <Route path="/getOrgMembers" element={<OrgUsers/>}/>
      <Route path="/settings" element={<Settings />} />
    </Route>

  </Routes>

  <Toaster />
</BrowserRouter>

    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

// export default App
