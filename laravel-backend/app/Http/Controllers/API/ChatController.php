<?php

namespace App\Http\Controllers\API;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    /**
     * Alias for route definitions or cached routes that reference @index.
     */
    public function index(Request $request)
    {
        return $this->conversations($request);
    }

    public function conversations(Request $request)
    {
        $userId = (int) $request->user()->id;

        $conversations = Conversation::query()
            ->where(function ($query) use ($userId) {
                $query->where('user_one_id', $userId)
                    ->orWhere('user_two_id', $userId);
            })
            ->with([
                'userOne:id,name,avatar',
                'userTwo:id,name,avatar',
                'latestMessage.user:id,name',
            ])
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Conversation $conversation) => $this->formatConversation($conversation, $userId));

        return response()->json(['data' => $conversations]);
    }

    public function messages(Request $request, Conversation $conversation)
    {
        abort_unless($conversation->involvesUser($request->user()->id), 403);

        $messages = $conversation->messages()
            ->with('user:id,name')
            ->oldest()
            ->get()
            ->map(fn (Message $message) => $this->formatMessage($message));

        return response()->json(['data' => $messages]);
    }

    public function storeMessage(Request $request, Conversation $conversation)
    {
        abort_unless($conversation->involvesUser($request->user()->id), 403);

        $validated = $request->validate([
            'content' => 'nullable|string|max:5000',
            'attachment' => 'nullable|file|mimes:pdf,docx|max:5120',
        ]);

        if (empty($validated['content']) && ! $request->hasFile('attachment')) {
            return response()->json(['message' => 'Un message ou une piece jointe est requis.'], 422);
        }

        $attachmentPath = null;
        $attachmentType = null;
        $attachmentName = null;

        if ($request->hasFile('attachment')) {
            [$attachmentPath, $attachmentType, $attachmentName] = $this->upload($request->file('attachment'));
        }

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['content'] ?? '',
            'attachment_path' => $attachmentPath,
            'attachment_type' => $attachmentType,
            'attachment_name' => $attachmentName,
        ]);

        $conversation->touch();

        $message->load('user:id,name');
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($this->formatMessage($message), 201);
    }

    public function upload($file): array
    {
        $path = $file->store('attachments', 'public');

        return [
            $path,
            $file->getMimeType(),
            $file->getClientOriginalName(),
            Storage::url($path),
        ];
    }

    public function startConversation(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id|different:'.$request->user()->id,
            'job_id' => 'nullable|exists:freelance_jobs,id',
            'content' => 'nullable|string|max:5000',
        ]);

        $userId = (int) $request->user()->id;
        $recipientId = (int) $validated['recipient_id'];

        $pair = [$userId, $recipientId];
        sort($pair);

        $conversation = Conversation::firstOrCreate(
            [
                'user_one_id' => $pair[0],
                'user_two_id' => $pair[1],
            ],
            ['job_id' => $validated['job_id'] ?? null]
        );

        $message = null;
        if (! empty($validated['content'])) {
            $message = $conversation->messages()->create([
                'user_id' => $userId,
                'body' => $validated['content'],
            ]);
            $conversation->touch();

            $message->load('user:id,name');
            broadcast(new MessageSent($message))->toOthers();
        }

        $conversation->load(['userOne:id,name,avatar', 'userTwo:id,name,avatar']);

        return response()->json([
            'data' => $this->formatConversation($conversation, $userId),
            'message' => $message ? $this->formatMessage($message->load('user:id,name')) : null,
        ], 201);
    }

    protected function formatConversation(Conversation $conversation, int $viewerId): array
    {
        $other = $conversation->otherParticipant($viewerId);
        $last = $conversation->latestMessage;

        return [
            'id' => $conversation->id,
            'job_id' => $conversation->job_id,
            'other_user' => $other ? [
                'id' => $other->id,
                'name' => $other->name,
                'avatar' => $other->avatar,
            ] : null,
            'last_message' => $last ? $this->formatMessage($last) : null,
            'updated_at' => $conversation->updated_at,
        ];
    }

    protected function formatMessage(Message $message): array
    {
        return [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'content' => $message->body,
            'sender_id' => $message->user_id,
            'created_at' => $message->created_at,
            'attachment_url' => $message->attachment_path ? Storage::url($message->attachment_path) : null,
            'attachment_type' => $message->attachment_type,
            'attachment_name' => $message->attachment_name,
            'user' => $message->relationLoaded('user') && $message->user ? [
                'id' => $message->user->id,
                'name' => $message->user->name,
            ] : null,
        ];
    }

    public function searchUsers(Request $request)
    {
        $query = $request->input('search', $request->input('q'));

        if (empty($query) || strlen($query) < 2) {
            return response()->json(['data' => []]);
        }

        $users = User::where('name', 'like', "%{$query}%")
            ->where('id', '!=', $request->user()->id)
            ->limit(10)
            ->get(['id', 'name', 'avatar']);

        return response()->json(['data' => $users]);
    }
}
