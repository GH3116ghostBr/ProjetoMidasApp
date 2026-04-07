// ==========================================================
// PROJETO MIDAS — Types (baseados nos Controllers C#)
// ==========================================================

// ── Usuário / Auth ─────────────────────────────────────────
export interface Usuario {
  idUsuario?: number;
  nomeUsuario: string;
  passwordString?: string;
  token?: string;
  lancamentos?: Lancamento[];
}

export interface AuthResponse {
  usuario: string;
  token: string;
}

// ── Lançamentos (LancamentosController) ───────────────────
export interface Lancamento {
  idLancamento?: number;
  idUsuario?: number;
  descricao: string;
  valor: number;
  data: string;          // "2025-04-06T00:00:00"
  dataCriacao?: string;
  tipo?: 'Receita' | 'Despesa' | string;
  idCategoria?: number;
  categoria?: string;
}

// ── Empréstimos (EmprestimosController) ───────────────────
export interface Emprestimo {
  idSimEmprestimo?: number;
  idUsuario?: number;
  nomeEmprestimo: string;
  descricaoEmprestimo?: string;
  provedorEmprestimo?: string;
  valorEmprestimo: number;
  parcelasEmprestimo: number;
  iofEmprestimo?: number;
  despesasEmprestimo?: number;
  tarifasEmprestimo?: number;
  data: string;
  // Campos calculados pela API (CalcularValores)
  valorParcela?: number;
  valorTotal?: number;
  cet?: number;
  dataCriacaoSE?: string;
}

// ── Projeções (ProjecoesController) ───────────────────────
export interface Projecao {
  idProjecao?: number;
  descricao: string;
  valorPrevisto: number;
  dataReferencia: string;
  dataCriacao?: string;
  categoria?: string;
}

// ── Recorrências (RecorrenciaController) ──────────────────
export interface Recorrencia {
  idRecorrente?: number;
  descricao: string;
  valor: number;
  idTipoRecorrencia: number;
  tipoRecorrencia?: TipoRecorrencia; // Include do controller
  momentoCriacao?: string;
}

export interface TipoRecorrencia {
  id?: number;
  nome: string;
  padraoSistema?: boolean;
}

// ── Empresa (EmpresaController) ───────────────────────────
export interface Empresa {
  idEmpresa?: number;
  idResponsavel?: number;
  razaoSocial: string;
  nomeFantasia?: string;
  telefoneEmp?: string;
  cnpjEmpresa?: string;
  emailEmpresa?: string;
}

// ── Responsável (ResponsavelController) ───────────────────
export interface Responsavel {
  idResponsavel?: number;
  nome: string;
}
