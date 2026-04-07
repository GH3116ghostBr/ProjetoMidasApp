import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../styles/theme';
import { lancamentosService } from '../api/services';
import type { Lancamento } from '../types';

const formatBRL  = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatData = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

interface Props { onNovo: () => void; }

export function LancamentosScreen({ onNovo }: Props) {
  const hoje = new Date();
  const [anoSel,  setAnoSel]  = useState(hoje.getFullYear());
  const [mesSel,  setMesSel]  = useState(hoje.getMonth() + 1);
  const [itens,   setItens]   = useState<Lancamento[]>([]);
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await lancamentosService.getByMes(anoSel, mesSel);
      setItens(data);
    } catch (_) {}
    finally { setLoading(false); setRefresh(false); }
  }, [anoSel, mesSel]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return itens;
    return itens.filter((l) =>
      l.descricao?.toLowerCase().includes(q) ||
      l.categoria?.toLowerCase().includes(q)
    );
  }, [query, itens]);

  const totalRealizados = useMemo(
    () => itens.reduce((s, l) => s + l.valor, 0),
    [itens]
  );

  const mudarMes = (delta: number) => {
    let m = mesSel + delta;
    let a = anoSel;
    if (m > 12) { m = 1;  a++; }
    if (m < 1)  { m = 12; a--; }
    setMesSel(m); setAnoSel(a);
  };

  const renderItem = ({ item }: { item: Lancamento }) => {
    const isNeg = item.valor < 0;
    return (
      <View style={styles.row}>
        <View style={[styles.rowDot, { backgroundColor: isNeg ? Colors.danger : Colors.success }]} />
        <View style={styles.rowInfo}>
          <Text style={styles.rowDesc} numberOfLines={1}>{item.descricao}</Text>
          <Text style={styles.rowDate}>{formatData(item.data)}</Text>
        </View>
        <Text style={[styles.rowVal, { color: isNeg ? Colors.danger : Colors.success }]}>
          {isNeg ? '−' : '+'} {formatBRL(Math.abs(item.valor))}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* ── Cabeçalho Midas ──────────────────────────────── */}
      <LinearGradient colors={['#2a0208', '#530816']} style={styles.headerGrad}>
        <Text style={styles.headerEye}>REALIZADOS</Text>
        <Text style={styles.headerTitle}>Lançamentos confirmados</Text>

        {/* Seletor de mês */}
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={() => mudarMes(-1)} style={styles.monthBtn}>
            <Text style={styles.monthArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{meses[mesSel - 1]} {anoSel}</Text>
          <TouchableOpacity onPress={() => mudarMes(+1)} style={styles.monthBtn}>
            <Text style={styles.monthArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Saldo */}
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Saldo do mês</Text>
          <Text style={[styles.balanceVal, { color: totalRealizados >= 0 ? Colors.goldLight : '#ff7b8a' }]}>
            {formatBRL(totalRealizados)}
          </Text>
        </View>
      </LinearGradient>

      {/* ── Busca ────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Buscar por descrição ou categoria..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* ── Lista ────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.wineButton} />
        </View>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(l) => String(l.idLancamento)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={() => { setRefresh(true); load(); }} tintColor={Colors.wineButton} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhum lançamento encontrado.</Text>
            </View>
          }
        />
      )}

      {/* ── FAB ──────────────────────────────────────────── */}
      <TouchableOpacity style={styles.fab} onPress={onNovo} activeOpacity={0.85}>
        <LinearGradient colors={['#ff3554', '#8f061d']} style={styles.fabGrad}>
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf5f6' },

  // Header
  headerGrad:  { paddingTop: 56, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.xl },
  headerEye:   { fontSize: FontSize.xs, letterSpacing: 4, color: Colors.white55, fontWeight: '700', marginBottom: 4 },
  headerTitle: { fontSize: FontSize.xl3, fontWeight: '800', color: '#fff', marginBottom: Spacing.lg },

  // Mês
  monthRow:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginBottom: Spacing.md },
  monthBtn:  { padding: Spacing.xs },
  monthArrow:{ fontSize: FontSize.xl2, color: Colors.goldLight, fontWeight: '700' },
  monthLabel:{ fontSize: FontSize.lg, fontWeight: '700', color: '#fff' },

  // Saldo
  balanceRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel:{ fontSize: FontSize.sm, color: Colors.white55, fontWeight: '600' },
  balanceVal:  { fontSize: FontSize.xl2, fontWeight: '800' },

  // Busca
  searchWrap:  { padding: Spacing.lg, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: Colors.border },
  searchInput: {
    height: 44,
    borderRadius: Radius.xl,
    backgroundColor: '#fff8f9',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },

  // Lista
  list:    { padding: Spacing.lg },
  row:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: '#fff', borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  rowDot:  { width: 10, height: 10, borderRadius: 5 },
  rowInfo: { flex: 1 },
  rowDesc: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  rowDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  rowVal:  { fontSize: FontSize.base, fontWeight: '700' },
  sep:     { height: Spacing.sm },

  // Empty / loading
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty:     { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.base },

  // FAB
  fab: {
    position: 'absolute', bottom: 28, right: 24,
    width: 58, height: 58, borderRadius: 29,
    overflow: 'hidden', ...Shadow.btn,
  },
  fabGrad:{ flex: 1, alignItems: 'center', justifyContent: 'center' },
  fabText:{ color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
});
