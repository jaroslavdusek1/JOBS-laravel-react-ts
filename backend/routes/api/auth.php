<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::post('/login', [AuthController::class, 'login']); // Login
Route::post('/register', [AuthController::class, 'register']); // Register
Route::get('/getUser', [AuthController::class, 'getUser']); // Get the authenticated user
Route::post('/logout', [AuthController::class, 'logout']); // Logout