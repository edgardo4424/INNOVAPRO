export default function Paginacion({
    paginaActual,
    totalPaginas,
    onPaginarAnterior,
    onPaginarSiguiente,
  }) {
    return (
      <div className="pagination">
        <button disabled={paginaActual === 1} onClick={onPaginarAnterior}>
          ⬅ Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          disabled={paginaActual === totalPaginas}
          onClick={onPaginarSiguiente}
        >
          Siguiente ➡
        </button>
      </div>
    );
  }  