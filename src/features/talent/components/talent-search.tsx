"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTalentSearch } from "@/features/talent/hooks/use-talents";
import { 
  Search, 
  X, 
  Loader2,
  User,
  MapPin,
  Star,
  TrendingUp,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "@/lib/utils";
import type { Talent } from "@/features/talent/types/talent.types";

interface TalentSearchProps {
  placeholder?: string;
  className?: string;
  onSelect?: (talent: Talent) => void;
  variant?: "default" | "compact";
}

/**
 * Talent Search Component
 * Advanced search with autocomplete
 */
export function TalentSearch({ 
  placeholder = "Search talents by name, skill, or location...",
  className,
  onSelect,
  variant = "default"
}: TalentSearchProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Use the search hook with debounce
  const { data, isLoading } = useTalentSearch(searchTerm, {
    debounceMs: 300,
    minLength: 2,
  });
  
  const results = data?.data || [];
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (searchTerm) {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, results, selectedIndex, searchTerm]);
  
  // Handle talent selection
  const handleSelect = useCallback((talent: Talent) => {
    if (onSelect) {
      onSelect(talent);
    } else {
      router.push(`/talent/${talent.id}`);
    }
    setIsOpen(false);
    setSearchTerm("");
    setSelectedIndex(-1);
  }, [onSelect, router]);
  
  // Handle search submit
  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      router.push(`/talent?search=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  }, [searchTerm, router]);
  
  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length >= 2);
    setSelectedIndex(-1);
  }, []);
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);
  
  if (variant === "compact") {
    return (
      <div ref={searchRef} className={cn("relative", className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            className={cn(
              "w-full pl-9 pr-9 py-2 rounded-lg",
              "bg-muted/50 border border-transparent",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "placeholder:text-muted-foreground text-sm"
            )}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-12 pr-12 py-3 rounded-xl",
            "bg-background border-2 border-input",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "placeholder:text-muted-foreground",
            "text-base"
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        )}
        {!isLoading && searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="max-h-96 overflow-y-auto">
                {results.map((talent, index) => (
                  <button
                    key={talent.id}
                    onClick={() => handleSelect(talent)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full px-4 py-3 flex items-start gap-3",
                      "hover:bg-muted/50 transition-colors text-left",
                      selectedIndex === index && "bg-muted/50"
                    )}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {talent.avatar ? (
                        <img
                          src={talent.avatar}
                          alt={`${talent.firstName} ${talent.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">
                          {talent.firstName} {talent.lastName}
                        </p>
                        {talent.score && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-warning fill-warning" />
                            <span className="text-xs text-muted-foreground">
                              {talent.score}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {talent.title}
                      </p>
                      {talent.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {talent.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Search All Results */}
              <div className="border-t border-border p-3">
                <button
                  onClick={handleSearch}
                  className="w-full px-3 py-2 text-sm text-brand-primary hover:bg-muted/50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  View all results for "{searchTerm}"
                </button>
              </div>
            </>
          ) : searchTerm.length >= 2 && !isLoading ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No talents found for "{searchTerm}"
              </p>
              <button
                onClick={handleSearch}
                className="mt-3 text-sm text-brand-primary hover:underline"
              >
                Try advanced search
              </button>
            </div>
          ) : null}
          
          {/* Recent Searches - Optional */}
          {!searchTerm && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Recent searches
              </p>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors">
                  React Developer
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors">
                  Public Health Expert
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors">
                  Cybersecurity Analyst
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}