<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ProposerProfile;
use App\Models\EducationalResource;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function verifyProposer(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,suspended'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('role', 'proposer')->findOrFail($id);
        $user->status = $request->status;
        $user->save();

        if ($request->status === 'active' && $user->proposerProfile) {
            $user->proposerProfile->verified_at = now();
            $user->proposerProfile->verified_by = $request->user()->id;
            $user->proposerProfile->save();
        }

        return response()->json([
            'message' => 'Proposer status updated',
            'user' => $user->load('proposerProfile')
        ]);
    }

    public function getPendingProposers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::with('proposerProfile')->where('role', 'proposer')->where('status', 'pending')->get();
        return response()->json($users);
    }

    public function createResource(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'resource_type' => 'required|in:article,guide,video_link'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $resource = EducationalResource::create([
            'author_id' => $request->user()->id,
            'title' => $request->title,
            'content' => $request->content,
            'resource_type' => $request->resource_type,
            'status' => 'published'
        ]);

        return response()->json($resource, 201);
    }

    public function deleteResource(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $resource = EducationalResource::findOrFail($id);
        $resource->delete();

        return response()->json(['message' => 'Resource deleted']);
    }

    public function getPendingResources(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $resources = EducationalResource::with('author')->where('status', 'pending')->get();
        return response()->json($resources);
    }

    public function approveResource(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $resource = EducationalResource::findOrFail($id);
        $resource->status = $request->status; // Expecting 'published' or 'rejected'
        $resource->save();

        return response()->json(['message' => 'Resource status updated', 'resource' => $resource]);
    }
}
