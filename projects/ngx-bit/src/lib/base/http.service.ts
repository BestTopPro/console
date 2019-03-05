import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ConfigService} from './config.service';
import {BitService} from './bit.service';

@Injectable()
export class HttpService {
  private model: string;

  constructor(private http: HttpClient,
              private config: ConfigService,
              private bit: BitService) {
  }

  /**
   * SetModel
   */
  setModel(model: string) {
    this.model = model;
  }

  /**
   * HttpClient
   */
  req(url: string, body: any = {}, method = 'post'): Observable<any> {
    const httpClient = this.http.request(method, this.config.origin + this.config.namespace + '/' + url, {
      body,
      withCredentials: this.config.withCredentials
    });
    return !this.config.httpInterceptor ? httpClient : httpClient.pipe(
      switchMap(res => this.config.interceptor(res))
    );
  }

  /**
   * Get Request
   */
  get(condition: any, special = false): Observable<any> {
    const http = condition.hasOwnProperty('id') ? this.req(this.model + '/get', condition) : this.req(this.model + '/get', {
      where: condition
    });
    return special ? http : http.pipe(
      map(res => !res.error ? res.data : {})
    );
  }

  /**
   * Lists Request
   */
  lists(condition: any[] = [], refresh = false, special = false): Observable<any> {
    if (refresh) {
      this.bit.listsPageIndex = 1;
    }
    const http = this.req(this.model + '/lists', {
      page: {
        limit: this.bit.pageLimit,
        index: this.bit.listsPageIndex
      },
      where: condition,
    }).pipe(
      map((res) => {
        this.bit.listsTotals = !res.error ? res.data.total : 0;
        this.bit.listsLoading = false;
        this.bit.listsAllChecked = false;
        this.bit.listsIndeterminate = false;
        this.bit.listsDisabledAction = true;
        this.bit.listsCheckedNumber = 0;
        return res;
      })
    );
    return special ? http : http.pipe(
      map(res => !res.error ? res.data.lists : [])
    );
  }

  /**
   * OriginLists Request
   */
  originLists(condition: any[] = [], special = false): Observable<any> {
    const http = this.req(this.model + '/originLists', {
      where: condition
    });
    return special ? http : http.pipe(
      map(res => !res.error ? res.data : [])
    );
  }

  /**
   * Add Request
   */
  add(data: any): Observable<any> {
    return this.req(this.model + '/add', data);
  }

  /**
   * Edit Request
   */
  edit(data: any, condition: any = []): Observable<any> {
    data.switch = false;
    return !condition ? this.req(this.model + '/edit', data) : this.req(this.model + '/edit', Object.assign(data, {
        where: condition
      })
    );
  }

  /**
   * Status Request
   */
  status(data: any, field = 'status', extra?: any): Observable<any> {
    return this.req(this.model + '/edit', {
      id: data.id,
      switch: true,
      [field]: !data[field],
      extra
    }).pipe(
      map((res) => {
        if (!res.error) {
          data[field] = !data[field];
        }
        return res;
      })
    );
  }

  /**
   * Delete Request
   */
  delete(condition: any): Observable<any> {
    return condition.hasOwnProperty('id') ? this.req(this.model + '/delete', condition) : this.req(this.model + '/delete', {
      where: condition
    });
  }
}
