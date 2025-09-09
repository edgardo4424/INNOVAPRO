import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Paginacion = ({ currentPage, totalPages, totalRecords, limit, onPageChange }) => {
    const handlePrevPage = () => {
        onPageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        onPageChange(currentPage + 1);
    };

    const getPages = () => {
        const pages = [];
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            // Si hay pocas páginas, renderiza todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Renderiza el inicio
            if (currentPage - half > 1) {
                pages.push(1);
                if (currentPage - half > 2) {
                    pages.push('...');
                }
            }

            // Renderiza el rango alrededor de la página actual
            let start = Math.max(1, currentPage - half);
            let end = Math.min(totalPages, currentPage + half);

            if (currentPage <= half) {
                end = maxPagesToShow;
            } else if (currentPage + half >= totalPages) {
                start = totalPages - maxPagesToShow + 1;
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Renderiza el final
            if (currentPage + half < totalPages) {
                if (currentPage + half < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pagesToRender = getPages();

    return (
        <div className="flex items-center justify-between py-4 mt-4">
            <div className="flex items-center text-sm text-gray-700">
                Mostrando {totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1} -{" "}
                {Math.min(currentPage * limit, totalRecords)} de {totalRecords} registros
            </div>
            <div className="flex items-center gap-x-2">
                <button
                    className="py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-x-1">
                    {pagesToRender.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="py-2 px-4 text-gray-700">...</span>
                            ) : (
                                <button
                                    className={`py-2 px-4 rounded-md shadow-sm cursor-pointer ${currentPage === page ? "bg-innova-blue text-white" : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <button
                    className="py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Paginacion;