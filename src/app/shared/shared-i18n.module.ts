import { NgModule } from '@angular/core';
import { TranslatePipe } from '../i18n/translate.pipe';
import { LanguageToggleComponent } from './language-toggle/language-toggle.component';

@NgModule({
  imports: [TranslatePipe, LanguageToggleComponent],
  exports: [TranslatePipe, LanguageToggleComponent],
})
export class SharedI18nModule {}
