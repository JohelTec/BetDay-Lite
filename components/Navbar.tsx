"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LogOut, Power } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  isAuthenticated: boolean;
  userName: string | null;
}

export default function Navbar({ isAuthenticated, userName }: NavbarProps) {
  const pathname = usePathname();
  
  // Use the user's name or a default and capitalize first letter
  const displayName = userName 
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : 'Usuario';

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <span className="text-xl">🎲</span>
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                  BetDay
                </div>
                <div className="text-xs text-gray-500 font-medium group-hover:text-emerald-700 transition-colors duration-300">
                  Lite Edition
                </div>
              </div>
            </Link>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  href="/profile"
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/profile"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start justify-center min-w-0">
                    <span className="text-xs font-semibold leading-tight truncate max-w-[120px]">{displayName}</span>
                    <span className="text-[10px] text-gray-500 leading-tight">Mi Perfil</span>
                  </div>
                </Link>
                
                <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2"></div>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <Power className="w-5 h-5" />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <LogOut className="w-4 h-4 rotate-180" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
