import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

import { Funcionario } from '../../models/funcionario.model';
import { Peca } from '../../models/peca.model';
import { Retirada } from '../../models/retirada.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { PecaService } from '../../services/peca.service';
import { RetiradaService } from '../../services/retirada.service';

import { FuncionarioFormModal } from '../funcionario-form-modal/funcionario-form-modal';
import { FuncionarioHistoricoModal } from '../funcionario-historico-modal/funcionario-historico-modal';
import { RetiradaFormModal } from '../retirada-form-modal/retirada-form-modal';

@Component({
  selector: 'app-funcionarios-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './funcionarios-list.html',
  styleUrl: './funcionarios-list.css',
})
export class FuncionariosList implements OnInit, OnChanges {
  @Input() refreshKey = 0;

  private readonly funcionarioService = inject(FuncionarioService);
  private readonly pecaService = inject(PecaService);
  private readonly retiradaService = inject(RetiradaService);
  private readonly dialog = inject(MatDialog);

  protected funcionarios: Funcionario[] = [];
  protected pecas: Peca[] = [];
  protected retiradas: Retirada[] = [];
  protected carregando = true;
  protected filtroTexto = '';

  ngOnInit(): void {
    this.carregarDados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshKey'] && !changes['refreshKey'].firstChange) {
      this.carregarDados();
    }
  }

  protected carregarDados(): void {
    this.carregando = true;
    this.funcionarioService.listar().subscribe({
      next: funcionarios => {
        this.funcionarios = [...funcionarios].sort((a, b) => 
          (a.nomeFuncionario ?? '').localeCompare(b.nomeFuncionario ?? '', 'pt-BR', { sensitivity: 'base' })
        );
      },
      error: () => this.erro('funcionários')
    });

    this.pecaService.listar().subscribe({
      next: pecas => {
        this.pecas = [...pecas].sort((a, b) => 
          (a.nomePeca ?? '').localeCompare(b.nomePeca ?? '', 'pt-BR', { sensitivity: 'base' })
        );
      },
      error: () => this.erro('ferramentas')
    });

    this.retiradaService.listar().subscribe({
      next: retiradas => {
        this.retiradas = retiradas;
        this.carregando = false;
      },
      error: () => this.erro('movimentações')
    });
  }

  get funcionariosFiltrados(): Funcionario[] {
    if (!this.filtroTexto.trim()) return this.funcionarios;
    const termo = this.filtroTexto.toLowerCase().trim();
    return this.funcionarios.filter(f => 
      f.nomeFuncionario?.toLowerCase().includes(termo) ||
      f.cargo?.toLowerCase().includes(termo)
    );
  }

  protected abrirNovoFuncionarioModal(): void {
    const dialogRef = this.dialog.open(FuncionarioFormModal, {
      width: '520px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.carregarDados();
    });
  }

  protected abrirEditarFuncionarioModal(event: Event, funcionario: Funcionario): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(FuncionarioFormModal, {
      width: '520px',
      maxWidth: '95vw',
      data: { funcionario }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.carregarDados();
    });
  }

  protected async excluirFuncionario(event: Event, funcionario: Funcionario): Promise<void> {
    event.stopPropagation();
    if (!funcionario.id) return;

    const confirmacao = await Swal.fire({
      icon: 'warning',
      title: 'Excluir funcionário?',
      text: `Tem certeza que deseja excluir ${funcionario.nomeFuncionario}? Esta ação não pode ser desfeita.`,
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#718078'
    });

    if (!confirmacao.isConfirmed) return;

    this.funcionarioService.excluir(funcionario.id).subscribe({
      next: () => {
        void Swal.fire({
          icon: 'success',
          title: 'Funcionário excluído',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#173c32'
        });
        this.carregarDados();
      },
      error: (error) => void Swal.fire({
        icon: 'error',
        title: 'Não foi possível excluir',
        text: error?.error || 'Verifique se o funcionário possui registros vinculados.',
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#173c32'
      })
    });
  }

  protected abrirRetiradaModal(): void {
    const dialogRef = this.dialog.open(RetiradaFormModal, {
      width: '520px',
      maxWidth: '95vw',
      data: {
        funcionarios: this.funcionarios,
        pecas: this.pecas
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.carregarDados();
    });
  }

  protected abrirHistorico(funcionario: Funcionario): void {
    const dialogRef = this.dialog.open(FuncionarioHistoricoModal, {
      width: '640px',
      maxWidth: '95vw',
      data: {
        funcionario,
        retiradas: this.retiradas
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.carregarDados();
    });
  }

  protected getItensAtivosCount(funcionarioId?: number): number {
    if (!funcionarioId) return 0;
    return this.retiradas.filter(r => r.funcionario?.id === funcionarioId && !r.dataHoraDevolucao).length;
  }

  protected emUso(retirada: Retirada): boolean {
    return !retirada.dataHoraDevolucao;
  }

  protected async devolver(retirada: Retirada): Promise<void> {
    if (!retirada.id) return;
    const confirmacao = await Swal.fire({
      icon: 'question',
      title: 'Registrar devolução?',
      text: `${retirada.peca.nomePeca} será marcada como devolvida.`,
      showCancelButton: true,
      confirmButtonText: 'Sim, devolver',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#173c32',
      cancelButtonColor: '#718078'
    });

    if (!confirmacao.isConfirmed) return;

    this.retiradaService.devolver(retirada.id).subscribe({
      next: () => {
        void Swal.fire({
          icon: 'success',
          title: 'Devolução registrada',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#173c32'
        });
        this.carregarDados();
      },
      error: error => void Swal.fire({
        icon: 'error',
        title: 'Não foi possível registrar',
        text: error?.error || 'Tente novamente.',
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#173c32'
      })
    });
  }

  private erro(item: string): void {
    this.carregando = false;
    void Swal.fire({
      icon: 'error',
      title: `Erro ao carregar ${item}`,
      confirmButtonText: 'Fechar',
      confirmButtonColor: '#173c32'
    });
  }
}
