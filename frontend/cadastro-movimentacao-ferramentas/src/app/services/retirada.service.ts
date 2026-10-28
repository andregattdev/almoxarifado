import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Retirada, RetiradaRequest } from '../models/retirada.model';

@Injectable({ providedIn: 'root' })
export class RetiradaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/retiradas';

  listar(): Observable<Retirada[]> {
    return this.http.get<Retirada[]>(this.apiUrl);
  }

  registrar(request: RetiradaRequest): Observable<Retirada> {
    return this.http.post<Retirada>(this.apiUrl, request);
  }

  devolver(id: number): Observable<Retirada> {
    return this.http.put<Retirada>(`${this.apiUrl}/${id}/devolucao`, {});
  }
}
