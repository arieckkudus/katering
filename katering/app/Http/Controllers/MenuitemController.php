<?php

namespace App\Http\Controllers;

use App\Models\MenuitemMerchant;
use App\Models\ProfileMerchant;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use DB;

class MenuitemController extends Controller
{

    public function menuitemget()
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '2') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }

        try {
            $menuItem = MenuitemMerchant::all();

            return response()->json([
                'status' => 'success',
                'message' => 'Data menu item berhasil diambil',
                'data' => $menuItem
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data menu item',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function menuitemprofilemerchant()
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '2') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }

        $profilem = ProfileMerchant::where('id_user', $checkUser->id)->first();
        $menuitem = MenuitemMerchant::where('id_profile_merchant', $profilem->id)->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Data menu Item berhasil diambil',
            'data' => $menuitem
        ], 200);
    }
    public function menuitemgetid($id)
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '2') {
            return response()->json('Anda Tidak Ada Akses', 403);
        } {
            try {
                $menuItem = MenuitemMerchant::find($id);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Data menu Item berhasil diambil',
                    'data' => $menuItem
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal mengambil data menu Item',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
    }


    public function menuitemcreate(Request $request)
    {

        $checkUser = Auth()->user();

        if ($checkUser->role != '2') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }

        $checkmerchant = ProfileMerchant::where('id_user', $checkUser->id)->first();

        $validated = $request->validate([
            'nama_item' => 'required|string',
            'nama_deskripsi' => 'required|string',
            'harga' => 'required|numeric',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi foto
        ]);

        DB::beginTransaction();
        try {
            $filePath = null;
            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $fileName = time() . '_' . $file->getClientOriginalName();

                // Buat folder jika belum ada
                $uploadPath = public_path('uploads/menuitems');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                // Pindahkan file ke folder public/uploads/menuitems/
                $file->move($uploadPath, $fileName);

                // Simpan path yang bisa diakses
                $filePath = 'uploads/menuitems/' . $fileName;
            }

            // Simpan data ke tabel menu_items
            $menuItem = MenuItemMerchant::create([
                'id_profile_merchant' => $checkmerchant->id,
                'nama_item' => $validated['nama_item'],
                'nama_deskripsi' => $validated['nama_deskripsi'],
                'harga' => $validated['harga'],
                'foto' => $filePath, // Simpan path foto
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Sukses menambahkan menu',
                'data' => $menuItem
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan menu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function menuitemUpdate(Request $request, string $id)
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '2') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }

        $validated = $request->validate([
            'nama_item' => 'required|string',
            'nama_deskripsi' => 'required|string',
            'harga' => 'required|numeric',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validasi foto
        ]);

        DB::beginTransaction();
        try {

            $menuItem = MenuItemMerchant::findOrFail($id);

            $filePath = $menuItem->foto;

            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $fileName = time() . '_' . $file->getClientOriginalName();

                $uploadPath = public_path('uploads/menuitems');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                if ($menuItem->foto && file_exists(public_path($menuItem->foto))) {
                    unlink(public_path($menuItem->foto));
                }

                $file->move($uploadPath, $fileName);
                $filePath = 'uploads/menuitems/' . $fileName;
            }

            $menuItem->update([
                'nama_item' => $validated['nama_item'],
                'nama_deskripsi' => $validated['nama_deskripsi'],
                'harga' => $validated['harga'],
                'foto' => $filePath,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Menu berhasil diperbarui',
                'data' => $menuItem
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui menu',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function menuitemdelete(string $id)
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '2') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }

        DB::beginTransaction();
        try {
            // Cari data berdasarkan id_profile
            $menuitem = MenuitemMerchant::where('id', operator: $id)->first();

            if (!$menuitem) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Merchant tidak ditemukan'
                ], 404);
            }

            // Hapus merchant
            $menuitem->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Sukses menghapus menuitem'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus menuitem',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
