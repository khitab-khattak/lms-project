<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function fetch_categories(){
        $categories = Category::orderBy('name','ASC')->get();
        if($categories == null){
            return response()->json([
                'message'=>'Categories not found'
            ]);
        }
        return response()->json([
            'status'=>200,
            'categories' => $categories
        ],200);
    }

    public function featuredCourses(){
        $courses = Course::where('is_featured','yes')
        ->where('status',1)
        ->orderBy('title','ASC')
        ->with('levels')
        ->get();
        if($courses == null){
            return response()->json([
                'status'=>404,
                'message'=>'Courses Not Found'
            ],404);   
        }
        return response()->json([
            'status'=>200,
            'courses'=>$courses
        ],200);
    }
}
