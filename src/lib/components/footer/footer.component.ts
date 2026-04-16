import { Component, inject, OnInit, TemplateRef, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LAYOUT_CONFIG } from '../../tokens/layout-config.token';

@Component({
  selector: 'nal-footer',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  protected readonly config = inject(LAYOUT_CONFIG);

  /** Footer içeriği için özel ng-template (nalFooter direktifi ile) */
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);

  protected currentYear = new Date().getFullYear();

  protected get copyright(): string {
    return this.config.footer?.copyright ?? 'My Company';
  }

  protected get links(): Array<{ label: string; href: string }> {
    return this.config.footer?.links ?? [
      { label: 'License', href: '#' },
      { label: 'More Themes', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Support', href: '#' },
    ];
  }

  ngOnInit(): void {}
}
