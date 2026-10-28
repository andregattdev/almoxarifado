import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Peca } from '../../models/peca.model';
import { PecaService } from '../../services/peca.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ferramenta-form',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './ferramenta-form.html',
  styleUrl: './ferramenta-form.css'
})
export class FerramentaForm implements OnChanges {
  @Input() ferramenta: Peca | null = null;
  @Output() salva = new EventEmitter<void>();
  @Output() cancelada = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly pecaService = inject(PecaService);
  protected salvando = false;
  protected formulario = this.formBuilder.nonNullable.group({
    nomePeca: ['', Validators.required],
    codigo: [''],
    descricaoPeca: [''],
    estoque: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ferramenta']) {
      const peca = this.ferramenta;
      this.formulario.reset({
        nomePeca: peca?.nomePeca ?? '',
        codigo: peca?.codigo ?? '',
        descricaoPeca: peca?.descricaoPeca ?? '',
        estoque: peca?.estoque ?? 0
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
      next: () => {
        this.salvando = false;
        void Swal.fire({
          icon: 'success',
          title: this.ferramenta?.id ? 'Ferramenta atualizada' : 'Ferramenta cadastrada',
          text: this.ferramenta?.id ? 'As alterações foram salvas.' : 'A ferramenta foi adicionada ao estoque.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#173c32'
        });
        this.salva.emit();
      },
      error: error => {
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

  protected cancelar(): void {
    this.formulario.reset({ nomePeca: '', codigo: '', descricaoPeca: '', estoque: 0 });
    this.cancelada.emit();
  }
}
