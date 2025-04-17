import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Users, LayoutDashboard, ClipboardList, UserCircle2, Ruler, Wrench, LineChart, Gift } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Clients', href: '/clients', icon: UserCircle2 },
    { name: 'Tasks', href: '/tasks', icon: ClipboardList },
    { name: 'Solar Design', href: '/design', icon: Ruler },
    { name: 'Engineering', href: '/engineering', icon: Wrench },
    { name: 'Analysis', href: '/analysis', icon: LineChart },
    { name: 'Referrals', href: '/referrals', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Sun className="w-8 h-8 text-yellow-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">Impulse Solar</span>
        </div>
        <nav className="px-4 mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-md',
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-end h-16 px-8">
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;