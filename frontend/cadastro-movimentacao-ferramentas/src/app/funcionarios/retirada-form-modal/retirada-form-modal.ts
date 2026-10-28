import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Funcionario } from '../../models/funcionario.model';
import { Peca } from '../../models/peca.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { PecaService } from '../../services/peca.service';
import { RetiradaService } from '../../services/retirada.service';

export interface RetiradaFormModalData {
  funcionarios?: Funcionario[];
  pecas?: Peca[];
  funcionarioIdPreselecionado?: number;
}

@Component({
  selector: 'app-retirada-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './retirada-form-modal.html',
  styleUrl: './retirada-form-modal.css'
})
export class RetiradaFormModal implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly retiradaService = inject(RetiradaService);
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly pecaService = inject(PecaService);
  protected dialogRef = inject(MatDialogRef<RetiradaFormModal>);

  protected funcionarios: Funcionario[] = [];
  protected pecas: Peca[] = [];
  protected registrando = false;
  protected carregandoListas = true;

  protected formulario = this.formBuilder.nonNullable.group({
    funcionarioId: [0, Validators.min(1)],
    pecaId: [0, Validators.min(1)]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: RetiradaFormModalData) {
    if (data?.funcionarios) this.funcionarios = data.funcionarios;
    if (data?.pecas) this.pecas = data.pecas;
    if (data?.funcionarioIdPreselecionado) {
      this.formulario.patchValue({ funcionarioId: data.funcionarioIdPreselecionado });
    }
  }

  ngOnInit(): void {
    if (this.funcionarios.length === 0 || this.pecas.length === 0) {
      this.carregarDados();
    } else {
      this.carregandoListas = false;
    }
  }

  private carregarDados(): void {
    this.carregandoListas = true;
    this.funcionarioService.listar().subscribe({
      next: funcs => this.funcionarios = funcs.sort((a,b) => (a.nomeFuncionario ?? '').localeCompare(b.nomeFuncionario ?? '')),
      error: () => {}
    });
    this.pecaService.listar().subscribe({
      next: pecas => {
        this.pecas = pecas.sort((a,b) => (a.nomePeca ?? '').localeCompare(b.nomePeca ?? ''));
        this.carregandoListas = false;
      },
      error: () => { this.carregandoListas = false; }
    });
  }

  protected registrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.registrando = true;
    this.retiradaService.registrar(this.formulario.getRawValue()).subscribe({
      next: (resultado) => {
        this.registrando = false;
        void Swal.fire({
          icon: 'success',
          title: 'Retirada Registrada',
          text: 'A ferramenta foi vinculada com sucesso ao funcionário.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#173c32'
        });
        this.dialogRef.close(resultado);
      },
      error: (error) => {
        this.registrando = false;
        void Swal.fire({
          icon: 'error',
          title: 'Não foi possível registrar',
          text: error?.error || 'Verifique os dados e tente novamente.',
          confirmButtonText: 'Fechar',
          confirmButtonColor: '#173c32'
        });
      }
    });
  }

  protected fechar(): void {
    this.dialogRef.close();
  }
}
