import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginacionBorradores = ({ currentPage, totalPages, totalRecords, limit, onPageChange }) => {
    const handlePrevPage = () => {
        onPageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        onPageChange(currentPage + 1);
    };

    const pages = [...Array(totalPages).keys()];

    return (
        <div className="flex  items-center justify-between py-4 mt-4">
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
                    {pages.map(i => (
                        <button
                            key={i}
                            className={`py-2 px-4 rounded-md shadow-sm cursor-pointer ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => onPageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
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

export default PaginacionBorradores;