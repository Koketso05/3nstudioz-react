import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./AdminLayout";

export function ProtectedAdminLayout() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );
}
