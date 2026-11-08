import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, tasaBcv }) {
    // Estados del Simulador
    const [nombre, setNombre] = useState('Carlos Mendoza');
    const [cedula, setCedula] = useState('V-18.452.910');
    const [salario, setSalario] = useState(100);
    const [cesta, setCesta] = useState(40);
    const [tasaLocal, setTasaLocal] = useState(tasaBcv);

    // Motor Matemático Reactivo (Quincenal)
    const salarioBs = (salario / 2) * tasaLocal;
    const cestaBs = (cesta / 2) * tasaLocal;
    const ssoBs = salarioBs * 0.04;
    const rpeBs = salarioBs * 0.005;
    const faovBs = salarioBs * 0.01;
    const totalDeducciones = ssoBs + rpeBs + faovBs;
    const netoBs = (salarioBs - totalDeducciones) + cestaBs;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Simulador BCV" />

            <div className="py-8 print:py-0 print:bg-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* BANNER BCV EN VIVO */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl shadow-xl p-6 mb-8 text-white flex flex-col md:flex-row justify-between items-center print:hidden">
                        <div>
                            <p className="text-blue-200 text-sm font-semibold tracking-wider mb-1">🔴 OFICIAL BCV EN VIVO | Fuente: DOLARAPI</p>
                            <h2 className="text-xl font-medium">TASA DE CAMBIO OFICIAL DEL DÍA (USD / VED)</h2>
                            <div className="flex items-end gap-3 mt-2">
                                <input 
                                    type="number" 
                                    step="0.01"
                                    className="bg-transparent border-b-2 border-white/50 text-5xl font-black w-48 outline-none focus:border-white transition-colors"
                                    value={tasaLocal}
                                    onChange={(e) => setTasaLocal(parseFloat(e.target.value) || 0)}
                                />
                                <span className="text-2xl font-light mb-2">Bs / USD</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 border border-white/30 px-6 py-2 rounded-lg backdrop-blur-sm transition-all flex items-center gap-2">
                                🔄 Actualizar Tasa
                            </button>
                        </div>
                    </div>

                    {/* DOS COLUMNAS: FORMULARIO Y RECIBO */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* COLUMNA IZQUIERDA: CONTROLES */}
                        <div className="lg:col-span-4 space-y-6 print:hidden">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                                    ⚙️ SIMULADOR INTERACTIVO
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Trabajador</label>
                                        <input type="text" className="w-full bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500" value={nombre} onChange={e => setNombre(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cédula de Identidad</label>
                                        <input type="text" className="w-full bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500" value={cedula} onChange={e => setCedula(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Salario Mensual (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                                            <input type="number" className="w-full bg-gray-50 border-0 rounded-lg pl-8 focus:ring-2 focus:ring-blue-500" value={salario} onChange={e => setSalario(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex justify-between">
                                            <span>Cestaticket (USD)</span>
                                            <span className="text-green-600 font-normal">Exento de Ley</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                                            <input type="number" className="w-full bg-gray-50 border-0 rounded-lg pl-8 focus:ring-2 focus:ring-blue-500" value={cesta} onChange={e => setCesta(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: EL RECIBO OFICIAL (Imprimible) */}
                        <div className="lg:col-span-8">
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 print:shadow-none print:border-none print:p-0">
                                
                                {/* Header del Recibo */}
                                <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight text-gray-900">INVERSIONES Y SERVICIOS DEMO, C.A.</h2>
                                        <p className="text-sm text-gray-600 font-mono">RIF: J-40012372-8</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-gray-800 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider inline-block">Recibo de Pago de Nómina</div>
                                        <p className="text-xs text-gray-500 mt-2 font-mono">Tasa Oficial BCV Aplicada: {tasaLocal} Bs/USD</p>
                                    </div>
                                </div>

                                {/* Datos del Trabajador en el Recibo */}
                                <div className="flex justify-between text-sm mb-8 bg-gray-50 p-4 border border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Trabajador</p>
                                        <p className="font-bold text-gray-900">{nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Cédula</p>
                                        <p className="font-bold text-gray-900 font-mono">{cedula}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase">Frecuencia</p>
                                        <p className="font-bold text-blue-800">QUINCENAL (15 DÍAS)</p>
                                    </div>
                                </div>

                                {/* Tabla Contable */}
                                <table className="w-full text-sm mb-6">
                                    <thead className="border-b-2 border-gray-300">
                                        <tr className="text-left text-gray-600 uppercase text-xs">
                                            <th className="py-2">Concepto</th>
                                            <th className="py-2 text-right">Base / Ref.</th>
                                            <th className="py-2 text-right text-blue-700">Equivalente (Bs)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Asignaciones */}
                                        <tr><td colSpan="3" className="py-2 font-bold text-xs bg-gray-100 px-2 mt-2">1. ASIGNACIONES (INGRESOS DEL TRABAJADOR)</td></tr>
                                        <tr className="border-b border-dashed border-gray-200">
                                            <td className="py-3 font-medium">Salario Básico Quincenal</td>
                                            <td className="py-3 text-right text-gray-500 font-mono">${(salario/2).toFixed(2)}</td>
                                            <td className="py-3 text-right font-mono font-medium">Bs. {salarioBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                        <tr className="border-b border-gray-300">
                                            <td className="py-3 font-medium">Cestaticket Socialista <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded ml-1">EXENTO</span></td>
                                            <td className="py-3 text-right text-gray-500 font-mono">${(cesta/2).toFixed(2)}</td>
                                            <td className="py-3 text-right font-mono font-medium text-green-700">Bs. {cestaBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="py-3 text-right font-bold text-xs uppercase">Subtotal Asignaciones:</td>
                                            <td className="py-3 text-right font-bold font-mono">Bs. {(salarioBs + cestaBs).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                                        </tr>

                                        {/* Deducciones */}
                                        <tr><td colSpan="3" className="py-2 font-bold text-xs bg-gray-100 px-2 mt-4">2. DEDUCCIONES DE LEY (APLICADAS EXCLUSIVAMENTE AL SALARIO BASE)</td></tr>
                                        <tr className="border-b border-dashed border-gray-200">
                                            <td className="py-3 text-gray-700">Seguro Social Obligatorio (S.S.O) - 4%</td>
                                            <td className="py-3 text-right text-gray-500 font-mono">4.0%</td>
                                            <td className="py-3 text-right font-mono text-red-600">- Bs. {ssoBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                        <tr className="border-b border-dashed border-gray-200">
                                            <td className="py-3 text-gray-700">Régimen Prestacional de Empleo (R.P.E) - 0.5%</td>
                                            <td className="py-3 text-right text-gray-500 font-mono">0.5%</td>
                                            <td className="py-3 text-right font-mono text-red-600">- Bs. {rpeBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                        <tr className="border-b border-gray-300">
                                            <td className="py-3 text-gray-700">F.A.O.V - 1%</td>
                                            <td className="py-3 text-right text-gray-500 font-mono">1.0%</td>
                                            <td className="py-3 text-right font-mono text-red-600">- Bs. {faovBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="py-3 text-right font-bold text-xs uppercase text-red-700">Subtotal Deducciones:</td>
                                            <td className="py-3 text-right font-bold font-mono text-red-700">- Bs. {totalDeducciones.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Total Neto */}
                                <div className="bg-gray-900 text-white p-4 flex justify-between items-center rounded-lg mt-4 shadow-inner">
                                    <span className="font-bold tracking-widest text-sm">TOTAL NETO A PAGAR AL TRABAJADOR:</span>
                                    <span className="font-black font-mono text-xl">Bs. {netoBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                                </div>

                                {/* Fundamento Legal */}
                                <div className="mt-8 text-[10px] text-gray-400 text-justify border-t border-gray-100 pt-4 leading-relaxed">
                                    <p>Fundamento Legal: Las deducciones de SSO (4%), RPE (0.5%) y FAOV (1%) se calcularon estrictamente sobre el Salario Base Imponible...</p>
                                </div>

                                {/* Firmas */}
                                <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm print:mt-32">
                                    <div className="border-t border-gray-400 pt-2"><p className="font-bold uppercase text-gray-700">El Empleador</p></div>
                                    <div className="border-t border-gray-400 pt-2"><p className="font-bold uppercase text-gray-700">El Trabajador ({nombre})</p></div>
                                </div>
                            </div>
                            
                            {/* BOTÓN DE EXPORTAR PDF (Oculto al imprimir) */}
                            <div className="mt-6 flex justify-end print:hidden">
                                <button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-3 transform hover:scale-105">
                                    🖨️ Exportar Recibo (PDF Oficial)
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            
            {/* ESTILO CSS GLOBAL PARA LA IMPRESIÓN */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body * { visibility: hidden; }
                    .print\\:hidden { display: none !important; }
                    .lg\\:col-span-8, .lg\\:col-span-8 * { visibility: visible; }
                    .lg\\:col-span-8 { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
                }
            `}} />
        </AuthenticatedLayout>
    );
}