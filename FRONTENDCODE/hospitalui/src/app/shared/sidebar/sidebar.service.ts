import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteInfo } from './sidebar.metadata';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(private http: HttpClient) {}

  /**
   * Get sidebar menu items from JSON file
   * @returns Observable<RouteInfo[]>
   */
  getRouteInfo(): Observable<RouteInfo[]> {
    // Assuming the JSON file is in the assets folder
    return this.http
      .get<{ routes: RouteInfo[] }>('assets/data/routes.json')
      .pipe(map((response) => response.routes));
  }
}
