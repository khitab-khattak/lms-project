<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function fetch_categories()
    {
        $categories = Category::orderBy('created_at', 'ASC')->get();
        if ($categories == null) {
            return response()->json([
                'message' => 'Categories not found'
            ]);
        }
        return response()->json([
            'status' => 200,
            'categories' => $categories
        ], 200);
    }

    public function featuredCourses()
    {
        $courses = Course::where('is_featured', 'yes')
            ->where('status', 1)
            ->orderBy('title', 'ASC')
            ->with('levels')
            ->withCount('reviews')
            ->withSum('reviews', 'rating')
            ->get();
            $courses->map(function ($course) {
                $course->rating = $course->reviews_count > 0
                    ? round($course->reviews_sum_rating / $course->reviews_count, 1)
                    : 0.0;
            
                return $course;
            });
        if ($courses == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Courses Not Found'
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'courses' => $courses
        ], 200);
    }

    public function courses(Request $request)
    {
        $courses = Course::where('status', 1)
        ->withCount('reviews')
        ->withSum('reviews', 'rating');
        //filter Course by title
        if (!empty($request->keyword)) {
            $courses = $courses->where('title', 'like', '%' . $request->keyword . '%');
        }

        //filter courses by category
        if (!empty($request->category)) {
            $categoryArr = explode(',', $request->category);
            if (!empty($categoryArr)) {
                $courses = $courses->whereIn('category_id', $categoryArr);
            }
        }

        //filter courses by levels
        if (!empty($request->level)) {
            $levelArr = explode(',', $request->level);
            if (!empty($levelArr)) {
                $courses = $courses->whereIn('level_id', $levelArr);
            }
        }
        //filter courses by languages
        if (!empty($request->language)) {
            $languageArr = explode(',', $request->language);
            if (!empty($languageArr)) {
                $courses = $courses->whereIn('language_id', $languageArr);
            }
        }

        if (!empty($request->sort)) {
            $sortArr = ['asc', 'desc'];
            if (in_array($request->sort, $sortArr)) {
                $courses->orderBy('created_at', $request->sort);
            } else {
                $courses->orderBy('created_at', 'DESC');
            }
        }

        $courses = $courses->orderBy('title', 'ASC')->get();

        $courses->map(function ($course) {
            $course->rating = $course->reviews_count > 0
                ? round($course->reviews_sum_rating / $course->reviews_count, 1)
                : 0.0;
        
            return $course;
        });

        return response()->json([
            'status' => 200,
            'courses' => $courses
        ], 200);
    }

    public function levels()
    {
        $levels = Level::where('status', 1)->orderBy('created_at', 'ASC')->get();
        return response()->json([
            'status' => 200,
            'levels' => $levels,
        ], 200);
    }

    public function languages()
    {
        $languages = Language::where('status', 1)->orderBy('name', 'ASC')->get();
        return response()->json([
            'status' => 200,
            'languages' => $languages,
        ], 200);
    }

    public function course($id)
    {
        // 1. Use 'with' to eager load all relationships in one query
        // 2. Find the course by ID
        $course = Course::where('id', $id)
            ->withCount('chapters')
            ->withCount('reviews')
            ->withSum('reviews', 'rating')
            ->with([
                'levels',
                'reviews',
                'reviews.user',
                'category',
                'language',
                'requirements',
                'outcomes',
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }]);
                    $query->withSum((['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }]), 'duration');
                },
                'chapters.lessons' => function ($q) {
                    $q->where('status', 1);
                    $q->whereNotNull('video');
                }
            ])->first();

        $totalduration = $course->chapters->sum('lessons_sum_duration');
        $totallessons = $course->chapters->sum('lessons_count');

        $course->totalduration = $totalduration;
        $course->totallessons = $totallessons;
        $course->rating = $course->reviews_count > 0
                ? round($course->reviews_sum_rating / $course->reviews_count, 1)
                : 0.0;
        

        // Check if course exists to avoid errors
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Course details retrieved successfully',
            'course' => $course
        ], 200);
    }

    public function enroll(Request $request)
    {
        // 1. Fix the Course check (Assuming you are passing course_id in the request)
        $course = Course::find($request->course_id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found',
            ], 404);
        }

        // 2. Fix the Duplicate Check (You must add ->count() at the end)
        $count = Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $request->course_id)
            ->count(); // ✅ Crucial: actually run the count query

        if ($count > 0) {
            return response()->json([
                'status' => 409,
                'message' => 'Already Enrolled',
            ], 409);
        }

        // 3. Save Enrollment
        $enrolluser = new Enrollment();
        $enrolluser->user_id = $request->user()->id;
        $enrolluser->course_id = $request->course_id;
        $enrolluser->save();

        return response()->json([
            'status' => 200,
            'message' => 'User Enrolled Successfully',
            'enroll' => $enrolluser
        ], 200);
    }
}
