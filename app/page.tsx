import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import Loading from "@/components/Loading";
import ScrollToTop from "@/components/ScrollToTop";
import { Event } from "@/lib/types";
import { auth } from "@/auth";
import { Calendar, TrendingUp, Users, BarChart3, Target, User, Wallet } from "lucide-react";

async function getEvents(): Promise<Event[]> {
  // Server-side data fetching usando Prisma directamente
  const { getEvents: fetchEvents } = await import("@/lib/data");
  const events = await fetchEvents();
  return events;
}

async function getUserData(email: string) {
  const { getUserByEmail } = await import("@/lib/data");
  return await getUserByEmail(email);
}

function groupEventsByHour(events: Event[]) {
  const grouped = new Map<string, Event[]>();
  
  events.forEach((event) => {
    const hour = new Date(event.startTime).getHours();
    const timeKey = `${hour.toString().padStart(2, "0")}:00`;
    
    if (!grouped.has(timeKey)) {
      grouped.set(timeKey, []);
    }
    grouped.get(timeKey)!.push(event);
  });
  
  return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

async function EventsTimeline() {
  const events = await getEvents();
  const session = await auth();
  const groupedEvents = groupEventsByHour(events);
  
  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg animate-pulse-slow">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No hay eventos disponibles
        </h3>
        <p className="text-sm text-gray-600 font-medium">
          Vuelve más tarde para ver los próximos eventos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groupedEvents.map(([timeKey, hourEvents]) => (
        <div key={timeKey} className="relative">
          <div className="sticky top-0 z-10 mb-8">
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 border-2 border-green-500/30 shadow-2xl py-5 px-7 rounded-2xl backdrop-blur-xl animate-slide-down relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center ring-4 ring-white/30 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white mb-1">{timeKey}</h2>
                    <p className="text-sm text-green-100 font-bold">
                      {hourEvents.length} {hourEvents.length === 1 ? "evento disponible" : "eventos disponibles"}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 bg-yellow-400/90 backdrop-blur-xl px-4 py-2 rounded-xl border-2 border-yellow-300 shadow-lg group-hover:scale-105 transition-transform">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50"></div>
                  <span className="font-black text-yellow-900 text-sm">EN VIVO</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hourEvents.map((event, index) => (
              <div 
                key={event.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
              >
                <EventCard
                  event={event}
                  isAuthenticated={!!session}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get user session and data
  const session = await auth();
  let userData = null;
  if (session?.user?.email) {
    userData = await getUserData(session.user.email);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Hero Header Section */}
        <div className="mb-12 relative overflow-hidden group/hero">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl blur-3xl group-hover/hero:scale-110 transition-transform duration-700"></div>
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 shadow-2xl border border-green-500/20 animate-fade-in hover:shadow-green-500/20 transition-all duration-500">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center ring-4 ring-white/30 shadow-xl animate-pulse-slow group-hover/hero:rotate-6 transition-transform duration-500">
                    <span className="text-3xl">🎲</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white mb-1 group-hover/hero:tracking-wide transition-all duration-300">
                      Apuestas Deportivas
                    </h1>
                    <p className="text-green-100 text-sm font-semibold flex items-center space-x-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></span>
                      <span>{today}</span>
                    </p>
                  </div>
                </div>
                <p className="text-green-50 text-base font-medium max-w-2xl">
                  Descubre las mejores cuotas en tiempo real, análisis profesional y más de 100+ mercados disponibles
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400/90 backdrop-blur-xl px-6 py-3 rounded-2xl border-2 border-yellow-300 hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg group cursor-default">
                  <div className="text-center">
                    <div className="text-xs text-yellow-900 font-black uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <span>🔥</span>
                      <span>En Vivo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Globales */}
        <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-blue-200 hover:border-blue-500 animate-fade-in-up cursor-default hover:-translate-y-2" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/30">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1 group-hover:tracking-wider transition-all duration-300">Eventos Hoy</p>
            <p className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">30</p>
            <div className="mt-2 h-1 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-0 group-hover:w-full transition-all duration-1000"></div>
            </div>
          </div>

          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-emerald-200 hover:border-emerald-500 animate-fade-in-up cursor-default hover:-translate-y-2" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-emerald-500/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-emerald-600 font-semibold uppercase mb-1 group-hover:tracking-wider transition-all duration-300">Cuota Promedio</p>
            <p className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">2.85</p>
            <div className="mt-2 h-1 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 w-0 group-hover:w-full transition-all duration-1000"></div>
            </div>
          </div>

          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-violet-200 hover:border-violet-500 animate-fade-in-up cursor-default hover:-translate-y-2" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-violet-500/30">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-violet-600 font-semibold uppercase mb-1 group-hover:tracking-wider transition-all duration-300">Apostadores</p>
            <p className="text-3xl font-black text-gray-900 group-hover:text-violet-600 transition-colors duration-300">1.2K+</p>
            <div className="mt-2 h-1 bg-violet-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600 w-0 group-hover:w-full transition-all duration-1000"></div>
            </div>
          </div>

          <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-amber-200 hover:border-amber-500 animate-fade-in-up cursor-default hover:-translate-y-2" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-amber-500/30">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-amber-600 font-semibold uppercase mb-1 group-hover:tracking-wider transition-all duration-300">Precisión IA</p>
            <p className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors duration-300">87%</p>
            <div className="mt-2 h-1 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-0 group-hover:w-full transition-all duration-1000"></div>
            </div>
          </div>
        </div>

        {/* Mercados Destacados */}
        <div className="mb-10 bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-gray-200 hover:border-indigo-200 animate-fade-in-up group/markets" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover/markets:scale-110 group-hover/markets:rotate-6 transition-all duration-500 shadow-lg shadow-indigo-500/30">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 group-hover/markets:text-indigo-600 transition-colors duration-300">Mercados Más Populares</h2>
              <p className="text-sm text-gray-600 font-medium">Tendencias de apuestas hoy</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group border-2 border-indigo-200 rounded-xl p-4 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">1X2 - Resultado Final</span>
                <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">45%</span>
              </div>
              <div className="w-full bg-indigo-50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-indigo-700" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-600 font-medium mt-2">El mercado más apostado</p>
            </div>
            <div className="group border-2 border-fuchsia-200 rounded-xl p-4 hover:border-fuchsia-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-800 group-hover:text-fuchsia-600 transition-colors duration-300">Total de Goles</span>
                <span className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">30%</span>
              </div>
              <div className="w-full bg-fuchsia-50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 h-full rounded-full transition-all duration-1000 group-hover:bg-gradient-to-r group-hover:from-fuchsia-600 group-hover:to-fuchsia-700" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-600 font-medium mt-2">Apuestas de Over/Under</p>
            </div>
            <div className="group border-2 border-rose-200 rounded-xl p-4 hover:border-rose-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-800 group-hover:text-rose-600 transition-colors duration-300">Ambos Marcan</span>
                <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">25%</span>
              </div>
              <div className="w-full bg-rose-50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 h-full rounded-full transition-all duration-1000 group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-rose-700" style={{ width: '25%' }}></div>
              </div>
              <p className="text-xs text-gray-600 font-medium mt-2">BTTS - Both Teams To Score</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <EventsTimeline />
        </Suspense>
      </main>

      <ScrollToTop />
    </div>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

