import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private jsonUrl = 'assets/data.json';

  // Method to fetch JSON data
  getJsonData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  // Method to fetch and filter JSON data by parentId
  getCityByParentId(parentId: string): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => {
        // Access the city array and filter it based on parentId
        const cities = data.city || [];
        return cities.filter((item: any) => item.parentId == parentId);
      })
    );
  }

  // Method to fetch and filter JSON data by parentId
  getAreaByParentId(parentId: string): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(data => {
        // Access the area array and filter it based on parentId
        const areas = data.area || [];
        console.log(areas)
        return areas.filter((item: any) => item.parentId == parentId);
      })
    );
  }
}
