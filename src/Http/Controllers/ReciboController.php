<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use App\Models\Empleado;
use App\Models\Recibo;

class ReciboController extends Controller
{
    public function index()
    {
        $empleados = Empleado::all();
        
        $tasaBcv = Cache::remember('tasa_bcv', 3600, function () {
            try {
                $resp = Http::timeout(3)->get('https://ve.dolarapi.com/v1/dolares/oficial');
                if ($resp->successful()) {
                    return $resp->json('promedio');
                }
            } catch (\Exception $e) {
            }
            return 42.50;
        });
        
        return Inertia::render('Recibos/Index', [
            'empleados' => $empleados,
            'tasaBcv' => (float)$tasaBcv
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'empleado_id' => 'required|exists:empleados,id',
            'tasa_bcv_aplicada' => 'required|numeric|min:0',
            'salario_base_bs' => 'required|numeric|min:0',
            'cestaticket_bs' => 'required|numeric|min:0',
            'sso_bs' => 'required|numeric|min:0',
            'rpe_bs' => 'required|numeric|min:0',
            'faov_bs' => 'required|numeric|min:0',
            'total_neto_pagar_bs' => 'required|numeric|min:0',
        ]);

        Recibo::create($request->all());
        
        return redirect()->back();
    }

    public function reportes()
    {
        $recibos = Recibo::with('empleado')->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Reportes/Index', [
            'recibos' => $recibos
        ]);
    }
}