import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse" />
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-40 animate-ping" />
            <svg
              className="w-24 h-24 text-emerald-600 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          ¡Oops! Página no encontrada
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida. Pero no te preocupes,
          tenemos muchas apuestas esperándote.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Ir al Inicio
          </Link>
          
          <Link
            href="/profile"
            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-emerald-300 inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Mi Perfil
          </Link>
        </div>

        {/* Additional links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Enlaces útiles:</p>
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <Link
              href="/"
              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              Eventos Deportivos
            </Link>
            <Link
              href="/profile"
              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              Mis Apuestas
            </Link>
            <Link
              href="/auth/signin"
              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
