import { Component, inject, input, OnInit, output, signal, TemplateRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { LAYOUT_CONFIG } from '../../tokens/layout-config.token';
import { NavItem } from '../../models/nav-item.interface';

@Component({
  selector: 'nal-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  protected readonly config = inject(LAYOUT_CONFIG);

  readonly isOpen = input(false);
  readonly isMini = input(false);
  readonly isMobile = input(false);
  readonly closeSidebar = output<void>();

  /** Menü öğeleri — [items] ile geç, yoksa provideLayout config'i kullanır */
  readonly items = input<NavItem[] | null>(null);

  /** Logo alanı için özel ng-template (nalLogo direktifi ile) */
  readonly logoTemplate = input<TemplateRef<unknown> | null>(null);

  protected expandedItems = signal<Set<string>>(new Set());

  protected get logoText(): string {
    return this.config.logo?.text ?? 'App';
  }

  protected get logoIcon(): string {
    return this.config.logo?.icon ?? 'ri-layout-grid-line';
  }

  protected get logoRoute(): string {
    return this.config.logo?.route ?? '/';
  }

  /** [items] varsa onu, yoksa provideLayout navItems'ı kullan */
  protected get navItems(): NavItem[] {
    return this.items() ?? this.config.navItems ?? [];
  }

  ngOnInit(): void {}

  isExpanded(id: string): boolean {
    return this.expandedItems().has(id);
  }

  toggleExpand(id: string): void {
    this.expandedItems.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  onLeafClick(): void {
    if (this.isMobile()) {
      this.closeSidebar.emit();
    }
  }
}
