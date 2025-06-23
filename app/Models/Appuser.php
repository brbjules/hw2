<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appuser extends Model
{
    public $timestamps = false;

    public function comments()
    {
        return $this->hasMany(Comment::class, "author");
    }
    public function posts()
    {
        return $this->hasMany(Post::class, "author");
    }
}
