import { Funcionario } from './funcionario.model';
import { Peca } from './peca.model';

export interface Retirada {
  id?: number;
  funcionario: Funcionario;
  peca: Peca;
  dataHoraRetirada: string;
  dataHoraDevolucao?: string | null;
}

export interface RetiradaRequest {
  funcionarioId: number;
  pecaId: number;
}
