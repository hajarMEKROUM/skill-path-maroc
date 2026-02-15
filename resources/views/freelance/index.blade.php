<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Opportunités Freelance - Skill Path Maroc</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-50 font-sans">

    <div class="flex h-screen">
        <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div class="p-6 flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <i class="fas fa-graduation-cap text-sm"></i>
                </div>
                <span class="font-bold text-gray-800">Skill Path Maroc</span>
            </div>
            <nav class="flex-1 px-4 space-y-2">
                <a href="#" class="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <i class="fas fa-th-large"></i> Tableau de bord
                </a>
                <a href="#" class="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <i class="fas fa-book"></i> Cours
                </a>
                
                {{-- زر Freelance - سيصبح أزرق عند التواجد في صفحة الوظائف --}}
                <a href="/freelance" class="flex items-center gap-3 p-3 {{ Request::is('freelance') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100' }} rounded-lg font-medium transition">
                    <i class="fas fa-briefcase"></i> Freelance
                </a>

                {{-- زر Mes candidatures - قمنا بربطه بالمسار الجديد --}}
                <a href="{{ route('applications.index') }}" class="flex items-center gap-3 p-3 {{ Request::is('my-applications') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100' }} rounded-lg transition">
                    <i class="fas fa-file-alt"></i> Mes candidatures
                </a>

                <a href="#" class="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <i class="fas fa-comments"></i> Messages
                </a>
                <a href="#" class="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <i class="fas fa-user"></i> Profil
                </a>
            </nav>
        </aside>

        <main class="flex-1 overflow-y-auto">
            <header class="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
                <div class="relative w-96">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <i class="fas fa-search"></i>
                    </span>
                    <input type="text" placeholder="Rechercher un projet..." class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                </div>
                <div class="flex items-center gap-4">
                    <button class="text-gray-500 relative">
                        <i class="far fa-bell text-xl"></i>
                        <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange-500 border-2 border-white"></span>
                    </button>
                    <div class="flex items-center gap-2 border-l pl-4">
                        <span class="text-sm font-medium">Ahmed Bennani</span>
                        <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">AB</div>
                    </div>
                </div>
            </header>

            <div class="p-8 max-w-5xl mx-auto">
                {{-- عرض رسالة النجاح --}}
                @if(session('success'))
                    <div class="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 flex items-center justify-between rounded-r shadow-sm">
                        <div class="flex items-center">
                            <i class="fas fa-check-circle mr-3"></i>
                            <p class="font-medium">{{ session('success') }}</p>
                        </div>
                        <button onclick="this.parentElement.remove()" class="text-green-500 hover:text-green-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                @endif

                <h1 class="text-2xl font-bold text-gray-900">Opportunités Freelance</h1>
                <p class="text-gray-500 mb-6">Trouvez des projets qui correspondent à vos compétences</p>

                <div class="flex gap-4 border-b border-gray-200 mb-6">
                    <a href="/freelance" class="pb-2 border-b-2 border-blue-600 text-blue-600 font-medium">Parcourir les offres</a>
                    <a href="{{ route('applications.index') }}" class="pb-2 text-gray-500 hover:text-gray-700 transition">Mes candidatures</a>
                </div>

                {{-- Recommandations IA Card --}}
                <div class="bg-blue-600 rounded-xl p-6 text-white mb-8 relative overflow-hidden">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-white/20 rounded-lg">
                            <i class="fas fa-magic"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold mb-1">Recommandations IA</h3>
                            <p class="text-blue-100 text-sm mb-4">Ces {{ $freelances->count() }} offres correspondent à votre profil</p>
                            <button class="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition">
                                Voir les recommandations
                            </button>
                        </div>
                    </div>
                </div>

                {{-- Skills Filters --}}
                <div class="flex flex-wrap gap-2 mb-8">
                    @php $filterSkills = ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Figma', 'UI Design', 'Python']; @endphp
                    @foreach($filterSkills as $filter)
                        <button class="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition text-nowrap">
                            {{ $filter }}
                        </button>
                    @endforeach
                </div>

                {{-- Freelance Grid --}}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    @forelse($freelances as $freelance)
                        <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-bold text-gray-900">{{ $freelance->title }}</h3>
                                    <p class="text-xs text-gray-500">
                                        <i class="fas fa-building mr-1"></i> {{ $freelance->company_name }}
                                    </p>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                                {{ $freelance->description }}
                            </p>
                            <div class="flex gap-4 text-xs text-blue-600 font-bold mb-4">
                                <span><i class="fas fa-money-bill-wave mr-1"></i> {{ $freelance->budget }}</span>
                                <span><i class="far fa-clock mr-1"></i> {{ $freelance->duration }}</span>
                            </div>

                            <div class="flex flex-wrap gap-2 mb-6">
                                @php $currentSkills = json_decode($freelance->skills) ?? []; @endphp
                                @foreach($currentSkills as $skill)
                                    <span class="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] rounded">
                                        {{ $skill }}
                                    </span>
                                @endforeach
                            </div>

                            <button onclick="openModal('{{ $freelance->id }}', '{{ $freelance->title }}')" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                                Postuler
                            </button>
                        </div>
                    @empty
                        <div class="col-span-full text-center py-10 text-gray-500">
                            Aucune offre disponible pour le moment.
                        </div>
                    @endforelse
                </div>
            </div>
        </main>
    </div>

    {{-- Modal --}}
    <div id="postulationModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900">Postuler pour : <span id="jobTitleDisplay" class="text-blue-600"></span></h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form action="{{ route('applications.store') }}" method="POST">
                @csrf
                <input type="hidden" name="freelance_id" id="jobIdInput">
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Votre message de motivation</label>
                    <textarea rows="4" name="message" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Expliquez pourquoi vous êtes le candidat idéal..." required></textarea>
                </div>
                
                <div class="flex gap-3">
                    <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-bold">
                        Annuler
                    </button>
                    <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">
                        Envoyer ma candidature
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const modal = document.getElementById('postulationModal');
        const jobTitleDisplay = document.getElementById('jobTitleDisplay');
        const jobIdInput = document.getElementById('jobIdInput');

        function openModal(id, title) {
            jobIdInput.value = id;
            jobTitleDisplay.innerText = title;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden'; 
        }

        function closeModal() {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = 'auto'; 
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }
    </script>

</body>
</html>