<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'proposer_id',
        'name',
        'description',
        'price',
        'stock',
        'category',
        'location',
        'image_url',
    ];

    public function proposer()
    {
        return $this->belongsTo(User::class, 'proposer_id');
    }
}
