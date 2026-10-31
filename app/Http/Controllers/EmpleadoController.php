<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- AJUSTE 1: Importamos la librería correctamente aquí arriba

class EmpleadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $empleados = Empleado::orderBy('created_at', 'desc')->get();
        
        // <-- AJUSTE 2: Ahora usamos Inertia de forma limpia y directa
        return Inertia::render('Empleados/Index', [
            'empleados' => $empleados
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'cedula' => 'required|string|unique:empleados,cedula|max:20',
            'fecha_ingreso' => 'required|date',
            'salario_base_usd' => 'required|numeric|min:0',
            'cestaticket_usd' => 'required|numeric|min:0',
        ]);

        Empleado::create($request->all());

        return redirect()->back()->with('message', 'Empleado creado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Empleado $empleado)
    {
        $empleado->delete();
        
        return redirect()->back()->with('message', 'Empleado eliminado exitosamente');
    }
}