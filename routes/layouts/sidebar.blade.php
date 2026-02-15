<div class="sidebar">
    <a href="{{ url('/freelance') }}">Freelance</a>
    <a href="{{ url('/cours') }}">Cours</a>

    {{-- هذا الجزء سيظهر الآن رغماً عن أي شيء --}}
    <div class="mt-4 border-t pt-4">
        <a href="{{ route('admin.applications.index') }}" 
           style="background-color: #ebf5ff; color: #2563eb; display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 10px; text-decoration: none;">
            <i class="fas fa-user-shield"></i>
            <strong>Gestion Admin</strong>
        </a>
    </div>
</div>