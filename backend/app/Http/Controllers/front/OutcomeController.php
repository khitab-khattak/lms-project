<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    //this method will return all outcome of a course
    public function index(Request $request){
        $outcomes = Outcome::where('course_id',$request->course_id)->get();
        return response()->json([
            'status'=>200,
            'data'=>$outcomes
        ],200);
    }
     //this method will save outcome of a course
     public function store(Request $request){
        $validator = Validator::make($request->all(),
        [
            'outcome'=>'required',
            'course_id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $outcome = new Outcome();
        $outcome->course_id= $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order=1000;
        $outcome->save();
        return response()->json([
            'status'=>200,
            'message'=>'Outcome added Successfully'
        ],200);
     }
      //this method will update outcome of a course
      public function update(Request $request,$id){
        $validator = Validator::make($request->all(),
        [
            'outcome'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'errors'=>$validator->errors()
            ],400);
        }

        $outcome= Outcome::find($id);
        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found',
            ], 404);
        }
        $outcome->text = $request->outcome;
        $outcome->save();
        return response()->json([
            'status'=>200,
            'message'=>'Outcome updated Successfully'
        ],200);
     }
     //this method will delete the selected outcome of a course
     public function destroy($id){
        $outcome = Outcome::find($id);
        if (!$outcome) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found',
            ], 404);
        }
        $outcome->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Outcome deleted Successfully'
        ],200);
     }

     public function reorder(Request $request)
{
    $request->validate([
        'items' => 'required|array',
        'items.*.id' => 'required|integer'
    ]);

    foreach ($request->items as $index => $item) {
        Outcome::where('id', $item['id'])
            ->update(['sort_order' => $index + 1]);
    }

    return response()->json([
        'message' => 'Outcome order updated successfully'
    ], 200);
}

}
