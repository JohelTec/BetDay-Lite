"use client";

import { Bet } from "@/lib/types";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

interface BetCardProps {
  bet: Bet;
}

export default function BetCard({ bet }: BetCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "WON":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-lg shadow-green-500/30";
      case "LOST":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400 shadow-lg shadow-red-500/30";
      default:
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-400 shadow-lg shadow-amber-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "WON":
        return "GANADA";
      case "LOST":
        return "PERDIDA";
      case "PENDING":
        return "PENDIENTE";
      default:
        return status;
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link href={`/bets/${bet.id}`}>
      <div className="bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-200 cursor-pointer hover:-translate-y-2 hover:border-green-300 group relative">
        {/* Status Badge - Absolute positioning on top right */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black border-2 ${getStatusColor(
              bet.status
            )} group-hover:scale-110 transition-all duration-300`}
          >
            {getStatusLabel(bet.status)}
          </span>
        </div>

        {/* Header con Liga */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-3 sm:px-5 sm:py-4 border-b-2 border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg">🏆</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider truncate">
              {bet.event.league}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          <div className="mb-3 sm:mb-4 pr-16 sm:pr-20">
            <h3 className="font-black text-gray-900 text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-green-600 transition-colors duration-300 leading-tight">
              {bet.event.homeTeam} <span className="text-gray-400 font-bold">vs</span>{" "}
              {bet.event.awayTeam}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                <Calendar className="w-3 h-3" />
                <span className="font-semibold text-[10px] sm:text-xs">{formatDate(bet.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-dashed border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1 sm:mb-2">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase">Selección</span>
              </div>
              <p className="font-black text-xs sm:text-sm text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {getSelectionLabel(bet.selection)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase">Cuota</span>
              </div>
              <p className="font-black text-base sm:text-lg text-green-600 group-hover:scale-110 transition-transform duration-300">
                {bet.odds.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1 sm:mb-2">
                <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" />
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase">Apuesta</span>
              </div>
              <p className="font-black text-xs sm:text-sm text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                ${bet.amount.toFixed(2)}
              </p>
            </div>
          </div>

          {bet.status === "WON" && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-dashed border-gray-200">
              <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 border-2 border-green-200 group-hover:border-green-400 transition-all duration-300">
                <span className="text-[10px] sm:text-xs font-black text-green-700 uppercase tracking-wider">
                  Ganancia:
                </span>
                <span className="text-base sm:text-xl font-black text-green-700 group-hover:scale-110 transition-transform duration-300">
                  ${(bet.amount * bet.odds).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
