import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, Users, Star, Award, ChevronRight, CheckCircle2 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                The #1 Moroccan Learning & Freelance Ecosystem
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                Learn New Skills. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                  Land Your Dream Job.
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
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
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  ))}
                </div>
                <span>Join 10,000+ Moroccans already learning</span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {/* Decorative background elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary-200 to-secondary-200 rounded-full blur-3xl opacity-50 z-0"></div>
              
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="card p-4 bg-white/80 backdrop-blur-sm shadow-xl transform transition hover:-translate-y-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">500+ Courses</h3>
                    <p className="text-sm text-gray-500">From web dev to marketing</p>
                  </div>
                  <div className="card p-4 bg-white/80 backdrop-blur-sm shadow-xl transform transition hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Students" className="w-full h-32 object-cover rounded-lg mb-4" />
                    <h3 className="font-bold text-gray-900">Expert Instructors</h3>
                    <p className="text-sm text-gray-500">Learn from the best in Morocco</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="card p-4 bg-white/80 backdrop-blur-sm shadow-xl transform transition hover:-translate-y-1">
                    <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Freelancer" className="w-full h-32 object-cover rounded-lg mb-4" />
                    <h3 className="font-bold text-gray-900">Get Hired</h3>
                    <p className="text-sm text-gray-500">Connect with top enterprises</p>
                  </div>
                  <div className="card p-4 bg-white/80 backdrop-blur-sm shadow-xl transform transition hover:-translate-y-1">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                      <Briefcase size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">1000+ Jobs</h3>
                    <p className="text-sm text-gray-500">Active freelance opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Trusted by top Moroccan enterprises</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['OCP Group', 'Attijariwafa', 'Inwi', 'Maroc Telecom', 'Royal Air Maroc'].map((company, idx) => (
              <div key={idx} className="text-xl font-bold font-serif text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-600 opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-secondary-600 opacity-20 blur-3xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to accelerate your career?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of professionals on Skill Path Maroc. Whether you want to learn, teach, or hire - we have everything you need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/register" className="btn-primary text-lg">Create Free Account</Link>
              <Link to="/contact" className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors duration-200">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
