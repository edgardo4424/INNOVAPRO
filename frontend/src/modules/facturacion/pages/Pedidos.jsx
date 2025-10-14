import React from 'react'
import ListaPedidos from '../por-emitir/list-pedidos/ListaPedidos'

const Pedidos = () => {
  return (
    <div className="flex w-full flex-col items-center py-6 md:px-8">
      <div className="w-full overflow-x-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">
            Lista de Pedidos
          </h2>
        </div>
        <ListaPedidos />
      </div>
    </div>
  )
}

export default Pedidos
