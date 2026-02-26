<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use App\Models\Chapter;
use App\Models\Lesson;

class CourseController extends Controller
{
    //return all courses for a specific user
    public function index() {}
    // store or save the course in database
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        $course = new Course();
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();
        return response()->json([
            'status' => 200,
            'message' => 'Course Created Successfully',
            'data' => $course,
        ], 200);
    }
    public function metaData()
    {
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();
        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages

        ], 200);
    }
    public function show($id)
    {
        $course = Course::with(['chapters', 'chapters.lessons'])->find($id);
        if ($course == null) {
            return response()->json([
                'status' => 401,
                'message' => 'Course not found'

            ], 401);
        }

        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found'
            ], 404);
        }

        // Validate based on frontend field names
        $validator = Validator::make($request->all(), [
            'title'     => 'required|min:4',
            'category'  => 'required|integer',
            'level'     => 'required|integer',
            'language'  => 'required|integer',
            'sellPrice' => 'nullable|numeric|min:0',
            'crossPrice' =>'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Save to DB using correct column names
        $course->title        = $request->title;
        $course->category_id  = $request->category;
        $course->level_id     = $request->level;
        $course->language_id  = $request->language;
        $course->description  = $request->description;
        $course->price        = $request->sellPrice;
        $course->cross_price  = $request->crossPrice;
        if ($request->has('status')) {
            $course->status = $request->status;
        }

        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Course Updated Successfully',
            'data' => $course,
        ], 200);
    }
    public function courseImage($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $course = Course::findOrFail($id);

        // Delete old image + thumbnail
        if (!empty($course->image)) {
            $oldImage = public_path("uploads/course/{$course->image}");
            $oldThumb = public_path("uploads/course/small/{$course->image}");

            if (File::exists($oldImage)) File::delete($oldImage);
            if (File::exists($oldThumb)) File::delete($oldThumb);
        }

        if ($request->hasFile('image')) {
            $image = $request->image;
            $ext = $image->getClientOriginalExtension();
            $imageName = time() . '-' . $id . '.' . $ext;

            // Save original image
            $image->move(public_path('uploads/course'), $imageName);

            //enable extention gd in xampp
            $manager = new ImageManager(Driver::class);
            $img = $manager->read(public_path('uploads/course/' . $imageName));

            $img->cover(750, 450);
            $img->save(public_path('uploads/course/small/' . $imageName));

            // Save in DB
            $course->image = $imageName;
            $course->save();
        }

        return response()->json([
            'status' => 200,
            'message' => 'Course image uploaded successfully',
            'image' => $course->image,
            'course_small_image' => asset('uploads/course/small/' . $course->image),
        ], 200);
    }
    public function changeStatus($id, Request $request)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'The requested course could not be found.'
            ], 404);
        }
    
        $chapters = Chapter::where('course_id', $id)
            ->pluck('id')
            ->toArray();
    
        if (count($chapters) == 0) {   // ✅ fixed parentheses
            return response()->json([
                'status' => 400,
                'message' => 'To publish this course, it must contain at least one chapter.',
                'course' => $course,
            ], 400);
        }
    
        $lessonsCount = Lesson::whereIn('chapter_id', $chapters)
            ->where('status', 1)
            ->whereNotNull('video')
            ->count();
    
        if ($lessonsCount == 0) {
            return response()->json([
                'status' => 400,
                'message' => 'Each course requires at least one lesson with a video to be published.',
                'course' => $course,
            ], 400);
        }
    
        $course->status = $request->status;
        $course->save();
    
        $message = ($course->status === 1)
            ? 'The course has been successfully published and is now visible to students.'
            : 'The course has been unpublished and is no longer visible to students.';
    
        return response()->json([
            'status' => 200,
            'message' => $message,
            'course' => $course,
        ], 200);
    }


    public function deleteCourse(Request $request, $id)
    {
        // 1. Find the course
        $course = Course::where('id', $id)
                        ->where('user_id', $request->user()->id)
                        ->first();
    
        if ($course == null) {
            return response()->json(['message' => 'Course Not Found']);
        }
    
        if ($course->image) {
            $imagePath = public_path('uploads/course/' . $course->image);
            
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }
        }
    
        if (!empty($course->course_small_image)) {
            $smallPath = public_path('uploads/course/small/' . $course->course_small_image);
            if (File::exists($smallPath)) {
                File::delete($smallPath);
            }
        }
        $chapters = Chapter::where('course_id', $course->id)->get();
    
        foreach ($chapters as $chapter) {
            // Get lessons for this chapter
            $lessons = Lesson::where('chapter_id', $chapter->id)->get();
    
            foreach ($lessons as $lesson) {
                // Check if lesson has a video
                if ($lesson->video) {
                    $videoPath = public_path('uploads/lesson/videos/' . $lesson->video);
    
                    if (File::exists($videoPath)) {
                        File::delete($videoPath);
                    }
                }
            }
        }
        $course->delete();
    
        return response()->json([
            'status' => 200,
            'message' => 'Course and associated files deleted successfully'
        ], 200);
    }
};
