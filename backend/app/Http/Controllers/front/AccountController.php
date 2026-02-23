<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Chapter;
use App\Models\Lesson;
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

    public function courses(Request $request){
        $userId = $request->user()->id;
        $courses = Course::where('user_id',$userId)
        ->with('levels')
        ->get();
        return response()->json([
            'status'=>200,
            'courses'=>$courses
        ],200);
    }

    public function enrollments(Request $request){
        $enroll = Enrollment::where('user_id',$request->user()->id,)->with('course','course.levels')->get();
        return response()->json([
            'status' => 200,
            'enroll'=>$enroll
        ],200);
    }

    // public function enroll_course($id,Request $request){
    //     $count = Enrollment::where(
    //         [
    //             'user_id'=>$request->user()->id,
    //             'course_id'=>$id
    //             ]
    //             )->count();
    //     if($count== 0){
    //         return response()->json([
    //             'status' => 404,
    //             'message' => "You can not access this course"
    //         ],404);
    //     }

    //     $course = Course::
    //     where('id',$id)
    //     ->withCount('chapters')
    //     ->with([
    //         'levels',
    //         'category',
    //         'language',
    //         'chapters'=>function($query){
    //             $query->withCount(['lessons'=>function($q){
    //                 $q->where('status',1);
    //                 $q->whereNotNull('video');
    //             }]);
    //             $query->withSum((['lessons'=>function($q){
    //                 $q->where('status',1);
    //                 $q->whereNotNull('video');
    //             }]),'duration');
    //         },
    //         'chapters.lessons'=>function($q){
    //             $q->where('status',1);
    //             $q->whereNotNull('video');
    //         }
    //     ])->first();
    //     //if no activity than show the first lesson of first chapter
       
    //     $activityCount = Activity::where([
    //         'user_id'=>$request->user()->id,
    //         'course_id'=>$id
    //     ])->count();

    //     $chapter = Chapter::
    //     where('course_id', $id)
    //     ->where('status',1)
    //     ->orderBy('sort_order','ASC')
    //     ->first();
    //     $lesson = Lesson:: 
    //     where('chapter_id', $chapter->id)
    //     ->where('status',1)
    //     ->whereNotNull('video')
    //     ->orderBy('sort_order','ASC')
    //     ->first();
    //     if($activityCount == 0){
    //          $lesson = collect();
    //         $activity = new Activity();
    //         $activity->user_id = $request->user()->id;
    //         $activity->course_id = $id;
    //         $activity->chapter_id = $chapter->id;
    //         $activity->lesson_id = $lesson->id;
    //         $activity->is_last_watched = "yes";
    //         $activity->save();
    //         $activityLesson = $lesson;
    //     }

       
    //     return response()->json([
    //         'status'=>200,
    //         'course'=>$course,
    //         'activitylesson'=>$activityLesson
    //     ],200);
    // }

    public function enroll_course($id, Request $request) {
        $userId = $request->user()->id;
    
        // 1. Check Enrollment (exists() is faster than count())
        $isEnrolled = Enrollment::where('user_id', $userId)
            ->where('course_id', $id)
            ->exists();
    
        if (!$isEnrolled) {
            return response()->json([
                'status' => 403,
                'message' => "You do not have access to this course"
            ], 403);
        }
    
        // 2. Fetch Course with eager loading
        $course = Course::where('id', $id)
            ->withCount('chapters')
            ->with([
                'levels', 'category', 'language',
                'chapters' => function($query) {
                    $query->withCount(['lessons' => function($q) {
                        $q->where('status', 1)->whereNotNull('video');
                    }])->withSum(['lessons' => function($q) {
                        $q->where('status', 1)->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function($q) {
                    $q->where('status', 1)->whereNotNull('video');
                }
            ])->first();
    
        // 3. Handle Lesson Activity
        // Try to find the last lesson the user was watching
        $lastActivity = Activity::where('user_id', $userId)
            ->where('course_id', $id)
            ->where('is_last_watched', 'yes')
            ->first();
    
        if ($lastActivity) {
            // If they have activity, find that specific lesson
            $activityLesson = Lesson::find($lastActivity->lesson_id);
        } else {
            // If no activity, find the first lesson of the first chapter
            $firstChapter = Chapter::where('course_id', $id)
                ->where('status', 1)
                ->orderBy('sort_order', 'ASC')
                ->first();
    
            if ($firstChapter) {
                $activityLesson = Lesson::where('chapter_id', $firstChapter->id)
                    ->where('status', 1)
                    ->whereNotNull('video')
                    ->orderBy('sort_order', 'ASC')
                    ->first();
    
                // Create initial activity record if lesson exists
                if ($activityLesson) {
                    Activity::create([
                        'user_id' => $userId,
                        'course_id' => $id,
                        'chapter_id' => $firstChapter->id,
                        'lesson_id' => $activityLesson->id,
                        'is_last_watched' => 'yes'
                    ]);
                }
            } else {
                $activityLesson = null;
            }
        }
        $completedLessons = Activity::where([
            'user_id'=> $userId,
            'course_id'=> $id,
            'is_completed'=>'yes'
        ])->pluck('lesson_id')
        ->toArray();
    
        return response()->json([
            'status' => 200,
            'course' => $course,
            'activitylesson' => $activityLesson,
            'completedLessons' => $completedLessons
        ], 200);
    }

    public function saveUserActivity(Request $request)
    {
        $userId = $request->user()->id;
    
        // remove last watched flag
        Activity::where([
            'user_id' => $userId,
            'course_id' => $request->course_id
        ])->update([
            'is_last_watched' => 'no'
        ]);
    
        Activity::updateOrInsert(
            [
                'user_id' => $userId,
                'course_id' => $request->course_id,
                'lesson_id' => $request->lesson_id,
                'chapter_id' => $request->chapter_id,
            ],
            [
                'is_last_watched' => 'yes',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    
      
        return response()->json([
            'status' => 200,
            'message' => "User activity saved successfully",
            
        ]);
    }

    public function markAsComplete(Request $request){
        $userId = $request->user()->id;
        Activity::where(
            
            [
                'user_id' => $userId,
                'course_id' => $request->course_id,
                'lesson_id' => $request->lesson_id,
                'chapter_id' => $request->chapter_id,
            ],
        )->update(
            [
                'is_completed' => 'yes',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
        
        return response()->json([
            'status' => 200,
            'message' => "Lesson mark as completed successfully",
        ]);
    }
}
