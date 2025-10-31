<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function register(Request $request){
        $validator = Validator::make($request->all(),[
            'name'=>'required|min:5',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:4'
        ]);
        if($validator->fails()){
           return response()->json([
            'status'=>400,
            'errors'=> $validator->errors()
           ],400);
        }
        $user = new User();
        $user->name= $request->name;
        $user->email = $request->email;
        $user->password= Hash::make($request->password);
        $user->save();

        return response()->json([
            'status'=>200,
            'message'=> 'User Register Successfully'
           ],200);
    }
}
