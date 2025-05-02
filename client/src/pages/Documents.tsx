import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Document } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoaderPinwheel, FileText, Download, Search, Filter } from 'lucide-react';

const Documents: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Fetch documents from API
  const { data: documents, isLoading, error } = useQuery<Document[]>({
    queryKey: [`/api/documents${category !== 'all' ? `?category=${category}` : ''}`],
  });
  
  // Filter documents based on search term
  const filteredDocuments = documents?.filter(doc => 
    searchTerm === '' || 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Document categories (dynamically generated from available documents)
  const categories = documents 
    ? ['all', ...new Set(documents.map(doc => doc.category))]
    : ['all'];
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <div id="main-content" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Document Repository</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access regulations, forms, publications, and other official documents.
          </p>
        </div>
        
        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    placeholder="Search documents..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Document tabs by type */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <DocumentList 
              documents={filteredDocuments} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
          
          <TabsContent value="forms">
            <DocumentList 
              documents={filteredDocuments?.filter(doc => doc.category === 'Forms')} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
          
          <TabsContent value="regulations">
            <DocumentList 
              documents={filteredDocuments?.filter(doc => doc.category === 'Regulations')} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
          
          <TabsContent value="publications">
            <DocumentList 
              documents={filteredDocuments?.filter(doc => doc.category === 'Publications')} 
              isLoading={isLoading} 
              error={error} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface DocumentListProps {
  documents?: Document[];
  isLoading: boolean;
  error: unknown;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading, error }) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Get file type icon
  const getFileIcon = (fileType: string): React.ReactNode => {
    return <FileText className="h-6 w-6" />;
  };
  
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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Documents</h2>
        <p className="text-gray-600">There was a problem loading the document repository.</p>
      </div>
    );
  }
  
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Documents Found</h2>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-primary-50 p-2 rounded">
              {getFileIcon(doc.fileType)}
            </div>
            <div>
              <CardTitle className="text-lg">{doc.title}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {doc.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {doc.description && (
              <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
            )}
            <div className="text-xs text-gray-500 flex items-center gap-4">
              <span>Type: {doc.fileType.toUpperCase()}</span>
              <span>Size: {formatFileSize(doc.fileSize)}</span>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <div className="text-xs text-gray-500">
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-primary-700">
              <a href={doc.fileUrl} download>
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Documents;
