import {Injectable} from '@angular/core';
import {HttpService} from '../http.service';
import {Observable} from 'rxjs';

@Injectable()
export class OriginListsService {
  private action = '/originLists';

  constructor(private http: HttpService) {
  }

  customAction(name: string) {
    this.action = name;
  }

  factory(model: string, condition: any[] = [], like: any = []): Observable<any> {
    return this.http.req(model + this.action, {
      where: condition,
      like: like
    });
  }
}
