<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

class LessonController extends Controller
{

    public function show($id)
{
    $lesson = Lesson::find($id);

    if (!$lesson) {
        return response()->json([
            'status' => 404,
            'message' => 'Lesson not found',
        ], 404);
    }

    return response()->json([
        'status' => 200,
        'data' => $lesson
    ], 200);
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
            'title'=>'required',
            'duration'=>'required|numeric|min:1'
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $lesson= Lesson::find($id);
        $lesson->title = $request->title;
        $lesson->chapter_id = $request->chapter_id;
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

     public function lessonVideo($id, Request $request)
     {
         $lesson = Lesson::find($id);
     
         if (!$lesson) {
             return response()->json([
                 'status' => 404,
                 'message' => 'Lesson not found.'
             ], 404);
         }
     
         $validator = Validator::make($request->all(), [
             'video' => 'required|file|mimes:mp4,mov,avi|max:51200', // 50MB
         ]);
     
         if ($validator->fails()) {
             return response()->json([
                 'status' => 400,
                 'errors' => $validator->errors()
             ], 400);
         }
     
         if ($request->hasFile('video')) {
     
             $path = public_path('uploads/lesson/videos');
     
             // ✅ create folder if not exists
             if (!File::exists($path)) {
                 File::makeDirectory($path, 0755, true);
             }
     
             // ✅ delete old video
             if ($lesson->video && File::exists($path . '/' . $lesson->video)) {
                 File::delete($path . '/' . $lesson->video);
             }
     
             $video = $request->file('video');
             $videoName = time() . '-' . $lesson->id . '.' . $video->getClientOriginalExtension();
     
             $video->move($path, $videoName);
     
             $lesson->video = $videoName;
             $lesson->save();
         }
     
         return response()->json([
             'status' => 200,
             'data' => $lesson,
             'message' => 'Video uploaded successfully',
         ], 200);
     }

     public function reorder(Request $request)
     {
         $request->validate([
             'items' => 'required|array',
             'items.*.id' => 'required|integer'
         ]);
     
         foreach ($request->items as $index => $item) {
             Lesson::where('id', $item['id'])
                 ->update(['sort_order' => $index + 1]);
         }
     
         return response()->json([
             'status' => 200,
             'message' => 'Lessons order updated successfully'
         ], 200);
     }
}
