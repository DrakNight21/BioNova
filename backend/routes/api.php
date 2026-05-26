<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProposerController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\ResourceController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [MarketplaceController::class, 'getProducts']);
Route::get('/resources', [ResourceController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/orders', [MarketplaceController::class, 'createOrder']);

    // Admin routes
    Route::put('/admin/verify-proposer/{id}', [AdminController::class, 'verifyProposer']);
    Route::get('/admin/pending-proposers', [AdminController::class, 'getPendingProposers']);
    Route::post('/admin/resources', [AdminController::class, 'createResource']);
    Route::delete('/admin/resources/{id}', [AdminController::class, 'deleteResource']);
    Route::get('/admin/pending-resources', [AdminController::class, 'getPendingResources']);
    Route::put('/admin/approve-resource/{id}', [AdminController::class, 'approveResource']);

    // Proposer routes
    Route::get('/proposer/products', [ProposerController::class, 'index']);
    Route::post('/proposer/products', [ProposerController::class, 'store']);
    Route::put('/proposer/products/{id}', [ProposerController::class, 'update']);
    Route::delete('/proposer/products/{id}', [ProposerController::class, 'destroy']);
    Route::post('/proposer/submit-resource', [ProposerController::class, 'submitResource']);
});
