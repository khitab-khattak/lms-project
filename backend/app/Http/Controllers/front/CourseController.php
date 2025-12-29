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
        $course = Course::with(['chapters','chapters.lessons'])->find($id);
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
            'sellPrice' => 'required|numeric',
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
        $course->status       = 0;

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
            'message' => 'Image & thumbnail uploaded successfully',
            'image' => $course->image,
            'course_small_image' => asset('uploads/course/small/' . $course->image),
        ], 200);
    }
};
