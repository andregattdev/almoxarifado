import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  selector: 'app-funcionarios-form',
  styleUrl: './funcionarios-form.css',
  templateUrl: './funcionarios-form.html',
})
export class FuncionariosForm {
  @Output() salvo = new EventEmitter<void>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly funcionarioService = inject(FuncionarioService);
  protected salvando = false;
  protected formulario = this.formBuilder.nonNullable.group({
    nomeFuncionario: ['', Validators.required],
    cargo: ['', Validators.required]
  });

  protected salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.funcionarioService.criar(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.salvando = false;
        this.formulario.reset({ nomeFuncionario: '', cargo: '' });
        void Swal.fire({ icon: 'success', title: 'Funcionário cadastrado', confirmButtonText: 'Continuar', confirmButtonColor: '#173c32' });
        this.salvo.emit();
      },
      error: error => {
        this.salvando = false;
        void Swal.fire({ icon: 'error', title: 'Não foi possível cadastrar', text: error?.error || 'Verifique os dados e tente novamente.', confirmButtonText: 'Fechar', confirmButtonColor: '#173c32' });
      }
    });
  }
}
