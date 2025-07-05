import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

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
        return areas.filter((item: any) => item.parentId == parentId);
      })
    );
  }
  // Method to fetch categories from JSON data
  // This method retrieves the categories from the JSON file and returns them as an observable array.
  getCategories(): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    }).pipe(
      map(data => {
        const categories = data.categories || [];
        return categories;
      })
    );
  }
  // Method to fetch brands from JSON data
  // This method retrieves the brands from the JSON file and returns them as an observable array.
  getBrands(): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    }).pipe(
      map(data => {
        const brands = data.brands || [];
        return brands;
      })
    );
  }
  // Method to fetch section permissions from is permitted or not
  // In your data service
  private publishSections: any[] = [];

  // Load sections once and cache them
  loadSections(): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl, {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    }).pipe(
      tap((data: any) => {
        this.publishSections = data.publishSections || [];
      })
    );
  }

  // Check if section is permitted
  isPermitted(sectionName: string): boolean {
    return this.publishSections.some(
      section => section.name.toLowerCase() === sectionName.toLowerCase()
    );
  }
}
