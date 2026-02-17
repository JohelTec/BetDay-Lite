"use client";

import { Event } from "@/lib/types";
import { Clock, TrendingUp, Users, ChevronDown, Calculator, Percent, TrendingDown, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  isAuthenticated: boolean;
}

export default function EventCard({ event, isAuthenticated }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [betAmount, setBetAmount] = useState<string>("10");
  const router = useRouter();

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getTimeUntilMatch = (date: Date) => {
    const now = new Date();
    const matchTime = new Date(date);
    const diff = matchTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 0) return "En vivo";
    if (hours === 0) return `En ${minutes}m`;
    if (hours < 24) return `En ${hours}h ${minutes}m`;
    return `En ${Math.floor(hours / 24)}d`;
  };

  const getPopularity = () => {
    // Simulación de popularidad basada en las cuotas
    const avgOdds = (event.odds.home + event.odds.draw + event.odds.away) / 3;
    if (avgOdds < 2.5) return { level: "Alta", icon: "🔥", bets: "250+" };
    if (avgOdds < 3.5) return { level: "Media", icon: "📊", bets: "150+" };
    return { level: "Baja", icon: "📈", bets: "50+" };
  };

  const getBestValue = () => {
    const odds = [
      { type: "Local", value: event.odds.home },
      { type: "Empate", value: event.odds.draw },
      { type: "Visitante", value: event.odds.away }
    ];
    const best = odds.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    return best;
  };

  // Calcular probabilidades implícitas
  const getImpliedProbability = (odds: number) => {
    return ((1 / odds) * 100).toFixed(1);
  };

  // Calcular margen de la casa
  const getBookmakerMargin = () => {
    const totalProb = (1 / event.odds.home) + (1 / event.odds.draw) + (1 / event.odds.away);
    return ((totalProb - 1) * 100).toFixed(1);
  };

  // Calcular potencial de retorno por el monto apostado
  const getPotentialReturn = (odds: number) => {
    const amount = parseFloat(betAmount) || 0;
    return (amount * odds).toFixed(2);
  };

  // Determinar si es alta o baja probabilidad
  const getProbabilityLevel = (odds: number) => {
    const prob = parseFloat(getImpliedProbability(odds));
    if (prob >= 50) return { level: "Alta", color: "green" };
    if (prob >= 30) return { level: "Media", color: "amber" };
    return { level: "Baja", color: "red" };
  };

  // Calcular valor esperado simple
  const getExpectedValue = () => {
    const homeProb = 1 / event.odds.home;
    const drawProb = 1 / event.odds.draw;
    const awayProb = 1 / event.odds.away;
    
    // Normalizar probabilidades (eliminar margen)
    const total = homeProb + drawProb + awayProb;
    const normalizedHome = (homeProb / total * 100).toFixed(1);
    const normalizedDraw = (drawProb / total * 100).toFixed(1);
    const normalizedAway = (awayProb / total * 100).toFixed(1);
    
    return { home: normalizedHome, draw: normalizedDraw, away: normalizedAway };
  };

  const handleBet = async (selection: "1" | "X" | "2", odds: number) => {
    if (!isAuthenticated) {
      toast.error("Por favor inicia sesión para apostar");
      return;
    }

    // Validar que el monto sea válido
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Por favor ingresa un monto válido");
      return;
    }

    if (amount < 0.01) {
      toast.error("El monto mínimo es $0.01");
      return;
    }

    if (amount > 10000) {
      toast.error("El monto máximo es $10,000");
      return;
    }

    setLoading(true);
    setSelectedOption(selection);

    try {
      const response = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          selection,
          amount: amount,
        }),
      });

      if (response.ok) {
        const bet = await response.json();
        setShowSuccess(true);
        toast.success(`¡Apuesta realizada! ${selection} @ ${odds.toFixed(2)}`, {
          description: `${event.homeTeam} vs ${event.awayTeam} - $${amount.toFixed(2)}`,
          duration: 3000,
        });
        
        console.log("✅ Apuesta creada exitosamente:", bet);
        
        // Refrescar los datos del router
        router.refresh();
        
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        const errorData = await response.json();
        console.error("❌ Error al crear apuesta:", errorData);
        toast.error(errorData.error || "Error al realizar la apuesta");
      }
    } catch (error) {
      console.error("❌ Error en handleBet:", error);
      toast.error("Ocurrió un error");
    } finally {
      setLoading(false);
      setTimeout(() => setSelectedOption(null), 1000);
    }
  };

  const getTeamInitial = (teamName: string) => {
    return teamName.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gradient-to-br from-white via-white to-gray-50/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 relative hover:-translate-y-2 hover:border-blue-300 group animate-fade-in-up focus-within:ring-4 focus-within:ring-blue-200">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-green-500/90 z-50 flex items-center justify-center animate-fade-in backdrop-blur-sm">
          <div className="text-center animate-bounce-slow">
            <div className="text-6xl mb-3">✅</div>
            <p className="text-white font-black text-2xl">¡Apuesta Registrada!</p>
          </div>
        </div>
      )}
      {/* Header con Liga, Hora y Popularidad */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-gray-50/80 to-gray-100/50 border-b border-gray-200/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Liga */}
          <div className="flex items-center space-x-2.5 bg-white/80 px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50 hover:scale-105 transition-transform duration-300">
            <span className="text-lg animate-float">🏆</span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {event.league}
            </span>
          </div>

          {/* Hora y Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center space-x-2 bg-white/80 px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50 hover:scale-105 transition-transform duration-300">
              <Clock className="w-3.5 h-3.5 text-blue-500 group-hover:animate-spin-slow" />
              <span className="text-sm font-bold text-gray-700">{formatTime(event.startTime)}</span>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full shadow-sm border-2 border-white text-[10px] font-black uppercase tracking-wider animate-pulse">
              {getTimeUntilMatch(event.startTime)}
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-orange-500/50 flex items-center space-x-1 animate-bounce-slow">
              <span>{getPopularity().icon}</span>
              <span>{getPopularity().level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center space-x-1.5 text-gray-600">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold">{getPopularity().bets}</span>
            <span className="text-gray-400">apuestas activas</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-600">
            <Percent className="w-3.5 h-3.5 text-purple-500" />
            <span className="font-semibold">Margen:</span>
            <span className="font-bold text-purple-700">{getBookmakerMargin()}%</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-600">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span className="font-semibold">Mejor:</span>
            <span className="font-bold text-green-700">{getBestValue().type} @ {getBestValue().value.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Equipos */}
      <div className="p-6 pb-4">
        <div className="space-y-4 mb-6 bg-gradient-to-br from-gray-50/30 to-transparent rounded-xl p-4">
          {/* Equipo Local */}
          <div className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform duration-300">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/40 group-hover:shadow-xl group-hover:shadow-blue-500/60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-2 ring-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                {getTeamInitial(event.homeTeam)}
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse-slow shadow-md shadow-blue-500/50"></div>
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors hover:animate-wiggle">{event.homeTeam}</div>
              <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide group-hover:animate-bounce-slow">Local</div>
            </div>
          </div>

          {/* VS */}
          <div className="flex justify-center py-1">
            <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 px-6 py-1.5 rounded-full shadow-sm border border-gray-300 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 animate-scale-pulse">
              <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">VS</span>
            </div>
          </div>

          {/* Equipo Visitante */}
          <div className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform duration-300">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/40 group-hover:shadow-xl group-hover:shadow-red-500/60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-2 ring-red-100 relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                {getTeamInitial(event.awayTeam)}
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse-slow shadow-md shadow-red-500/50"></div>
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors hover:animate-wiggle">{event.awayTeam}</div>
              <div className="text-xs text-red-600 font-semibold uppercase tracking-wide group-hover:animate-bounce-slow">Visitante</div>
            </div>
          </div>
        </div>

        {/* Mercado 1X2 */}
        <div className="pt-4 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center justify-center space-x-2 mb-4 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 py-2 px-4 rounded-xl border border-green-200 animate-slide-down group-hover:scale-105 transition-transform duration-300">
            <TrendingUp className="w-4 h-4 text-green-600 animate-bounce-slow" />
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">
              Mercado 1X2
            </span>
          </div>

          {/* Input para Monto de Apuesta */}
          <div className="mb-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 border-2 border-indigo-200 shadow-sm">
            <label htmlFor={`bet-amount-${event.id}`} className="block text-xs font-black text-gray-700 uppercase mb-2 text-center tracking-wider">
              💰 Monto a Apostar
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
              <input
                id={`bet-amount-${event.id}`}
                type="number"
                min="0.01"
                max="10000"
                step="0.01"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="10.00"
                className="w-full pl-8 pr-4 py-3 text-center text-2xl font-black text-gray-900 bg-white border-2 border-indigo-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none transition-all duration-300 hover:border-indigo-400 placeholder:text-gray-300"
              />
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <button
                onClick={() => setBetAmount("5")}
                className="px-3 py-1 text-xs font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                $5
              </button>
              <button
                onClick={() => setBetAmount("10")}
                className="px-3 py-1 text-xs font-bold bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
              >
                $10
              </button>
              <button
                onClick={() => setBetAmount("25")}
                className="px-3 py-1 text-xs font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                $25
              </button>
              <button
                onClick={() => setBetAmount("50")}
                className="px-3 py-1 text-xs font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                $50
              </button>
              <button
                onClick={() => setBetAmount("100")}
                className="px-3 py-1 text-xs font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                $100
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-500 font-medium mt-2">
              Mínimo: $0.01 • Máximo: $10,000.00
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleBet("1", event.odds.home)}
              disabled={loading}
              title={`Apostar al ${event.homeTeam} con cuota ${event.odds.home.toFixed(2)}`}
              style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
              className={`relative py-6 px-2 rounded-2xl font-semibold transition-all duration-300 border-2 transform hover:scale-110 active:scale-95 overflow-hidden animate-fade-in-up hover:-translate-y-1 focus:ring-4 focus:ring-blue-300 focus:outline-none ${
                selectedOption === "1"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/60 animate-pulse"
                  : "bg-gradient-to-br from-blue-50 to-sky-50 text-blue-700 border-blue-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-300/60"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-[9px] uppercase mb-2 font-black tracking-widest opacity-75">Local</div>
              <div className="text-3xl font-black group-hover:animate-bounce-slow">{event.odds.home.toFixed(2)}</div>
              <div className="text-[9px] text-blue-600 font-semibold mt-1">
                Gana: ${getPotentialReturn(event.odds.home)}
              </div>
              {selectedOption !== "1" && !loading && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-200/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
              {loading && selectedOption === "1" && (
                <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="w-7 h-7 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
            
            <button
              onClick={() => handleBet("X", event.odds.draw)}
              disabled={loading}
              title={`Apostar al empate con cuota ${event.odds.draw.toFixed(2)}`}
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
              className={`relative py-6 px-2 rounded-2xl font-semibold transition-all duration-300 border-2 transform hover:scale-110 active:scale-95 overflow-hidden animate-fade-in-up hover:-translate-y-1 focus:ring-4 focus:ring-amber-300 focus:outline-none ${
                selectedOption === "X"
                  ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-amber-600 shadow-xl shadow-amber-500/60 animate-pulse"
                  : "bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700 border-amber-300 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-300/60"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-[9px] uppercase mb-2 font-black tracking-widest opacity-75">Empate</div>
              <div className="text-3xl font-black group-hover:animate-bounce-slow">{event.odds.draw.toFixed(2)}</div>
              <div className="text-[9px] text-amber-600 font-semibold mt-1">
                Gana: ${getPotentialReturn(event.odds.draw)}
              </div>
              {selectedOption !== "X" && !loading && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-200/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
              {loading && selectedOption === "X" && (
                <div className="absolute inset-0 bg-amber-600/20 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="w-7 h-7 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
            
            <button
              onClick={() => handleBet("2", event.odds.away)}
              disabled={loading}
              title={`Apostar al ${event.awayTeam} con cuota ${event.odds.away.toFixed(2)}`}
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
              className={`relative py-6 px-2 rounded-2xl font-semibold transition-all duration-300 border-2 transform hover:scale-110 active:scale-95 overflow-hidden animate-fade-in-up hover:-translate-y-1 focus:ring-4 focus:ring-red-300 focus:outline-none ${
                selectedOption === "2"
                  ? "bg-gradient-to-br from-red-500 to-rose-600 text-white border-red-600 shadow-xl shadow-red-500/60 animate-pulse"
                  : "bg-gradient-to-br from-red-50 to-rose-50 text-red-700 border-red-300 hover:border-red-500 hover:shadow-xl hover:shadow-red-300/60"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-[9px] uppercase mb-2 font-black tracking-widest opacity-75">Visit.</div>
              <div className="text-3xl font-black group-hover:animate-bounce-slow">{event.odds.away.toFixed(2)}</div>
              <div className="text-[9px] text-red-600 font-semibold mt-1">
                Gana: ${getPotentialReturn(event.odds.away)}
              </div>
              {selectedOption !== "2" && !loading && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-red-200/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
              {loading && selectedOption === "2" && (
                <div className="absolute inset-0 bg-red-600/20 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="w-7 h-7 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Sección Expandible con Más Información */}
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
          <button
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 py-2 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg group/expand focus:ring-2 focus:ring-gray-300 focus:outline-none"
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              {showMoreInfo ? "Menos" : "Más"} Información
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-hover/expand:scale-110 ${showMoreInfo ? "rotate-180" : ""}`} />
          </button>

          {showMoreInfo && (
            <div className="mt-3 space-y-3 animate-slide-down">
              {/* Análisis de Probabilidades */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-200">
                <h4 className="text-xs font-black text-gray-700 uppercase mb-3 flex items-center space-x-1">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Análisis de Probabilidades</span>
                </h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-semibold">{event.homeTeam}</span>
                      <span className="font-black text-blue-600">{getExpectedValue().home}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" style={{ width: `${getExpectedValue().home}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-semibold">Empate</span>
                      <span className="font-black text-amber-600">{getExpectedValue().draw}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 h-full rounded-full" style={{ width: `${getExpectedValue().draw}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-semibold">{event.awayTeam}</span>
                      <span className="font-black text-red-600">{getExpectedValue().away}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" style={{ width: `${getExpectedValue().away}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Potencial de Retorno */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                <h4 className="text-xs font-black text-gray-700 uppercase mb-2 flex items-center space-x-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Retorno por ${(parseFloat(betAmount) || 0).toFixed(2)} Apostados</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 mb-1">Local</div>
                    <div className="text-lg font-black text-blue-600">${getPotentialReturn(event.odds.home)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 mb-1">Empate</div>
                    <div className="text-lg font-black text-amber-600">${getPotentialReturn(event.odds.draw)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 mb-1">Visitante</div>
                    <div className="text-lg font-black text-red-600">${getPotentialReturn(event.odds.away)}</div>
                  </div>
                </div>
              </div>

              {/* Comparación de Cuotas */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-3 text-center border border-blue-200">
                  <div className="text-xs text-gray-500 font-semibold mb-1">Cuota Local</div>
                  <div className="text-2xl font-black text-blue-600">{event.odds.home.toFixed(2)}</div>
                  <div className={`text-[9px] font-bold mt-1 text-${getProbabilityLevel(event.odds.home).color}-600`}>
                    {getProbabilityLevel(event.odds.home).level}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-3 text-center border border-amber-200">
                  <div className="text-xs text-gray-500 font-semibold mb-1">Cuota Empate</div>
                  <div className="text-2xl font-black text-amber-600">{event.odds.draw.toFixed(2)}</div>
                  <div className={`text-[9px] font-bold mt-1 text-${getProbabilityLevel(event.odds.draw).color}-600`}>
                    {getProbabilityLevel(event.odds.draw).level}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-3 text-center border border-red-200">
                  <div className="text-xs text-gray-500 font-semibold mb-1">Cuota Visit.</div>
                  <div className="text-2xl font-black text-red-600">{event.odds.away.toFixed(2)}</div>
                  <div className={`text-[9px] font-bold mt-1 text-${getProbabilityLevel(event.odds.away).color}-600`}>
                    {getProbabilityLevel(event.odds.away).level}
                  </div>
                </div>
              </div>

              {/* Info del Evento */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-3 border border-gray-200">
                <h4 className="text-xs font-black text-gray-700 uppercase mb-2 flex items-center space-x-1">
                  <span>ℹ️</span>
                  <span>Información del Evento</span>
                </h4>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold">Liga:</span>
                    <span>{event.league}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Hora de inicio:</span>
                    <span>{formatTime(event.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Tiempo restante:</span>
                    <span className="font-bold text-green-600">{getTimeUntilMatch(event.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Popularidad:</span>
                    <span>{getPopularity().icon} {getPopularity().level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Margen de la casa:</span>
                    <span className="font-bold text-purple-600">{getBookmakerMargin()}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
