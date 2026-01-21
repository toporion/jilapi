import React from 'react';
import { Leaf, Truck, Award, ShieldCheck } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "100% Organic Milk",
    desc: "Sourced from happy local cows. No hormones, just pure creaminess.",
    icon: <Leaf className="w-6 h-6 text-green-600" />,
    bg: "bg-green-100",
    delay: "0s"
  },
  {
    id: 2,
    title: "Fast Cold Delivery",
    desc: "Our thermal-tech packaging keeps scoops frozen for 60 mins.",
    icon: <Truck className="w-6 h-6 text-blue-600" />,
    bg: "bg-blue-100",
    delay: "1s" // Animation delay
  },
  {
    id: 3,
    title: "Master Chef Recipe",
    desc: "Recipes crafted by award-winning dessert chefs from Italy.",
    icon: <Award className="w-6 h-6 text-yellow-600" />,
    bg: "bg-yellow-100",
    delay: "2s"
  },
  {
    id: 4,
    title: "Zero Preservatives",
    desc: "Eat fresh, feel fresh. We make our batches daily at 4 AM.",
    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
    bg: "bg-purple-100",
    delay: "3s"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      
      {/* --- Wavy SVG Separator at the top --- */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            Why We Are <span className="text-pink-500 underline decoration-wavy decoration-yellow-400">The Best</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
             We don't just sell ice cream; we sell frozen memories. Here is the scoop on our quality.
          </p>
        </div>

        {/* The Layout: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* --- Left Column (Features 1 & 2) --- */}
          <div className="space-y-12">
            {features.slice(0, 2).map((feature) => (
               <div 
                  key={feature.id} 
                  className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl hover:shadow-pink-200/50 transition-all duration-300 hover:-translate-y-2"
               >
                  <div className={`absolute -top-6 left-8 w-14 h-14 ${feature.bg} rounded-2xl rotate-12 flex items-center justify-center shadow-sm group-hover:rotate-0 transition-all duration-300`}>
                     {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
               </div>
            ))}
          </div>

          {/* --- Center Column (The GIANT visual) --- */}
          <div className="relative h-[500px] flex items-center justify-center">
             {/* Animated Background Circles behind the image */}
             <div className="absolute w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
             <div className="absolute w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 left-10"></div>

             {/* The Center Image (Use a transparent PNG of a Sundae here) */}
             {/* We apply a subtle 'float' animation to the image itself */}
             <img 
               src="https://images.unsplash.com/photo-1560008581-09826d1de69e?q=80&w=600&auto=format&fit=crop" 
               alt="Giant Sundae" 
               className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float"
             />
          </div>

          {/* --- Right Column (Features 3 & 4) --- */}
          <div className="space-y-12">
            {features.slice(2, 4).map((feature) => (
               <div 
                  key={feature.id} 
                  className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl hover:shadow-pink-200/50 transition-all duration-300 hover:-translate-y-2"
               >
                  <div className={`absolute -top-6 left-8 w-14 h-14 ${feature.bg} rounded-2xl rotate-12 flex items-center justify-center shadow-sm group-hover:rotate-0 transition-all duration-300`}>
                     {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
               </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;