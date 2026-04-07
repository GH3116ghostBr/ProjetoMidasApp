import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useAuth } from '../context/AuthContext';

interface Props {
  onGoRegister: () => void;
}

export function LoginScreen({ onGoRegister }: Props) {
  const { login } = useAuth();
  const [usuario, setUsuario]   = useState('');
  const [senha, setSenha]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha usuário e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(usuario.trim(), senha);
    } catch (e: any) {
      Alert.alert('Erro ao entrar', e?.response?.data || 'Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#170105', '#3c0610', '#120104']}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.root}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* ── Header / marca ──────────────────────────────── */}
          <View style={styles.header}>
            {/* Ícone Midas (M dourado) */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>M</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.brandLabel}>MIDAS FINANCE</Text>
              <Text style={styles.brandTitle}>Cockpit financeiro</Text>
            </View>
          </View>

          {/* ── Cards de features ───────────────────────────── */}
          <View style={styles.featureRow}>
            {[
              { label: 'CASH VIEW', value: '6 meses', color: Colors.goldLight },
              { label: 'ALERTAS',   value: 'Tempo real', color: '#ff5e78' },
              { label: 'STATUS',    value: 'Claros',  color: '#60d394' },
            ].map((f) => (
              <View key={f.label} style={styles.featureCard}>
                <View style={[styles.featureDot, { backgroundColor: f.color }]} />
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureValue}>{f.value}</Text>
              </View>
            ))}
          </View>

          {/* ── Painel de login ─────────────────────────────── */}
          <View style={styles.panel}>
            <Text style={styles.panelEyebrow}>ENTRAR</Text>
            <Text style={styles.panelTitle}>Acesse seu cockpit financeiro</Text>
            <Text style={styles.panelSub}>
              Use seu usuário e senha para visualizar indicadores, confirmar projetados e monitorar empréstimos.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Usuário</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor={Colors.textMuted}
                value={usuario}
                onChangeText={setUsuario}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={Colors.textMuted}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            {/* Botão primário */}
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#ff3554', '#8f061d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnPrimaryText}>Entrar no painel →</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Botão secundário */}
            <TouchableOpacity style={styles.btnSecondary} onPress={onGoRegister} activeOpacity={0.75}>
              <Text style={styles.btnSecondaryText}>Criar conta</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  flex:   { flex: 1 },
  scroll: { flexGrow: 1, padding: Spacing.xl, paddingTop: 60 },

  // Header
  header:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl3 },
  logoCircle:  {
    width: 56, height: 56, borderRadius: Radius.full,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.btn,
  },
  logoLetter:  { fontSize: FontSize.xl2, fontWeight: '700', color: Colors.wineDeep },
  headerText:  { flex: 1 },
  brandLabel:  { fontSize: FontSize.xs, letterSpacing: 4, color: Colors.white55, fontWeight: '600' },
  brandTitle:  { fontSize: FontSize.xl2, fontWeight: '700', color: '#fff', marginTop: 2 },

  // Feature cards
  featureRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl3 },
  featureCard: {
    flex: 1,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.white10,
    backgroundColor: Colors.white06,
    padding: Spacing.md,
  },
  featureDot:   { width: 8, height: 8, borderRadius: 4, marginBottom: Spacing.sm },
  featureLabel: { fontSize: FontSize.xs, letterSpacing: 2.5, color: Colors.white55, fontWeight: '600', marginBottom: 4 },
  featureValue: { fontSize: FontSize.lg, fontWeight: '700', color: '#fff' },

  // Painel branco
  panel: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: Radius.xl + 4,
    padding: Spacing.xl2,
    ...Shadow.hero,
  },
  panelEyebrow: {
    fontSize: FontSize.xs, letterSpacing: 4, fontWeight: '700',
    color: Colors.textLabel, marginBottom: Spacing.sm,
  },
  panelTitle: {
    fontSize: FontSize.xl2, fontWeight: '700',
    color: Colors.textPrimary, marginBottom: Spacing.sm,
    lineHeight: 30,
  },
  panelSub: {
    fontSize: FontSize.sm, color: Colors.textBody,
    lineHeight: 20, marginBottom: Spacing.xl2,
  },

  // Campos
  fieldGroup: { marginBottom: Spacing.lg },
  fieldLabel: {
    fontSize: FontSize.base, fontWeight: '600',
    color: Colors.textPrimary, marginBottom: Spacing.xs,
  },
  input: {
    height: 50,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#e8cdd4',
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },

  // Botões
  btnPrimary:   { borderRadius: Radius.xl, overflow: 'hidden', marginTop: Spacing.sm, ...Shadow.btn },
  btnDisabled:  { opacity: 0.6 },
  btnGradient:  { height: 50, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: FontSize.base, fontWeight: '700', letterSpacing: 0.5 },

  btnSecondary: {
    height: 50, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: '#e8cdd4',
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: Spacing.md,
  },
  btnSecondaryText: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
});
