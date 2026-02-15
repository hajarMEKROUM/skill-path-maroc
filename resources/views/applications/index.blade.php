<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mes Candidatures - Skill Path Maroc</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-50 font-sans p-8">

    <div class="max-w-6xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
            <a href="/freelance" class="text-blue-600 hover:text-blue-800 transition">
                <i class="fas fa-arrow-left text-xl"></i>
            </a>
            <h1 class="text-3xl font-bold text-gray-900">Mes Candidatures 📂</h1>
        </div>

        <div class="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <table class="w-full text-left">
                <thead class="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase text-sm">
                    <tr>
                        <th class="px-6 py-4 font-semibold">Projet / Entreprise</th>
                        <th class="px-6 py-4 font-semibold">Message</th>
                        <th class="px-6 py-4 font-semibold">Budget</th>
                        <th class="px-6 py-4 font-semibold text-center">Statut</th> {{-- العمود الجديد --}}
                        <th class="px-6 py-4 font-semibold text-center">Date</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    @forelse($applications as $application)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4">
                                <div class="font-bold text-gray-900">{{ $application->freelance->title }}</div>
                                <div class="text-sm text-gray-500 italic">{{ $application->freelance->company_name }}</div>
                            </td>
                            <td class="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                                {{ $application->message }}
                            </td>
                            <td class="px-6 py-4 text-blue-600 font-bold">
                                {{ $application->freelance->budget }}
                            </td>

                            {{-- عرض الحالة بألوان مختلفة --}}
                            <td class="px-6 py-4 text-center">
                                @if($application->status == 'en_attente')
                                    <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase">
                                        En attente ⏳
                                    </span>
                                @elseif($application->status == 'acceptée')
                                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                                        Acceptée ✅
                                    </span>
                                @else
                                    <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase">
                                        Refusée ❌
                                    </span>
                                @endif
                            </td>

                            <td class="px-6 py-4 text-center text-gray-500 text-xs">
                                {{ $application->created_at->format('d/m/Y') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500"> {{-- عدلنا colspan إلى 5 --}}
                                <i class="fas fa-folder-open text-4xl mb-4 block"></i>
                                Vous n'avez pas encore postulé à des offres.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

</body>
</html>