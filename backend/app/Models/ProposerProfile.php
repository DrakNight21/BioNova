<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProposerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'certification_details',
        'farm_name',
        'bio',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
