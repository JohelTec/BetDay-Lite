import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BetCard from "@/components/BetCard";
import Loading from "@/components/Loading";
import { Bet } from "@/lib/types";
import { User, TrendingUp, Target, Award, Zap, BarChart3, Clock, TrendingDown, Wallet } from "lucide-react";
import { getBetsByUserId, getUserByEmail, resolvePendingBets } from "@/lib/data";

async function getUserBets(): Promise<Bet[]> {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Llamar directamente a la función de datos en el servidor
  const bets = await getBetsByUserId(session.user.email);
  return bets;
}

async function BetsList() {
  const bets = await getUserBets();

  if (bets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-md border border-gray-200">
          <div className="mb-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Aún no hay apuestas
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Comienza a apostar en los eventos de hoy para verlas aquí
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <span>Ver Eventos</span>
            <TrendingUp className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const stats = {
    total: bets.length,
    won: bets.filter((b) => b.status === "WON").length,
    lost: bets.filter((b) => b.status === "LOST").length,
    pending: bets.filter((b) => b.status === "PENDING").length,
  };

  const winRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : 0;
  const totalWinnings = bets
    .filter((b) => b.status === "WON")
    .reduce((sum, bet) => sum + (bet.amount * bet.odds), 0);
  const totalInvested = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const profit = totalWinnings - totalInvested;

  return (
    <div className="space-y-6">
      {/* Stats Cards Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border-l-4 border-emerald-600">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Total Apuestas</div>
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Ganadas</div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-green-600">{stats.won}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border-l-4 border-red-600">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Perdidas</div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-red-600">{stats.lost}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border-l-4 border-amber-600">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="text-xs font-medium text-gray-500 uppercase">Pendientes</div>
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-amber-600">{stats.pending}</div>
        </div>
      </div>

      {/* Estadísticas Avanzadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase">Tasa de Acierto</p>
              <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{winRate}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${winRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase">Ganancia/Pérdida</p>
              <p className={`text-2xl sm:text-3xl font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs text-gray-600">
            <span>Invertido: ${totalInvested.toFixed(2)}</span>
            <span>Ganado: ${totalWinnings.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase">Racha Actual</p>
              <p className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {stats.won > 0 ? `${Math.min(stats.won, 5)}🔥` : '0'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {stats.won > 0 ? 'En racha positiva' : 'Comienza tu racha'}
          </p>
        </div>
      </div>

      {/* Análisis de Rendimiento */}
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Análisis de Rendimiento</h2>
            <p className="text-xs text-gray-500">Estadísticas detalladas de tus apuestas</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase mb-1 sm:mb-2">Cuota Promedio</p>
            <p className="text-lg sm:text-2xl font-semibold text-indigo-600">
              {stats.total > 0 ? (bets.reduce((sum, bet) => sum + bet.odds, 0) / stats.total).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase mb-1 sm:mb-2">Apuesta Promedio</p>
            <p className="text-lg sm:text-2xl font-semibold text-purple-600">
              ${stats.total > 0 ? (totalInvested / stats.total).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase mb-1 sm:mb-2">ROI</p>
            <p className={`text-lg sm:text-2xl font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase mb-1 sm:mb-2">Mejor Racha</p>
            <p className="text-lg sm:text-2xl font-semibold text-orange-600">{Math.min(stats.won, 10)}🏆</p>
          </div>
        </div>
      </div>

      {/* Lista de Apuestas */}
      <div>
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Historial de Apuestas</h3>
            <p className="text-xs sm:text-sm text-gray-500">{bets.length} {bets.length === 1 ? 'apuesta registrada' : 'apuestas registradas'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {bets.map((bet) => (
            <BetCard key={bet.id} bet={bet} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect("/auth/signin");
  }

  // Resolver apuestas pendientes primero
  await resolvePendingBets(session.user.email);

  // Obtener el balance del usuario (ya actualizado después de resolver apuestas)
  const userData = await getUserByEmail(session.user.email);
  const balance = userData?.balance ?? 1000.0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 border-b border-emerald-700 shadow-lg">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-white drop-shadow-md">
                  Mi Perfil
                </h1>
                <p className="text-xs sm:text-sm text-emerald-50 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
              {/* Balance Card */}
              <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white/50 flex-shrink-0 shadow-lg">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase">Saldo</div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">
                      ${balance.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nivel Badge */}
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-3 rounded-lg border border-white/50 flex-shrink-0 shadow-lg">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase">Nivel</div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900">Pro</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <Suspense fallback={<Loading />}>
          <BetsList />
        </Suspense>
      </main>
    </div>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
