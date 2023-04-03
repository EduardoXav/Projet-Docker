import { Injectable } from '@angular/core';
import { Cd } from '../models/cd';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { ListCDsComponent } from '../list-cds/list-cds.component';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CdsService {

  constructor(private http: HttpClient) { }

  getAllCDs(): Observable<Cd[]> {
    return this.http.get<Cd[]>('http://localhost:3000/CD');
  }

  getCdById(id: number): Observable<Cd> {
    const cd = this.http.get<Cd>('http://localhost:3000/CD/' + id);
    if (cd === undefined) {
      throw new Error('CD introuvable');
    }else{
      return cd;
    }
  }

  addCD(cd: Cd): Observable<Cd> {
    return this.http.post<Cd>('http://localhost:3000/CD/', cd);
  }
  
  AddCD(cd: Cd): Observable<Cd>{
    return this.getAllCDs().pipe(
      map(cds => [...cds].sort((a, b) => a.id - b.id)),
      map(cds_tries => cds_tries[cds_tries.length - 1]),
      map(cd_max => (cd.id = cd_max.id + 1)),
      switchMap(() => this.http.post<Cd>('http://localhost:3000/CD/', cd))
    )

  }
}
