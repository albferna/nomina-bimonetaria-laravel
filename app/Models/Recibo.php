<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recibo extends Model
{
    use HasFactory;

    protected $fillable = [
        'empleado_id',
        'tasa_bcv_aplicada',
        'salario_base_bs',
        'cestaticket_bs',
        'sso_bs',
        'rpe_bs',
        'faov_bs',
        'total_neto_pagar_bs',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }
}