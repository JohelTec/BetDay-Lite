"use client";

import { toast } from "sonner";

export default function TestToast() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold mb-4">Prueba de Toasts</h1>
        
        <button
          onClick={() => toast.success("¡Toast de éxito!", { description: "Esto es un mensaje de éxito" })}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Toast Verde (Éxito)
        </button>
        
        <button
          onClick={() => toast.error("Error en el sistema", { description: "Esto es un mensaje de error" })}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Toast Rojo (Error)
        </button>
        
        <button
          onClick={() => toast.info("Información", { description: "Esto es un mensaje informativo" })}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Toast Azul (Info)
        </button>
        
        <button
          onClick={() => toast.warning("Advertencia", { description: "Esto es una advertencia" })}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Toast Amarillo (Warning)
        </button>

        <div className="mt-8 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            Si no ves los toasts al hacer clic, hay un problema con la configuración de Sonner.
          </p>
        </div>
      </div>
    </div>
  );
}
