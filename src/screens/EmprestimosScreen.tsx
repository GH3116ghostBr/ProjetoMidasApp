import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../styles/theme';
import { emprestimosService } from '../api/services';
import type { Emprestimo } from '../types';

const formatBRL = (v?: number) =>
  (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface Props { onVoltar: () => void; }

export function EmprestimosScreen({ onVoltar }: Props) {
  const [nome,      setNome]      = useState('');
  const [provedor,  setProvedor]  = useState('');
  const [valor,     setValor]     = useState('');
  const [parcelas,  setParcelas]  = useState('');
  const [iof,       setIof]       = useState('');
  const [resultado, setResultado] = useState<Emprestimo | null>(null);
  const [loading,   setLoading]   = useState(false);

  const simular = async () => {
    const v = parseFloat(valor.replace(',', '.'));
    const p = parseInt(parcelas, 10);
    if (!nome.trim() || isNaN(v) || isNaN(p) || p < 1) {
      Alert.alert('Atenção', 'Preencha nome, valor e número de parcelas.');
      return;
    }
    setLoading(true);
    try {
      const res = await emprestimosService.simular({
        nomeEmprestimo: nome.trim(),
        provedorEmprestimo: provedor.trim() || undefined,
        valorEmprestimo: v,
        parcelasEmprestimo: p,
        iofEmprestimo: parseFloat(iof) || 0,
        data: new Date().toISOString().slice(0, 10) + 'T00:00:00',
      });
      setResultado(res);
    } catch (e: any) {
      Alert.alert('Erro na simulação', e?.response?.data || 'Verifique os dados informados.');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#2a0208', '#530816']} style={styles.headerGrad}>
        <TouchableOpacity onPress={onVoltar} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerEye}>SIMULADOR</Text>
        <Text style={styles.headerTitle}>Simulação de empréstimo</Text>
        <Text style={styles.headerSub}>Os valores são calculados pela API automaticamente.</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">

          {[
            { label: 'Nome do empréstimo *', value: nome,     set: setNome,     placeholder: 'Ex: Crédito pessoal Bradesco' },
            { label: 'Provedor / Banco',      value: provedor, set: setProvedor, placeholder: 'Ex: Bradesco, Nubank...' },
            { label: 'Valor total (R$) *',    value: valor,    set: setValor,    placeholder: '0,00', keyboard: 'decimal-pad' },
            { label: 'Nº de parcelas *',      value: parcelas, set: setParcelas, placeholder: '12',   keyboard: 'number-pad' },
            { label: 'IOF (%)',               value: iof,      set: setIof,      placeholder: '0,38', keyboard: 'decimal-pad' },
          ].map((f) => (
            <View key={f.label}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={Colors.textMuted}
                value={f.value}
                onChangeText={f.set}
                keyboardType={(f as any).keyboard ?? 'default'}
              />
            </View>
          ))}

          <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={simular} disabled={loading}>
            <LinearGradient colors={['#ff3554', '#8f061d']} style={styles.btnGrad}>
              <Text style={styles.btnText}>{loading ? 'Calculando...' : 'Simular empréstimo →'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Resultado da simulação */}
          {resultado && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Resultado da simulação</Text>
              <Text style={styles.resultName}>{resultado.nomeEmprestimo}</Text>

              {[
                { label: 'Valor solicitado',  value: formatBRL(resultado.valorEmprestimo) },
                { label: 'Parcelas',           value: `${resultado.parcelasEmprestimo}x ${formatBRL(resultado.valorParcela)}` },
                { label: 'Total a pagar',      value: formatBRL(resultado.valorTotal), highlight: true },
              ].map((r) => (
                <View key={r.label} style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{r.label}</Text>
                  <Text style={[styles.resultVal, r.highlight && { color: Colors.wineButton, fontSize: FontSize.xl }]}>
                    {r.value}
                  </Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#faf5f6' },
  flex:       { flex: 1 },
  headerGrad: { paddingTop: 56, paddingBottom: Spacing.xl2, paddingHorizontal: Spacing.xl },
  backBtn:    { marginBottom: Spacing.md },
  backText:   { color: Colors.goldLight, fontSize: FontSize.base, fontWeight: '600' },
  headerEye:  { fontSize: FontSize.xs, letterSpacing: 4, color: Colors.white55, fontWeight: '700', marginBottom: 4 },
  headerTitle:{ fontSize: FontSize.xl3, fontWeight: '800', color: '#fff' },
  headerSub:  { fontSize: FontSize.sm, color: Colors.white70, marginTop: 4 },

  form:    { padding: Spacing.xl, paddingBottom: 60 },
  label:   { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.xs },
  input:   {
    height: 50, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.base, color: Colors.textPrimary,
    ...Shadow.card,
  },

  btn:    { marginTop: Spacing.xl2, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.btn },
  btnGrad:{ height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText:{ color: '#fff', fontSize: FontSize.md, fontWeight: '700' },

  // Resultado
  resultCard: {
    marginTop: Spacing.xl2,
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.hero,
  },
  resultTitle: { fontSize: FontSize.xs, letterSpacing: 3, color: Colors.textMuted, fontWeight: '700', marginBottom: Spacing.xs },
  resultName:  { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.lg },
  resultRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderTopWidth: 1, borderColor: Colors.borderLight },
  resultLabel: { fontSize: FontSize.base, color: Colors.textMuted },
  resultVal:   { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
});
