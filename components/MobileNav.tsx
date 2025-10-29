"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, BookOpen, Users, FileText, Bell, BarChart, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface MobileNavProps {
  role: 'teacher' | 'student';
  userName?: string;
}

export default function MobileNav({ role, userName }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const teacherNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard/teacher', icon: Home },
    { name: 'Classrooms', href: '/dashboard/teacher/classrooms/create', icon: Users },
    { name: 'Create Test', href: '/dashboard/teacher/tests/create', icon: FileText },
    { name: 'All Tests', href: '/dashboard/teacher/tests/all', icon: BookOpen },
    { name: 'Question Bank', href: '/dashboard/teacher/question-bank', icon: BookOpen },
    { name: 'Analytics', href: '/dashboard/teacher/analytics', icon: BarChart },
  ];

  const studentNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard/student', icon: Home },
    { name: 'My Profile', href: '/dashboard/student/profile', icon: User },
    { name: 'Materials', href: '/dashboard/student/materials', icon: BookOpen },
    { name: 'Announcements', href: '/dashboard/student/announcements', icon: Bell },
  ];

  const navItems = role === 'teacher' ? teacherNav : studentNav;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-[#FF991C] rounded-xl shadow-lg hover:bg-[#FF8F4D] transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <Menu className="h-6 w-6 text-black" />
        )}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-black via-gray-900 to-black border-l border-[#FF991C]/20 shadow-2xl z-40 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#FF991C]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] flex items-center justify-center">
                  <User className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="text-[#F5F5F5] font-bold text-lg">{userName || 'User'}</p>
                  <p className="text-[#F5F5F5]/60 text-sm capitalize">{role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-[#FF991C] text-black font-semibold shadow-lg'
                            : 'text-[#F5F5F5] hover:bg-[#FF991C]/10 hover:text-[#FF991C]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#FF991C]/20 bg-black/50 backdrop-blur-sm">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all font-semibold"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
