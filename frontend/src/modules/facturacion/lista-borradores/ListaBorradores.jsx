import React, { useState } from 'react'

const ListaBorradores = () => {
  // --- Datos de factura falsos para la presentación ---
  const facturas = [
    {
      id: 'F001-0001',
      tipoDoc: 'Factura',
      fecha: '2024-07-10',
      cliente: 'Tienda La Esquina SAC',
      docCliente: '20123456789',
      monto: 1500.50,
      moneda: 'PEN',
      estado: 'Aceptada'
    },
    {
      id: 'B001-0005',
      tipoDoc: 'Boleta',
      fecha: '2024-07-10',
      cliente: 'Juan Pérez García',
      docCliente: '45678912',
      monto: 85.75,
      moneda: 'PEN',
      estado: 'Aceptada'
    },
    {
      id: 'F001-0002',
      tipoDoc: 'Factura',
      fecha: '2024-07-09',
      cliente: 'Distribuciones Alfa S.A.',
      docCliente: '20987654321',
      monto: 3200.00,
      moneda: 'USD',
      estado: 'Aceptada con Observación'
    },
    {
      id: 'B001-0006',
      tipoDoc: 'Boleta',
      fecha: '2024-07-08',
      cliente: 'María Fernanda Díaz',
      docCliente: '78912345',
      monto: 120.00,
      moneda: 'PEN',
      estado: 'Aceptada'
    },
    {
      id: 'F001-0003',
      tipoDoc: 'Factura',
      fecha: '2024-07-07',
      cliente: 'Tecno Soluciones SAC',
      docCliente: '20555555555',
      monto: 500.00,
      moneda: 'PEN',
      estado: 'Rechazada'
    },
    {
      id: 'NC01-0001',
      tipoDoc: 'Nota de Crédito',
      fecha: '2024-07-06',
      cliente: 'Cliente de Prueba S.A.C.',
      docCliente: '20111222333',
      monto: 250.00,
      moneda: 'PEN',
      estado: 'Aceptada'
    },
    {
      id: 'B001-0007',
      tipoDoc: 'Boleta',
      fecha: '2024-07-05',
      cliente: 'Carlos Gonzales',
      docCliente: '98765432',
      monto: 65.00,
      moneda: 'PEN',
      estado: 'Pendiente'
    },
  ];

  // --- Estados para los valores de los filtros (solo para controlar los inputs visualmente) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocType, setFilterDocType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // --- Opciones para los selectores ---
  const documentTypes = ['Todos', 'Factura', 'Boleta', 'Nota de Crédito', 'Nota de Débito'];
  const statuses = ['Todos', 'Aceptada', 'Aceptada con Observación', 'Rechazada', 'Pendiente'];

  return (
    <div className=" w-full flex flex-col items-center px-4 md:px-8 py-6">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6 ">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
            Lista de Borradores
          </h2>
        </div>
      </div>

      {/* --- Contenedor de Filtros --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8 p-6 bg-white rounded-xl shadow-md items-end border-2">
        <div className="flex flex-col">
          <label htmlFor="search" className="mb-2 font-semibold text-gray-600 text-sm">Buscar por ID/Cliente:</label>
          <input
            type="text"
            id="search"
            placeholder="Ej. F001-0001 o Juan Pérez"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="docType" className="mb-2 font-semibold text-gray-600 text-sm">Tipo de Documento:</label>
          <select
            id="docType"
            value={filterDocType}
            onChange={(e) => setFilterDocType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
          >
            {documentTypes.map(type => (
              <option key={type} value={type === 'Todos' ? '' : type}>{type}</option>
            ))}
          </select>
        </div>

        {/* <div className="flex flex-col">
          <label htmlFor="status" className="mb-2 font-semibold text-gray-600 text-sm">Estado SUNAT:</label>
          <select
            id="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
          >
            {statuses.map(status => (
              <option key={status} value={status === 'Todos' ? '' : status}>{status}</option>
            ))}
          </select>
        </div> */}

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-600 text-sm">Fecha Desde:</label>
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-600 text-sm">Fecha Hasta:</label>
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Botón para "Aplicar Filtros" (en una app real, esto activaría el filtrado) */}
        <button
          className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 mt-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => console.log('Aplicar filtros con:', { searchTerm, filterDocType, filterStatus, filterDateFrom, filterDateTo })}
        >
          Aplicar Filtros
        </button>
      </div>

      {/* --- Tabla de Facturas --- */}
      <div className="overflow-x-auto border-1 rounded-xl border-gray-300"> {/* Ensures table is scrollable on small screens */}
        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">ID Documento</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Tipo</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Fecha</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Empresa Ruc</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Cliente</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Doc. Cliente</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Valor Venta</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Sub Total</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Monto Imp. Venta</th>
              <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody>
            {/* {facturas.length > 0 ? (
              facturas.map((factura, index) => (
                <tr key={factura.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}>
                  <td className="py-3 px-6 text-sm text-gray-700">{factura.id}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{factura.tipoDoc}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{factura.fecha}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{factura.cliente}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{factura.docCliente}</td>
                  <td className="py-3 px-6 text-sm text-gray-700 font-medium">{`${factura.moneda} ${factura.monto.toFixed(2)}`}</td>
                  <td className={`py-3 px-6 text-sm font-semibold ${factura.estado === 'Aceptada' ? 'text-green-600' :
                    factura.estado === 'Rechazada' ? 'text-red-600' :
                      factura.estado === 'Aceptada con Observación' ? 'text-yellow-600' :
                        'text-gray-500' // For 'Pendiente' or others
                    }`}>
                    {factura.estado}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500 italic">
                  No hay facturas para mostrar.
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaBorradores