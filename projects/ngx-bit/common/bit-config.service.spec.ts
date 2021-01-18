import { TestBed } from '@angular/core/testing';
import { BitConfigService, BitEventsService, BitHttpService, BitService, BitSupportService, BitSwalService } from 'ngx-bit';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../simulation/environment';

describe('BitConfigService', () => {
  let config: BitConfigService;

  beforeEach(() => {
    if (!config) {
      TestBed.configureTestingModule({
        providers: [
          BitService,
          BitHttpService,
          BitEventsService,
          BitSupportService,
          BitSwalService,
          {
            provide: BitConfigService, useFactory: () => {
              const env = environment.bit;
              const service = new BitConfigService();
              Reflect.ownKeys(env).forEach(key => {
                service[key] = env[key];
              });
              return service;
            }
          }
        ]
      });
      config = TestBed.inject(BitConfigService);
    }
  });

  it('Verify configuration correctness', () => {
    expect(config.url).toBe(environment.bit.url);
    expect(config.api).toBe(environment.bit.api);
    expect(config.locale).toBe(environment.bit.locale);
    expect(config.page).toBe(environment.bit.page);
    expect(config.col).toBe(environment.bit.col);
    expect(config.i18n).toBe(environment.bit.i18n);
  });

  it('Test setup common language pack', (done) => {
    config.setupLocales(import('../simulation/common.language'));
    setTimeout(() => {
      const lang = config.getLang('zh_cn');
      expect(lang).not.toBeNull();
      expect(lang.dashboard).toBe('仪表盘');
      done();
    }, 1000);
  });

  it('Test set up request interceptor', (done) => {
    const http = of({
      error: 1,
      code: 400
    });
    config.setupHttpInterceptor(
      map((res: any) => {
        if (res.error === 1 && res.code === 400) {
          return false;
        }
        return res;
      })
    );
    http.pipe(
      config.getHttpInterceptor()
    ).subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });
});
