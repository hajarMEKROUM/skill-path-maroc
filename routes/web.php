<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FreelanceController;




Route::get('/', function () {
    return view('welcome');
});


Route::resource('freelance', FreelanceController::class);