import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Route } from '@features/routes/list/interfaces';

@Injectable()
export class RoutesService {
    private _apiUrl = 'assets/data/routes.json';
    private _http = inject(HttpClient);

    public getRoutesList(): Observable<Route[]> {
        return this._http.get<Route[]>(this._apiUrl);
    }

}