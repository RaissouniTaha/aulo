import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';

// Component imports
import HeroSlider from '@/components/homepage/HeroSlider';
import QuickAccess from '@/components/homepage/QuickAccess';
import AboutSection from '@/components/homepage/AboutSection';
import ServicesSection from '@/components/homepage/ServicesSection';
import StatisticsSection from '@/components/homepage/StatisticsSection';
import NewsSection from '@/components/homepage/NewsSection';
import AnnouncementsSection from '@/components/homepage/AnnouncementsSection';
import CallToAction from '@/components/shared/CallToAction';
import SpatialDataPreview from '@/components/maps/SpatialDataPreview';
import SEOHead from '@/components/shared/SEOHead';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

// API service imports
import { fetchHomePageContent, fetchNewsHighlights, fetchServiceHighlights } from '@/services/api';

const HomepageContainer = () => {
  const { t, i18n } = useTranslation('home');
  const currentLanguage = i18n.language;
  
  // Fetch homepage content
  const { 
    data: homepageData,
    isLoading: isLoadingHomepage,
    isError: isHomepageError,
    error: homepageError
  } = useQuery(
    ['homepageContent', currentLanguage], 
    () => fetchHomePageContent(currentLanguage),
    { staleTime: 1000 * 60 * 10 } // Cache for 10 minutes
  );
  
  // Fetch featured news
  const {
    data: newsData,
    isLoading: isLoadingNews,
    isError: isNewsError
  } = useQuery(
    ['newsHighlights', currentLanguage],
    () => fetchNewsHighlights(currentLanguage, 3),
    { staleTime: 1000 * 60 * 5 } // Cache for 5 minutes
  );
  
  // Fetch featured services
  const {
    data: servicesData,
    isLoading: isLoadingServices,
    isError: isServicesError
  } = useQuery(
    ['serviceHighlights', currentLanguage],
    () => fetchServiceHighlights(currentLanguage),
    { staleTime: 1000 * 60 * 30 } // Cache for 30 minutes
  );
  
  // Handle loading state
  if (isLoadingHomepage || isLoadingNews || isLoadingServices) {
    return <LoadingSpinner fullPage />;
  }
  
  // Handle error state
  if (isHomepageError || isNewsError || isServicesError) {
    return <ErrorDisplay error={homepageError} />;
  }
  
  // Extract data from response
  const { 
    hero_slides,
    quick_access,
    about_section,
    statistics,
    cta_section,
    seo,
    announcements
  } = homepageData;
  
  return (
    <>
      {/* SEO optimization */}
      <SEOHead
        title={seo?.title || t('home.defaultTitle')}
        description={seo?.description || t('home.defaultDescription')}
        keywords={seo?.keywords}
        ogImage={seo?.og_image?.url}
      />
      
      {/* Hero slider */}
      <HeroSlider slides={hero_slides} />
      
      {/* Quick access services section */}
      <QuickAccess items={quick_access} />
      
      {/* About agency section */}
      <AboutSection 
        title={about_section?.title}
        content={about_section?.content}
        image={about_section?.image}
        features={about_section?.features}
        stats={about_section?.stats}
        buttonText={about_section?.button_text}
        buttonUrl={about_section?.button_url}
      />
      
      {/* Services highlight section */}
      <ServicesSection 
        title={t('home.services.title')}
        subtitle={t('home.services.subtitle')}
        services={servicesData}
        viewAllLink="/services"
        viewAllText={t('common.viewAll')}
      />
      
      {/* Map data preview section */}
      <SpatialDataPreview 
        title={t('home.spatialData.title')} 
        subtitle={t('home.spatialData.subtitle')}
        mapConfig={{
          center: [homepageData?.map_center?.longitude || -7.62, homepageData?.map_center?.latitude || 33.57],
          zoom: homepageData?.map_zoom || 11
        }}
      />
      
      {/* Statistics counters section */}
      <StatisticsSection stats={statistics} />
      
      {/* Latest news section */}
      <NewsSection 
        title={t('home.latestNews.title')}
        subtitle={t('home.latestNews.subtitle')}
        news={newsData}
        viewAllLink="/news"
        viewAllText={t('common.viewAllNews')}
      />
      
      {/* Important announcements section (conditionally rendered) */}
      {announcements?.length > 0 && (
        <AnnouncementsSection 
          announcements={announcements} 
          title={t('home.announcements.title')}
        />
      )}
      
      {/* Call-to-action section */}
      <CallToAction
        title={cta_section?.title || t('home.cta.defaultTitle')}
        description={cta_section?.description || t('home.cta.defaultDescription')}
        primaryButtonText={cta_section?.primary_button_text || t('home.cta.contactUs')}
        primaryButtonUrl={cta_section?.primary_button_url || '/contact'}
        secondaryButtonText={cta_section?.secondary_button_text || t('home.cta.services')}
        secondaryButtonUrl={cta_section?.secondary_button_url || '/services'}
        backgroundImage={cta_section?.background_image?.url}
      />
    </>
  );
};

export default HomepageContainer;