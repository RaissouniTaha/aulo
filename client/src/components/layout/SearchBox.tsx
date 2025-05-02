import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form className="flex items-center" onSubmit={handleSubmit}>
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input 
          type="search" 
          className="w-full pl-10 py-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary focus:border-primary font-medium"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button 
        type="submit" 
        className="bg-primary hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-r-md transition-colors"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBox;
