import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Funcionario } from '../../models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';

export interface FuncionarioFormModalData {
  funcionario?: Funcionario | null;
}

@Component({
  selector: 'app-funcionario-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './funcionario-form-modal.html',
  styleUrl: './funcionario-form-modal.css'
})
export class FuncionarioFormModal {
  private readonly formBuilder = inject(FormBuilder);
  private readonly funcionarioService = inject(FuncionarioService);
  protected dialogRef = inject(MatDialogRef<FuncionarioFormModal>);

  protected funcionario: Funcionario | null = null;
  protected salvando = false;

  protected formulario = this.formBuilder.nonNullable.group({
    nomeFuncionario: ['', Validators.required],
    cargo: ['', Validators.required]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: FuncionarioFormModalData) {
    if (data?.funcionario) {
      this.funcionario = data.funcionario;
      this.formulario.patchValue({
        nomeFuncionario: this.funcionario.nomeFuncionario || '',
        cargo: this.funcionario.cargo || ''
      });
    }
  }

  protected salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const dados = this.formulario.getRawValue();

    const request = this.funcionario?.id
      ? this.funcionarioService.atualizar(this.funcionario.id, dados)
      : this.funcionarioService.criar(dados);

    request.subscribe({
      next: (resultado) => {
        this.salvando = false;
        void Swal.fire({
          icon: 'success',
          title: this.funcionario?.id ? 'Funcionário atualizado' : 'Funcionário cadastrado',
          text: this.funcionario?.id ? 'Os dados do funcionário foram alterados.' : 'O novo funcionário foi adicionado ao sistema.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#173c32'
        });
        this.dialogRef.close(resultado);
      },
      error: (error) => {
        this.salvando = false;
        void Swal.fire({
          icon: 'error',
          title: 'Não foi possível salvar',
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
