import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, empleados, tasaBcv }) {
    const [tasaLocal, setTasaLocal] = useState(tasaBcv);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [calculos, setCalculos] = useState(null);

    // Formulario de Inertia para guardar en BD
    const { data, setData, post, processing, reset } = useForm({
        empleado_id: '',
        tasa_bcv_aplicada: '',
        salario_base_bs: '',
        cestaticket_bs: '',
        sso_bs: '',
        rpe_bs: '',
        faov_bs: '',
        total_neto_pagar_bs: '',
    });

    // Motor Matemático LOTTT
    const handleCalcular = (empleado) => {
        const salarioBs = (empleado.salario_base_usd / 2) * tasaLocal;
        const cestaBs = (empleado.cestaticket_usd / 2) * tasaLocal;
        
        // Retenciones solo al salario base
        const ssoBs = salarioBs * 0.04;
        const rpeBs = salarioBs * 0.005;
        const faovBs = salarioBs * 0.01;
        const netoBs = (salarioBs - (ssoBs + rpeBs + faovBs)) + cestaBs;

        const calc = { salarioBs, cestaBs, ssoBs, rpeBs, faovBs, netoBs };
        setCalculos(calc);
        setSelectedEmp(empleado);
        
        // Pre-llenar el formulario de envío
        setData({
            empleado_id: empleado.id,
            tasa_bcv_aplicada: tasaLocal,
            salario_base_bs: salarioBs,
            cestaticket_bs: cestaBs,
            sso_bs: ssoBs,
            rpe_bs: rpeBs,
            faov_bs: faovBs,
            total_neto_pagar_bs: netoBs,
        });

        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/recibos', {
            onSuccess: () => {
                setShowModal(false);
                reset();
                alert('¡Recibo quincenal guardado exitosamente en la base de datos!');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Emisión de Recibos Bimonetarios</h2>}
        >
            <Head title="Emitir Recibos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tarjeta de Tasa BCV */}
                    <div className="bg-blue-900 text-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold">Tasa BCV del Día</h3>
                            <p className="text-blue-200 text-sm">Modifica si es necesario para la simulación</p>
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold bg-white/10 p-3 rounded-lg border border-white/20">
                            <span>Bs.</span>
                            <input 
                                type="number" 
                                step="0.01" 
                                className="bg-transparent border-b border-blue-300 focus:ring-0 focus:border-white w-28 text-center outline-none transition-colors"
                                value={tasaLocal}
                                onChange={(e) => setTasaLocal(parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {/* Tabla de Empleados con Desplazamiento Táctil Móvil */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900">
                            
                            {/* Indicador sutil para móviles */}
                            <p className="text-xs text-gray-400 mb-2 sm:hidden flex items-center gap-1">
                                👉 <span>Desliza hacia los lados para ver el botón de acción</span>
                            </p>

                            {/* CONTENEDOR CON DESPLAZAMIENTO HORIZONTAL HABILITADO */}
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="inline-block min-w-full align-middle">
                                    <table className="min-w-[620px] w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cédula</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salario USD</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {empleados.map((emp) => (
                                                <tr key={emp.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{emp.nombre}</td>
                                                    <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">{emp.cedula}</td>
                                                    <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">${parseFloat(emp.salario_base_usd).toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleCalcular(emp)}
                                                            className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-2.5 px-5 rounded-lg transition shadow-md"
                                                        >
                                                            Calcular Quincena
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {empleados.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                                        No hay empleados registrados.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Modal de Previsualización Contable */}
            {showModal && selectedEmp && calculos && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-0 w-full max-w-2xl shadow-2xl overflow-hidden">
                        
                        <div className="bg-gray-100 p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Recibo de Pago Quincenal</h3>
                                <p className="text-gray-500">Trabajador: <span className="font-bold text-gray-800">{selectedEmp.nombre}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase">Tasa Aplicada</p>
                                <p className="font-mono font-bold text-gray-800">{tasaLocal} Bs/USD</p>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-8 mb-6">
                                <div>
                                    <h4 className="font-bold text-green-700 border-b border-green-200 pb-2 mb-3">Asignaciones</h4>
                                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Salario Quincenal</span><span className="font-mono font-medium">Bs. {calculos.salarioBs.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm mb-2 text-green-700"><span className="font-medium">Cestaticket (Exento)</span><span className="font-mono font-medium">Bs. {calculos.cestaBs.toFixed(2)}</span></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-700 border-b border-red-200 pb-2 mb-3">Deducciones Legales</h4>
                                    <div className="flex justify-between text-sm mb-2 text-red-600"><span>S.S.O (4%)</span><span className="font-mono">- Bs. {calculos.ssoBs.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm mb-2 text-red-600"><span>R.P.E (0.5%)</span><span className="font-mono">- Bs. {calculos.rpeBs.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm mb-2 text-red-600"><span>F.A.O.V (1%)</span><span className="font-mono">- Bs. {calculos.faovBs.toFixed(2)}</span></div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100 mb-6">
                                <span className="font-bold text-blue-900 text-lg">Total a Pagar (Neto)</span>
                                <span className="font-mono text-2xl font-black text-blue-700">Bs. {calculos.netoBs.toFixed(2)}</span>
                            </div>

                            <form onSubmit={handleSubmit} className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition shadow disabled:opacity-50">
                                    {processing ? 'Guardando en BD...' : 'Confirmar y Guardar Recibo'}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}