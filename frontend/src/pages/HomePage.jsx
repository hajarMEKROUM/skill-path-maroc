import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, ChevronRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-background min-h-screen text-slate-200">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Subtle glow effect behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-400 font-medium text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                The #1 Moroccan Learning & Freelance Ecosystem
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-50 tracking-tight mb-6 leading-tight">
                Learn New Skills. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                  Land Your Dream Job.
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Skill Path Maroc connects ambitious students with expert instructors and enterprises with top-tier freelancers. Build your future today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/courses" className="btn-primary text-lg px-8 flex items-center justify-center gap-2 group">
                  Explore Courses 
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/marketplace" className="btn-secondary text-lg px-8 flex items-center justify-center gap-2">
                  Find Freelance Jobs
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
                    <h3 className="text-slate-50">500+ Courses</h3>
                    <p className="text-sm text-slate-400">From web dev to marketing</p>
                  </div>
                  <div className="card transform transition hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Students" className="w-full h-32 object-cover rounded-lg mb-4 opacity-80" />
                    <h3 className="text-slate-50">Expert Instructors</h3>
                    <p className="text-sm text-slate-400">Learn from the best in Morocco</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="card transform transition hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Freelancer" className="w-full h-32 object-cover rounded-lg mb-4 opacity-80" />
                    <h3 className="text-slate-50">Get Hired</h3>
                    <p className="text-sm text-slate-400">Connect with top enterprises</p>
                  </div>
                  <div className="card transform transition hover:-translate-y-1">
                    <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center text-accent-400 mb-4 border border-accent-500/30">
                      <Briefcase size={24} />
                    </div>
                    <h3 className="text-slate-50">1000+ Jobs</h3>
                    <p className="text-sm text-slate-400">Active freelance opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-y border-slate-800 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Trusted by top Moroccan enterprises</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500">
            {['OCP Group', 'Attijariwafa', 'Inwi', 'Maroc Telecom', 'Royal Air Maroc'].map((company, idx) => (
              <div key={idx} className="text-xl font-bold font-serif text-slate-300 flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surfaceHighlight border border-slate-700 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-600 opacity-20 blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-accent-600 opacity-20 blur-[80px]"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-6 relative z-10">Ready to accelerate your career?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of professionals on Skill Path Maroc. Whether you want to learn, teach, or hire - we have everything you need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/register" className="btn-primary text-lg">Create Free Account</Link>
              <Link to="/contact" className="btn-secondary text-lg">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
