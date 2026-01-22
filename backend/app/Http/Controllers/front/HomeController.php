<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function fetch_categories()
    {
        $categories = Category::orderBy('name', 'ASC')->get();
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
            ->get();
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
        $courses = Course::where('status', 1);
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

        $courses = $courses->get();


        return response()->json([
            'status' => 200,
            'courses' => $courses
        ], 200);
    }

    public function levels()
    {
        $levels = Level::where('status', 1)->orderBy('created_at','ASC')->get();
        return response()->json([
            'status' => 200,
            'levels' => $levels,
        ], 200);
    }

    public function languages()
    {
        $languages = Language::where('status', 1)->orderBy('name','ASC')->get();
        return response()->json([
            'status' => 200,
            'languages' => $languages,
        ], 200);
    }
}
