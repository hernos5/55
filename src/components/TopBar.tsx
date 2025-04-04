import React from 'react';
import { ChevronLeftIcon } from 'lucide-react';
const TopBar = ({
  title
}) => {
  return <header className="sticky top-0 bg-[#0D0F1F] border-b border-[#0F52BA]/20 px-4 py-3 z-10">
      <div className="container mx-auto max-w-3xl flex items-center">
        <button className="mr-4 text-[#0F52BA] hover:text-[#FFD700] transition-colors" aria-label="Go back">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-xl font-medium text-[#F5F5DC]">{title}</h1>
      </div>
    </header>;
};
export default TopBar;