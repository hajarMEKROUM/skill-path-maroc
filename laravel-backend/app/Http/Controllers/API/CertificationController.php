<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CertificationController extends Controller
{
    public function index(Request $request)
    {
        $certificates = Certificate::where('user_id', $request->user()->id)
            ->with('course')
            ->latest('issued_at')
            ->get()
            ->map(function (Certificate $certificate) {
                return [
                    'id' => $certificate->id,
                    'course_id' => $certificate->course_id,
                    'course_title' => $certificate->course?->title,
                    'certificate_number' => $certificate->certificate_number,
                    'status' => $certificate->status ?? 'validated',
                    'issued_at' => $certificate->issued_at,
                    'certificate_url' => $certificate->certificate_url,
                ];
            });

        return response()->json(['data' => $certificates]);
    }

    public function download(Request $request, $id)
    {
        $certificate = Certificate::where('user_id', $request->user()->id)
            ->with(['course', 'user'])
            ->findOrFail($id);

        $status = $certificate->status ?? 'validated';
        if ($status !== 'validated') {
            return response()->json([
                'message' => 'Cette certification n\'est pas encore validée.',
            ], 403);
        }

        $userName = $certificate->user->name;
        $courseTitle = $certificate->course?->title ?? 'Course';
        $issuedAt = $certificate->issued_at?->format('d/m/Y') ?? now()->format('d/m/Y');
        $number = $certificate->certificate_number;

        $html = <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Certification - {$courseTitle}</title>
  <style>
    body { font-family: Georgia, serif; text-align: center; padding: 48px; background: #f8fafc; }
    .card { background: white; border: 4px solid #7c3aed; border-radius: 16px; padding: 48px; max-width: 720px; margin: 0 auto; }
    h1 { color: #7c3aed; margin-bottom: 8px; }
    h2 { color: #1e293b; margin-top: 32px; }
    p { color: #475569; line-height: 1.6; }
    .number { margin-top: 24px; font-size: 14px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Skill Path Maroc</h1>
    <p>Certificat de réussite</p>
    <h2>{$userName}</h2>
    <p>a complété avec succès le parcours</p>
    <h2>{$courseTitle}</h2>
    <p>Délivré le {$issuedAt}</p>
    <p class="number">N° {$number}</p>
  </div>
</body>
</html>
HTML;

        $filename = 'certification-' . $certificate->id . '.html';

        return Response::make($html, 200, [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
