<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Request $request){
        $lessons = Lesson::where('course_id',$request->course_id)
        ->orderBy('sort_order')
        ->get();
        return response()->json([
            'status'=>200,
            'data'=>$lessons
        ],200);
    }
     //this method will save lesson of a course
     public function store(Request $request){
        $validator = Validator::make($request->all(),
        [
            'chapter_id' => 'required|integer|exists:chapters,id',
            'lesson'=>'required|string',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $lesson = new Lesson();
        $lesson->chapter_id= $request->chapter_id;
        $lesson->title = trim($request->lesson);
        $lesson->status = $request->status;
        $lesson->sort_order=1000;
        $lesson->save();
        return response()->json([
            'status'=>200,
            'message'=>'lesson added Successfully',
            'data'=>$lesson
        ],200);
     }
      //this method will update lesson of a course
      public function update(Request $request,$id){
        $validator = Validator::make($request->all(),
        [
            'lesson'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $lesson= Lesson::find($id);
        $lesson->title = $request->lesson;
        $lesson->is_free_preview = ($request->free_preview == false)? 'no':'yes';
        $lesson->duration = $request->duration;
        $lesson->description = $request->description;
        $lesson->status = $request->status;
        $lesson->save();
        return response()->json([
            'status'=>200,
            'message'=>'Lesson updated Successfully',
            'data'=> $lesson
        ],200);
     }
     //this method will delete the selected lesson of a course
     public function destroy($id){
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => 'lesson not found',
            ], 404);
        }
        $lesson->delete();
        return response()->json([
            'status'=>200,
            'message'=>'lesson deleted Successfully'
        ],200);
     }
}
