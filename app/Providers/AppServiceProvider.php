<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- 1. Importamos la herramienta URL

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 2. Le decimos a Laravel que si está en Render, use HTTPS para todo
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}