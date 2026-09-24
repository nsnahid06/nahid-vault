import React, { useState } from 'react';
import { ChevronDown, ShoppingBag, Check, Globe } from 'lucide-react';

interface GlobalRegionSelectorProps {
  isOpen: boolean;
  onExplore: (country: string, region: string) => void;
}

const REGION_DATA: Record<string, string[]> = {
  Asia: ['Bangladesh', 'India', 'Japan', 'United Arab Emirates', 'Singapore', 'Malaysia', 'South Korea'],
  Europe: ['United Kingdom', 'France', 'Italy', 'Germany', 'Spain', 'Switzerland'],
  Americas: ['United States', 'Canada', 'Brazil', 'Mexico'],
  'Africa & Oceania': ['Australia', 'South Africa', 'Egypt', 'New Zealand'],
};

export const GlobalRegionSelector: React.FC<GlobalRegionSelectorProps> = ({ isOpen, onExplore }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Asia');
  const [selectedCountry, setSelectedCountry] = useState<string>('Bangladesh');
  const [isExplorerSuccess, setIsExplorerSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const availableCountries = REGION_DATA[region] || [];
    if (availableCountries.length > 0) {
      setSelectedCountry(availableCountries[0]);
    }
  };

  const handleExploreClick = () => {
    setIsExplorerSuccess(true);
    setTimeout(() => {
      setIsExplorerSuccess(false);
      onExplore(selectedCountry, selectedRegion);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black animate-fadeIn">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110 opacity-60"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1800&auto=format&fit=crop')`,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Center Landing Gateway Card */}
      <div className="relative z-10 max-w-md w-full mx-4 text-center text-white space-y-8 p-6">
        {/* Brand Logo & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black font-serif italic tracking-tight text-white drop-shadow-xl">
            NAHID <span className="text-amber-500 font-sans not-italic font-light">VAULT</span>
          </h1>
          <p className="text-base sm:text-lg font-light tracking-wide text-stone-200">
            Explore NAHID VAULT world
          </p>
        </div>

        {/* Dropdowns Form */}
        <div className="space-y-6 text-left max-w-sm mx-auto pt-2">
          {/* Region Dropdown */}
          <div className="relative border-b border-white/70 pb-2 transition-colors hover:border-amber-400">
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full bg-transparent text-white text-lg font-medium cursor-pointer focus:outline-none appearance-none pr-8 font-sans"
            >
              {Object.keys(REGION_DATA).map((region) => (
                <option key={region} value={region} className="bg-neutral-900 text-white py-2">
                  {region}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-white/80 absolute right-0 top-1 pointer-events-none" />
          </div>

          {/* Country Dropdown */}
          <div className="relative border-b border-white/70 pb-2 flex items-center gap-2 transition-colors hover:border-amber-400">
            <ShoppingBag className="w-5 h-5 text-white/80 shrink-0" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-transparent text-white text-lg font-medium cursor-pointer focus:outline-none appearance-none pr-8 font-sans"
            >
              {(REGION_DATA[selectedRegion] || []).map((country) => (
                <option key={country} value={country} className="bg-neutral-900 text-white py-2">
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-white/80 absolute right-0 top-1 pointer-events-none" />
          </div>
        </div>

        {/* Explore Button */}
        <div className="pt-4 max-w-sm mx-auto">
          <button
            onClick={handleExploreClick}
            disabled={isExplorerSuccess}
            className={`w-full py-3.5 px-8 border border-white/90 text-white text-sm sm:text-base font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-neutral-950 active:scale-95 shadow-2xl ${
              isExplorerSuccess ? 'bg-amber-500 border-amber-500 text-neutral-950 font-black' : 'bg-transparent'
            }`}
          >
            {isExplorerSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>Opening Store...</span>
              </span>
            ) : (
              'EXPLORE'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

