import React, { useState } from "react";
import ContentPedidosTv from "../components/content/ContentPedidosTv";
import { Maximize2, X } from "lucide-react";

const PedidosTv = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullScreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
    } catch (err) {
      console.warn("⚠️ No se pudo activar pantalla completa:", err);
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      else if (document.msExitFullscreen) await document.msExitFullscreen();
    } catch (err) {
      console.warn("⚠️ No se pudo salir de pantalla completa:", err);
    }
  };

  const handleOpenTv = async () => {
    await enterFullScreen();
    setIsFullScreen(true);
  };

  const handleCloseTv = async () => {
    await exitFullScreen();
    setIsFullScreen(false);
  };

  return (
    <div className="relative flex min-h-[95dvh] w-full flex-col items-center bg-[#12213d] py-6 md:px-8">
      {/* Header principal */}
      <div className="w-full flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold !text-slate-100 md:text-3xl font-sans tracking-wide">
          Pase de Pedidos
        </h2>

        {/* Botón para activar modo TV */}
        <button
          onClick={handleOpenTv}
          className="flex items-center justify-center rounded-full bg-blue-600 p-2 hover:bg-blue-700 active:scale-95 transition-transform duration-150 shadow-md"
          title="Ver en pantalla completa"
        >
          <Maximize2 className="text-white w-5 h-5" />
        </button>
      </div>

      {/* Contenido normal */}
      <div className="w-full flex flex-1 justify-center">
        <ContentPedidosTv />
      </div>

      {/* Overlay de pantalla completa */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[9999] flex flex-col h-screen bg-gradient-to-b from-[#0a0f1a] via-[#111827] to-[#1e293b] text-white animate-fadeIn">
          {/* Botón salir */}
          <div className="absolute top-4 right-4 z-[10000]">
            <button
              onClick={handleCloseTv}
              className="rounded-full bg-red-600 p-3 hover:bg-red-700 active:scale-95 transition-transform duration-150 shadow-lg"
              title="Salir de pantalla completa"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Contenido TV ocupa todo el alto */}
          <div className="flex-1 flex items-top justify-center overflow-auto p-6">
            <ContentPedidosTv />
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosTv;
