import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

export function asyncValidator(req: Observable<any>): Observable<any> {
  return Observable.create(observer => {
    setTimeout(() => {
      req.subscribe(res => {
        if (!res.error) {
          if (res.data) {
            observer.next({error: true, duplicated: true});
          } else {
            observer.next(null);
          }
        } else {
          observer.next({error: true});
        }
        observer.complete();
      });
    }, 1000);
  });
}

export function i18nControlsValue(i18n: string, value?: any): string {
  if (!value) {
    return null;
  }
  if (value[i18n] !== undefined) {
    return value[i18n];
  } else {
    return null;
  }
}

export function i18nControlsValidate(i18n: string, validate?: any): any[] {
  if (!validate) {
    return [];
  }
  if (validate[i18n] !== undefined) {
    return [validate[i18n]];
  } else {
    return [];
  }
}

export function i18nControlsAsyncValidate(i18n: string, asyncValidate?: any): any[] {
  if (!asyncValidate) {
    return [];
  }
  if (asyncValidate[i18n] !== undefined) {
    return [asyncValidate[i18n]];
  } else {
    return [];
  }
}

export function getId(route: ActivatedRoute): Observable<any> {
  return route.params.pipe(map(params => params.id));
}

export function emptyObject(object: any): boolean {
  if (typeof object === 'object') {
    return Object.keys(object).length === 0;
  } else {
    return false;
  }
}

export function getRouteName(url: string, start = '%7B', end = '%7D'): string {
  const reg1 = new RegExp(`(?:${start})(.+?)(?=${end})`, 'g');
  return url.match(reg1)[0].replace(start, '');
}
