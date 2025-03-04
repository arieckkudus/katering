<?php

namespace App\Http\Controllers;

use App\Models\CheckoutOrder;
use App\Models\MenuitemMerchant;
use App\Models\ProfileMerchant;
use Illuminate\Http\Request;
use DB;
class CustomerController extends Controller
{

    public function search(Request $request)
    {

        $request->validate([
            'search' => 'nullable|string|max:255'
        ]);
        $search = $request->search;

        $data = ProfileMerchant::join('menuitem_merchants', 'menuitem_merchants.id_profile_merchant', '=', 'profile_merchants.id')
            ->where(function ($query) use ($search) {
                $query->where('profile_merchants.nama_perusahaan', 'LIKE', '%' . $search . '%')
                    ->orWhere('menuitem_merchants.nama_item', 'LIKE', '%' . $search . '%');
            })
            ->select('profile_merchants.*', 'menuitem_merchants.*')
            ->get();

        $formattedData = [];
        foreach ($data as $item) {
            $merchantId = $item->id;

            // Jika merchant belum ada dalam array, tambahkan
            if (!isset($formattedData[$merchantId])) {
                $formattedData[$merchantId] = [
                    'profile' => [
                        'id' => $item->id,
                        'nama_perusahaan' => $item->nama_perusahaan,
                        'alamat' => $item->alamat,
                        'kontak' => $item->kontak,
                        'deskripsi' => $item->deskripsi
                    ],
                    'menu_items' => []
                ];
            }

            // Tambahkan menu item ke dalam merchant yang sesuai
            $formattedData[$merchantId]['menu_items'][] = [
                'menu' => $item->id, // ID menu item
                'profile_id' => $item->id_profile_merchant,
                'nama_item' => $item->nama_item,
                'nama_deskripsi' => $item->nama_deskripsi,
                'foto' => $item->foto,
                'harga' => $item->harga
            ];
        }

        return response()->json([
            'status' => 'success',
            'message' => count($formattedData) > 0 ? 'Data ditemukan' : 'Data tidak ditemukan',
            'data' => array_values($formattedData) // Mengubah dari associative array ke indexed array
        ]);
    }


    public function checkOut(Request $request, $id_menuitem)
    {
        $checkUser = Auth()->user();

        if ($checkUser->role != '3') {
            return response()->json('Anda Tidak Ada Akses', 403);
        }
        $validated = $request->validate([
            // 'id_menu_item' => 'required|string',
            'jumlah_porsi' => 'required|numeric',
            'tanggal_pengiriman_makanan' => 'required|date',
        ]);

        $menuitem = MenuitemMerchant::find($id_menuitem);

        $hasil_harga = $menuitem->harga * $request->jumlah_porsi;

        DB::beginTransaction();
        try {
            $checkout = new CheckoutOrder;
            $checkout->id_user = $checkUser->id;
            $checkout->id_menu_item = $id_menuitem;
            $checkout->total_harga = $hasil_harga;
            $checkout->jumlah_porsi = $request->jumlah_porsi;
            $checkout->status = '1'; // 1 Pending
            $checkout->tanggal_pengiriman_makanan = $request->tanggal_pengiriman_makanan;
            $checkout->save();
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Sukses checkout',
                'data' => $checkout
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal Checkout',
                'error' => $e->getMessage()
            ], 500);
        }

    }

    public function invoice(Request $request, $id_checkout)
    {
        $checkUser = Auth()->user(); // Gunakan Auth::user(), bukan Auth()

        if ($checkUser->role != '3') {
            return abort(403, 'Anda Tidak Ada Akses');
        }

        // Ambil data invoice dengan join ke menuitem_merchants
        $datainvoice = CheckoutOrder::where('checkout_orders.id', $id_checkout)
            ->where('checkout_orders.id_user', $checkUser->id)
            ->join('menuitem_merchants', 'menuitem_merchants.id', '=', 'checkout_orders.id_menu_item')
            ->join('profile_merchants', 'profile_merchants.id', '=', 'menuitem_merchants.id_profile_merchant' )
            ->select(
                'checkout_orders.id',
                'checkout_orders.id_user',
                'checkout_orders.status',
                'checkout_orders.jumlah_porsi',
                'checkout_orders.tanggal_pengiriman_makanan',
                'checkout_orders.created_at',
                'checkout_orders.updated_at',
                'menuitem_merchants.nama_item',
                'menuitem_merchants.harga',
                'menuitem_merchants.id_profile_merchant',
                'profile_merchants.nama_perusahaan',

            )
            ->first();

        // Cek apakah data ditemukan
        if (!$datainvoice) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invoice tidak ditemukan atau bukan milik Anda.'
            ], 404);
        }

        // Format response JSON agar lebih terstruktur
        return response()->json([
            'status' => 'success',
            'message' => 'Data invoice ditemukan.',
            'invoice' => [
                'id' => $datainvoice->id,
                'id_user' => $datainvoice->id_user,
                'status' => $datainvoice->status,
                'jumlah_porsi' => $datainvoice->jumlah_porsi,
                'tanggal_pengiriman_makanan' => $datainvoice->tanggal_pengiriman_makanan,
                'created_at' => $datainvoice->created_at,
                'updated_at' => $datainvoice->updated_at,
                'total_harga' => $datainvoice->harga * $datainvoice->jumlah_porsi // Total harga dihitung ulang
            ],
            'menu_item' => [
                'nama_item' => $datainvoice->nama_item,
                'harga_satuan' => $datainvoice->harga,
                'nama_perusahaan'=>$datainvoice->nama_perusahaan
            ],

        ]);
    }


}
