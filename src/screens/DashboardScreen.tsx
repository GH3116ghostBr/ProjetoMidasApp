import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../styles/theme';
import { lancamentosService, projecoesService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import type { Lancamento, Projecao } from '../types';

// ── Helpers ────────────────────────────────────────────────
const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

interface Props { onNavigate: (screen: string) => void; }

export function DashboardScreen({ onNavigate }: Props) {
  const { userName } = useAuth();

  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [projecoes,   setProjecoes]   = useState<Projecao[]>([]);
  const [somatoria,   setSomatoria]   = useState<number>(0);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);

  const load = useCallback(async () => {
    try {
      const hoje = new Date();
      const [lancs, prjs, soma] = await Promise.all([
        lancamentosService.getByMes(hoje.getFullYear(), hoje.getMonth() + 1),
        projecoesService.getByMes(hoje.getFullYear(), hoje.getMonth() + 1),
        lancamentosService.getSomatoria(),
      ]);
      setLancamentos(lancs);
      setProjecoes(prjs);
      setSomatoria(soma);
    } catch (_) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Métricas calculadas localmente (espelho do DashboardPage.tsx)
  const totalEntradas = lancamentos
    .filter((l) => l.valor > 0)
    .reduce((s, l) => s + l.valor, 0);
  const totalSaidas = lancamentos
    .filter((l) => l.valor < 0)
    .reduce((s, l) => s + Math.abs(l.valor), 0);
  const saldoMes = totalEntradas - totalSaidas;
  const totalProjetado = projecoes.reduce((s, p) => s + p.valorPrevisto, 0);

  const ultimos = [...lancamentos]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); load(); }}
          tintColor={Colors.gold}
        />
      }
    >
      {/* ── Hero card ─────────────────────────────────────── */}
      <LinearGradient
        colors={['#2a0208', '#530816', '#220206']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroEye}>FINTECH COCKPIT</Text>
        <Text style={styles.heroTitle}>
          Olá, {userName ?? 'Midas'} 👋
        </Text>
        <Text style={styles.heroSub}>
          Saldo acumulado de todos os lançamentos
        </Text>
        <Text style={styles.heroBalance}>{formatBRL(somatoria)}</Text>

        <View style={styles.heroBtns}>
          <TouchableOpacity
            style={styles.heroBtnWhite}
            onPress={() => onNavigate('NovoLancamento')}
          >
            <Text style={styles.heroBtnWhiteText}>+ Lançamento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heroBtnGold}
            onPress={() => onNavigate('NovaProjecao')}
          >
            <Text style={styles.heroBtnGoldText}>+ Projeção</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Cards de métricas ─────────────────────────────── */}
      <View style={styles.metricsRow}>
        {[
          { label: 'Entradas',   value: formatBRL(totalEntradas), color: Colors.success,   bg: '#d1fae5' },
          { label: 'Saídas',     value: formatBRL(totalSaidas),   color: Colors.danger,    bg: '#fee2e2' },
          { label: 'Saldo mês',  value: formatBRL(saldoMes),      color: Colors.wineButton, bg: '#fde4e9' },
          { label: 'Projetado',  value: formatBRL(totalProjetado), color: Colors.warning,   bg: '#fef3c7' },
        ].map((m) => (
          <View key={m.label} style={[styles.metricCard, Shadow.card]}>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
            <View style={[styles.metricBar, { backgroundColor: m.bg }]} />
          </View>
        ))}
      </View>

      {/* ── Últimos lançamentos ───────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEye}>TIMELINE</Text>
            <Text style={styles.sectionTitle}>Últimos movimentos</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('Lancamentos')}>
            <Text style={styles.sectionLink}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        {ultimos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum lançamento este mês.</Text>
          </View>
        ) : (
          ultimos.map((l) => {
            const isNeg = l.valor < 0;
            return (
              <View key={l.idLancamento} style={styles.txRow}>
                <View
                  style={[
                    styles.txDot,
                    { backgroundColor: isNeg ? Colors.danger : Colors.success },
                  ]}
                />
                <View style={styles.txInfo}>
                  <Text style={styles.txDesc} numberOfLines={1}>{l.descricao}</Text>
                  <Text style={styles.txDate}>{formatData(l.data)}</Text>
                </View>
                <Text
                  style={[
                    styles.txValue,
                    { color: isNeg ? Colors.danger : Colors.success },
                  ]}
                >
                  {isNeg ? '-' : '+'} {formatBRL(Math.abs(l.valor))}
                </Text>
              </View>
            );
          })
        )}
      </View>

      {/* ── Alertas rápidos ───────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionEye}>RADAR</Text>
        <Text style={styles.sectionTitle}>Sinais rápidos</Text>

        <View style={styles.radarRow}>
          {[
            { icon: '✅', label: 'Realizados', value: lancamentos.length, bg: '#d1fae5', color: Colors.successText },
            { icon: '📅', label: 'Projetados', value: projecoes.length,   bg: '#fef3c7', color: Colors.warningText },
          ].map((r) => (
            <View key={r.label} style={[styles.radarCard, { backgroundColor: r.bg }]}>
              <Text style={styles.radarIcon}>{r.icon}</Text>
              <Text style={[styles.radarValue, { color: r.color }]}>{r.value}</Text>
              <Text style={[styles.radarLabel, { color: r.color }]}>{r.label}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#faf5f6' },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  center:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf5f6' },
  loadingText: { marginTop: Spacing.md, color: Colors.textMuted, fontSize: FontSize.base },

  // Hero
  heroCard: {
    borderRadius: Radius.xl + 4,
    padding: Spacing.xl2,
    marginBottom: Spacing.lg,
    ...Shadow.hero,
  },
  heroEye:     { fontSize: FontSize.xs, letterSpacing: 4, color: Colors.white55, fontWeight: '600', marginBottom: Spacing.sm },
  heroTitle:   { fontSize: FontSize.xl2, fontWeight: '700', color: '#fff', marginBottom: 4 },
  heroSub:     { fontSize: FontSize.sm, color: Colors.white70, marginBottom: Spacing.md },
  heroBalance: { fontSize: FontSize.xl4, fontWeight: '800', color: '#fff', marginBottom: Spacing.xl },
  heroBtns:    { flexDirection: 'row', gap: Spacing.md },
  heroBtnWhite: {
    flex: 1, height: 44, borderRadius: Radius.xl,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtnWhiteText: { color: Colors.wineDeep, fontWeight: '700', fontSize: FontSize.base },
  heroBtnGold: {
    flex: 1, height: 44, borderRadius: Radius.xl,
    backgroundColor: Colors.goldLight,
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtnGoldText: { color: '#260308', fontWeight: '700', fontSize: FontSize.base },

  // Métricas
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  metricLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  metricValue: { fontSize: FontSize.md, fontWeight: '700' },
  metricBar:   { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 },

  // Seções
  section:       { backgroundColor: '#fff', borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border, ...Shadow.card },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.lg },
  sectionEye:    { fontSize: FontSize.xs, letterSpacing: 3, color: Colors.textMuted, fontWeight: '700' },
  sectionTitle:  { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  sectionLink:   { fontSize: FontSize.sm, color: Colors.wineButton, fontWeight: '600' },

  // Transações
  txRow:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  txDot:   { width: 10, height: 10, borderRadius: 5 },
  txInfo:  { flex: 1 },
  txDesc:  { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  txDate:  { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  txValue: { fontSize: FontSize.base, fontWeight: '700' },

  // Empty
  empty:     { paddingVertical: Spacing.xl2, alignItems: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.base },

  // Radar
  radarRow:  { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  radarCard: { flex: 1, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center' },
  radarIcon:  { fontSize: 24, marginBottom: Spacing.xs },
  radarValue: { fontSize: FontSize.xl3, fontWeight: '800' },
  radarLabel: { fontSize: FontSize.xs, fontWeight: '600', marginTop: 2 },
});
