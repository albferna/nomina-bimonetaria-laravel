<?php
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReciboController; // <-- ¡AQUÍ ESTÁ LA LÍNEA VITAL QUE FALTABA!
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');
// Reemplazadas por el código de abajo

Route::get('/dashboard', function () {
    // Motor BCV en vivo (con caché de 1 hora)
    $tasaBcv = Cache::remember('tasa_bcv_dashboard', 3600, function () {
        try {
            $resp = Http::timeout(3)->get('https://ve.dolarapi.com/v1/dolares/oficial');
            if ($resp->successful()) {
                return $resp->json('promedio');
            }
        } catch (\Exception $e) {}
        return 42.50; // Tasa de contingencia
    });

    return Inertia::render('Dashboard', [
        'tasaBcv' => (float)$tasaBcv
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');



// Unificamos todas las rutas protegidas en un solo grupo limpio
Route::middleware('auth')->group(function () {
    // Módulo de Empleados
    Route::resource('empleados', EmpleadoController::class);
    
    // Módulo de Recibos Bimonetarios y Reportes
    Route::get('/recibos', [ReciboController::class, 'index'])->name('recibos.index');
    Route::post('/recibos', [ReciboController::class, 'store'])->name('recibos.store');
    Route::get('/reportes', [ReciboController::class, 'reportes'])->name('reportes.index');
    
    // Módulo de Perfil (Generado por Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';