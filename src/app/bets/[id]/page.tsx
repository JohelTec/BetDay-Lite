import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Loading from "@/components/Loading";
import { Bet } from "@/lib/types";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Trophy,
  XCircle,
  Clock,
  Target,
  Percent,
  TrendingDown,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getBetById } from "@/lib/data";

async function getBet(id: string): Promise<Bet | null> {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Llamar directamente a la función de datos en el servidor
  const bet = await getBetById(id);

  if (!bet) {
    return null;
  }

  // Verificar que la apuesta pertenece al usuario
  if (bet.userId !== session.user.email) {
    return null;
  }

  return bet;
}

async function BetDetails({ id }: { id: string }) {
  const bet = await getBet(id);

  if (!bet) {
    notFound();
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "WON":
        return <Trophy className="w-8 h-8" />;
      case "LOST":
        return <XCircle className="w-8 h-8" />;
      default:
        return <Clock className="w-8 h-8" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WON":
        return "from-green-500 to-emerald-600";
      case "LOST":
        return "from-red-500 to-rose-600";
      default:
        return "from-yellow-500 to-amber-600";
    }
  };

  const getSelectionLabel = (selection: string) => {
    switch (selection) {
      case "1":
        return "Victoria Local";
      case "X":
        return "Empate";
      case "2":
        return "Victoria Visitante";
      default:
        return selection;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const potentialWin = bet.amount * bet.odds;
  const profit = potentialWin - bet.amount;
  const profitPercentage = ((profit / bet.amount) * 100).toFixed(1);
  const isHighOdds = bet.odds >= 2.5;
  const totalOdds = bet.event.odds.home + bet.event.odds.draw + bet.event.odds.away;
  const impliedProbability = ((1 / bet.odds) * 100).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/profile"
        className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-all duration-300 font-medium transform hover:-translate-x-1 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Volver al Perfil</span>
      </Link>

      {/* Header con Estado */}
      <div className={`bg-gradient-to-r ${getStatusColor(bet.status)} text-white rounded-2xl p-6 sm:p-8 shadow-lg`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {getStatusIcon(bet.status)}
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                {bet.status === "WON" && "¡GANADA!"}
                {bet.status === "LOST" && "PERDIDA"}
                {bet.status === "PENDING" && "EN JUEGO"}
              </div>
              <p className="text-white/80 text-sm">ID: {bet.id.slice(0, 8)}...</p>
            </div>
          </div>
          {bet.status === "WON" && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-right">
              <div className="text-sm text-white/90 mb-1">Ganancia</div>
              <div className="text-3xl sm:text-4xl font-bold">+${profit.toFixed(2)}</div>
              <div className="text-sm text-white/90 mt-1">ROI: +{profitPercentage}%</div>
            </div>
          )}
          {bet.status === "LOST" && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-right">
              <div className="text-sm text-white/90 mb-1">Pérdida</div>
              <div className="text-3xl sm:text-4xl font-bold">-${bet.amount.toFixed(2)}</div>
              <div className="text-sm text-white/90 mt-1">ROI: -100%</div>
            </div>
          )}
          {bet.status === "PENDING" && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-right">
              <div className="text-sm text-white/90 mb-1">Ganancia Potencial</div>
              <div className="text-3xl sm:text-4xl font-bold">${potentialWin.toFixed(2)}</div>
              <div className="text-sm text-white/90 mt-1">Si ganas: +{profitPercentage}%</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Evento */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase mb-3">
                  <Activity className="w-3 h-3" />
                  <span>{bet.event.league}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {bet.event.homeTeam}{" "}
                  <span className="text-gray-400">vs</span>{" "}
                  {bet.event.awayTeam}
                </h1>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(bet.event.startTime)}</span>
                </div>
              </div>
              {isHighOdds && (
                <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Alta Cuota</span>
                </div>
              )}
            </div>

            {/* Tu Apuesta */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-200">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-900 uppercase">Tu Selección</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {getSelectionLabel(bet.selection)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {bet.selection === "1" && bet.event.homeTeam}
                    {bet.selection === "X" && "Ningún equipo gana"}
                    {bet.selection === "2" && bet.event.awayTeam}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Cuota</div>
                  <div className="text-3xl font-bold text-emerald-600">{bet.odds.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Todas las Cuotas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gray-700" />
              <span>Mercado de Apuestas</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className={`p-5 rounded-xl border-2 transition-all hover:scale-105 ${
                  bet.selection === "1"
                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600 font-medium">Local</div>
                  {bet.selection === "1" && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
                <div className="text-sm text-gray-700 mb-2 font-medium truncate">{bet.event.homeTeam}</div>
                <div className="text-2xl font-bold text-gray-900">{bet.event.odds.home.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Prob: {((1 / bet.event.odds.home) * 100).toFixed(0)}%
                </div>
              </div>
              <div
                className={`p-5 rounded-xl border-2 transition-all hover:scale-105 ${
                  bet.selection === "X"
                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600 font-medium">Empate</div>
                  {bet.selection === "X" && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
                <div className="text-sm text-gray-700 mb-2 font-medium">Ningún ganador</div>
                <div className="text-2xl font-bold text-gray-900">{bet.event.odds.draw.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Prob: {((1 / bet.event.odds.draw) * 100).toFixed(0)}%
                </div>
              </div>
              <div
                className={`p-5 rounded-xl border-2 transition-all hover:scale-105 ${
                  bet.selection === "2"
                    ? "border-emerald-500 bg-emerald-50 shadow-md"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600 font-medium">Visitante</div>
                  {bet.selection === "2" && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
                <div className="text-sm text-gray-700 mb-2 font-medium truncate">{bet.event.awayTeam}</div>
                <div className="text-2xl font-bold text-gray-900">{bet.event.odds.away.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Prob: {((1 / bet.event.odds.away) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Análisis Adicional */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-gray-700" />
              <span>Análisis de la Apuesta</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-900 font-medium">Probabilidad Implícita</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{impliedProbability}%</div>
                <div className="text-xs text-blue-700 mt-1">De ganar según la cuota</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-900 font-medium">Multiplicador</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{bet.odds.toFixed(2)}x</div>
                <div className="text-xs text-purple-700 mt-1">Tu dinero se multiplica</div>
              </div>
              <div className={`rounded-lg p-4 border ${bet.status === "WON" ? "bg-green-50 border-green-200" : bet.status === "LOST" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {bet.status === "WON" && <TrendingUp className="w-4 h-4 text-green-600" />}
                  {bet.status === "LOST" && <TrendingDown className="w-4 h-4 text-red-600" />}
                  {bet.status === "PENDING" && <Clock className="w-4 h-4 text-amber-600" />}
                  <span className={`text-xs font-medium ${bet.status === "WON" ? "text-green-900" : bet.status === "LOST" ? "text-red-900" : "text-amber-900"}`}>
                    {bet.status === "WON" ? "Ganancia Real" : bet.status === "LOST" ? "Pérdida" : "Ganancia Potencial"}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${bet.status === "WON" ? "text-green-600" : bet.status === "LOST" ? "text-red-600" : "text-amber-600"}`}>
                  {bet.status === "WON" && `+$${profit.toFixed(2)}`}
                  {bet.status === "LOST" && `-$${bet.amount.toFixed(2)}`}
                  {bet.status === "PENDING" && `$${potentialWin.toFixed(2)}`}
                </div>
                <div className={`text-xs mt-1 ${bet.status === "WON" ? "text-green-700" : bet.status === "LOST" ? "text-red-700" : "text-amber-700"}`}>
                  {bet.status === "WON" && `ROI: +${profitPercentage}%`}
                  {bet.status === "LOST" && "ROI: -100%"}
                  {bet.status === "PENDING" && `Si ganas: +${profitPercentage}%`}
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs text-indigo-900 font-medium">Tipo de Apuesta</span>
                </div>
                <div className="text-xl font-bold text-indigo-600">
                  {isHighOdds ? "Alta" : "Segura"}
                </div>
                <div className="text-xs text-indigo-700 mt-1">
                  {isHighOdds ? "Mayor riesgo/recompensa" : "Menor riesgo"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Lateral - Resumen */}
        <div className="space-y-6">
          {/* Resumen Financiero */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-700" />
              <span>Resumen</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Monto Apostado</span>
                <span className="text-lg font-bold text-gray-900">${bet.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Cuota</span>
                <span className="text-lg font-bold text-emerald-600">{bet.odds.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Posible Retorno</span>
                <span className="text-lg font-bold text-gray-900">${potentialWin.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-gray-900">Beneficio Neto</span>
                <span className={`text-xl font-bold ${bet.status === "WON" ? "text-green-600" : bet.status === "LOST" ? "text-red-600" : "text-amber-600"}`}>
                  {bet.status === "WON" && `+$${profit.toFixed(2)}`}
                  {bet.status === "LOST" && `-$${bet.amount.toFixed(2)}`}
                  {bet.status === "PENDING" && `+$${profit.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Estado y Fechas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-700" />
              <span>Información</span>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Estado</div>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  bet.status === "WON" ? "bg-green-100 text-green-700" :
                  bet.status === "LOST" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {bet.status === "WON" && <Trophy className="w-4 h-4" />}
                  {bet.status === "LOST" && <XCircle className="w-4 h-4" />}
                  {bet.status === "PENDING" && <Clock className="w-4 h-4" />}
                  <span>
                    {bet.status === "WON" && "Ganada"}
                    {bet.status === "LOST" && "Perdida"}
                    {bet.status === "PENDING" && "Pendiente"}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Apuesta realizada</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(bet.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Evento inicia</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(bet.event.startTime)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">ID de Apuesta</div>
                <div className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  {bet.id}
                </div>
              </div>
            </div>
          </div>

          {/* Consejos o Info */}
          <div className={`rounded-2xl shadow-sm border p-6 ${
            bet.status === "PENDING" ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200" :
            bet.status === "WON" ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" :
            "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
          }`}>
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                bet.status === "PENDING" ? "bg-amber-200" :
                bet.status === "WON" ? "bg-green-200" :
                "bg-red-200"
              }`}>
                {bet.status === "PENDING" && <Zap className="w-5 h-5 text-amber-700" />}
                {bet.status === "WON" && <Trophy className="w-5 h-5 text-green-700" />}
                {bet.status === "LOST" && <Target className="w-5 h-5 text-red-700" />}
              </div>
              <div>
                <h4 className={`font-bold mb-1 ${
                  bet.status === "PENDING" ? "text-amber-900" :
                  bet.status === "WON" ? "text-green-900" :
                  "text-red-900"
                }`}>
                  {bet.status === "PENDING" && "¡Suerte!"}
                  {bet.status === "WON" && "¡Felicitaciones!"}
                  {bet.status === "LOST" && "Sigue Intentando"}
                </h4>
                <p className={`text-sm ${
                  bet.status === "PENDING" ? "text-amber-800" :
                  bet.status === "WON" ? "text-green-800" :
                  "text-red-800"
                }`}>
                  {bet.status === "PENDING" && "Tu apuesta está en juego. El resultado se determinará cuando finalice el evento."}
                  {bet.status === "WON" && `¡Acertaste! Has ganado $${profit.toFixed(2)} con una rentabilidad del ${profitPercentage}%.`}
                  {bet.status === "LOST" && "No acertaste esta vez, pero cada apuesta es una oportunidad de aprender."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <Suspense fallback={<Loading />}>
          <BetDetails id={id} />
        </Suspense>
      </main>
    </div>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
