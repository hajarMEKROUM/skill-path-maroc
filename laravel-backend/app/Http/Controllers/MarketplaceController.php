<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Marketplace;

class MarketplaceController extends Controller
{
    public function index()
    {
        return response()->json(Marketplace::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'budget' => 'nullable|numeric',
            'category' => 'nullable|string',
            'duration' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'open';

        $offer = Marketplace::create($validated);

        return response()->json($offer, 201);
    }

    public function update(Request $request, $id)
    {
        $marketplace = Marketplace::findOrFail($id);
        
        if ($marketplace->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'budget' => 'nullable|numeric',
            'category' => 'nullable|string',
            'duration' => 'nullable|string',
            'status' => 'nullable|string'
        ]);

        $marketplace->update($validated);

        return response()->json($marketplace);
    }

    public function destroy($id)
    {
        $marketplace = Marketplace::findOrFail($id);
        
        if ($marketplace->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $marketplace->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
