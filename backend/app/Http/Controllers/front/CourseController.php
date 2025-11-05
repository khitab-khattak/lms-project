<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    //return all courses for a specific user
    public function index(){

    }
    // store or save the course in database
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'title'=>'required|min:5',
        ]);
        if ($validator->fails()){
            return response()->json([
                'status'=> 400,
                'errors'=> $validator->errors()
            ],400);
        }
        $course = new Course();
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();
        return response()->json([
            'status'=> 200,
            'message'=>'Course Created Successfully'
        ],200);
    }
}
