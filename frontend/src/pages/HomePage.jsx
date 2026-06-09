import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, ChevronRight, Star } from 'lucide-react';
import useAuthStore from '../store/authStore';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Youssef El Mansouri',
    role: 'Développeur Full Stack',
    avatar: 'YE',
    rating: 5,
    text: 'Skill Path Maroc m\'a permis de passer de débutant à développeur employé en moins de 6 mois. Les cours sont pratiques et adaptés au marché marocain.',
  },
  {
    id: 2,
    name: 'Sara Benali',
    role: 'Étudiante en Data Science',
    avatar: 'SB',
    rating: 5,
    text: 'La plateforme est intuitive et les instructeurs sont très réactifs. J\'ai obtenu mon certificat et décroché un stage grâce au réseau communautaire.',
  },
  {
    id: 3,
    name: 'Karim Tahiri',
    role: 'Freelance Web Developer',
    avatar: 'KT',
    rating: 4,
    text: 'Grâce à l\'espace freelance, j\'ai trouvé mes premières missions en quelques semaines. Une vraie passerelle entre la formation et l\'emploi au Maroc.',
  },
  {
    id: 4,
    name: 'Fatima Zahra Idrissi',
    role: 'Chef de projet digital',
    avatar: 'FI',
    rating: 5,
    text: 'En tant qu\'entreprise, nous avons recruté trois talents formés sur Skill Path. La qualité des profils est remarquable et le processus est simple.',
  },
  {
    id: 5,
    name: 'Omar Bennani',
    role: 'Développeur Mobile',
    avatar: 'OB',
    rating: 5,
    text: 'Les parcours de formation sont bien structurés avec des projets concrets. Le test de positionnement m\'a aidé à choisir le bon cursus dès le départ.',
  },
  {
    id: 6,
    name: 'Nadia Alaoui',
    role: 'UX/UI Designer',
    avatar: 'NA',
    rating: 4,
    text: 'Une communauté active et bienveillante. J\'ai pu échanger avec d\'autres apprenants et recevoir des retours précieux sur mes projets portfolio.',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
      />
    ))}
  </div>
);

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-background min-h-screen text-slate-200">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-400 font-medium text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                </span>
                L&apos;écosystème marocain de l&apos;apprentissage et du freelance
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-50 tracking-tight mb-6 leading-tight">
                Apprenez de nouvelles compétences. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                  Décrochez le job de vos rêves.
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Skill Path Maroc connecte les étudiants ambitieux aux meilleurs formateurs et les entreprises aux freelances les plus qualifiés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/courses" className="btn-primary text-lg px-8 flex items-center justify-center gap-2 group">
                  Explorer les cours
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/marketplace" className="btn-secondary text-lg px-8 flex items-center justify-center gap-2">
                  Trouver des missions
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="card transform transition hover:-translate-y-1">
                    <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400 mb-4 border border-primary-500/30">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-slate-50">500+ Cours</h3>
                    <p className="text-sm text-slate-400">Du web dev au marketing</p>
                  </div>
                  <div className="card transform transition hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Étudiants" className="w-full h-32 object-cover rounded-lg mb-4 opacity-80" />
                    <h3 className="text-slate-50">Formateurs experts</h3>
                    <p className="text-sm text-slate-400">Les meilleurs du Maroc</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="card transform transition hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Freelance" className="w-full h-32 object-cover rounded-lg mb-4 opacity-80" />
                    <h3 className="text-slate-50">Trouvez un emploi</h3>
                    <p className="text-sm text-slate-400">Connectez-vous aux entreprises</p>
                  </div>
                  <div className="card transform transition hover:-translate-y-1">
                    <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center text-accent-400 mb-4 border border-accent-500/30">
                      <Briefcase size={24} />
                    </div>
                    <h3 className="text-slate-50">1000+ Offres</h3>
                    <p className="text-sm text-slate-400">Missions freelance actives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 border-y border-slate-800 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">Témoignages</p>
            <h2 className="text-3xl font-bold text-slate-50">Ce que disent nos apprenants</h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
              Des milliers de professionnels marocains font confiance à Skill Path Maroc pour développer leur carrière.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="card p-6 flex flex-col gap-4 hover:border-primary-500/30 transition-colors">
                <StarRating rating={t.rating} />
                <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-slate-100 font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — masqué si connecté */}
      {!isAuthenticated && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-surfaceHighlight border border-slate-700 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-600 opacity-20 blur-[80px]" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-accent-600 opacity-20 blur-[80px]" />

              <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6 relative z-10">Prêt à accélérer votre carrière ?</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                Rejoignez des milliers de professionnels sur Skill Path Maroc. Apprenez, enseignez ou recrutez — tout est là.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Link to="/register" className="btn-primary text-lg">Créer un compte gratuit</Link>
                <Link to="/courses" className="btn-secondary text-lg">Découvrir les cours</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
