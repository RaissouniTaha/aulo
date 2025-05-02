import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the slide data structure
interface Slide {
  title: string;
  description: string;
  imageUrl: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
}

const slides: Slide[] = [
  {
    title: "Shaping Urban Development For Tomorrow",
    description: "Providing comprehensive urban planning services, regulatory oversight, and community development initiatives.",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    primaryButtonText: "Explore Our Services",
    primaryButtonUrl: "/services",
    secondaryButtonText: "Contact Us",
    secondaryButtonUrl: "/contact"
  },
  {
    title: "Building Sustainable Communities",
    description: "Creating environmentally conscious urban spaces that balance development needs with ecological preservation.",
    imageUrl: "https://images.unsplash.com/photo-1518799118562-c31578e8a60f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    primaryButtonText: "Sustainability Plans",
    primaryButtonUrl: "/services/planning",
    secondaryButtonText: "Learn More",
    secondaryButtonUrl: "/about"
  },
  {
    title: "Smart Urban Planning Solutions",
    description: "Leveraging technology and data to create more efficient, livable, and responsive urban environments.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    primaryButtonText: "Smart City Initiatives",
    primaryButtonUrl: "/services/smart-city",
    secondaryButtonText: "View Maps",
    secondaryButtonUrl: "/maps"
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Change slide every 7 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const currentSlideData = slides[currentSlide];
  
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={currentSlideData.imageUrl} 
          className="w-full h-full object-cover transition-opacity duration-500" 
          alt="Urban planning and development" 
        />
        <div className="absolute inset-0 bg-primary-900 bg-opacity-70"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-24 md:py-36">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{currentSlideData.title}</h2>
          <p className="text-lg md:text-xl mb-8">{currentSlideData.description}</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-accent hover:bg-accent-700 text-white font-medium px-6 py-3 rounded-md transition-colors shadow-md">
              <Link to={currentSlideData.primaryButtonUrl}>
                {currentSlideData.primaryButtonText}
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-white hover:bg-gray-100 text-primary-700 font-medium px-6 py-3 rounded-md transition-colors shadow-md">
              <Link to={currentSlideData.secondaryButtonUrl}>
                {currentSlideData.secondaryButtonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Slide navigation dots */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white opacity-100' : 'bg-white opacity-50'}`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
      
      {/* Arrow navigation */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/30 text-white hover:bg-white/50 transition-colors"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
};

export default HeroSlider;
