import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FerramentaList } from './ferramentas/ferramenta-list/ferramenta-list';
import { FuncionariosList } from './funcionarios/funcionarios-list/funcionarios-list';
import { NavLateral, Secao } from './navegacao/nav-lateral/nav-lateral';

import { PecaService } from './services/peca.service';
import { FuncionarioService } from './services/funcionario.service';
import { RetiradaService } from './services/retirada.service';

import { FerramentaFormModal } from './ferramentas/ferramenta-form-modal/ferramenta-form-modal';
import { FuncionarioFormModal } from './funcionarios/funcionario-form-modal/funcionario-form-modal';
import { RetiradaFormModal } from './funcionarios/retirada-form-modal/retirada-form-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FerramentaList,
    FuncionariosList,
    NavLateral
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly pecaService = inject(PecaService);
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly retiradaService = inject(RetiradaService);
  private readonly dialog = inject(MatDialog);

  protected secaoAtiva: Secao = 'inicio';
  protected listaAtualizada = 0;
  protected funcionariosAtualizados = 0;

  protected totalFerramentas = 0;
  protected totalFuncionarios = 0;
  protected retiradasAtivasCount = 0;

  ngOnInit(): void {
    this.carregarResumo();
  }

  protected carregarResumo(): void {
    this.pecaService.listar().subscribe({
      next: pecas => this.totalFerramentas = pecas.length,
      error: () => {}
    });
    this.funcionarioService.listar().subscribe({
      next: funcs => this.totalFuncionarios = funcs.length,
      error: () => {}
    });
    this.retiradaService.listar().subscribe({
      next: retiradas => this.retiradasAtivasCount = retiradas.filter(r => !r.dataHoraDevolucao).length,
      error: () => {}
    });
  }

  protected abrirModalNovaFerramenta(): void {
    const dialogRef = this.dialog.open(FerramentaFormModal, {
      width: '600px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.listaAtualizada++;
        this.carregarResumo();
      }
    });
  }

  protected abrirModalNovoFuncionario(): void {
    const dialogRef = this.dialog.open(FuncionarioFormModal, {
      width: '520px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.funcionariosAtualizados++;
        this.carregarResumo();
      }
    });
  }

  protected abrirModalNovaRetirada(): void {
    const dialogRef = this.dialog.open(RetiradaFormModal, {
      width: '520px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.funcionariosAtualizados++;
        this.carregarResumo();
      }
    });
  }

  protected selecionarSecao(secao: Secao): void {
    this.secaoAtiva = secao;
    if (secao === 'inicio') this.carregarResumo();
  }
}
