<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationalResource extends Model
{
    protected $fillable = [
        'author_id',
        'title',
        'content',
        'resource_type',
        'status',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
