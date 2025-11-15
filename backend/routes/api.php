<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\front\OutcomeController;



Route::post('/register',[AccountController::class,'register']);
Route::post('/login',[AccountController::class,'authenticate']);


Route::middleware(['auth:sanctum'])->group( function(){
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/meta-data',[CourseController::class,'metaData']);
    Route::get('/courses/{id}',[CourseController::class,'show']);
    Route::put('/courses/update/{id}',[CourseController::class,'update']);

    //outcome
    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcomes', [OutcomeController::class, 'store']);
    Route::put('/outcome/update/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcome/delete/{id}', [OutcomeController::class, 'destroy']);

});


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
