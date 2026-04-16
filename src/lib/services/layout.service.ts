import { Injectable, inject, signal } from '@angular/core';
import {
  LayoutConfig,
  LogoConfig,
  FooterConfig,
  UserConfig,
  ThemeVars,
} from '../models/layout-config.interface';
import { NavItem } from '../models/nav-item.interface';
import { ThemeService } from './theme.service';

/**
 * Layout yapılandırmasını runtime'da yönetir.
 *
 * Inject ederek navItems, logo, kullanıcı bilgisi, footer ve tema
 * değişkenlerini uygulama çalışırken güncelleyebilirsin.
 *
 * @example
 * // Herhangi bir bileşende:
 * readonly layout = inject(LayoutService);
 *
 * // Menüyü değiştir
 * this.layout.setNavItems([...]);
 *
 * // Renkleri değiştir
 * this.layout.setCustomVars({ '--primary': '#ff6b6b' });
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly _config = signal<LayoutConfig>({});
  private readonly themeService = inject(ThemeService);

  /** Mevcut layout yapılandırması — reaktif readonly signal */
  readonly config = this._config.asReadonly();

  // ── Dahili init (provideLayout / LayoutComponent tarafından çağrılır) ─────
  /** @internal */
  _init(config: LayoutConfig): void {
    this._config.set(config);
  }

  // ── Genel güncelleme ───────────────────────────────────────────────────────

  /**
   * Yapılandırmanın istediğin alanlarını güncelle.
   * Girmediğin alanlar mevcut değerini korur.
   *
   * @example
   * this.layout.update({ defaultTheme: 'dark', logo: { text: 'v2' } });
   */
  update(partial: Partial<LayoutConfig>): void {
    this._config.update((curr) => ({ ...curr, ...partial }));
  }

  // ── Kısayol metodlar ───────────────────────────────────────────────────────

  /**
   * Sidebar navigasyon menüsünü değiştirir.
   *
   * @example
   * this.layout.setNavItems([
   *   { id: 'home', label: 'Ana Sayfa', icon: 'ri-home-line', route: '/' },
   * ]);
   */
  setNavItems(items: NavItem[]): void {
    this.update({ navItems: items });
  }

  /**
   * Logo ayarlarını kısmen veya tamamen değiştirir.
   *
   * @example
   * this.layout.setLogo({ text: 'MyApp v2', icon: 'ri-rocket-line' });
   */
  setLogo(logo: Partial<LogoConfig>): void {
    this._config.update((curr) => ({
      ...curr,
      logo: { ...curr.logo, ...logo },
    }));
  }

  /**
   * Kullanıcı bilgilerini günceller (ad, rol, avatar).
   *
   * @example
   * this.layout.setUser({ name: 'Ahmet K.', role: 'Editor', avatarUrl: '/avatar.png' });
   */
  setUser(user: Partial<UserConfig>): void {
    this._config.update((curr) => ({
      ...curr,
      user: { name: curr.user?.name ?? '', ...curr.user, ...user },
    }));
  }

  /**
   * Footer yapılandırmasını günceller.
   *
   * @example
   * this.layout.setFooter({ copyright: 'ACME Corp' });
   */
  setFooter(footer: Partial<FooterConfig>): void {
    this._config.update((curr) => ({
      ...curr,
      footer: { ...curr.footer, ...footer },
    }));
  }

  /**
   * CSS değişkenlerini programatik olarak günceller.
   * Hem light hem dark modda geçerli olan genel renkler için kullan.
   * Değişiklikler DOM'a anında yansır.
   *
   * @example
   * this.layout.setCustomVars({
   *   '--primary':     '#7c3aed',
   *   '--primary-rgb': '124, 58, 237',
   * });
   */
  setCustomVars(vars: Partial<ThemeVars>): void {
    this._config.update((curr) => ({
      ...curr,
      customVars: { ...curr.customVars, ...vars },
    }));
    // DOM'a anında uygula (ThemeService üzerinden)
    this.themeService.setCustomVars(vars);
  }

  /**
   * Yalnızca dark modda geçerli olacak CSS değişkenlerini günceller.
   * Değişiklikler DOM'a anında yansır.
   *
   * @example
   * this.layout.setDarkVars({ '--sidebar-bg': '#1e1b4b' });
   */
  setDarkVars(vars: Partial<ThemeVars>): void {
    this._config.update((curr) => ({
      ...curr,
      darkVars: { ...curr.darkVars, ...vars },
    }));
    // DOM'a anında uygula (ThemeService üzerinden)
    this.themeService.setDarkVars(vars);
  }
}
