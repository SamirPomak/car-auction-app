import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeMap: Record<Theme, string> = {
    dark: 'md-dark-indigo',
    light: 'md-light-indigo',
  };
  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(theme: Theme) {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = this.themeMap[theme] + '.css';
    }

    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }
  }
}
