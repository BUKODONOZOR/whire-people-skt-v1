/**
 * Enhanced Avatar Generation System for Wired People
 * Path: src/shared/utils/avatar-enhanced.utils.ts
 * 
 * Generates professional-looking avatars with multiple fallback strategies
 */

// Professional avatar service URLs with fallbacks
const AVATAR_SERVICES = {
  ui_avatars: (name: string, bg: string, color: string) => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}&size=200&font-size=0.40&bold=true&format=svg`,
  
  dicebear: (seed: string, style: string = 'initials') => 
    `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0D6661,164643,75A3AB,FC7E00&backgroundType=gradientLinear`,
  
  boringavatars: (name: string, variant: string = 'marble') =>
    `https://source.boringavatars.com/${variant}/200/${encodeURIComponent(name)}?colors=0D6661,164643,75A3AB,FC7E00,CFE8E0`,
    
  pravatar: (id: number, gender?: 'men' | 'women') => 
    gender 
      ? `https://i.pravatar.cc/200?img=${id}&set=set${gender === 'women' ? '3' : '1'}`
      : `https://i.pravatar.cc/200?img=${id}`,
      
  robohash: (text: string, set: number = 4) =>
    `https://robohash.org/${encodeURIComponent(text)}.png?size=200x200&set=set${set}&bgset=bg2`
};

// Professional stock photo collections for demos
const PROFESSIONAL_PHOTOS = {
  men: [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/11.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/men/43.jpg',
    'https://randomuser.me/api/portraits/men/46.jpg',
    'https://randomuser.me/api/portraits/men/52.jpg',
    'https://randomuser.me/api/portraits/men/65.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/men/83.jpg',
    'https://randomuser.me/api/portraits/men/91.jpg',
  ],
  women: [
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/women/11.jpg',
    'https://randomuser.me/api/portraits/women/21.jpg',
    'https://randomuser.me/api/portraits/women/31.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/women/57.jpg',
    'https://randomuser.me/api/portraits/women/63.jpg',
    'https://randomuser.me/api/portraits/women/72.jpg',
    'https://randomuser.me/api/portraits/women/89.jpg',
    'https://randomuser.me/api/portraits/women/95.jpg',
  ],
  diverse: [
    'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
    'https://xsgames.co/randomusers/assets/avatars/female/1.jpg',
    'https://xsgames.co/randomusers/assets/avatars/male/15.jpg',
    'https://xsgames.co/randomusers/assets/avatars/female/15.jpg',
    'https://xsgames.co/randomusers/assets/avatars/male/30.jpg',
    'https://xsgames.co/randomusers/assets/avatars/female/30.jpg',
    'https://xsgames.co/randomusers/assets/avatars/male/45.jpg',
    'https://xsgames.co/randomusers/assets/avatars/female/45.jpg',
  ]
};

// Wired People brand colors for avatars
const BRAND_COLORS = {
  primary: ['0D6661', '164643'],
  secondary: ['75A3AB', 'CFE8E0'],
  accent: ['FC7E00', 'e37100'],
  gradients: [
    ['0D6661', '75A3AB'],
    ['164643', 'FC7E00'],
    ['75A3AB', 'CFE8E0'],
    ['FC7E00', 'FFB366'],
  ]
};

/**
 * Generates a professional avatar based on user data
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email (used for consistent generation)
 * @param index - Index for variety in bulk lists
 * @param options - Additional options for avatar generation
 */
export function generateProfessionalAvatar(
  firstName: string,
  lastName: string,
  email: string,
  index: number = 0,
  options: {
    preferRealPhotos?: boolean;
    style?: 'initials' | 'avataaars' | 'bottts' | 'fun-emoji' | 'lorelei' | 'micah' | 'notionists' | 'personas';
    variant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
    forceGender?: 'men' | 'women';
  } = {}
): string {
  const fullName = `${firstName} ${lastName}`;
  const seed = email || fullName;
  
  // Use index for variety in lists
  const colorIndex = index % BRAND_COLORS.gradients.length;
  const [bgColor, fgColor] = BRAND_COLORS.gradients[colorIndex];
  
  // Strategy 1: Professional stock photos for demo (if preferRealPhotos is true)
  if (options.preferRealPhotos) {
    // Determine gender based on name or use forceGender option
    const gender = options.forceGender || guessGenderFromName(firstName);
    const photos = gender === 'women' ? PROFESSIONAL_PHOTOS.women : PROFESSIONAL_PHOTOS.men;
    
    // Use email hash or index to consistently select a photo
    const photoIndex = hashCode(email || fullName) % photos.length;
    return photos[Math.abs(photoIndex)];
  }
  
  // Strategy 2: DiceBear avatars with various styles
  if (options.style && options.style !== 'initials') {
    return AVATAR_SERVICES.dicebear(seed, options.style);
  }
  
  // Strategy 3: Boring Avatars with different variants
  if (options.variant) {
    return AVATAR_SERVICES.boringavatars(fullName, options.variant);
  }
  
  // Strategy 4: UI Avatars with initials (default)
  return AVATAR_SERVICES.ui_avatars(fullName, bgColor, 'ffffff');
}

/**
 * Generate multiple unique avatars for a list of talents
 */
export function generateBulkAvatars(
  talents: Array<{ firstName: string; lastName: string; email: string }>,
  preferRealPhotos: boolean = true
): Map<string, string> {
  const avatarMap = new Map<string, string>();
  const usedPhotos = new Set<string>();
  
  talents.forEach((talent, index) => {
    let avatar: string;
    
    if (preferRealPhotos) {
      // Try to avoid duplicate photos
      let attempts = 0;
      do {
        avatar = generateProfessionalAvatar(
          talent.firstName,
          talent.lastName,
          talent.email,
          index + attempts,
          { preferRealPhotos: true }
        );
        attempts++;
      } while (usedPhotos.has(avatar) && attempts < 5);
      
      usedPhotos.add(avatar);
    } else {
      // Use different styles for variety
      const styles = ['initials', 'avataaars', 'bottts', 'personas', 'notionists'];
      const style = styles[index % styles.length] as any;
      
      avatar = generateProfessionalAvatar(
        talent.firstName,
        talent.lastName,
        talent.email,
        index,
        { style }
      );
    }
    
    const key = `${talent.firstName}-${talent.lastName}-${talent.email}`;
    avatarMap.set(key, avatar);
  });
  
  return avatarMap;
}

/**
 * Simple hash function for consistent selection
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Simple gender guesser based on common name patterns
 * This is not perfect but helps with demo data
 */
function guessGenderFromName(firstName: string): 'men' | 'women' {
  const femaleEndings = ['a', 'e', 'ie', 'y', 'ey', 'elle', 'ette'];
  const maleEndings = ['o', 'n', 'k', 'r', 'd', 's'];
  
  const lowerName = firstName.toLowerCase();
  
  // Check female patterns
  for (const ending of femaleEndings) {
    if (lowerName.endsWith(ending)) {
      return 'women';
    }
  }
  
  // Check male patterns
  for (const ending of maleEndings) {
    if (lowerName.endsWith(ending)) {
      return 'men';
    }
  }
  
  // Default based on hash for consistency
  return hashCode(firstName) % 2 === 0 ? 'men' : 'women';
}

/**
 * Get avatar placeholder while loading
 */
export function getAvatarPlaceholder(initials: string): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0D6661;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#75A3AB;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#grad)"/>
      <text x="100" y="110" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle">
        ${initials}
      </text>
    </svg>
  `)}`;
}

/**
 * Professional role badges with colors
 */
export function getRoleBadgeColor(role: string): { bg: string; text: string } {
  const roleColors: Record<string, { bg: string; text: string }> = {
    'developer': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'designer': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'manager': { bg: 'bg-green-100', text: 'text-green-700' },
    'analyst': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'engineer': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'consultant': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'specialist': { bg: 'bg-teal-100', text: 'text-teal-700' },
    'coordinator': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'default': { bg: 'bg-gray-100', text: 'text-gray-700' }
  };
  
  const lowerRole = role.toLowerCase();
  
  for (const [key, colors] of Object.entries(roleColors)) {
    if (lowerRole.includes(key)) {
      return colors;
    }
  }
  
  return roleColors.default;
}

/**
 * Get initials from first and last name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Generate avatar gradient based on email or name
 */
export function generateAvatarGradient(seed: string): string {
  const gradients = [
    'from-[#0D6661] to-[#75A3AB]',
    'from-[#164643] to-[#FC7E00]',
    'from-[#75A3AB] to-[#CFE8E0]',
    'from-[#FC7E00] to-[#FFB366]',
    'from-[#0D6661] to-[#164643]',
  ];
  
  const index = hashCode(seed) % gradients.length;
  return gradients[Math.abs(index)];
}

/**
 * Enrich talent data with professional avatar
 */
export function enrichTalentWithAvatar(
  talent: any,
  index: number = 0,
  preferRealPhotos: boolean = true
): any {
  const avatar = generateProfessionalAvatar(
    talent.firstName,
    talent.lastName,
    talent.email,
    index,
    { preferRealPhotos }
  );
  
  return {
    ...talent,
    avatar
  };
}