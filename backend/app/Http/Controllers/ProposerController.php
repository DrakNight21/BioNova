<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProposerController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'proposer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $products = Product::where('proposer_id', $request->user()->id)->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'proposer' || $request->user()->status !== 'active') {
            return response()->json(['message' => 'Unauthorized or pending verification'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|in:vegetables,fruits,grains,dairy,fertilizers',
            'location' => 'nullable|string',
            'image' => 'nullable|file|max:10240'
        ]);

        if ($validator->fails()) {
            Log::error('Product upload validation failed', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->except('image');
            $data['proposer_id'] = $request->user()->id;

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $data['image_url'] = asset('storage/' . $path);
            }

            $product = Product::create($data);

            return response()->json($product, 201);
        } catch (\Exception $e) {
            Log::error('Product upload exception', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'proposer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::where('proposer_id', $request->user()->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'category' => 'sometimes|required|in:vegetables,fruits,grains,dairy,fertilizers',
            'location' => 'nullable|string',
            'image' => 'nullable|file|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = asset('storage/' . $path);
        }

        $product->update($data);

        return response()->json($product);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'proposer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::where('proposer_id', $request->user()->id)->findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }

    public function submitResource(Request $request)
    {
        if ($request->user()->role !== 'proposer' || $request->user()->status !== 'active') {
            return response()->json(['message' => 'Unauthorized or pending verification'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'resource_type' => 'required|in:article,guide,video_link'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $resource = \App\Models\EducationalResource::create([
            'author_id' => $request->user()->id,
            'title' => $request->title,
            'content' => $request->content,
            'resource_type' => $request->resource_type,
            'status' => 'pending' // pending by default
        ]);

        return response()->json($resource, 201);
    }
}
