import { InjectionToken } from '@angular/core';
import { LayoutConfig } from '../models/layout-config.interface';

export const LAYOUT_CONFIG = new InjectionToken<LayoutConfig>('LAYOUT_CONFIG', {
  providedIn: 'root',
  factory: () => ({}),
});
