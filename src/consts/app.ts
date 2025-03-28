import { Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { Color } from '../styles/Color';

export const MAIN_FONT = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-main',
  preload: true,
  fallback: ['sans-serif'],
});
export const APP_NAME = 'AmericanoLabs';
export const APP_DESCRIPTION = 'AmericanoLabs is a platform for staking based on your risk appetite.';
export const APP_URL = 'americanolabs.vercel.app';
export const BRAND_COLOR = Color.primary;
export const BACKGROUND_COLOR = Color.primary;
export const BACKGROUND_IMAGE =
  'radial-gradient(circle at 50% -50%, rgba(0, 0, 0, 0), rgba(18, 28, 66, 0.8) 40%, rgb(18 28 66) 60%)';
