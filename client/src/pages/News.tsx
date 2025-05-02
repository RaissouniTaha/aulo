import React from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { News as NewsType } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoaderPinwheel, Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

// News Detail component
const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: newsItem, isLoading, error } = useQuery<NewsType>({
    queryKey: [`/api/news/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading News</h2>
        <p className="text-gray-600">There was a problem loading this news article.</p>
        <Link to="/news" className="text-primary hover:underline mt-4 inline-block">
          Back to News
        </Link>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <p className="text-gray-600">The requested article could not be found.</p>
        <Link to="/news" className="text-primary hover:underline mt-4 inline-block">
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/news" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </div>
        
        <Card className="shadow-md overflow-hidden">
          {newsItem.imageUrl && (
            <div className="h-[300px] overflow-hidden">
              <img 
                src={newsItem.imageUrl} 
                alt={newsItem.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <Badge variant="secondary">{newsItem.category}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(newsItem.publishDate), 'MMMM d, yyyy')}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{newsItem.title}</CardTitle>
            {newsItem.excerpt && (
              <CardDescription className="text-lg">{newsItem.excerpt}</CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: newsItem.content }} />
          </CardContent>
          
          <CardFooter className="border-t border-gray-100 flex justify-between">
            <div className="text-sm text-gray-500 flex items-center">
              <User className="h-4 w-4 mr-1" />
              Author ID: {newsItem.author}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <i className="fab fa-facebook-f mr-2"></i>
                Share
              </Button>
              <Button variant="outline" size="sm">
                <i className="fab fa-twitter mr-2"></i>
                Tweet
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// News List component
const NewsList: React.FC = () => {
  const { data: newsItems, isLoading, error } = useQuery<NewsType[]>({
    queryKey: ['/api/news'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading News</h2>
        <p className="text-gray-600">There was a problem loading the news articles.</p>
      </div>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No News Available</h2>
        <p className="text-gray-600">There are currently no news articles available.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">News & Announcements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about urban planning initiatives, regulatory updates, and community events.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                )}
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex justify-between">
                  <Badge variant="secondary">{item.category}</Badge>
                  <span className="text-sm text-gray-500">
                    {format(new Date(item.publishDate), 'MMM d, yyyy')}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2 hover:text-primary">
                  <Link to={`/news/${item.slug}`}>
                    {item.title}
                  </Link>
                </h3>
                {item.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>
                )}
                <Link 
                  to={`/news/${item.slug}`} 
                  className="text-primary hover:text-primary-800 font-medium inline-flex items-center"
                >
                  Read More
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main News component with routes
const News: React.FC = () => {
  return (
    <div id="main-content">
      <Routes>
        <Route path="/" element={<NewsList />} />
        <Route path="/:slug" element={<NewsDetail />} />
      </Routes>
    </div>
  );
};

export default News;
