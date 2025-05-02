import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const NewsSection: React.FC = () => {
  // Fetch latest news items
  const { data: newsItems, isLoading, error } = useQuery<News[]>({
    queryKey: ['/api/news?limit=3'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">Latest News & Announcements</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed about urban planning initiatives, regulatory updates, and community events.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(null).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">
              Error loading news. Please try again later.
            </div>
          ) : (
            newsItems?.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      className="w-full h-full object-cover transition-transform hover:scale-105" 
                      alt={item.title} 
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {format(new Date(item.publishDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {item.excerpt}
                  </p>
                  <Link to={`/news/${item.slug}`} className="text-primary hover:text-primary-800 font-medium inline-flex items-center">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="bg-white hover:bg-gray-100 text-primary border border-primary font-medium px-6 py-3 rounded-md transition-colors shadow-sm">
            <Link to="/news">
              View All News & Announcements
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
