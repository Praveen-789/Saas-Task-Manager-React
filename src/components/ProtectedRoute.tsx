import { Navigate, Outlet } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { useAppContext } from "@/context/AppContext";

export default function ProtectedRoute() {
  const { token } = useAppContext();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}