const TablaSkeleton = ({ rows = 10 }) => {
    // Crear array de filas skeleton
    const skeletonRows = Array(Number(rows)).fill(null);

    return (
        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead className=" bg-innova-blue text-white">
                <tr>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"></th>
                </tr>
            </thead>
            <tbody>
                {skeletonRows.map((_, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}>
                        {/* ID */}
                        <td className=" py-3 px-6">
                            <div className="h-4 bg-gray-300 rounded w-8 shadow-gray-300"></div>
                        </td>

                        {/* Tipo Doc */}
                        <td className=" py-3 px-6">
                            <div className="h-4 bg-gray-300 rounded w-16 shadow-gray-300"></div>
                        </td>

                        {/* Serie-Correlativo */}
                        <td className=" py-3 px-6">
                            <div className="h-4 bg-gray-300 rounded w-20 shadow-gray-300"></div>
                        </td>

                        {/* Fecha Emisión */}
                        <td className=" py-3 px-6">
                            <div className="h-4 bg-gray-300 rounded w-24 shadow-gray-300"></div>
                        </td>

                        {/* Empresa RUC */}
                        <td className=" py-3 px-6">
                            <div className="h-4 bg-gray-300 rounded w-28 shadow-gray-300"></div>
                        </td>

                        {/* Nro. Doc - Cliente */}
                        <td className=" py-3 px-2">
                            <div className="flex flex-col gap-1">
                                <div className="h-3 bg-gray-300 rounded w-20 shadow-gray-300"></div>
                                <div className="h-3 bg-gray-300 rounded w-32 shadow-gray-300"></div>
                            </div>
                        </td>

                        {/* Estado */}
                        <td className=" py-3">
                            <div className="h-6 bg-gray-300 rounded-full w-20 shadow-gray-300"></div>
                        </td>

                        {/* Acciones */}
                        <td className=" py-3 px-6">
                            <div className="flex justify-start gap-x-2">
                                <div className="h-5 w-5 bg-gray-300 rounded shadow-gray-300"></div>
                                <div className="h-5 w-5 bg-gray-300 rounded shadow-gray-300"></div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TablaSkeleton;
