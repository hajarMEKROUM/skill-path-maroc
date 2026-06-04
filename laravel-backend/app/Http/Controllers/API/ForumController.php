<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ForumComment;
use App\Models\ForumTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ForumController extends Controller
{
    public function index()
    {
        return response()->json(
            ForumTopic::with(['author', 'course'])
                ->withCount('comments')
                ->latest('is_pinned')
                ->latest()
                ->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'course_id' => 'nullable|exists:courses,id',
        ]);

        $topic = ForumTopic::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'slug' => Str::slug($validated['title']).'-'.uniqid(),
        ]);

        return response()->json($topic->load('author'), 201);
    }

    public function show(ForumTopic $topic)
    {
        return response()->json($topic->load(['author', 'course', 'comments.author']));
    }

    public function comment(Request $request, ForumTopic $topic)
    {
        $validated = $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:forum_comments,id',
        ]);

        $comment = ForumComment::create([
            ...$validated,
            'forum_topic_id' => $topic->id,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($comment->load('author'), 201);
    }
}
