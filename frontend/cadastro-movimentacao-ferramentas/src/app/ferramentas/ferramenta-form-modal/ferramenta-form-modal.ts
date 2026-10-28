import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Peca } from '../../models/peca.model';
import { PecaService } from '../../services/peca.service';

export interface FerramentaFormModalData {
  ferramenta?: Peca | null;
}

@Component({
  selector: 'app-ferramenta-form-modal',
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
  templateUrl: './ferramenta-form-modal.html',
  styleUrl: './ferramenta-form-modal.css'
})
export class FerramentaFormModal {
  private readonly formBuilder = inject(FormBuilder);
  private readonly pecaService = inject(PecaService);
  protected dialogRef = inject(MatDialogRef<FerramentaFormModal>);

  protected ferramenta: Peca | null = null;
  protected salvando = false;

  protected formulario = this.formBuilder.nonNullable.group({
    nomePeca: ['', Validators.required],
    codigo: [''],
    descricaoPeca: [''],
    estoque: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: FerramentaFormModalData) {
    if (data?.ferramenta) {
      this.ferramenta = data.ferramenta;
      this.formulario.patchValue({
        nomePeca: this.ferramenta.nomePeca || '',
        codigo: this.ferramenta.codigo || '',
        descricaoPeca: this.ferramenta.descricaoPeca || '',
        estoque: this.ferramenta.estoque ?? 0
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

    const request = this.ferramenta?.id
      ? this.pecaService.atualizar(this.ferramenta.id, dados)
      : this.pecaService.criar(dados);

    request.subscribe({
      next: (resultado) => {
        this.salvando = false;
        void Swal.fire({
          icon: 'success',
          title: this.ferramenta?.id ? 'Ferramenta atualizada' : 'Ferramenta cadastrada',
          text: this.ferramenta?.id ? 'As alterações foram salvas com sucesso.' : 'A ferramenta foi adicionada ao inventário.',
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
