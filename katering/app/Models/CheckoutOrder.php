<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckoutOrder extends Model
{
    use HasFactory;

    // Menentukan tabel yang digunakan
    protected $table = 'checkout_orders';

    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'id_user',
        'id_menu_item',
        'total_harga',
        'jumlah_porsi',
        'status',
        'tanggal_pengiriman_makanan'
    ];
}
