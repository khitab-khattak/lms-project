<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\RequirementController;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/meta-data', [CourseController::class, 'metaData']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/update/{id}', [CourseController::class, 'update']);
    Route::post('/course-image/{id}', [CourseController::class, 'courseImage']);

    //outcome
    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcomes', [OutcomeController::class, 'store']);
    Route::put('/outcome/update/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcome/delete/{id}', [OutcomeController::class, 'destroy']);
    Route::post('/outcome/reorder', [OutcomeController::class, 'reorder']);



    //requirement
    Route::get('/requirements', [RequirementController::class, 'index']);
    Route::post('/requirements', [RequirementController::class, 'store']);
    Route::put('/requirement/update/{id}', [RequirementController::class, 'update']);
    Route::delete('/requirement/delete/{id}', [RequirementController::class, 'destroy']);
    Route::post('/requirement/reorder', [RequirementController::class, 'reorder']);



    //chapter
    Route::get('/chapters', [chapterController::class, 'index']);
    Route::post('/chapters', [chapterController::class, 'store']);
    Route::put('/chapter/update/{id}', [chapterController::class, 'update']);
    Route::delete('/chapter/delete/{id}', [chapterController::class, 'destroy']);
    Route::post('/chapter/reorder', [chapterController::class, 'reorder']);
});


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
