import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Sidebar logo alanını özelleştirmek için kullan.
 *
 * @example
 * <nal-layout [items]="navItems">
 *   <ng-template nalLogo>
 *     <img src="logo.svg" alt="Logo" style="height:36px" />
 *   </ng-template>
 * </nal-layout>
 */
@Directive({ selector: 'ng-template[nalLogo]', standalone: true })
export class NalLogoDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/**
 * Header sağ aksiyonlarını özelleştirmek için kullan.
 * Varsayılan tema butonu + bildirim + kullanıcı menüsünün YERİNE geçer.
 *
 * @example
 * <nal-layout [items]="navItems">
 *   <ng-template nalHeaderActions>
 *     <button (click)="logout()">Çıkış</button>
 *   </ng-template>
 * </nal-layout>
 */
@Directive({ selector: 'ng-template[nalHeaderActions]', standalone: true })
export class NalHeaderActionsDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/**
 * Footer içeriğini tamamen özelleştirmek için kullan.
 *
 * @example
 * <nal-layout [items]="navItems">
 *   <ng-template nalFooter>
 *     <span>&copy; 2026 Şirket Adı</span>
 *   </ng-template>
 * </nal-layout>
 */
@Directive({ selector: 'ng-template[nalFooter]', standalone: true })
export class NalFooterDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** Tüm template direktifleri tek import'ta */
export const NAL_TEMPLATE_DIRECTIVES = [
  NalLogoDirective,
  NalHeaderActionsDirective,
  NalFooterDirective,
] as const;
