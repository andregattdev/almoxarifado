import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type Secao = 'inicio' | 'ferramentas' | 'funcionarios';

@Component({
  imports: [MatIconModule],
  selector: 'app-nav-lateral',
  styleUrl: './nav-lateral.css',
  templateUrl: './nav-lateral.html',
})
export class NavLateral {
  @Input() secaoAtiva: Secao = 'inicio';
  @Output() secaoSelecionada = new EventEmitter<Secao>();

  protected selecionar(secao: Secao): void {
    this.secaoAtiva = secao;
    this.secaoSelecionada.emit(secao);
  }
}
