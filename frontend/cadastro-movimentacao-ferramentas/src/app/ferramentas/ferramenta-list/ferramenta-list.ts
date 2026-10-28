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

import { Peca } from '../../models/peca.model';
import { PecaService } from '../../services/peca.service';
import { FerramentaFormModal } from '../ferramenta-form-modal/ferramenta-form-modal';

@Component({
  selector: 'app-ferramenta-list',
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
  templateUrl: './ferramenta-list.html',
  styleUrl: './ferramenta-list.css',
})
export class FerramentaList implements OnInit, OnChanges {
  @Input() refreshKey = 0;

  private readonly pecaService = inject(PecaService);
  private readonly dialog = inject(MatDialog);

  protected pecas: Peca[] = [];
  protected carregando = true;
  protected erroCarregamento = false;
  protected filtroTexto = '';

  ngOnInit(): void {
    this.carregar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshKey'] && !changes['refreshKey'].firstChange) {
      this.carregar();
    }
  }

  protected carregar(): void {
    this.carregando = true;
    this.erroCarregamento = false;
    this.pecaService.listar().subscribe({
      next: pecas => {
        this.pecas = [...pecas].sort((a, b) => 
          (a.nomePeca ?? '').localeCompare(b.nomePeca ?? '', 'pt-BR', { sensitivity: 'base' })
        );
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.erroCarregamento = true;
      }
    });
  }

  get pecasFiltradas(): Peca[] {
    if (!this.filtroTexto.trim()) return this.pecas;
    const termo = this.filtroTexto.toLowerCase().trim();
    return this.pecas.filter(p => 
      p.nomePeca?.toLowerCase().includes(termo) ||
      p.codigo?.toLowerCase().includes(termo) ||
      p.descricaoPeca?.toLowerCase().includes(termo)
    );
  }

  protected abrirNovaFerramentaModal(): void {
    const dialogRef = this.dialog.open(FerramentaFormModal, {
      width: '600px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.carregar();
    });
  }

  protected abrirEditarFerramentaModal(ferramenta: Peca): void {
    const dialogRef = this.dialog.open(FerramentaFormModal, {
      width: '600px',
      maxWidth: '95vw',
      data: { ferramenta }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.carregar();
    });
  }

  protected async excluir(peca: Peca): Promise<void> {
    if (!peca.id) return;

    const confirmacao = await Swal.fire({
      icon: 'warning',
      title: 'Excluir ferramenta?',
      text: `Tem certeza que deseja apagar "${peca.nomePeca}" do cadastro?`,
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#718078'
    });

    if (!confirmacao.isConfirmed) return;

    this.pecaService.excluir(peca.id).subscribe({
      next: () => {
        void Swal.fire({
          icon: 'success',
          title: 'Ferramenta excluída',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#173c32'
        });
        this.carregar();
      },
      error: error => void Swal.fire({
        icon: 'error',
        title: 'Não foi possível excluir',
        text: error?.error || 'A ferramenta pode ter movimentações registradas.',
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#173c32'
      })
    });
  }
}
