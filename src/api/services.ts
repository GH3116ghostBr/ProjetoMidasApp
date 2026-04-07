import * as SecureStore from 'expo-secure-store';
import api from './client';
import type {
  AuthResponse,
  Emprestimo,
  Empresa,
  Lancamento,
  Projecao,
  Recorrencia,
  Responsavel,
  TipoRecorrencia,
} from '../types';

// ==========================================================
// AUTH — /Usuario
// ==========================================================
export const authService = {
  registrar: (nomeUsuario: string, senha: string) =>
    api.post<string>('/Usuario/Registrar', { nomeUsuario, passwordString: senha })
       .then((r) => r.data),

  autenticar: async (nomeUsuario: string, senha: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/Usuario/Autenticar', {
      nomeUsuario,
      passwordString: senha,
    });
    await SecureStore.setItemAsync('midas_token', data.token);
    await SecureStore.setItemAsync('midas_user', data.usuario);
    return data;
  },

  alterarSenha: (nomeUsuario: string, novaSenha: string) =>
    api.put('/Usuario/AlterarSenha', { nomeUsuario, passwordString: novaSenha }),

  logout: async () => {
    await SecureStore.deleteItemAsync('midas_token');
    await SecureStore.deleteItemAsync('midas_user');
  },

  getToken: () => SecureStore.getItemAsync('midas_token'),
  getUser:  () => SecureStore.getItemAsync('midas_user'),
};

// ==========================================================
// LANÇAMENTOS — /Lancamentos
// Filtros automáticos por usuário logado (JWT no header)
// ==========================================================
export const lancamentosService = {
  getAll: () =>
    api.get<Lancamento[]>('/Lancamentos/GetAll').then((r) => r.data),

  getById: (id: number) =>
    api.get<Lancamento>(`/Lancamentos/${id}`).then((r) => r.data),

  getByMes: (ano: number, mes: number) =>
    api.get<Lancamento[]>(`/Lancamentos/mes/${ano}/${mes}`).then((r) => r.data),

  getByDia: (ano: number, mes: number, dia: number) =>
    api.get<Lancamento[]>(`/Lancamentos/dia/${ano}/${mes}/${dia}`).then((r) => r.data),

  getByAno: (ano: number) =>
    api.get<Lancamento[]>(`/Lancamentos/ano/${ano}`).then((r) => r.data),

  getSomatoria: () =>
    api.get<number>('/Lancamentos/somatoria').then((r) => r.data),

  getMaioresQue: (valor: number) =>
    api.get<Lancamento[]>(`/Lancamentos/comparacao/${valor}`).then((r) => r.data),

  criar: (lancamento: Omit<Lancamento, 'idLancamento' | 'idUsuario' | 'dataCriacao'>) =>
    api.post<Lancamento>('/Lancamentos/New', lancamento).then((r) => r.data),

  atualizar: (id: number, lancamento: Lancamento) =>
    api.put(`/Lancamentos/${id}`, lancamento),

  deletar: (id: number) =>
    api.delete(`/Lancamentos/${id}`),
};

// ==========================================================
// EMPRÉSTIMOS — /Emprestimos
// A API calcula valorParcela, valorTotal e CET no POST/PUT
// ==========================================================
export const emprestimosService = {
  getAll: () =>
    api.get<Emprestimo[]>('/Emprestimos/GetAll').then((r) => r.data),

  getById: (id: number) =>
    api.get<Emprestimo>(`/Emprestimos/${id}`).then((r) => r.data),

  simular: (emp: Omit<Emprestimo, 'idSimEmprestimo' | 'idUsuario' | 'dataCriacaoSE'>) =>
    api.post<Emprestimo>('/Emprestimos/New', emp).then((r) => r.data),

  atualizar: (id: number, emp: Emprestimo) =>
    api.put(`/Emprestimos/${id}`, emp),

  deletar: (id: number) =>
    api.delete(`/Emprestimos/${id}`),
};

// ==========================================================
// PROJEÇÕES — /Projecoes
// ==========================================================
export const projecoesService = {
  getAll: () =>
    api.get<Projecao[]>('/Projecoes/GetAll').then((r) => r.data),

  getById: (id: number) =>
    api.get<Projecao>(`/Projecoes/${id}`).then((r) => r.data),

  getByMes: (ano: number, mes: number) =>
    api.get<Projecao[]>(`/Projecoes/mes/${ano}/${mes}`).then((r) => r.data),

  getSomatoria: () =>
    api.get<number>('/Projecoes/somatoria').then((r) => r.data),

  criar: (p: Omit<Projecao, 'idProjecao' | 'dataCriacao'>) =>
    api.post<Projecao>('/Projecoes/New', p).then((r) => r.data),

  atualizar: (id: number, p: Projecao) =>
    api.put(`/Projecoes/${id}`, p),

  deletar: (id: number) =>
    api.delete(`/Projecoes/${id}`),
};

// ==========================================================
// RECORRÊNCIAS — /Recorrencia + /TipoRecorrencia
// GetAll já retorna TipoRecorrencia via Include
// ==========================================================
export const recorrenciasService = {
  getAll: () =>
    api.get<Recorrencia[]>('/Recorrencia/GetAll').then((r) => r.data),

  getById: (id: number) =>
    api.get<Recorrencia>(`/Recorrencia/${id}`).then((r) => r.data),

  criar: (r: Omit<Recorrencia, 'idRecorrente' | 'momentoCriacao'>) =>
    api.post<Recorrencia>('/Recorrencia/New', r).then((res) => res.data),

  atualizar: (id: number, r: Recorrencia) =>
    api.put(`/Recorrencia/${id}`, r),

  deletar: (id: number) =>
    api.delete(`/Recorrencia/${id}`),
};

export const tipoRecorrenciaService = {
  // Ordenados: padrão do sistema primeiro, depois alfabético
  getAll: () =>
    api.get<TipoRecorrencia[]>('/TipoRecorrencia/GetAll').then((r) => r.data),

  criar: (nome: string) =>
    api.post<TipoRecorrencia>('/TipoRecorrencia/New', { nome }).then((r) => r.data),

  // A API bloqueia exclusão de tipos padrão (retorna 400)
  deletar: (id: number) =>
    api.delete(`/TipoRecorrencia/${id}`),
};

// ==========================================================
// EMPRESA — /Empresa  (sem [Authorize] no controller)
// ==========================================================
export const empresaService = {
  getAll: () =>
    api.get<Empresa[]>('/Empresa/GetAll').then((r) => r.data),

  getById: (id: number) =>
    api.get<Empresa>(`/Empresa/${id}`).then((r) => r.data),

  criar: (e: Omit<Empresa, 'idEmpresa'>) =>
    api.post<Empresa>('/Empresa/New', e).then((r) => r.data),

  atualizar: (id: number, e: Empresa) =>
    api.put(`/Empresa/${id}`, e),

  deletar: (id: number) =>
    api.delete(`/Empresa/${id}`),
};

// ==========================================================
// RESPONSÁVEL — /Responsavel  (sem [Authorize])
// ==========================================================
export const responsavelService = {
  getAll: () =>
    api.get<Responsavel[]>('/Responsavel/GetAll').then((r) => r.data),

  getById: (id: number) =>
    api.get<Responsavel>(`/Responsavel/${id}`).then((r) => r.data),

  criar: (r: Omit<Responsavel, 'idResponsavel'>) =>
    api.post<Responsavel>('/Responsavel/New', r).then((res) => res.data),

  deletar: (id: number) =>
    api.delete(`/Responsavel/${id}`),
};
