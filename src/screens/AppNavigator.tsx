import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { LoginScreen }          from '../screens/LoginScreen';
import { DashboardScreen }      from '../screens/DashboardScreen';
import { LancamentosScreen }    from '../screens/LancamentosScreen';
import { NovoLancamentoScreen } from '../screens/NovoLancamentoScreen';
import { ProjecoesScreen }      from '../screens/ProjecoesScreen';
import { EmprestimosScreen }    from '../screens/EmprestimosScreen';
import { RecorrenciasScreen }   from '../screens/RecorrenciasScreen';
import { PerfilScreen }         from '../screens/PerfilScreen';
import { Colors, FontSize, Spacing } from '../styles/theme';

type Tab   = 'Dashboard' | 'Lancamentos' | 'Projecoes' | 'Recorrencias' | 'Perfil';
type Modal = 'NovoLancamento' | 'Emprestimos' | null;

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'Dashboard',    icon: '◈',  label: 'Dashboard'    },
  { id: 'Lancamentos',  icon: '↕',  label: 'Realizados'   },
  { id: 'Projecoes',    icon: '📅', label: 'Projetados'   },
  { id: 'Recorrencias', icon: '🔁', label: 'Recorrências' },
  { id: 'Perfil',       icon: '👤', label: 'Perfil'       },
];

export function AppNavigator() {
  const { token, isLoading } = useAuth();
  const [tab,   setTab]   = useState<Tab>('Dashboard');
  const [modal, setModal] = useState<Modal>(null);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashLogo}><Text style={styles.splashM}>M</Text></View>
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoginScreen onGoRegister={() => {}} />
      </SafeAreaView>
    );
  }

  if (modal === 'NovoLancamento') {
    return (
      <SafeAreaView style={styles.safe}>
        <NovoLancamentoScreen
          onSalvo={() => { setModal(null); setTab('Lancamentos'); }}
          onVoltar={() => setModal(null)}
        />
      </SafeAreaView>
    );
  }

  if (modal === 'Emprestimos') {
    return (
      <SafeAreaView style={styles.safe}>
        <EmprestimosScreen onVoltar={() => setModal(null)} />
      </SafeAreaView>
    );
  }

  const renderTab = () => {
    switch (tab) {
      case 'Dashboard':
        return (
          <DashboardScreen
            onNavigate={(s) => {
              if (s === 'NovoLancamento') setModal('NovoLancamento');
              if (s === 'NovaProjecao')   setTab('Projecoes');
              if (s === 'Lancamentos')    setTab('Lancamentos');
              if (s === 'Emprestimos')    setModal('Emprestimos');
            }}
          />
        );
      case 'Lancamentos':
        return <LancamentosScreen onNovo={() => setModal('NovoLancamento')} />;
      case 'Projecoes':
        return <ProjecoesScreen onNova={() => {}} />;
      case 'Recorrencias':
        return <RecorrenciasScreen onNova={() => {}} />;
      case 'Perfil':
        return <PerfilScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>{renderTab()}</View>
      <LinearGradient colors={['#1f0208', '#2e0510']} style={styles.tabBar}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <TouchableOpacity key={t.id} style={styles.tabItem} onPress={() => setTab(t.id)} activeOpacity={0.7}>
              {active && <View style={styles.tabGlow} />}
              <Text style={[styles.tabIcon, active && styles.tabIconOn]}>{t.icon}</Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelOn]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#1f0208' },
  content: { flex: 1, backgroundColor: '#faf5f6' },
  splash:  { flex: 1, backgroundColor: '#170105', alignItems: 'center', justifyContent: 'center' },
  splashLogo: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  splashM: { fontSize: 40, fontWeight: '800', color: '#170105' },
  tabBar:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.white10, paddingTop: Spacing.sm, paddingBottom: Spacing.xs },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.xs, position: 'relative' },
  tabGlow: { position: 'absolute', top: -1, left: '20%', right: '20%', height: 2, backgroundColor: Colors.gold, borderRadius: 2 },
  tabIcon:    { fontSize: 18, color: Colors.white55, marginBottom: 3 },
  tabIconOn:  { color: Colors.gold },
  tabLabel:   { fontSize: 10, color: Colors.white55, fontWeight: '600', letterSpacing: 0.3 },
  tabLabelOn: { color: '#fff', fontWeight: '700' },
});
