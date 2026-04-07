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
import { lancamentosService } from '../api/services';

interface Props { onSalvo: () => void; onVoltar: () => void; }

export function NovoLancamentoScreen({ onSalvo, onVoltar }: Props) {
  const [descricao, setDescricao] = useState('');
  const [valor,     setValor]     = useState('');
  const [data,      setData]      = useState(new Date().toISOString().slice(0, 10));
  const [tipo,      setTipo]      = useState<'Receita' | 'Despesa'>('Despesa');
  const [loading,   setLoading]   = useState(false);

  const salvar = async () => {
    if (!descricao.trim()) { Alert.alert('Campo obrigatório', 'Informe a descrição.'); return; }
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) { Alert.alert('Valor inválido', 'Informe um valor positivo.'); return; }

    const valorFinal = tipo === 'Despesa' ? -Math.abs(valorNum) : Math.abs(valorNum);

    setLoading(true);
    try {
      await lancamentosService.criar({ descricao: descricao.trim(), valor: valorFinal, data: `${data}T00:00:00`, tipo });
      Alert.alert('Sucesso', 'Lançamento criado!', [{ text: 'OK', onPress: onSalvo }]);
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data || 'Não foi possível salvar.');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <LinearGradient colors={['#2a0208', '#530816']} style={styles.headerGrad}>
        <TouchableOpacity onPress={onVoltar} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerEye}>NOVO</Text>
        <Text style={styles.headerTitle}>Registrar lançamento</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">

          {/* Tipo — Receita / Despesa */}
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.toggleRow}>
            {(['Receita', 'Despesa'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.toggleBtn, tipo === t && styles.toggleBtnActive(t)]}
                onPress={() => setTipo(t)}
              >
                <Text style={[styles.toggleText, tipo === t && styles.toggleTextActive]}>
                  {t === 'Receita' ? '↑ Receita' : '↓ Despesa'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Salário, Aluguel, Supermercado..."
            placeholderTextColor={Colors.textMuted}
            value={descricao}
            onChangeText={setDescricao}
          />

          <Text style={styles.label}>Valor (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor={Colors.textMuted}
            value={valor}
            onChangeText={setValor}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={Colors.textMuted}
            value={data}
            onChangeText={setData}
          />

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={salvar}
            disabled={loading}
          >
            <LinearGradient colors={['#ff3554', '#8f061d']} style={styles.btnGrad}>
              <Text style={styles.btnText}>{loading ? 'Salvando...' : 'Salvar lançamento'}</Text>
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// helper para estilo dinâmico
const toggleBtnActiveStyle = (tipo: 'Receita' | 'Despesa') => ({
  backgroundColor: tipo === 'Receita' ? Colors.successBg : Colors.dangerBg,
  borderColor:     tipo === 'Receita' ? Colors.success    : Colors.danger,
});

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#faf5f6' },
  flex:       { flex: 1 },
  headerGrad: { paddingTop: 56, paddingBottom: Spacing.xl2, paddingHorizontal: Spacing.xl },
  backBtn:    { marginBottom: Spacing.md },
  backText:   { color: Colors.goldLight, fontSize: FontSize.base, fontWeight: '600' },
  headerEye:  { fontSize: FontSize.xs, letterSpacing: 4, color: Colors.white55, fontWeight: '700', marginBottom: 4 },
  headerTitle:{ fontSize: FontSize.xl3, fontWeight: '800', color: '#fff' },

  form:    { padding: Spacing.xl },
  label:   { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs, marginTop: Spacing.lg },
  input:   {
    height: 50, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.base, color: Colors.textPrimary,
    ...Shadow.card,
  },

  toggleRow:      { flexDirection: 'row', gap: Spacing.md },
  toggleBtn:      {
    flex: 1, height: 48, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  toggleBtnActive: (t: 'Receita' | 'Despesa') => toggleBtnActiveStyle(t),
  toggleText:     { fontSize: FontSize.base, fontWeight: '600', color: Colors.textMuted },
  toggleTextActive:{ color: Colors.textPrimary },

  btn:    { marginTop: Spacing.xl2, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.btn },
  btnGrad:{ height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText:{ color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
