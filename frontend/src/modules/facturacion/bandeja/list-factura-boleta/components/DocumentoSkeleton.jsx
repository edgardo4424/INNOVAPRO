// components/InvoiceSkeleton.jsx
import React from "react";

const Bar = ({ className = "" }) => (
    <div className={`h-4 bg-gray-200 rounded ${className}`} />
);

export default function DocumentoSkeleton({ rows = 1 }) {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
        >
            <div className=" space-y-6">
                {/* HEADER */}
                <div className="rounded-xl border border-gray-200 bg-white">
                    <div className="px-6 py-6 md:py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Bar className="h-6 w-60 mb-3" />
                            <Bar className="w-40 mb-2" />
                            <Bar className="w-96" />
                        </div>
                        <div className="md:text-right">
                            <Bar className="ml-auto w-56 mb-3" />
                            <Bar className="ml-auto h-6 w-40 mb-4" />
                            <Bar className="ml-auto w-64" />
                        </div>
                    </div>
                </div>

                {/* CLIENTE + PAGO */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Bar className="w-28 mb-4" />
                        <div className="space-y-2">
                            <Bar className="w-64" />
                            <Bar className="w-72" />
                            <Bar className="w-44" />
                            <Bar className="w-52" />
                        </div>
                    </div>
                    <div>
                        <Bar className="w-40 mb-4" />
                        <div className="space-y-2">
                            <Bar className="w-28" />
                            <Bar className="w-32" />
                            <Bar className="w-36" />
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                    <div className="bg-gray-100 grid grid-cols-12 px-6 py-3">
                        <Bar className="col-span-2 h-3" />
                        <Bar className="col-span-5 h-3 ml-3" />
                        <Bar className="col-span-2 h-3 ml-3" />
                        <Bar className="col-span-1 h-3 ml-3" />
                        <Bar className="col-span-2 h-3 ml-3" />
                    </div>

                    <div className="divide-y divide-gray-200">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-12 px-6 py-4 items-center"
                            >
                                <Bar className="col-span-2 w-24" />
                                <Bar className="col-span-5 w-72 ml-3" />
                                <Bar className="col-span-2 w-24 ml-3" />
                                <Bar className="col-span-1 w-12 ml-3" />
                                <Bar className="col-span-2 w-24 ml-3" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* LEYENDA + TOTALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-2">
                        <Bar className="w-24" />
                        <Bar className="w-full" />
                        <Bar className="w-5/6" />
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
                        <div className="flex justify-between">
                            <Bar className="w-24" />
                            <Bar className="w-28" />
                        </div>
                        <div className="flex justify-between">
                            <Bar className="w-16" />
                            <Bar className="w-28" />
                        </div>
                        <div className="pt-3 mt-2 border-t flex justify-between">
                            <Bar className="w-28" />
                            <Bar className="w-32" />
                        </div>
                    </div>
                </div>

                {/* NOTA */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-2">
                    <Bar className="w-16" />
                    <Bar className="w-full" />
                    <Bar className="w-4/5" />
                </div>
            </div>

            <span className="sr-only">Cargando documento…</span>
        </div>
    );
}
