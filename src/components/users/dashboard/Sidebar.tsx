"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiCalendar, FiLogOut, FiX, FiAward, FiUserCheck, FiCreditCard, FiVolume2, FiBookOpen, FiMessageSquare, FiHelpCircle } from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', href: '/users/dashboard', icon: <FiCalendar className="w-5 h-5" /> },
  { name: 'My Registration', href: '/users/my-registration', icon: <FiUserCheck className="w-5 h-5" /> },
  { name: 'Payment Details', href: '/users/payment-details', icon: <FiCreditCard className="w-5 h-5" /> },
  { name: 'My Badge', href: '/users/my-badge', icon: <FiAward className="w-5 h-5" /> },
  { name: 'Announcements', href: '/users/announcements', icon: <FiVolume2 className="w-5 h-5" /> },
  { name: 'Event Resources', href: '/users/event-resources', icon: <FiBookOpen className="w-5 h-5" /> },
  { name: 'Feedback', href: '/users/feedback', icon: <FiMessageSquare className="w-5 h-5" /> },
  { name: 'Support', href: '/users/support', icon: <FiHelpCircle className="w-5 h-5" /> }
];

export default function Sidebar({ isOpen, toggleSidebarAction }: { isOpen: boolean; toggleSidebarAction: () => void }) {
  const toggleSidebar = toggleSidebarAction;
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex items-center mt-3 justify-between p-3.5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">EventFlow</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-10"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${pathname === item.href
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link href="/user/login">
              <button className="flex items-center w-full p-3 text-red-600 rounded-lg hover:bg-red-50 cursor-pointer">
                <FiLogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
