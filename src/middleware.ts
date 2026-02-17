export { auth as middleware } from "./auth";

export const config = {
  // Solo proteger rutas específicas que requieren autenticación
  matcher: [
    "/profile/:path*",
    "/bets/:path*",
  ],
};
