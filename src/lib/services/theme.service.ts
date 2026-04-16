import { Injectable, signal, inject, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeVars } from '../models/layout-config.interface';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'nal-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _theme = signal<ThemeMode>('light');
  private _customVars: Partial<ThemeVars> = {};
  private _darkVars: Partial<ThemeVars> = {};

  /** Mevcut tema modu (signal) */
  readonly theme = this._theme.asReadonly();

  /** Dark modda mı? (computed signal) */
  readonly isDark = computed(() => this._theme() === 'dark');

  /**
   * Başlangıç temasını ayarlar.
   * Kullanıcının localStorage tercihi varsa onu önceliklendirir.
   */
  init(defaultTheme: ThemeMode = 'light', customVars?: Partial<ThemeVars>, darkVars?: Partial<ThemeVars>): void {
    if (customVars) this._customVars = customVars;
    if (darkVars) this._darkVars = darkVars;

    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      const initial = saved ?? defaultTheme;
      this.applyTheme(initial);
    } else {
      this._theme.set(defaultTheme);
    }
  }

  /** Light / Dark arasında geçiş yapar */
  toggleTheme(): void {
    this.setTheme(this._theme() === 'light' ? 'dark' : 'light');
  }

  /** Temayı doğrudan ayarlar */
  setTheme(mode: ThemeMode): void {
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme(mode);
    } else {
      this._theme.set(mode);
    }
  }

  /**
   * CSS özel değişkenlerini programatik olarak geçersiz kıl.
   * Hem light hem dark modda geçerli.
   */
  setCustomVars(vars: Partial<ThemeVars>): void {
    this._customVars = { ...this._customVars, ...vars };
    if (isPlatformBrowser(this.platformId)) {
      this.applyCssVars(vars);
    }
  }

  /**
   * Dark modda geçerli olacak özel CSS değişkenlerini ayarlar.
   */
  setDarkVars(vars: Partial<ThemeVars>): void {
    this._darkVars = { ...this._darkVars, ...vars };
    // Aktif tema dark ise hemen uygula
    if (isPlatformBrowser(this.platformId) && this._theme() === 'dark') {
      this.applyTheme('dark');
    }
  }

  private applyTheme(mode: ThemeMode): void {
    const root = document.documentElement;
    root.setAttribute('data-nal-theme', mode);
    this._theme.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);

    // Önce genel custom vars uygula
    this.applyCssVars(this._customVars);

    // Dark modda dark-specific vars uygula
    if (mode === 'dark') {
      this.applyCssVars(this._darkVars);
    }
  }

  private applyCssVars(vars: Partial<ThemeVars>): void {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
      if (value !== undefined) {
        root.style.setProperty(key, value);
      }
    }
  }
}
