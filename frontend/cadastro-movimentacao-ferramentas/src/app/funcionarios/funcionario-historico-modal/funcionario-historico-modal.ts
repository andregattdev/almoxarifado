import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { Funcionario } from '../../models/funcionario.model';
import { Retirada } from '../../models/retirada.model';
import { RetiradaService } from '../../services/retirada.service';

export interface FuncionarioHistoricoData {
  funcionario: Funcionario;
  retiradas: Retirada[];
}

@Component({
  selector: 'app-funcionario-historico-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './funcionario-historico-modal.html',
  styleUrl: './funcionario-historico-modal.css'
})
export class FuncionarioHistoricoModal {
  private readonly retiradaService = inject(RetiradaService);
  protected dialogRef = inject(MatDialogRef<FuncionarioHistoricoModal>);

  protected funcionario: Funcionario;
  protected retiradas: Retirada[] = [];
  protected filtroTexto = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: FuncionarioHistoricoData) {
    this.funcionario = data.funcionario;
    this.retiradas = (data.retiradas || []).filter(r => r.funcionario?.id === this.funcionario.id);
  }

  get retiradasAtivas(): Retirada[] {
    return this.retiradas.filter(r => !r.dataHoraDevolucao);
  }

  get retiradasFiltradas(): Retirada[] {
    if (!this.filtroTexto.trim()) return this.retiradas;
    const termo = this.filtroTexto.toLowerCase().trim();
    return this.retiradas.filter(r => 
      r.peca?.nomePeca?.toLowerCase().includes(termo) ||
      r.peca?.codigo?.toLowerCase().includes(termo) ||
      r.dataHoraRetirada?.toLowerCase().includes(termo)
    );
  }

  protected async devolver(retirada: Retirada): Promise<void> {
    if (!retirada.id) return;
    const confirmacao = await Swal.fire({
      icon: 'question',
      title: 'Registrar devolução?',
      text: `${retirada.peca.nomePeca} será marcada como devolvida por ${this.funcionario.nomeFuncionario}.`,
      showCancelButton: true,
      confirmButtonText: 'Sim, devolver',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#173c32',
      cancelButtonColor: '#718078'
    });

    if (!confirmacao.isConfirmed) return;

    this.retiradaService.devolver(retirada.id).subscribe({
      next: (devolvido) => {
        void Swal.fire({
          icon: 'success',
          title: 'Devolução registrada!',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#173c32'
        });
        const idx = this.retiradas.findIndex(r => r.id === retirada.id);
        if (idx !== -1) {
          this.retiradas[idx] = devolvido;
        }
      },
      error: (error) => void Swal.fire({
        icon: 'error',
        title: 'Não foi possível registrar devolução',
        text: error?.error || 'Tente novamente.',
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#173c32'
      })
    });
  }

  protected fechar(): void {
    this.dialogRef.close();
  }
}
