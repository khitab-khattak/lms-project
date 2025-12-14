<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class RequirementController extends Controller
{
    
    public function index(Request $request){
        $requirements = Requirement::where('course_id',$request->course_id)
        ->orderBy('sort_number')
        ->get();
        return response()->json([
            'status'=>200,
            'data'=>$requirements
        ],200);
    }
     //this method will save requirement of a course
     public function store(Request $request){
        $validator = Validator::make($request->all(),
        [
            'requirement'=>'required',
            'course_id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $requirement = new requirement();
        $requirement->course_id= $request->course_id;
        $requirement->text = $request->requirement;
        $requirement->sort_order=1000;
        $requirement->save();
        return response()->json([
            'status'=>200,
            'message'=>'Requirement added Successfully'
        ],200);
     }
      //this method will update requirement of a course
      public function update(Request $request,$id){
        $validator = Validator::make($request->all(),
        [
            'requirement'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $requirement= Requirement::find($id);
        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found',
            ], 404);
        }
        $requirement->text = $request->requirement;
        $requirement->save();
        return response()->json([
            'status'=>200,
            'message'=>'Requirement updated Successfully'
        ],200);
     }
     //this method will delete the selected requirement of a course
     public function destroy($id){
        $requirement = requirement::find($id);
        if (!$requirement) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement not found',
            ], 404);
        }
        $requirement->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Requirement deleted Successfully'
        ],200);
     }

     public function reorder(Request $request)
     {
         $request->validate([
             'items' => 'required|array',
             'items.*.id' => 'required|integer'
         ]);
     
         foreach ($request->items as $index => $item) {
             Requirement::where('id', $item['id'])
                 ->update(['sort_order' => $index + 1]);
         }
     
         return response()->json([
             'message' => 'Outcome order updated successfully'
         ], 200);
     }
}
