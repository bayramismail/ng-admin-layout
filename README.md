# ng-admin-layout

Angular 17+ için yeniden kullanılabilir admin layout kütüphanesi. Sidebar, header ve footer bileşenlerini, dark/light tema desteğini ve tam CSS değişken özelleştirmesini tek bir pakette sunar.

---

## Kurulum

```bash
npm install ng-admin-layout
```

### Stil Dosyasını Ekle

`angular.json` dosyandaki `styles` dizisine aşağıdaki satırı ekle:

```json
"styles": [
  "node_modules/ng-admin-layout/styles/index.scss",
  "src/styles.scss"
]
```

---

## Hızlı Başlangıç

### 1. `provideLayout()` ile Yapılandır

`app.config.ts` dosyasına `provideLayout()` fonksiyonunu ekle:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideLayout } from 'ng-admin-layout';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideLayout({
      defaultTheme: 'light',
      logo: {
        text: 'MyApp',
        icon: 'ri-star-line',
        route: '/dashboard',
      },
      user: {
        name: 'İsmail Bayram',
        role: 'Admin',
        avatarUrl: null,
      },
      footer: {
        copyright: 'My Company',
        links: [
          { label: 'Gizlilik', href: '/privacy' },
          { label: 'İletişim', href: '/contact' },
        ],
      },
      navItems: [
        { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', route: '/dashboard' },
        { id: 'users',     label: 'Kullanıcılar', icon: 'ri-user-line', route: '/users' },
        {
          id: 'settings',
          label: 'Ayarlar',
          icon: 'ri-settings-line',
          children: [
            { id: 'profile',   label: 'Profil',   route: '/settings/profile' },
            { id: 'security',  label: 'Güvenlik', route: '/settings/security' },
          ],
        },
      ],
    }),
  ],
};
```

### 2. `<nal-layout>` Bileşenini Kullan

`app.component.ts` dosyasına `LayoutComponent`'i import et ve şablona ekle:

```ts
// app.component.ts
import { Component } from '@angular/core';
import { LayoutComponent } from 'ng-admin-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `<nal-layout />`,
})
export class AppComponent {}
```

Router outlet otomatik olarak layout içine yerleştirilir.

---

## Yapılandırma Seçenekleri (`LayoutConfig`)

| Özellik        | Tip                    | Açıklama                                       |
|----------------|------------------------|------------------------------------------------|
| `navItems`     | `NavItem[]`            | Sidebar navigasyon öğeleri                     |
| `logo`         | `LogoConfig`           | Logo metni, ikonu ve yönlendirme route'u       |
| `user`         | `UserConfig`           | Kullanıcı adı, rolü ve avatar URL'i            |
| `footer`       | `FooterConfig`         | Telif hakkı metni ve alt bağlantılar           |
| `defaultTheme` | `'light' \| 'dark'`   | Başlangıç teması (varsayılan: `'light'`)       |
| `customVars`   | `Partial<ThemeVars>`   | CSS değişken geçersiz kılmaları (light + dark) |
| `darkVars`     | `Partial<ThemeVars>`   | Yalnızca dark modda geçerli CSS değişkenleri   |

### `NavItem` Arayüzü

```ts
interface NavItem {
  id: string;
  label: string;
  icon?: string;    // Remix Icon sınıfı, örn: 'ri-home-line'
  route?: string;   // Angular router route
  children?: NavItem[];
}
```

---

## `[items]` Input'u ile Dinamik Menü

`provideLayout()` yerine veya ek olarak, menü öğelerini doğrudan bileşene aktarabilirsin:

```ts
@Component({
  template: `<nal-layout [items]="navItems" />`,
  imports: [LayoutComponent],
})
export class AppComponent {
  navItems: NavItem[] = [
    { id: 'home', label: 'Ana Sayfa', icon: 'ri-home-line', route: '/' },
  ];
}
```

> `[items]` girilirse `provideLayout()` içindeki `navItems` ayarını ezer.

---

## `ng-template` Slotları

PrimeNG tarzı üç slot direktifi ile layout bölgelerini özelleştirebilirsin.

### `nalLogo` — Sidebar Logo Alanı

```html
<nal-layout>
  <ng-template nalLogo>
    <img src="assets/logo.svg" alt="Logo" style="height: 36px" />
  </ng-template>
</nal-layout>
```

### `nalHeaderActions` — Header Sağ Alanı

Varsayılan tema butonu, bildirim ve kullanıcı menüsünün **yerine** geçer.

```html
<nal-layout>
  <ng-template nalHeaderActions>
    <button (click)="logout()">Çıkış Yap</button>
    <span class="badge">3</span>
  </ng-template>
</nal-layout>
```

### `nalFooter` — Footer İçeriği

```html
<nal-layout>
  <ng-template nalFooter>
    <span>&copy; 2026 Şirket Adı. Tüm hakları saklıdır.</span>
  </ng-template>
</nal-layout>
```

Direktifleri bağımsız import edebilirsin:

```ts
import { NalLogoDirective, NalHeaderActionsDirective, NalFooterDirective } from 'ng-admin-layout';
// veya tümü bir arada:
import { NAL_TEMPLATE_DIRECTIVES } from 'ng-admin-layout';
```

---

## `ThemeService` ile Programatik Tema Kontrolü

```ts
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ng-admin-layout';

@Component({ ... })
export class MyComponent {
  private theme = inject(ThemeService);

  toggleDark() {
    this.theme.toggleTheme();           // light ↔ dark
  }

  setDark() {
    this.theme.setTheme('dark');
  }

  isDark = this.theme.isDark;           // Signal<boolean>
  currentTheme = this.theme.theme;     // Signal<'light' | 'dark'>
}
```

---

## CSS Değişkenleri ile Özelleştirme

### Yöntem 1 — `provideLayout()` ile

```ts
provideLayout({
  customVars: {
    '--primary':     '#7c3aed',
    '--primary-rgb': '124, 58, 237',
  },
  darkVars: {
    '--sidebar-bg': '#1e1b4b',
  },
})
```

### Yöntem 2 — `styles.scss` ile

```scss
:root {
  --primary:          #7c3aed;
  --primary-rgb:      124, 58, 237;
  --sidebar-width:    280px;
  --header-height:    64px;
}
```

### Kullanılabilir CSS Değişkenleri

| Değişken              | Açıklama                   |
|-----------------------|----------------------------|
| `--primary`           | Ana renk (hex)             |
| `--primary-rgb`       | Ana renk (R, G, B)         |
| `--primary-light`     | Açık ton                   |
| `--primary-dark`      | Koyu ton                   |
| `--sidebar-bg`        | Sidebar arka planı         |
| `--header-bg`         | Header arka planı          |
| `--body-bg`           | Sayfa arka planı           |
| `--text-primary`      | Birincil metin rengi       |
| `--text-secondary`    | İkincil metin rengi        |
| `--text-muted`        | Soluk metin rengi          |
| `--border-color`      | Kenar çizgisi rengi        |
| `--sidebar-width`     | Açık sidebar genişliği     |
| `--sidebar-mini-width`| Daraltılmış sidebar genişliği |
| `--header-height`     | Header yüksekliği          |
| `--footer-height`     | Footer yüksekliği          |

---

## Gereksinimler

- Angular **17** veya üzeri
- `@angular/router` (RouterOutlet layout içinde kullanılır)
- İkonlar için [Remix Icon](https://remixicon.com/) önerilir (CDN veya npm ile eklenebilir)

```html
<!-- index.html -->
<link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet" />
```

---

## Lisans

MIT © [ismail bayram](https://github.com/bayramismail)

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
