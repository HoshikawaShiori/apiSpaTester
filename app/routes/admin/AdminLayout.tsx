import { Outlet } from 'react-router';
import { RoleGuard } from '../../components/RoleGuard';

export default function AdminLayout() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="admin-layout">
        <main>
          <Outlet />
        </main>
      </div>
    </RoleGuard>
  );
} 