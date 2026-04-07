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
import { authService } from '../api/services';
import { useAuth } from '../context/AuthContext';

export function PerfilScreen() {
  const { userName, logout } = useAuth();
  const [novaSenha,    setNovaSenha]    = useState('');
  const [confirmar,    setConfirmar]    = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);

  const handleAlterarSenha = async () => {
    if (!novaSenha.trim()) { Alert.alert('Atenção', 'Informe a nova senha.'); return; }
    if (novaSenha !== confirmar) { Alert.alert('Atenção', 'As senhas não coincidem.'); return; }
    if (novaSenha.length < 4)   { Alert.alert('Atenção', 'Senha muito curta (mín. 4 caracteres).'); return; }

    setLoadingSenha(true);
    try {
      await authService.alterarSenha(userName!, novaSenha);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setNovaSenha(''); setConfirmar('');
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data || 'Não foi possível alterar a senha.');
    } finally { setLoadingSenha(false); }
  };

  const handleLogout = () => {
    Alert.alert('Sair do Midas', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1f0208', '#3a0610']} style={styles.headerGrad}>
        {/* Avatar inicial */}
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>
            {(userName ?? 'M').slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{userName ?? 'Usuário Midas'}</Text>
        <Text style={styles.userSub}>Controle de caixa em tempo real</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* Seção: alterar senha */}
          <View style={styles.section}>
            <Text style={styles.sectionEye}>SEGURANÇA</Text>
            <Text style={styles.sectionTitle}>Alterar senha</Text>

            <Text style={styles.label}>Nova senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 4 caracteres"
              placeholderTextColor={Colors.textMuted}
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar nova senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Repita a nova senha"
              placeholderTextColor={Colors.textMuted}
              value={confirmar}
              onChangeText={setConfirmar}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.btnPrimary, loadingSenha && { opacity: 0.6 }]}
              onPress={handleAlterarSenha}
              disabled={loadingSenha}
            >
              <LinearGradient colors={['#ff3554', '#8f061d']} style={styles.btnGrad}>
                <Text style={styles.btnPrimaryText}>
                  {loadingSenha ? 'Salvando...' : 'Salvar nova senha'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Seção: informações */}
          <View style={styles.section}>
            <Text style={styles.sectionEye}>SOBRE</Text>
            <Text style={styles.sectionTitle}>Projeto Midas</Text>

            {[
              { label: 'Versão do app', value: '1.0.0' },
              { label: 'Plataforma',    value: Platform.OS === 'ios' ? 'iOS' : 'Android' },
              { label: 'API',           value: 'ASP.NET Core + SQL Server' },
            ].map((info) => (
              <View key={info.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue}>{info.value}</Text>
              </View>
            ))}
          </View>

          {/* Botão logout */}
          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.btnLogoutText}>Sair da conta</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#faf5f6' },
  flex:        { flex: 1 },
  headerGrad:  { paddingTop: 64, paddingBottom: Spacing.xl3, paddingHorizontal: Spacing.xl, alignItems: 'center' },
  avatar:      {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md, ...Shadow.btn,
  },
  avatarLetter:{ fontSize: FontSize.xl3, fontWeight: '800', color: Colors.wineDeep },
  userName:    { fontSize: FontSize.xl2, fontWeight: '700', color: '#fff', marginBottom: 4 },
  userSub:     { fontSize: FontSize.sm, color: Colors.white55 },

  content: { padding: Spacing.xl, paddingBottom: 60 },

  section:      {
    backgroundColor: '#fff', borderRadius: Radius.xl,
    padding: Spacing.xl, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.card,
  },
  sectionEye:   { fontSize: FontSize.xs, letterSpacing: 3, color: Colors.textMuted, fontWeight: '700', marginBottom: 4 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.lg },

  label: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: {
    height: 50, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: '#fff8f9',
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.base, color: Colors.textPrimary,
  },

  btnPrimary:    { marginTop: Spacing.lg, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.btn },
  btnGrad:       { height: 50, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText:{ color: '#fff', fontSize: FontSize.base, fontWeight: '700' },

  infoRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderTopWidth: 1, borderColor: Colors.borderLight },
  infoLabel: { fontSize: FontSize.base, color: Colors.textMuted },
  infoValue: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },

  btnLogout: {
    height: 52, borderRadius: Radius.xl,
    borderWidth: 1.5, borderColor: Colors.wineButton,
    backgroundColor: '#fde4e9',
    alignItems: 'center', justifyContent: 'center',
  },
  btnLogoutText: { color: Colors.wineButton, fontSize: FontSize.base, fontWeight: '700' },
});
