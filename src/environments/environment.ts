import { BitConfig } from 'ngx-bit';
import { Locale } from 'ngx-bit/i18n';

const cdn = 'https://cdn.kainonly.com/';

const bit: Partial<BitConfig> = {
  baseUrl: 'https://dev.kainonly.com/system',
  assets: cdn
};

const locales: Locale[] = [
  {
    id: 'zh_cn',
    name: '中文'
  },
  {
    id: 'en_us',
    name: 'English'
  }
];

export const environment = {
  production: false,
  iconUrl: cdn,
  bit,
  locales
};
