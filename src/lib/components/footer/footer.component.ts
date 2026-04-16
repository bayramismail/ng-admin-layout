import { Component, inject, OnInit, TemplateRef, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'nal-footer',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  /** Footer içeriği için özel ng-template (nalFooter direktifi ile) */
  readonly contentTemplate = input<TemplateRef<unknown> | null>(null);

  protected currentYear = new Date().getFullYear();

  protected get copyright(): string {
    return this.layoutService.config().footer?.copyright ?? 'My Company';
  }

  protected get links(): Array<{ label: string; href: string }> {
    return this.layoutService.config().footer?.links ?? [
      { label: 'License',       href: '#' },
      { label: 'More Themes',   href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Support',       href: '#' },
    ];
  }

  ngOnInit(): void {}
}
