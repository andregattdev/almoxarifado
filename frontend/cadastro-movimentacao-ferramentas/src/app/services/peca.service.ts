import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peca } from '../models/peca.model';

@Injectable({ providedIn: 'root' })
export class PecaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/pecas';

  listar(): Observable<Peca[]> {
    return this.http.get<Peca[]>(this.apiUrl);
  }

  criar(peca: Peca): Observable<Peca> {
    return this.http.post<Peca>(this.apiUrl, peca);
  }

  atualizar(id: number, peca: Peca): Observable<Peca> {
    return this.http.put<Peca>(`${this.apiUrl}/${id}`, peca);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
