import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shield, AlertCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Logo y Descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎲</span>
              </div>
              <h3 className="text-2xl font-black text-white">BetDay Lite</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu plataforma de confianza para apuestas deportivas en tiempo real. 
              Cuotas competitivas, análisis profesional y la mejor experiencia de usuario.
            </p>
            <div className="flex items-center space-x-2 text-xs text-yellow-500">
              <Shield className="w-4 h-4" />
              <span className="font-semibold">Licencia y regulación oficial</span>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Deportes
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  En Vivo
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Casino
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Promociones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Resultados
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Estadísticas
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Ayuda y Soporte */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ayuda y Soporte</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Juego Responsable
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Verificación de Cuenta
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:soporte@betdaylite.com" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  soporte@betdaylite.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <a href="tel:+511234567890" className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                  +51 123 456 7890
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  Lima, Perú
                </span>
              </li>
            </ul>
            
            {/* Redes Sociales */}
            <div className="mt-6">
              <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Síguenos</h5>
              <div className="flex space-x-3">
                <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-gradient-to-br hover:from-sky-500 hover:to-sky-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-gradient-to-br hover:from-pink-600 hover:to-rose-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Youtube className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Juego Responsable Banner */}
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-2 border-amber-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-amber-400 font-bold text-sm mb-1">Juego Responsable +18</h5>
                <p className="text-gray-400 text-xs leading-relaxed">
                  El juego puede ser adictivo. Juega con responsabilidad. Solo para mayores de 18 años. 
                  Si crees que tienes un problema con el juego, busca ayuda profesional.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright y Métodos de Pago */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">
                © {currentYear} <span className="font-semibold text-gray-400">BetDay Lite</span>. Todos los derechos reservados.
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Desarrollado con tecnología de última generación
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 font-medium">Métodos de pago seguros:</span>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">VISA</span>
                </div>
                <div className="w-10 h-7 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">MC</span>
                </div>
                <div className="w-10 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">AMEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
