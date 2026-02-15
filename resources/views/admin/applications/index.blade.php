<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Gestion des Candidatures</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-100 font-sans p-8">

    <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">Gestion des Candidatures (Admin) 🛠️</h1>
            <div class="flex gap-4">
                <a href="/freelance" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                    <i class="fas fa-eye mr-2"></i> Vue Client
                </a>
            </div>
        </div>

        {{-- رسالة النجاح عند التحديث --}}
        @if(session('success'))
            <div class="mb-6 p-4 bg-green-500 text-white rounded-lg shadow-md flex justify-between items-center">
                <span><i class="fas fa-check-circle mr-2"></i> {{ session('success') }}</span>
                <button onclick="this.parentElement.remove()" class="text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        @endif

        <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-4 text-gray-700 font-bold uppercase text-xs">Candidat</th>
                        <th class="px-6 py-4 text-gray-700 font-bold uppercase text-xs">Projet / Entreprise</th>
                        <th class="px-6 py-4 text-gray-700 font-bold uppercase text-xs">Message de Motivation</th>
                        <th class="px-6 py-4 text-gray-700 font-bold uppercase text-xs text-center">Statut Actuel</th>
                        <th class="px-6 py-4 text-gray-700 font-bold uppercase text-xs text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($applications as $application)
                        <tr class="hover:bg-blue-50/30 transition">
                            <td class="px-6 py-4">
                                {{-- جلب اسم المستخدم من العلاقة في الموديل --}}
                                <div class="font-bold text-gray-900">{{ $application->user->name ?? 'Utilisateur #'.$application->user_id }}</div>
                                <div class="text-[10px] text-gray-400">Inscrit le: {{ $application->user->created_at->format('d/m/Y') ?? '' }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-gray-800">{{ $application->freelance->title }}</div>
                                <div class="text-xs text-blue-500 italic">{{ $application->freelance->company_name }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm text-gray-500 max-w-xs break-words">
                                    {{ $application->message }}
                                </p>
                            </td>
                            <td class="px-6 py-4 text-center">
                                @if($application->status == 'en_attente')
                                    <span class="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-[10px] font-black uppercase border border-yellow-200">En attente</span>
                                @elseif($application->status == 'acceptée')
                                    <span class="px-2 py-1 bg-green-100 text-green-600 rounded text-[10px] font-black uppercase border border-green-200">Acceptée</span>
                                @else
                                    <span class="px-2 py-1 bg-red-100 text-red-600 rounded text-[10px] font-black uppercase border border-red-200">Refusée</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                               <div class="flex justify-center gap-3">
    {{-- زر القبول --}}
    <form action="{{ route('admin.applications.updateStatus', $application->id) }}" method="POST">
        @csrf @method('PATCH')
        <input type="hidden" name="status" value="acceptée">
        <button type="submit" class="bg-green-500 text-white p-2.5 rounded-lg hover:bg-green-600 transition">
            <i class="fas fa-check"></i>
        </button>
    </form>

    {{-- زر الرفض --}}
    <form action="{{ route('admin.applications.updateStatus', $application->id) }}" method="POST">
        @csrf @method('PATCH')
        <input type="hidden" name="status" value="refusée">
        <button type="submit" class="bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600 transition">
            <i class="fas fa-times"></i>
        </button>
    </form>

    {{-- زر الحذف الجديد 🗑️ --}}
    <form action="{{ route('admin.applications.destroy', $application->id) }}" method="POST" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce message ?')">
        @csrf @method('DELETE')
        <button type="submit" class="bg-gray-400 text-white p-2.5 rounded-lg hover:bg-gray-700 transition">
            <i class="fas fa-trash-alt"></i>
        </button>
    </form>
</div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-10 text-center text-gray-400 italic">
                                Aucune candidature n'a été déposée pour le moment.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // نحدد عنصر التنبيه
        const alertElement = document.querySelector('.bg-green-500');
        
        if (alertElement) {
            // ننتظر 3 ثوانٍ ثم نبدأ عملية الإخفاء
            setTimeout(() => {
                alertElement.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                alertElement.style.opacity = "0";
                alertElement.style.transform = "translateY(-20px)";
                
                // نحذف العنصر نهائياً بعد انتهاء الأنميشن
                setTimeout(() => alertElement.remove(), 600);
            }, 3000);
        }
    });
</script>


</body>
</html>