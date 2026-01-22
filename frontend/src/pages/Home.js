
import HeroSection from '../components/HeroSection';
import PopularFlavors from '../components/PopularFlavors';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';

const Home = () => {
    return (
        <div>
           <HeroSection/>
           <PopularFlavors/>
           <WhyChooseUs/>
           <Testimonials/>
        </div>
    );
};

export default Home;