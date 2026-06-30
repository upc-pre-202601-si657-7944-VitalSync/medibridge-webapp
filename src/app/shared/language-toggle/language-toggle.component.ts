import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleService, Locale } from '../../i18n/locale.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.css'],
})
export class LanguageToggleComponent {
  private readonly localeService = inject(LocaleService);

  readonly currentLocale = this.localeService.locale;

  setLocale(locale: Locale): void {
    this.localeService.setLocale(locale);
  }
}
