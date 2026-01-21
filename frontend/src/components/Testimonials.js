
import { Quote } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "Sarah J.",
        role: "Chocoholic",
        text: "I literally drove 40 mins just for the Midnight Berry. It's not food, it's a spiritual experience!",
        img: "https://i.pravatar.cc/150?img=5",
        bg: "bg-pink-50"
    },
    {
        id: 2,
        name: "Mike T.",
        role: "Gym Trainer",
        text: "The zero-sugar options actually taste good. Finally I can cheat on my diet without guilt.",
        img: "https://i.pravatar.cc/150?img=11",
        bg: "bg-blue-50"
    },
    {
        id: 3,
        name: "Emily R.",
        role: "Mom of 3",
        text: "My kids stopped crying instantly. 10/10 would buy again just for the silence.",
        img: "https://i.pravatar.cc/150?img=9",
        bg: "bg-yellow-50"
    },
    {
        id: 4,
        name: "David K.",
        role: "Food Blogger",
        text: "Texture is 100% better than store bought. You can taste the cream quality.",
        img: "https://i.pravatar.cc/150?img=3",
        bg: "bg-green-50"
    }
];

const Testimonials = () => {
    return (
        <section className="py-12 bg-white mb-20 md:mb-0"> {/* Margin bottom for mobile nav */}
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-black text-center text-gray-800 mb-8">
                    Fan <span className="text-pink-500">Favorites</span> 💖
                </h2>

                {/* MOBILE APP TRICK: 
                   'overflow-x-auto' allows side scrolling.
                   'snap-x' makes it lock into place like a real app carousel.
                   'scrollbar-hide' hides the ugly browser scrollbar (add utility in CSS).
                */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide px-4">
                    {reviews.map((review) => (
                        <div 
                            key={review.id} 
                            className={`min-w-[85%] md:min-w-[350px] snap-center p-6 rounded-3xl ${review.bg} border-2 border-transparent hover:border-pink-200 transition-all`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">{review.role}</p>
                                </div>
                                <Quote className="w-8 h-8 text-black/5 ml-auto fill-current transform rotate-180" />
                            </div>
                            <p className="text-gray-700 font-medium italic">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;