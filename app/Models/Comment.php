<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    public $timestamps = false;

    public function author()
    {
        return $this->belongsTo(Appuser::class, "author");
    }
    public function getPost()
    {
        return $this->belongsTo(Post::class, "post");
    }
}
