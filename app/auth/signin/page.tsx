"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, Sparkles, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("¡Cuenta creada exitosamente! Por favor inicia sesión.");
    }
  }, [searchParams]);

  // Validate email format
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("El email es requerido");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor ingresa un email válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validate password
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("La contraseña es requerida");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      validateEmail(value);
    }
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      validatePassword(value);
    }
  };

  // Handle field blur
  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });
    if (field === "email") {
      validateEmail(email);
    } else {
      validatePassword(password);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      toast.error("Formulario inválido", {
        description: "Por favor corrige los errores en el formulario antes de continuar",
        duration: 4000,
      });
      return;
    }

    setLoading(true);

    console.log("🔍 [LOGIN] Intentando login con:", { email });

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("📊 [LOGIN] Resultado de signIn:", {
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url,
        fullResult: result,
      });

      // Verificar explícitamente si ok es true y no hay error
      if (result?.ok === true && !result?.error) {
        console.log("✅ [LOGIN] Login exitoso");
        toast.success("¡Inicio de sesión exitoso!", {
          description: "Bienvenido de vuelta",
          duration: 3000,
        });
        router.push("/");
        router.refresh();
      } else {
        // Login falló - mostrar error
        console.error("❌ [LOGIN] Login falló. Mostrando errores...");
        console.error("❌ [LOGIN] result.error:", result?.error);
        console.error("❌ [LOGIN] result.ok:", result?.ok);
        console.error("❌ [LOGIN] result completo:", JSON.stringify(result, null, 2));
        
        let errorMsg = "Las credenciales proporcionadas no son válidas. Verifica tu email y contraseña.";
        
        // Si hay un error específico del servidor
        if (result?.error && result.error !== "CredentialsSignin") {
          errorMsg = result.error;
        }
        
        console.error("❌ [LOGIN] Mensaje de error:", errorMsg);
        
        // FORZAR actualización del estado
        setError(errorMsg);
      }
    } catch (error) {
      console.error("❌ [LOGIN] Excepción capturada:", error);
      const errorMsg = "Error al conectar con el servidor. Por favor intenta nuevamente.";
      setError(errorMsg);
      toast.error("Error de conexión", {
        description: errorMsg,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🎲</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🏆</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>⚽</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🎯</div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Main card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-emerald-100 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
          {/* Logo section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl p-5 shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <div className="text-6xl">🎲</div>
              </div>
            </div>
            
            <h2 className="mt-8 text-center text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-700 to-teal-600 bg-clip-text text-transparent tracking-tight">
              BetDay Lite
            </h2>
            <p className="mt-3 text-center text-base text-gray-600 font-medium">
              Inicia sesión para comenzar a apostar
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 animate-fade-in">
              <p className="text-sm text-emerald-700 font-medium text-center">{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-5 shadow-lg animate-fade-in-up">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse-slow">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-sm font-bold text-red-900 mb-1">Error de autenticación</h3>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                  <p className="text-xs text-red-600 mt-2">Por favor verifica tus credenciales e intenta nuevamente.</p>
                </div>
              </div>
            </div>
          )}

          {/* Form section */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email input */}
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-300 ${
                      emailError 
                        ? "text-red-500" 
                        : "text-gray-400 group-focus-within:text-emerald-600"
                    }`} />
                  </div>
                  {emailError && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur("email")}
                    className={`appearance-none rounded-xl relative block w-full pl-12 pr-12 py-4 border-2 placeholder-gray-400 text-gray-900 focus:outline-none transition-all duration-300 hover:shadow-md bg-white ${
                      emailError
                        ? "border-red-300 focus:ring-4 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 hover:border-emerald-300"
                    }`}
                    placeholder="tu@email.com"
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-fade-in">
                    <AlertCircle className="h-4 w-4 mr-1.5" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-300 ${
                      passwordError 
                        ? "text-red-500" 
                        : "text-gray-400 group-focus-within:text-emerald-600"
                    }`} />
                  </div>
                  {passwordError && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur("password")}
                    className={`appearance-none rounded-xl relative block w-full pl-12 pr-12 py-4 border-2 placeholder-gray-400 text-gray-900 focus:outline-none transition-all duration-300 hover:shadow-md bg-white ${
                      passwordError
                        ? "border-red-300 focus:ring-4 focus:ring-red-200 focus:border-red-500"
                        : "border-gray-200 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 hover:border-emerald-300"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-fade-in">
                    <AlertCircle className="h-4 w-4 mr-1.5" />
                    {passwordError}
                  </p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !!emailError || !!passwordError}
                className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform shadow-lg overflow-hidden ${
                  loading || emailError || passwordError
                    ? "bg-gray-400 cursor-not-allowed opacity-60"
                    : "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 hover:scale-105 active:scale-95 hover:shadow-xl"
                }`}
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <LogIn className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  )}
                </span>
                
                <span className="relative">
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </span>
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link 
                href="/auth/signup" 
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all duration-300"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>

          {/* Features section */}
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="group cursor-default">
                <div className="flex justify-center mb-2">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-700">Mejores</p>
                <p className="text-xs text-gray-500">Cuotas</p>
              </div>
              
              <div className="group cursor-default">
                <div className="flex justify-center mb-2">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-700">Análisis</p>
                <p className="text-xs text-gray-500">En Vivo</p>
              </div>
              
              <div className="group cursor-default">
                <div className="flex justify-center mb-2">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-700">Bonos</p>
                <p className="text-xs text-gray-500">Exclusivos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">
            🔒 Conexión segura y encriptada
          </p>
        </div>
      </div>
    </div>
  );
}
