<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $appends = ['course_small_image'];
    protected $casts = [
        'price' => 'float',       // Converts "10.00" -> 10
        'cross_price' => 'float', // Converts "10.00" -> 10
    ];

    function getCourseSmallImageAttribute(){
        if($this->image== ""){
            return "";
        }

        return asset('uploads/course/small/'.$this->image);
    }

    public function chapters(){
        return $this->hasMany(Chapter::class);
    }

    public function levels(){
        return $this->belongsTo(Level::class,'level_id');
    }
}
