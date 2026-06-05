<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $roleValue = $validated['role'] instanceof \UnitEnum ? $validated['role']->value : $validated['role'];

        if ($roleValue === 'admin') {
            throw ValidationException::withMessages([
                'role' => ['Le rôle administrateur ne peut pas être choisi à l\'inscription.'],
            ]);
        }

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $validated['password'], // Laravel hashes automatically due to 'hashed' cast in User.php
            'role'     => $roleValue,
        ]);

        $user->assignRole($roleValue);

        Auth::guard('web')->login($user);

        return response()->json([
            'message'      => 'User registered successfully',
            'user'         => new UserResource($user->load('roles'))
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        if (! Auth::guard('web')->attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $request->session()->regenerate();

        $user = Auth::guard('web')->user();

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user->load('roles'))
        ]);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user()->load('roles'));
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string|max:2000',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (array_key_exists('bio', $validated)) {
            $user->bio = $validated['bio'];
        }
        if (! empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user' => new UserResource($user->load('roles')),
        ]);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = $request->user();

        if ($user->avatar) {
            $oldPath = str_replace('/storage/', '', $user->avatar);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = '/storage/' . $path;
        $user->save();

        return response()->json([
            'message' => 'Avatar mis à jour.',
            'avatar' => $user->avatar,
            'user' => new UserResource($user->load('roles')),
        ]);
    }
}
