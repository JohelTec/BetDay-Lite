"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Sparkles, TrendingUp, Trophy, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  
  const router = useRouter();

  // Validation functions
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError("El correo electrónico es obligatorio");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Por favor ingresa un correo electrónico válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError("La contraseña es obligatoria");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setConfirmPasswordError("Debes confirmar tu contraseña");
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    // Validate email format without setting state
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValidLocal = email.trim() !== "" && emailRegex.test(email);
    
    // Validate password without setting state
    const isPasswordValidLocal = password.trim() !== "" && password.length >= 6;
    
    // Validate confirm password without setting state
    const isConfirmPasswordValidLocal = confirmPassword.trim() !== "" && confirmPassword === password;
    
    return (
      isEmailValidLocal &&
      isPasswordValidLocal &&
      isConfirmPasswordValidLocal &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  // Handle field changes
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      validatePassword(value);
    }
    // Re-validate confirm password if it's been touched
    if (touched.confirmPassword && confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      validateConfirmPassword(value);
    }
  };

  // Handle field blur
  const handleBlur = (field: "email" | "password" | "confirmPassword") => {
    setTouched({ ...touched, [field]: true });
    if (field === "email") {
      validateEmail(email);
    } else if (field === "password") {
      validatePassword(password);
    } else if (field === "confirmPassword") {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Mark all fields as touched
    setTouched({ 
      email: true, 
      password: true, 
      confirmPassword: true 
    });

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      toast.error("Formulario inválido", {
        description: "Por favor corrige los errores antes de continuar",
        duration: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      // Register user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Error al registrar usuario";
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Show success message
      toast.success("¡Cuenta creada exitosamente!", {
        description: "Iniciando sesión...",
        duration: 3000,
      });

      // Auto login after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        router.refresh();
      } else {
        // Registration successful but login failed, redirect to signin
        toast.info("Cuenta creada", {
          description: "Por favor inicia sesión manualmente",
          duration: 4000,
        });
        router.push("/auth/signin?registered=true");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMsg = "Error al crear la cuenta";
      setError(errorMsg);
      toast.error("Error del servidor", {
        description: errorMsg,
        duration: 5000,
      });
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
          {/* Back button */}
          <Link 
            href="/auth/signin"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Volver al inicio de sesión
          </Link>

          {/* Logo section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl p-5 shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <div className="text-6xl">🎲</div>
              </div>
            </div>
            
            <h2 className="mt-8 text-center text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-700 to-teal-600 bg-clip-text text-transparent tracking-tight">
              Crear Cuenta
            </h2>
            <p className="mt-3 text-center text-base text-gray-600 font-medium">
              Únete a BetDay Lite y comienza a ganar
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in">
              <p className="text-sm text-red-700 font-medium text-center">{error}</p>
            </div>
          )}

          {/* Form section */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Name input */}
              <div className="relative group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full pl-12 pr-4 py-4 border-2 border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300 hover:shadow-md bg-white"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-300 ${
                      touched.email && emailError
                        ? "text-red-500"
                        : "text-gray-400 group-focus-within:text-emerald-600"
                    }`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`appearance-none rounded-xl relative block w-full pl-12 pr-12 py-4 border-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 transition-all duration-300 bg-white ${
                      touched.email && emailError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:shadow-md"
                    }`}
                    placeholder="tu@email.com"
                  />
                  {touched.email && emailError && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {touched.email && emailError && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center animate-fade-in">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-300 ${
                      touched.password && passwordError
                        ? "text-red-500"
                        : "text-gray-400 group-focus-within:text-emerald-600"
                    }`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`appearance-none rounded-xl relative block w-full pl-12 pr-12 py-4 border-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 transition-all duration-300 bg-white ${
                      touched.password && passwordError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:shadow-md"
                    }`}
                    placeholder="••••••••"
                  />
                  {touched.password && passwordError && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {touched.password && passwordError ? (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center animate-fade-in">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {passwordError}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-500">Mínimo 6 caracteres</p>
                )}
              </div>

              {/* Confirm Password input */}
              <div className="relative group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-300 ${
                      touched.confirmPassword && confirmPasswordError
                        ? "text-red-500"
                        : "text-gray-400 group-focus-within:text-emerald-600"
                    }`} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={`appearance-none rounded-xl relative block w-full pl-12 pr-12 py-4 border-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 transition-all duration-300 bg-white ${
                      touched.confirmPassword && confirmPasswordError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 hover:border-emerald-300 hover:shadow-md"
                    }`}
                    placeholder="••••••••"
                  />
                  {touched.confirmPassword && confirmPasswordError && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {touched.confirmPassword && confirmPasswordError && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center animate-fade-in">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform shadow-lg overflow-hidden ${
                  loading || !isFormValid()
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
                    <UserPlus className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  )}
                </span>
                
                <span className="relative">
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </span>
              </button>
              
              {/* Validation hint */}
              {!isFormValid() && (touched.email || touched.password || touched.confirmPassword) && (
                <p className="mt-2 text-xs text-gray-500 text-center flex items-center justify-center animate-fade-in">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Completa todos los campos correctamente para continuar
                </p>
              )}
            </div>

            {/* Benefits info */}
            <div className="relative mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-4 border-2 border-emerald-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-900 mb-1">
                    ¡Bono de bienvenida de $1000!
                  </p>
                  <p className="text-xs text-emerald-700">
                    Comienza a apostar de inmediato con tu saldo inicial
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Features section */}
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="group cursor-default">
                <div className="flex justify-center mb-2">
                  <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-5 w-5 text-teal-600" />
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
                  <div className="bg-gradient-to-br from-green-100 to-lime-100 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-700">Bonos</p>
                <p className="text-xs text-gray-500">Exclusivos</p>
              </div>
            </div>
          </div>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link 
                href="/auth/signin" 
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all duration-300"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">
            🔒 Tus datos están protegidos y encriptados
          </p>
        </div>
      </div>
    </div>
  );
}
