<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EmploymentJob;

class FreelanceController extends Controller
{
    public function index()
    {
        return response()->json(
            EmploymentJob::with('user:id,name')
                ->latest()
                ->get()
        );
    }
}
