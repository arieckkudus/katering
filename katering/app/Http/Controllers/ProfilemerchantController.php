<?php

namespace App\Http\Controllers;
use App\Models\ProfileMerchant;
use Illuminate\Http\Request;
use DB;

class ProfilemerchantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function profilemerchantget()
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '1') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }

        try {
            $merchants = ProfileMerchant::all();

            return response()->json([
                'status' => 'success',
                'message' => 'Data merchant berhasil diambil',
                'data' => $merchants
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data merchant',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function profilemerchantgetid($id)
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '1') {
            return response()->json('Anda Tidak Ada Akses', 403);
        } {
            try {
                $merchants = ProfileMerchant::find($id);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Data merchant berhasil diambil',
                    'data' => $merchants
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal mengambil data merchant',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
    }

    public function profilemerchantcreate(Request $request)
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '1') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }

        $validated = $request->validate([
            'id_user'=>'required',
            'nama_perusahaan' => 'required|string',
            'alamat' => 'required|string',
            'kontak' => 'required|string',
            'deskripsi' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            // Simpan data ke tabel profile_merchants
            $merchant = ProfileMerchant::create([
                'id_user'=>$validated['id_user'],
                'nama_perusahaan' => $validated['nama_perusahaan'],
                'alamat' => $validated['alamat'],
                'kontak' => $validated['kontak'],
                'deskripsi' => $validated['deskripsi'],
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Sukses mendaftarkan merchant',
                'data' => $merchant
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mendaftarkan merchant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function profilemerchantUpdate(Request $request, $id)
    {
        $checkUser = Auth()->user();

        if($checkUser->role != '1'){
            return response()->json('Anda Tidak Ada Akses', 403);
        }
        $validated = $request->validate([
            'nama_perusahaan' => 'required|string',
            'alamat' => 'required|string',
            'kontak' => 'required|string',
            'deskripsi' => 'required|string',
        ]);


        DB::beginTransaction();
        try {
            // Cari data berdasarkan id_profile
            $merchant = ProfileMerchant::find($id);

            if (!$merchant) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Merchant tidak ditemukan'
                ], 404);
            }

            // Update data merchant
            $merchant->update([
                'nama_perusahaan' => $validated['nama_perusahaan'],
                'alamat' => $validated['alamat'],
                'kontak' => $validated['kontak'],
                'deskripsi' => $validated['deskripsi'],
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Sukses mengupdate merchant',
                'data' => $merchant
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengupdate merchant',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function profilemerchantDelete($id)
    {
        $checkUser = Auth()->user();

        if($checkUser->role != '1'){
            return response()->json('Anda Tidak Ada Akses', 403);
        }
        DB::beginTransaction();
        try {
            // Cari data berdasarkan id_profile
            $merchant = ProfileMerchant::where('id', $id)->first();

            if (!$merchant) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Merchant tidak ditemukan'
                ], 404);
            }

            // Hapus merchant
            $merchant->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Sukses menghapus merchant'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus merchant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
