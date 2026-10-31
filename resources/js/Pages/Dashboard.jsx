import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Control Central</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido al Sistema, {auth.user.name}!</h3>
                        <p className="text-gray-500 mb-8 text-lg">Selecciona un módulo para comenzar a operar el sistema de nómina bimonetaria.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Tarjeta Empleados */}
                            <Link href="/empleados" className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:bg-blue-100 hover:shadow-md transition-all block text-center group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                                <h4 className="text-xl font-bold text-blue-900">Gestión de Empleados</h4>
                                <p className="text-sm text-blue-700 mt-2">Registrar, editar y eliminar trabajadores del sistema LOTTT.</p>
                            </Link>
                            
                            {/* Tarjeta Recibos */}
                            <Link href="/recibos" className="bg-green-50 p-8 rounded-2xl border border-green-100 hover:bg-green-100 hover:shadow-md transition-all block text-center group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💵</div>
                                <h4 className="text-xl font-bold text-green-900">Emitir Recibos</h4>
                                <p className="text-sm text-green-700 mt-2">Simular y calcular la quincena obteniendo la tasa BCV actual.</p>
                            </Link>
                            
                            {/* Tarjeta Reportes */}
                            <Link href="/reportes" className="bg-purple-50 p-8 rounded-2xl border border-purple-100 hover:bg-purple-100 hover:shadow-md transition-all block text-center group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                                <h4 className="text-xl font-bold text-purple-900">Reportes de Nómina</h4>
                                <p className="text-sm text-purple-700 mt-2">Ver el historial de pagos, deducciones y exportar comprobantes.</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}