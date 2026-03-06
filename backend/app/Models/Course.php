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
        return $this->hasMany(Chapter::class)->orderBy('sort_order','ASC');
    }

    public function levels(){
        return $this->belongsTo(Level::class,'level_id');
    }

    public function language(){
        return $this->belongsTo(Language::class,'language_id');
    }

    public function category(){
        return $this->belongsTo(Category::class,'category_id');
    }

    public function outcomes(){
        return $this->hasMany(Outcome::class)->orderBy('sort_order','ASC');
    }
    public function requirements(){
        return $this->hasMany(Requirement::class)->orderBy('sort_order','ASC');
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }
    
}
