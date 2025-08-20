/**
 * Avatar Generation Service
 * Provides methods to generate avatar URLs using various services
 */

export interface AvatarOptions {
  name?: string;
  email?: string;
  size?: number;
  background?: string;
  color?: string;
  format?: 'svg' | 'png';
}

/**
 * Generate avatar URL using UI Avatars service
 * Free service that generates avatars based on initials
 */
export function generateUIAvatar(options: AvatarOptions): string {
  const {
    name = 'Unknown User',
    size = 200,
    background = '0D6661', // Wired People primary color
    color = 'FFFFFF',
    format = 'svg'
  } = options;

  const params = new URLSearchParams({
    name,
    size: size.toString(),
    background,
    color,
    format,
    bold: 'true',
    'font-size': '0.4'
  });

  return `https://ui-avatars.com/api/?${params.toString()}`;
}

/**
 * Generate avatar URL using DiceBear service
 * More variety with different avatar styles
 */
export function generateDiceBearAvatar(options: AvatarOptions & { style?: string }): string {
  const {
    name = 'Unknown',
    size = 200,
    background = 'transparent',
    style = 'initials' // Can be: initials, avataaars, bottts, personas, etc.
  } = options;

  const seed = name.replace(/\s+/g, '').toLowerCase();
  
  // Using DiceBear 7.x API
  const params = new URLSearchParams({
    seed,
    size: size.toString(),
    backgroundColor: background === 'transparent' ? '' : background
  });

  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`;
}

/**
 * Generate professional avatar URL with variety
 * Randomly selects between different styles for more visual diversity
 */
export function generateProfessionalAvatar(
  firstName: string,
  lastName: string,
  email?: string,
  index?: number
): string {
  const fullName = `${firstName} ${lastName}`;
  
  // Deterministic style selection based on name or index
  const styles = [
    'initials',
    'avataaars',
    'personas',
    'lorelei',
    'notionists'
  ];
  
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  const styleIndex = index !== undefined ? index : hashCode(fullName);
  const selectedStyle = styles[styleIndex % styles.length];
  
  // Use UI Avatars for initials style (better quality)
  if (selectedStyle === 'initials') {
    const backgrounds = ['0D6661', '164643', '75A3AB', 'FC7E00'];
    const bgIndex = styleIndex % backgrounds.length;
    
    return generateUIAvatar({
      name: fullName,
      size: 400,
      background: backgrounds[bgIndex],
      color: backgrounds[bgIndex] === 'FC7E00' ? '164643' : 'FFFFFF'
    });
  }
  
  // Use DiceBear for other styles
  return generateDiceBearAvatar({
    name: fullName,
    style: selectedStyle,
    size: 400
  });
}

/**
 * Generate placeholder avatar with gradient background
 * Used as fallback or for loading states
 */
export function generatePlaceholderAvatar(initials: string): string {
  const gradients = [
    'bg-gradient-to-br from-[#0D6661] to-[#164643]',
    'bg-gradient-to-br from-[#75A3AB] to-[#0D6661]',
    'bg-gradient-to-br from-[#FC7E00] to-[#e37100]',
    'bg-gradient-to-br from-[#164643] to-[#0D6661]',
  ];
  
  const index = initials.charCodeAt(0) + initials.charCodeAt(1);
  const gradientClass = gradients[index % gradients.length];
  
  // Return a data URL or class name to be used in component
  return gradientClass;
}

/**
 * Get random professional photo from Unsplash
 * For demo purposes - returns professional looking stock photos
 */
export function getStockPhotoAvatar(gender?: 'male' | 'female', index?: number): string {
  const collections = {
    professional: '2k5mEhaEJZw', // Professional headshots collection
    business: 'lthIzMerJyA',     // Business people collection
  };
  
  const seed = index ? `person${index}` : Math.random().toString();
  
  return `https://source.unsplash.com/400x400/?professional,headshot,${gender || 'person'}&sig=${seed}`;
}

/**
 * Avatar provider configuration
 */
export const AvatarProviders = {
  uiAvatars: generateUIAvatar,
  diceBear: generateDiceBearAvatar,
  professional: generateProfessionalAvatar,
  placeholder: generatePlaceholderAvatar,
  stock: getStockPhotoAvatar
} as const;

export type AvatarProvider = keyof typeof AvatarProviders;