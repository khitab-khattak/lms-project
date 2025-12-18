<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    
    public function index(Request $request){
        $chapters = Chapter::where('course_id',$request->course_id)
        ->orderBy('sort_order')
        ->get();
        return response()->json([
            'status'=>200,
            'data'=>$chapters
        ],200);
    }
     //this method will save chapter of a course
     public function store(Request $request){
        $validator = Validator::make($request->all(),
        [
            'course_id' => 'required|integer|exists:courses,id',
            'chapter'=>'required|string',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $chapter = new Chapter();
        $chapter->course_id= $request->course_id;
        $chapter->title = trim($request->chapter);
        $chapter->sort_order=1000;
        $chapter->save();
        return response()->json([
            'status'=>200,
            'message'=>'Chapter added Successfully',
            'data'=>$chapter
        ],200);
     }
      //this method will update chapter of a course
      public function update(Request $request,$id){
        $validator = Validator::make($request->all(),
        [
            'chapter'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $chapter= Chapter::find($id);
        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'chapter not found',
            ], 404);
        }
        $chapter->title = $request->chapter;
        $chapter->save();
        return response()->json([
            'status'=>200,
            'message'=>'Chapter updated Successfully',
            'data'=> $chapter
        ],200);
     }
     //this method will delete the selected chapter of a course
     public function destroy($id){
        $chapter = Chapter::find($id);
        if (!$chapter) {
            return response()->json([
                'status' => 404,
                'message' => 'chapter not found',
            ], 404);
        }
        $chapter->delete();
        return response()->json([
            'status'=>200,
            'message'=>'chapter deleted Successfully'
        ],200);
     }

     public function reorder(Request $request)
{
    $request->validate([
        'items' => 'required|array',
        'items.*.id' => 'required|integer'
    ]);

    foreach ($request->items as $index => $item) {
        Chapter::where('id', $item['id'])
            ->update(['sort_order' => $index + 1]);
    }

    return response()->json([
        'message' => 'chapter order updated successfully'
    ], 200);
}

}

