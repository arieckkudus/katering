<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileMerchant extends Model
{
    use HasFactory;

    // Menentukan tabel yang digunakan
    protected $table = 'profile_merchants';

    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'id_user',
        'nama_perusahaan',
        'alamat',
        'kontak',
        'deskripsi'
    ];
}
