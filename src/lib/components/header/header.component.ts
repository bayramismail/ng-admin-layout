import { Component, inject, OnInit, output, signal, TemplateRef, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LAYOUT_CONFIG } from '../../tokens/layout-config.token';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'nal-header',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  protected readonly config = inject(LAYOUT_CONFIG);
  readonly themeService = inject(ThemeService);

  readonly toggleSidebar = output<void>();

  /** Header sağ aksiyon alanı için özel ng-template (nalHeaderActions direktifi ile) */
  readonly actionsTemplate = input<TemplateRef<unknown> | null>(null);

  protected isSearchFocused = signal(false);
  protected notificationCount = signal(0);

  protected get userName(): string {
    return this.config.user?.name ?? 'User';
  }

  protected get userRole(): string {
    return this.config.user?.role ?? '';
  }

  protected get avatarUrl(): string | null {
    return this.config.user?.avatarUrl ?? null;
  }

  ngOnInit(): void {}
}
