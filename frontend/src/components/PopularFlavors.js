import React from 'react';
import Tilt from 'react-parallax-tilt';
import { ShoppingBag, Heart, Star } from 'lucide-react';

// Mock Data - In a real MERN app, you'd fetch this from your MongoDB
const flavors = [
    {
        id: 1,
        name: "Midnight Berry",
        description: "Dark chocolate mixed with fresh blueberries.",
        price: "$4.50",
        rating: 4.8,
        color: "bg-indigo-100",
        btnColor: "bg-indigo-600",
        img: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?q=80&w=400&auto=format&fit=crop" // Blueberry
    },
    {
        id: 2,
        name: "Strawberry Bliss",
        description: "Fresh strawberries with a hint of vanilla bean.",
        price: "$3.99",
        rating: 4.9,
        color: "bg-pink-100",
        btnColor: "bg-pink-500",
        img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=400&auto=format&fit=crop" // Strawberry
    },
    {
        id: 3,
        name: "Minty Madness",
        description: "Refreshing mint with chunky chocolate chips.",
        price: "$4.25",
        rating: 4.7,
        color: "bg-green-100",
        btnColor: "bg-green-500",
        img: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=400&auto=format&fit=crop" // Mint
    }
];

const PopularFlavors = () => {
    return (
        <section className="py-20 bg-white" id="flavors">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-pink-500 font-bold tracking-wider uppercase text-sm">Sweet Selections</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">
                        Top Picks of the Week 🍦
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        These are the flavors that our customers are going crazy for! Grab them before they melt away.
                    </p>
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {flavors.map((iceCream) => (
                        <Tilt 
                            key={iceCream.id} 
                            tiltMaxAngleX={5} 
                            tiltMaxAngleY={5} 
                            scale={1.02} 
                            transitionSpeed={400}
                            className="h-full"
                        >
                            <div className={`relative group rounded-3xl p-6 h-full border border-white shadow-xl hover:shadow-2xl transition-all duration-300 ${iceCream.color}`}>
                                
                                {/* Favorite Heart Icon (Top Right) */}
                                <button className="absolute top-6 right-6 p-2 bg-white/60 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors z-10">
                                    <Heart className="w-5 h-5" />
                                </button>

                                {/* Image Area with "Pop out" effect on hover */}
                                <div className="relative h-64 mb-6 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-white/30 rounded-full filter blur-2xl transform group-hover:scale-110 transition-transform duration-500"></div>
                                    <img 
                                        src={iceCream.img} 
                                        alt={iceCream.name}
                                        className="w-52 h-52 object-cover rounded-full shadow-lg transform group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-500 z-10 border-4 border-white"
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-bold text-gray-800">{iceCream.name}</h3>
                                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="font-bold text-sm">{iceCream.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {iceCream.description}
                                    </p>

                                    {/* Price & Add Button */}
                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/5">
                                        <span className="text-2xl font-black text-gray-900">{iceCream.price}</span>
                                        
                                        <button className={`${iceCream.btnColor} text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 transition-all`}>
                                            <ShoppingBag className="w-4 h-4" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Tilt>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PopularFlavors;