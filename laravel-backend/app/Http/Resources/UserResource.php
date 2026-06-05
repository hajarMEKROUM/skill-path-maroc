<?php

namespace App\Http\Resources;

use App\Support\RoleNormalizer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => RoleNormalizer::normalize($this->role),
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'roles' => $this->whenLoaded('roles'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
