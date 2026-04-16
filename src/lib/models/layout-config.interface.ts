import { NavItem } from './nav-item.interface';

export interface LogoConfig {
  /** Sidebar başlık metni */
  text?: string;
  /** Remix Icon sınıfı, örn: 'ri-check-double-fill' */
  icon?: string;
  /** Logo tıklanınca gidilecek route */
  route?: string;
}

export interface FooterConfig {
  /** Telif hakkı metni, örn: 'My Company' */
  copyright?: string;
  /** Altbilgi linkleri */
  links?: Array<{ label: string; href: string }>;
}

export interface UserConfig {
  name: string;
  role?: string;
  /** Avatar URL veya null (varsayılan ikon gösterilir) */
  avatarUrl?: string | null;
}

export interface LayoutConfig {
  /** Sidebar navigasyon öğeleri */
  navItems?: NavItem[];
  /** Logo ayarları */
  logo?: LogoConfig;
  /** Altbilgi ayarları */
  footer?: FooterConfig;
  /** Kullanıcı bilgileri */
  user?: UserConfig;
  /** Başlangıç teması: 'light' | 'dark' (varsayılan: 'light') */
  defaultTheme?: 'light' | 'dark';
  /** CSS özel değişken geçersiz kılmaları */
  customVars?: Partial<ThemeVars>;
  /** Dark modda CSS özel değişken geçersiz kılmaları */
  darkVars?: Partial<ThemeVars>;
}

export interface ThemeVars {
  '--primary': string;
  '--primary-light': string;
  '--primary-dark': string;
  '--primary-rgb': string;
  '--sidebar-bg': string;
  '--header-bg': string;
  '--body-bg': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-muted': string;
  '--border-color': string;
  '--shadow-sm': string;
  '--shadow': string;
  '--shadow-lg': string;
  '--sidebar-width': string;
  '--sidebar-mini-width': string;
  '--header-height': string;
  '--footer-height': string;
  [key: string]: string;
}
