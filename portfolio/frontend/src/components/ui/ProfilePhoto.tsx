'use client';

import { motion } from 'framer-motion';
import { designSystem } from '@/config/design-system';
import { animations } from '@/config/animations';
import { useAnalytics } from '@/config/analytics';
import type { ProfilePhotoProps } from '@/types';

const sizeMap = {
  sm: designSystem.components.profilePhoto.header,
  md: designSystem.components.profilePhoto.mobile,
  lg: designSystem.components.profilePhoto.desktop,
};

export function ProfilePhoto({ src, alt, size }: ProfilePhotoProps) {
  const photoSize = sizeMap[size];
  const { trackProfileInteraction } = useAnalytics();

  const handleClick = () => {
    trackProfileInteraction('photo_click');
  };

  return (
    <motion.img
      src={src}
      alt={alt}
      className="rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
      style={{ 
        width: photoSize,
        height: photoSize 
      }}
      variants={animations.profilePhoto}
      initial="rest"
      whileHover="hover"
      onClick={handleClick}
      data-analytics="profile-photo"
    />
  );
}