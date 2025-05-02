import React from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import QuickAccess from '@/components/home/QuickAccess';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import MapPreview from '@/components/home/MapPreview';
import StatisticsSection from '@/components/home/StatisticsSection';
import NewsSection from '@/components/home/NewsSection';
import CallToAction from '@/components/home/CallToAction';

const Home: React.FC = () => {
  return (
    <div id="main-content">
      <HeroSlider />
      <QuickAccess />
      <AboutSection />
      <ServicesSection />
      <MapPreview />
      <StatisticsSection />
      <NewsSection />
      <CallToAction />
    </div>
  );
};

export default Home;
