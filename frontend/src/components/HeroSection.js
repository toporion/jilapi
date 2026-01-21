
import { ArrowRight, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#fff5f7] flex items-center pt-20 overflow-hidden pb-28">
      
      {/* --- Background Blobs (Funky Decor) --- */}
      <div className="absolute top-20 left-[-50px] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-20 right-[-50px] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          
          {/* --- LEFT SIDE: Text Content --- */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-pink-200 shadow-sm text-pink-500 text-sm font-semibold animate-bounce-slow">
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
              <span>Blueberry Burst is back! 🫐</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Scoops of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                Pure Happiness
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              Handcrafted artisan ice cream made with 100% organic milk and real fruit chunks. Life is short, eat the dessert first!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-4">
              <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-lg shadow-gray-900/20 hover:scale-105 transition-transform">
                Order Now <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors">
                View Menu
              </button>
            </div>

            {/* Social Proof / Trust */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                        <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    ))}
                </div>
                <div className="text-left">
                    <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">500+ Yummy Reviews</p>
                </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: Hero Image --- */}
          <div className="flex-1 relative">
             {/* Placeholder for your actual ice cream image */}
             {/* If you don't have an image yet, use a div as a placeholder or a free Unsplash link */}
             <div className="relative z-10 w-full max-w-lg mx-auto transform hover:rotate-6 transition-transform duration-500">
                <img 
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop" 
                    alt="Delicious Ice Cream Cone" 
                    className="rounded-3xl shadow-2xl border-8 border-white rotate-[-6deg]"
                />
                
                {/* Floating Price Tag */}
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl rotate-6 animate-pulse">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Starting at</p>
                    <p className="text-3xl font-extrabold text-pink-500">$2.99</p>
                </div>
             </div>
             
             {/* Decor behind image */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full opacity-30 blur-3xl -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;