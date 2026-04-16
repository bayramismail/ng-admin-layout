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

## `[items]` Input'u ile Dinamik Menü

`provideLayout()` yerine veya ek olarak, menü öğelerini doğrudan bileşene aktarabilirsin:

```ts
// app.component.ts
import { Component } from '@angular/core';
import { LayoutComponent, NavItem } from 'ng-admin-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `<nal-layout [items]="navItems" />`,
})
export class AppComponent {
  navItems: NavItem[] = [
    { id: 'home', label: 'Ana Sayfa', icon: 'ri-home-line', route: '/' },
    { id: 'users', label: 'Kullanıcılar', icon: 'ri-user-line', route: '/users' },
  ];
}
```

> `[items]` girilirse `provideLayout()` içindeki `navItems` ayarını ezer.

---

## `ng-template` Slotları ile Özelleştirme

Layout'un 4 bölgesi `ng-template` direktifleri ile özelleştirilebilir.  
Tüm `ng-template`'ler **doğrudan `<nal-layout>` içine** yazılır.

```
┌─────────────────────────────────────────┐
│  SIDEBAR                                │
│  ┌──────────────────┐                   │
│  │  [nalLogo]       │  ← logo slotu     │
│  │──────────────────│                   │
│  │  Navigasyon      │                   │
│  │  menüsü          │                   │
│  │──────────────────│                   │
│  │  [nalSidebarBot] │  ← alt slot       │
│  └──────────────────┘                   │
│                                         │
│  HEADER                                 │
│  ┌──────────────────────────────────┐   │
│  │  ☰  Arama kutusu  [nalHeaderAct] │   │
│  └──────────────────────────────────┘   │
│                                         │
│  İÇERİK (router-outlet)                 │
│                                         │
│  FOOTER                                 │
│  ┌──────────────────────────────────┐   │
│  │  [nalFooter]                     │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Özet Tablosu

| Direktif            | Bölge                        | Davranış                                      |
|---------------------|------------------------------|-----------------------------------------------|
| `nalLogo`           | Sidebar üst — logo alanı     | Varsayılan logo + metin yerine geçer          |
| `nalSidebarBottom`  | Sidebar alt — menünün altı   | Boş olan alt alana eklenir                    |
| `nalHeaderActions`  | Header sağ — aksiyon alanı   | Tema/bildirim/kullanıcı butonları yerine geçer|
| `nalFooter`         | Footer — tüm içerik          | Varsayılan telif + linkler yerine geçer       |

---

### `nalLogo` — Sidebar Logo Alanı

Varsayılan ikon + metin logosunun **yerine** özel içerik koyar.

```ts
// app.component.ts
import { Component } from '@angular/core';
import { LayoutComponent, NalLogoDirective } from 'ng-admin-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, NalLogoDirective],
  template: `
    <nal-layout>
      <ng-template nalLogo>
        <img src="assets/logo.svg" alt="Logo" style="height: 36px" />
        <span style="font-weight: 700; margin-left: 8px">MyApp</span>
      </ng-template>
    </nal-layout>
  `,
})
export class AppComponent {}
```

---

### `nalSidebarBottom` — Sidebar Alt Alanı

Navigasyon menüsünün hemen altında render edilir. Kullanıcı profili, versiyon numarası vb. için idealdir.

```ts
// app.component.ts
import { Component } from '@angular/core';
import { LayoutComponent, NalSidebarBottomDirective } from 'ng-admin-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, NalSidebarBottomDirective],
  template: `
    <nal-layout>
      <ng-template nalSidebarBottom>
        <div style="padding: 16px; border-top: 1px solid var(--border-color)">
          <div style="display: flex; align-items: center; gap: 10px">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center">
              <i class="ri-user-line" style="color:#fff"></i>
            </div>
            <div>
              <div style="font-weight: 600">İsmail Bayram</div>
              <div style="font-size: 12px; color: var(--text-muted)">Admin</div>
            </div>
          </div>
        </div>
      </ng-template>
    </nal-layout>
  `,
})
export class AppComponent {}
```

---

### `nalHeaderActions` — Header Sağ Alanı

Varsayılan tema butonu, bildirim ve kullanıcı menüsünün **tamamının yerine** geçer.

```ts
// app.component.ts
import { Component } from '@angular/core';
import { LayoutComponent, NalHeaderActionsDirective, ThemeService } from 'ng-admin-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, NalHeaderActionsDirective],
  template: `
    <nal-layout>
      <ng-template nalHeaderActions>
        <!-- Özel tema butonu -->
        <button (click)="theme.toggleTheme()" style="background:none; border:none; cursor:pointer; font-size:18px">
          @if (theme.isDark()) {
            <i class="ri-moon-line"></i>
          } @else {
            <i class="ri-sun-line"></i>
          }
        </button>

        <!-- Bildirim ikonu -->
        <button style="background:none; border:none; cursor:pointer; position:relative">
          <i class="ri-notification-3-line" style="font-size:18px"></i>
          <span style="position:absolute; top:-4px; right:-4px; background:red; color:#fff; border-radius:50%; width:16px; height:16px; font-size:10px; display:flex; align-items:center; justify-content:center">3</span>
        </button>

        <!-- Çıkış butonu -->
        <button (click)="logout()" style="background:none; border:none; cursor:pointer">
          <i class="ri-logout-box-line" style="font-size:18px"></i>
        </button>
      </ng-template>
    </nal-layout>
  `,
})
export class AppComponent {
  theme = inject(ThemeService);

  logout() {
    // çıkış işlemi
  }
}
```

---

### `nalFooter` — Footer İçeriği

Varsayılan footer içeriğinin **tamamının yerine** geçer.

```ts
// app.component.ts
import { Component } from '@angular/core';
import { LayoutComponent, NalFooterDirective } from 'ng-admin-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, NalFooterDirective],
  template: `
    <nal-layout>
      <ng-template nalFooter>
        <span>&copy; 2026 Şirket Adı — Tüm hakları saklıdır.</span>
        <div>
          <a href="/privacy">Gizlilik</a> |
          <a href="/terms">Kullanım Koşulları</a>
        </div>
      </ng-template>
    </nal-layout>
  `,
})
export class AppComponent {}
```

---

### Tüm Slotları Aynı Anda Kullanmak

```ts
// app.component.ts
import { Component, inject } from '@angular/core';
import {
  LayoutComponent,
  NavItem,
  ThemeService,
  NAL_TEMPLATE_DIRECTIVES,   // 4 direktifi tek seferde import eder
} from 'ng-admin-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, ...NAL_TEMPLATE_DIRECTIVES],
  template: `
    <nal-layout [items]="navItems">

      <!-- 1. Sidebar logo -->
      <ng-template nalLogo>
        <img src="assets/logo.svg" alt="Logo" style="height:32px" />
      </ng-template>

      <!-- 2. Sidebar alt alan -->
      <ng-template nalSidebarBottom>
        <div class="sidebar-user-widget">
          <i class="ri-user-line"></i>
          <span>Profil</span>
        </div>
      </ng-template>

      <!-- 3. Header sağ aksiyonlar -->
      <ng-template nalHeaderActions>
        <button (click)="theme.toggleTheme()">
          <i [class]="theme.isDark() ? 'ri-moon-line' : 'ri-sun-line'"></i>
        </button>
        <button (click)="logout()">Çıkış</button>
      </ng-template>

      <!-- 4. Footer -->
      <ng-template nalFooter>
        <span>&copy; 2026 MyApp</span>
      </ng-template>

    </nal-layout>
  `,
})
export class AppComponent {
  theme = inject(ThemeService);

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', route: '/dashboard' },
  ];

  logout() {}
}
```

---

## `ThemeService` ile Programatik Tema Kontrolü

```ts
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ng-admin-layout';

@Component({ ... })
export class MyComponent {
  private theme = inject(ThemeService);

  toggle()       { this.theme.toggleTheme(); }       // light ↔ dark
  setDark()      { this.theme.setTheme('dark'); }
  setLight()     { this.theme.setTheme('light'); }

  isDark         = this.theme.isDark;                // Signal<boolean>
  currentTheme   = this.theme.theme;                 // Signal<'light' | 'dark'>
}
```

---

## `LayoutService` ile Runtime Yapılandırma Güncellemesi

`provideLayout()` yalnızca başlangıç değerini ayarlar. Uygulama çalışırken menüyü,
kullanıcı bilgisini, logoyu, footer'ı veya tema renklerini değiştirmek için `LayoutService`'i inject et.
Tüm değişiklikler anında DOM'a yansır.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { LayoutService, NavItem } from 'ng-admin-layout';

@Component({ ... })
export class MyComponent implements OnInit {
  private layout = inject(LayoutService);

  ngOnInit() {
    // Sunucudan menüyü çek ve uygula
    this.navService.getMenu().subscribe(items => {
      this.layout.setNavItems(items);
    });
  }
}
```

### `LayoutService` API

| Metod | Açıklama |
|---|---|
| `update(partial)` | Birden fazla alanı aynı anda güncelle |
| `setNavItems(items)` | Sidebar menüsünü değiştir |
| `setLogo(logo)` | Logo metnini / ikonunu / route'unu değiştir |
| `setUser(user)` | Header'daki kullanıcı adı / rol / avatarını değiştir |
| `setFooter(footer)` | Footer telif hakkı ve linklerini değiştir |
| `setCustomVars(vars)` | CSS değişkenlerini değiştir (anında DOM'a yansır) |
| `setDarkVars(vars)` | Dark moda özel CSS değişkenlerini değiştir |

### Örnekler

```ts
import { inject } from '@angular/core';
import { LayoutService } from 'ng-admin-layout';

// Bir bileşenin herhangi bir yerinde:
private layout = inject(LayoutService);
```

**Menüyü değiştir:**
```ts
this.layout.setNavItems([
  { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', route: '/dashboard' },
  { id: 'reports',   label: 'Raporlar',  icon: 'ri-bar-chart-line', route: '/reports'   },
]);
```

**Kullanıcıyı giriş sonrası güncelle:**
```ts
// auth servisten gelen kullanıcıyı yansıt
this.authService.currentUser$.subscribe(user => {
  this.layout.setUser({
    name:      user.fullName,
    role:      user.role,
    avatarUrl: user.avatarUrl ?? null,
  });
});
```

**Logo metnini değiştir:**
```ts
this.layout.setLogo({ text: 'MyApp v2', icon: 'ri-rocket-line' });
```

**Ana rengi runtime'da değiştir:**
```ts
this.layout.setCustomVars({
  '--primary':     '#10b981',
  '--primary-rgb': '16, 185, 129',
});
```

**Dark modda sidebar rengini değiştir:**
```ts
this.layout.setDarkVars({ '--sidebar-bg': '#0f172a' });
```

**Birden fazla alanı aynı anda güncelle:**
```ts
this.layout.update({
  logo:    { text: 'Admin Panel' },
  user:    { name: 'İsmail B.', role: 'Süper Admin' },
  footer:  { copyright: 'ACME Corp' },
  navItems: [
    { id: 'home', label: 'Ana Sayfa', icon: 'ri-home-line', route: '/' },
  ],
});
```

**`config` sinyalini okuyarak mevcut değerlere ulaş:**
```ts
// Mevcut menü
const items = this.layout.config().navItems;

// Tema değişikliklerini izle
effect(() => {
  const cfg = this.layout.config();
  console.log('Logo metni:', cfg.logo?.text);
});
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

| Değişken               | Açıklama                          |
|------------------------|-----------------------------------|
| `--primary`            | Ana renk (hex)                    |
| `--primary-rgb`        | Ana renk (R, G, B)                |
| `--primary-light`      | Açık ton                          |
| `--primary-dark`       | Koyu ton                          |
| `--sidebar-bg`         | Sidebar arka planı                |
| `--header-bg`          | Header arka planı                 |
| `--body-bg`            | Sayfa arka planı                  |
| `--text-primary`       | Birincil metin rengi              |
| `--text-secondary`     | İkincil metin rengi               |
| `--text-muted`         | Soluk metin rengi                 |
| `--border-color`       | Kenar çizgisi rengi               |
| `--sidebar-width`      | Açık sidebar genişliği            |
| `--sidebar-mini-width` | Daraltılmış sidebar genişliği     |
| `--header-height`      | Header yüksekliği                 |
| `--footer-height`      | Footer yüksekliği                 |

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
  icon?: string;      // Remix Icon sınıfı, örn: 'ri-home-line'
  route?: string;     // Angular router route
  children?: NavItem[];
}
```

---

## Gereksinimler

- Angular **17** veya üzeri
- `@angular/router` (RouterOutlet layout içinde kullanılır)
- İkonlar için [Remix Icon](https://remixicon.com/) önerilir

```html
<!-- index.html -->
<link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet" />
```

---

## Lisans

MIT © [ismail bayram](https://github.com/bayramismail)

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
