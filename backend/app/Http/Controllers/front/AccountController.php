<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

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
    public function authenticate(Request $request){
        $validator = Validator::make($request->all(),[
            'email'=>'required',
            'password'=>'required',
        ]);
        if($validator->fails()){
           return response()->json([
            'status'=>400,
            'errors'=> $validator->errors()
           ],400);
        }
        if(Auth::attempt(['email'=>$request->email,'password'=>$request->password])){
            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;
            return response()->json([
                'status'=> 200,
                'token'=> $token,
                'id'=> Auth::user()->id,
                'name'=> Auth::user()->name,
            ],200);
        }else{
            return response()->json([
                'status'=> 401,
                'message'=> 'Either Email/Password is in correct'
            ]);
        }
    }
}
