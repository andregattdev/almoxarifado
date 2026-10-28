export interface Peca {
  id?: number;
  nomePeca: string;
  codigo: string;
  descricaoPeca: string;
  estoque: number | null;
  especificacoes?: Especificacao[];
  lotes?: Lote[];
  ativo?: boolean;
}

export interface Especificacao {
  id?: number;
  material: string;
  dimensoes?: string;
  peso?: number | null;
  cor?: string;
  descricaoTecnica?: string;
}

export interface Lote {
  id?: number;
  quantidade: number;
  pacoteFechado?: boolean;
}
