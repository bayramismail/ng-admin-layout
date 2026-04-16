import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LayoutConfig } from './models/layout-config.interface';
import { LAYOUT_CONFIG } from './tokens/layout-config.token';

/**
 * Ng-admin-layout paketini uygulamaya ekler.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideLayout({
 *       defaultTheme: 'dark',
 *       logo: { text: 'MyApp', icon: 'ri-star-line' },
 *       navItems: [...],
 *       customVars: { '--primary': '#ff6b6b', '--primary-rgb': '255,107,107' },
 *       darkVars:   { '--sidebar-bg': '#1a1a2e' },
 *     })
 *   ]
 * };
 */
export function provideLayout(config: LayoutConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: LAYOUT_CONFIG, useValue: config },
  ]);
}
