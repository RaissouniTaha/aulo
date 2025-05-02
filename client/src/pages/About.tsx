import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Page } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderPinwheel } from 'lucide-react';

// About page sections
const Mission: React.FC = () => {
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['/api/pages/mission'],
  });

  if (isLoading) return <div className="flex justify-center p-8"><LoaderPinwheel className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-red-500 p-8">Error loading content. Please try again later.</div>;
  if (!page) return <div className="p-8">No content available.</div>;

  return (
    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
  );
};

const Leadership: React.FC = () => {
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['/api/pages/leadership'],
  });

  if (isLoading) return <div className="flex justify-center p-8"><LoaderPinwheel className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-red-500 p-8">Error loading content. Please try again later.</div>;
  if (!page) return <div className="p-8">No content available.</div>;

  return (
    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
  );
};

const History: React.FC = () => {
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['/api/pages/history'],
  });

  if (isLoading) return <div className="flex justify-center p-8"><LoaderPinwheel className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-red-500 p-8">Error loading content. Please try again later.</div>;
  if (!page) return <div className="p-8">No content available.</div>;

  return (
    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
  );
};

const Reports: React.FC = () => {
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['/api/pages/reports'],
  });

  if (isLoading) return <div className="flex justify-center p-8"><LoaderPinwheel className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <div className="text-red-500 p-8">Error loading content. Please try again later.</div>;
  if (!page) return <div className="p-8">No content available.</div>;

  return (
    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
  );
};

// Main About component with tabs
const About: React.FC = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const defaultTab = path.includes('/about/leadership') ? 'leadership' :
                     path.includes('/about/history') ? 'history' :
                     path.includes('/about/reports') ? 'reports' : 'mission';

  const handleTabChange = (value: string) => {
    navigate(`/about/${value === 'mission' ? '' : value}`);
  };

  return (
    <div id="main-content" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <Card className="shadow-md">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-3xl font-bold">About Our Agency</CardTitle>
            <CardDescription className="text-white text-opacity-90">
              Learn about our mission, leadership, history, and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="mission">Our Mission</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="reports">Annual Reports</TabsTrigger>
              </TabsList>
              <Routes>
                <Route path="/" element={<Mission />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/history" element={<History />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
