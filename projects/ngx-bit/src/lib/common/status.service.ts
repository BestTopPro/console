import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable()
export class StatusService {
	private action = '/edit';

	constructor(private http: HttpService) {}

	customAction(name: string) {
		this.action = name;
	}

	factory(model: string, data: any, field = 'status'): Observable<any> {
		return this.http
			.req(model + this.action, {
				id: data.id,
				switch: true,
				[field]: !data[field]
			})
			.pipe(
				map((res) => {
					if (!res.error) {
						data[field] = !data[field];
					}
					return res;
				})
			);
	}
}
