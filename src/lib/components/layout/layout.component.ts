import {
  Component,
  inject,
  OnInit,
  signal,
  PLATFORM_ID,
  HostListener,
  effect,
  input,
  contentChild,
  computed,
  TemplateRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LAYOUT_CONFIG } from '../../tokens/layout-config.token';
import { ThemeService } from '../../services/theme.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavItem } from '../../models/nav-item.interface';
import {
  NalLogoDirective,
  NalHeaderActionsDirective,
  NalFooterDirective,
} from '../../directives/nal-templates';

@Component({
  selector: 'nal-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(LAYOUT_CONFIG);
  private readonly themeService = inject(ThemeService);

  // ── Doğrudan input (provideLayout config'i ezer) ─────────────────────────
  /** Sidebar menü öğeleri — [items]="navItems" şeklinde geç */
  readonly items = input<NavItem[] | null>(null);

  // ── ng-template slotları (PrimeNG stili) ─────────────────────────────────
  protected readonly _logoDir    = contentChild(NalLogoDirective);
  protected readonly _actionsDir = contentChild(NalHeaderActionsDirective);
  protected readonly _footerDir  = contentChild(NalFooterDirective);

  // Şablonları computed ile çöz (TemplateRef | null)
  protected readonly logoTpl    = computed((): TemplateRef<unknown> | null => this._logoDir()?.template    ?? null);
  protected readonly actionsTpl = computed((): TemplateRef<unknown> | null => this._actionsDir()?.template ?? null);
  protected readonly footerTpl  = computed((): TemplateRef<unknown> | null => this._footerDir()?.template  ?? null);

  // [items] varsa onu, yoksa provideLayout'taki navItems'ı kullan
  protected readonly resolvedItems = computed<NavItem[]>(() => this.items() ?? this.config.navItems ?? []);

  protected sidebarOpen = signal(false);
  protected sidebarMini = signal(false);
  protected isMobileView = signal(false);

  constructor() {
    // ThemeService'i LAYOUT_CONFIG ile başlat
    effect(() => {
      this.themeService.init(
        this.config.defaultTheme ?? 'light',
        this.config.customVars,
        this.config.darkVars,
      );
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initViewport();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const width = window.innerWidth;
    const wasMobile = this.isMobileView();
    this.isMobileView.set(width < 768);
    if (width < 768 && !wasMobile) {
      this.sidebarOpen.set(false);
    }
  }

  protected toggleSidebar(): void {
    if (this.isMobileView()) {
      this.sidebarOpen.update((v) => !v);
    } else {
      this.sidebarMini.update((v) => !v);
    }
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  private initViewport(): void {
    const width = window.innerWidth;
    this.isMobileView.set(width < 768);
    this.sidebarMini.set(width >= 768 && width < 1200);
  }
}
