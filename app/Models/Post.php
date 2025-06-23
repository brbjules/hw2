<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    public $timestamps = false;

    public function op()
    {
        return $this->belongsTo(Appuser::class, "author");
    }
    public function replies()
    {
        return $this->hasMany(Comment::class, "post");
    }
}
