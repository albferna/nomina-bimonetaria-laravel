import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, recibos }) {
    // Calculamos los KPIs matemáticos con JavaScript
    const totalPagadoBs = recibos.reduce((acc, recibo) => acc + parseFloat(recibo.total_neto_pagar_bs), 0);
    const totalRecibos = recibos.length;

    // Función nativa para imprimir/guardar PDF
    const handleImprimir = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Reportes y Cierre de Nómina</h2>
                    <button 
                        onClick={handleImprimir}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded transition shadow flex items-center gap-2"
                    >
                        🖨️ Exportar / Imprimir
                    </button>
                </div>
            }
        >
            <Head title="Reportes de Nómina" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tarjetas de KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Recibos Emitidos</p>
                            <p className="text-4xl font-black text-gray-800">{totalRecibos}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Nómina Total Pagada (Neto)</p>
                            <p className="text-4xl font-black text-gray-800 font-mono">
                                Bs. {totalPagadoBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    {/* Tabla de Historial */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tasa BCV</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Deducciones</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Neto Pagado</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recibos.map((recibo) => {
                                        const deducciones = parseFloat(recibo.sso_bs) + parseFloat(recibo.rpe_bs) + parseFloat(recibo.faov_bs);
                                        return (
                                            <tr key={recibo.id} className="hover:bg-gray-50 transition text-sm">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {new Date(recibo.created_at).toLocaleDateString('es-VE')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-800">{recibo.empleado.nombre}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{recibo.empleado.cedula}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center font-mono text-gray-600 bg-gray-50">
                                                    {recibo.tasa_bcv_aplicada}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-red-600 font-mono">
                                                    - {deducciones.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-black text-blue-700 font-mono text-base">
                                                    {parseFloat(recibo.total_neto_pagar_bs).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {recibos.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay historial de recibos.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}