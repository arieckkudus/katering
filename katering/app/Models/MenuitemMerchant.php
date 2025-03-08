<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuitemMerchant extends Model
{
    use HasFactory;

    // Menentukan tabel yang digunakan
    protected $table = 'menuitem_merchants';

    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'id_profile_merchant',
        'nama_item',
        'nama_deskripsi',
        'harga',
        'foto'
    ];

    public function checkoutOrders()
    {
        return $this->hasMany(CheckoutOrder::class, 'id_menu_item', 'id');
    }

    public function profileMerchant()
    {
        return $this->belongsTo(ProfileMerchant::class, 'id_profile_merchant', 'id');
    }

}
