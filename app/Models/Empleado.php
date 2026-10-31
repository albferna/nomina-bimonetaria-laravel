<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'cedula',
        'fecha_ingreso',
        'salario_base_usd',
        'cestaticket_usd',
    ];

    public function recibos()
    {
        return $this->hasMany(Recibo::class);
    }
}