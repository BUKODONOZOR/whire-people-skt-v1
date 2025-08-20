/**
 * Wired People Logo Components
 * Path: src/shared/components/ui/logos.tsx
 */

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  variant?: 'default' | 'horizontal' | 'stacked' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * Main Wired People Logo Component
 */
export function WiredPeopleLogo({ 
  variant = 'default', 
  size = 'md',
  className,
  theme = 'light'
}: LogoProps) {
  const sizeMap = {
    sm: { height: 32, width: 140 },
    md: { height: 40, width: 175 },
    lg: { height: 48, width: 210 },
    xl: { height: 56, width: 245 }
  };

  const iconSizeMap = {
    sm: { height: 32, width: 32 },
    md: { height: 40, width: 40 },
    lg: { height: 48, width: 48 },
    xl: { height: 56, width: 56 }
  };

  // Determine which logo file to use
  const getLogoSrc = () => {
    const themePrefix = theme === 'dark' ? 'white' : 'teal';
    
    switch (variant) {
      case 'horizontal':
        return `/logos/wired-people-horizontal-${themePrefix}.png`;
      case 'stacked':
        return `/logos/wired-people-stacked-${themePrefix}.png`;
      case 'icon-only':
        return `/logos/wired-people-icon-${themePrefix}.png`;
      default:
        return `/logos/wired-people-horizontal-${themePrefix}.png`;
    }
  };

  const dimensions = variant === 'icon-only' ? iconSizeMap[size] : sizeMap[size];

  // Fallback to SVG if image doesn't load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'block';
  };

  return (
    <div className={cn("relative", className)}>
      <Image
        src={getLogoSrc()}
        alt="Wired People"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="object-contain"
        onError={handleImageError}
      />
      
      {/* SVG Fallback */}
      <div className="hidden">
        {variant === 'icon-only' ? (
          <WiredPeopleIconSVG size={size} theme={theme} />
        ) : (
          <WiredPeopleLogoSVG variant={variant} size={size} theme={theme} />
        )}
      </div>
    </div>
  );
}

/**
 * SVG Version of Wired People Logo (Fallback)
 */
export function WiredPeopleLogoSVG({ 
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  className 
}: LogoProps) {
  const color = theme === 'dark' ? '#FFFFFF' : '#0D6661';
  
  const sizeMap = {
    sm: { width: 140, height: 32 },
    md: { width: 175, height: 40 },
    lg: { width: 210, height: 48 },
    xl: { width: 245, height: 56 }
  };

  const dimensions = sizeMap[size];

  if (variant === 'stacked') {
    return (
      <svg 
        width={dimensions.width} 
        height={dimensions.height * 1.5} 
        viewBox="0 0 200 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Wired text */}
        <text x="20" y="35" fontFamily="Objektiv Mk1, Inter, sans-serif" fontSize="28" fontWeight="500" fill={color}>
          wired
        </text>
        {/* People text */}
        <text x="20" y="65" fontFamily="Objektiv Mk1, Inter, sans-serif" fontSize="28" fontWeight="500" fill={color}>
          people
        </text>
        {/* Connection line decoration */}
        <circle cx="15" cy="25" r="3" fill={color} />
        <path d="M15 25 Q100 20 180 25" stroke={color} strokeWidth="2" fill="none" />
        <circle cx="180" cy="70" r="3" fill={color} />
        <path d="M20 70 Q100 75 180 70" stroke={color} strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // Horizontal variant (default)
  return (
    <svg 
      width={dimensions.width} 
      height={dimensions.height} 
      viewBox="0 0 240 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Wired People text */}
      <text x="10" y="28" fontFamily="Objektiv Mk1, Inter, sans-serif" fontSize="24" fontWeight="500" fill={color}>
        wired
      </text>
      <text x="80" y="28" fontFamily="Objektiv Mk1, Inter, sans-serif" fontSize="24" fontWeight="500" fill={color}>
        people
      </text>
      {/* Connection line decoration */}
      <circle cx="5" cy="20" r="3" fill={color} />
      <path d="M5 20 Q120 15 230 20" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="235" cy="20" r="3" fill={color} />
    </svg>
  );
}

/**
 * SVG Icon Version (W in circle)
 */
export function WiredPeopleIconSVG({ 
  size = 'md',
  theme = 'light',
  className 
}: LogoProps) {
  const color = theme === 'dark' ? '#FFFFFF' : '#0D6661';
  const bgColor = theme === 'dark' ? '#0D6661' : '#FFFFFF';
  
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56
  };

  const dimension = sizeMap[size];

  return (

<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 width="100" viewBox="0 0 168 162" enable-background="new 0 0 168 162" >
<path fill="none" opacity="1.000000" stroke="none"  
	d="
M94.000000,163.000000 
	C62.666672,163.000000 31.833342,163.000000 1.000008,163.000000 
	C1.000005,109.000008 1.000005,55.000019 1.000003,1.000023 
	C56.999985,1.000015 112.999969,1.000015 168.999969,1.000008 
	C168.999969,54.999973 168.999969,108.999947 168.999985,162.999969 
	C144.166672,163.000000 119.333336,163.000000 94.000000,163.000000 
M83.921432,18.586277 
	C80.467766,19.087404 76.933510,19.275221 73.573235,20.139479 
	C47.864681,26.751690 30.683147,42.706394 24.025530,68.405411 
	C17.399490,93.982521 24.465096,116.495644 44.163841,133.974243 
	C64.215935,151.766373 87.729301,155.702240 112.675484,145.924850 
	C142.651642,134.176056 159.372635,102.465958 152.906036,71.486153 
	C146.224869,39.478401 118.215523,17.678778 83.921432,18.586277 
z"/>
<path fill="#EAF2F2" opacity="1.000000" stroke="none" 
	d="
M84.372879,18.542278 
	C118.215523,17.678778 146.224869,39.478401 152.906036,71.486153 
	C159.372635,102.465958 142.651642,134.176056 112.675484,145.924850 
	C87.729301,155.702240 64.215935,151.766373 44.163841,133.974243 
	C24.465096,116.495644 17.399490,93.982521 24.025530,68.405411 
	C30.683147,42.706394 47.864681,26.751690 73.573235,20.139479 
	C76.933510,19.275221 80.467766,19.087404 84.372879,18.542278 
M43.405262,127.083916 
	C62.169075,145.578857 84.423965,151.254684 109.039909,142.341949 
	C133.269394,133.569153 146.536758,115.200356 149.430618,89.447014 
	C149.859665,85.628746 149.155197,83.952347 144.859406,84.196922 
	C138.716766,84.546623 132.533081,84.124466 126.380249,84.368187 
	C123.327774,84.489098 121.895538,83.407333 121.069366,80.539810 
	C119.847237,76.298050 118.249458,72.164513 116.326965,66.576065 
	C110.640228,86.581207 105.358955,105.159950 99.681129,125.133743 
	C95.669441,111.277107 92.102966,98.958282 88.536499,86.639458 
	C88.159294,86.669365 87.782082,86.699272 87.404877,86.729179 
	C83.882111,98.853607 80.359344,110.978035 76.836571,123.102455 
	C76.468384,123.107323 76.100197,123.112183 75.732010,123.117043 
	C70.579514,104.828217 65.427017,86.539391 60.274517,68.250565 
	C57.845238,72.201820 56.249973,76.030121 55.203949,80.003021 
	C54.332348,83.313446 52.752964,84.514397 49.254868,84.381660 
	C41.824348,84.099701 34.375698,84.295601 26.493938,84.295601 
	C26.656507,100.998039 32.269218,114.752968 43.405262,127.083916 
M101.540405,24.698593 
	C59.476265,15.467881 27.319059,49.842903 27.284683,79.760025 
	C32.568367,79.760025 37.913792,79.294472 43.139988,79.884674 
	C48.921864,80.537636 51.420425,78.302338 52.848343,72.879372 
	C54.638603,66.080276 57.320160,59.515865 59.617035,52.850163 
	C60.015041,52.915260 60.413052,52.980358 60.811062,53.045456 
	C65.830421,70.884850 70.849777,88.724243 76.287491,108.050529 
	C80.319267,94.174019 83.917145,81.790894 87.515022,69.407768 
	C87.872063,69.415703 88.229111,69.423637 88.586159,69.431572 
	C92.137932,81.790047 95.689697,94.148521 99.241470,106.506989 
	C99.536476,106.483940 99.831490,106.460892 100.126495,106.437843 
	C105.216393,88.548882 110.306282,70.659920 115.396179,52.770954 
	C119.174995,60.619530 121.769455,68.327461 124.557632,75.964668 
	C125.065857,77.356766 126.321037,79.490685 127.305412,79.532310 
	C134.522446,79.837532 141.758362,79.696976 148.956772,79.696976 
	C149.018494,55.344765 128.724487,31.825739 101.540405,24.698593 
z"/>
<path fill="#116964" opacity="1.000000" stroke="none" 
	d="
M43.156006,126.832382 
	C32.269218,114.752968 26.656507,100.998039 26.493938,84.295601 
	C34.375698,84.295601 41.824348,84.099701 49.254868,84.381660 
	C52.752964,84.514397 54.332348,83.313446 55.203949,80.003021 
	C56.249973,76.030121 57.845238,72.201820 60.274517,68.250565 
	C65.427017,86.539391 70.579514,104.828217 75.732010,123.117043 
	C76.100197,123.112183 76.468384,123.107323 76.836571,123.102455 
	C80.359344,110.978035 83.882111,98.853607 87.404877,86.729179 
	C87.782082,86.699272 88.159294,86.669365 88.536499,86.639458 
	C92.102966,98.958282 95.669441,111.277107 99.681129,125.133743 
	C105.358955,105.159950 110.640228,86.581207 116.326965,66.576065 
	C118.249458,72.164513 119.847237,76.298050 121.069366,80.539810 
	C121.895538,83.407333 123.327774,84.489098 126.380249,84.368187 
	C132.533081,84.124466 138.716766,84.546623 144.859406,84.196922 
	C149.155197,83.952347 149.859665,85.628746 149.430618,89.447014 
	C146.536758,115.200356 133.269394,133.569153 109.039909,142.341949 
	C84.423965,151.254684 62.169075,145.578857 43.156006,126.832382 
z"/>
<path fill="#116964" opacity="1.000000" stroke="none" 
	d="
M101.949860,24.790432 
	C128.724487,31.825739 149.018494,55.344765 148.956772,79.696976 
	C141.758362,79.696976 134.522446,79.837532 127.305412,79.532310 
	C126.321037,79.490685 125.065857,77.356766 124.557632,75.964668 
	C121.769455,68.327461 119.174995,60.619530 115.396179,52.770954 
	C110.306282,70.659920 105.216393,88.548882 100.126495,106.437843 
	C99.831490,106.460892 99.536476,106.483940 99.241470,106.506989 
	C95.689697,94.148521 92.137932,81.790047 88.586159,69.431572 
	C88.229111,69.423637 87.872063,69.415703 87.515022,69.407768 
	C83.917145,81.790894 80.319267,94.174019 76.287491,108.050529 
	C70.849777,88.724243 65.830421,70.884850 60.811062,53.045456 
	C60.413052,52.980358 60.015041,52.915260 59.617035,52.850163 
	C57.320160,59.515865 54.638603,66.080276 52.848343,72.879372 
	C51.420425,78.302338 48.921864,80.537636 43.139988,79.884674 
	C37.913792,79.294472 32.568367,79.760025 27.284683,79.760025 
	C27.319059,49.842903 59.476265,15.467881 101.949860,24.790432 
z"/>
</svg>
  );
}

/**
 * Simple text version for places where images can't be used
 */
export function WiredPeopleText({ 
  className,
  size = 'md' 
}: { 
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={cn("font-heading font-medium text-[#0D6661]", sizeClasses[size], className)}>
      <span>wired</span>
      <span className="text-[#0D6661]">people</span>
    </div>
  );
}

/**
 * Loading skeleton for logo
 */
export function LogoSkeleton({ 
  variant = 'default',
  size = 'md',
  className 
}: LogoProps) {
  const sizeMap = {
    sm: 'h-8 w-32',
    md: 'h-10 w-40',
    lg: 'h-12 w-48',
    xl: 'h-14 w-56'
  };

  const iconSizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14'
  };

  return (
    <div 
      className={cn(
        "animate-pulse bg-gray-200 rounded",
        variant === 'icon-only' ? iconSizeMap[size] : sizeMap[size],
        className
      )}
    />
  );
}

// Export additional icon components that might be needed
export function ProcessHubIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="5" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="19" cy="12" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="12" cy="19" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="5" cy="12" r="2" fill="currentColor" opacity="0.5" />
      <path d="M12 7v2M12 15v2M14 12h3M7 12h3" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

export function TalentHubIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="8" r="3" fill="currentColor" />
      <path d="M12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}