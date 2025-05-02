import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { languages, useLanguage } from '@/lib/i18n';

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-white hover:text-accent-200 focus:outline-none">
        <span className="mr-1">{language.code.toUpperCase()}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`${language.code === lang.code ? 'bg-primary-50 text-primary' : ''}`}
          >
            {lang.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
