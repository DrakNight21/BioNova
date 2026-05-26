<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EducationalResource;

class ResourceController extends Controller
{
    public function index()
    {
        $resources = EducationalResource::with('author')
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($resources);
    }
}
