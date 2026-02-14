<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'user_id', 
        'course_id', 
        'chapter_id', 
        'lesson_id', 
        'is_last_watched'
    ];
    public function lessons(){
        return $this->belongsTo(Lesson::class);
    }
}
