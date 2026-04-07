import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../styles/theme';
import { projecoesService } from '../api/services';
import type { Projecao } from '../types';

const formatBRL  = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

interface Props { onNova: () => void; }

export function ProjecoesScreen({ onNova }: Props) {
  const hoje = new Date();
  const [anoSel,  setAnoSel]  = useState(hoje.getFullYear());
  const [mesSel,  setMesSel]  = useState(hoje.getMonth() + 1);
  const [itens,   setItens]   = useState<Projecao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await projecoesService.getByMes(anoSel, mesSel);
      setItens(data);
    } catch (_) {}
    finally { setLoading(false); setRefresh(false); }
  }, [anoSel, mesSel]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const mudarMes = (delta: number) => {
    let m = mesSel + delta;
    let a = anoSel;
    if (m > 12) { m = 1;  a++; }
    if (m < 1)  { m = 12; a--; }
    setMesSel(m); setAnoSel(a);
  };

  const totalPrevisto = itens.reduce((s, p) => s + p.valorPrevisto, 0);

  const renderItem = ({ item }: { item: Projecao }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>📅</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowDesc} numberOfLines={1}>{item.descricao}</Text>
        <Text style={styles.rowDate}>{formatData(item.dataReferencia)}</Text>
      </View>
      <Text style={styles.rowVal}>{formatBRL(item.valorPrevisto)}</Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1a0305', '#4a0a18']} style={styles.headerGrad}>
        <Text style={styles.headerEye}>PROJETADOS</Text>
        <Text style={styles.headerTitle}>Compromissos futuros</Text>

        <View style={styles.monthRow}>
          <TouchableOpacity onPress={() => mudarMes(-1)} style={styles.monthBtn}>
            <Text style={styles.monthArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{meses[mesSel - 1]} {anoSel}</Text>
          <TouchableOpacity onPress={() => mudarMes(+1)} style={styles.monthBtn}>
            <Text style={styles.monthArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total previsto</Text>
            <Text style={styles.summaryVal}>{formatBRL(totalPrevisto)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Lançamentos</Text>
            <Text style={styles.summaryVal}>{itens.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.wineButton} />
        </View>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(p) => String(p.idProjecao)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={() => { setRefresh(true); load(); }} tintColor={Colors.wineButton} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>Nenhuma projeção para este mês.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={onNova}>
                <Text style={styles.emptyBtnText}>Criar projeção</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onNova} activeOpacity={0.85}>
        <LinearGradient colors={['#ff3554', '#8f061d']} style={styles.fabGrad}>
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#faf5f6' },
  headerGrad:  { paddingTop: 56, paddingBottom: Spacing.xl2, paddingHorizontal: Spacing.xl },
  headerEye:   { fontSize: FontSize.xs, letterSpacing: 4, color: Colors.white55, fontWeight: '700', marginBottom: 4 },
  headerTitle: { fontSize: FontSize.xl3, fontWeight: '800', color: '#fff', marginBottom: Spacing.lg },
  monthRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginBottom: Spacing.md },
  monthBtn:    { padding: Spacing.xs },
  monthArrow:  { fontSize: FontSize.xl2, color: Colors.goldLight, fontWeight: '700' },
  monthLabel:  { fontSize: FontSize.lg, fontWeight: '700', color: '#fff' },
  summaryRow:  { flexDirection: 'row', gap: Spacing.xl2 },
  summaryItem: {},
  summaryLabel:{ fontSize: FontSize.xs, color: Colors.white55, fontWeight: '600', marginBottom: 2 },
  summaryVal:  { fontSize: FontSize.xl2, fontWeight: '800', color: '#fff' },

  list:        { padding: Spacing.lg, paddingBottom: 100 },
  row:         {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: '#fff', borderRadius: Radius.lg,
    padding: Spacing.lg, ...Shadow.card,
  },
  rowIcon:     {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.warningBg,
    alignItems: 'center', justifyContent: 'center',
  },
  rowIconText: { fontSize: 18 },
  rowInfo:     { flex: 1 },
  rowDesc:     { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  rowDate:     { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  rowVal:      { fontSize: FontSize.base, fontWeight: '700', color: Colors.warning },

  center:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty:        { paddingTop: 80, alignItems: 'center', gap: Spacing.md },
  emptyEmoji:   { fontSize: 48 },
  emptyText:    { fontSize: FontSize.base, color: Colors.textMuted },
  emptyBtn:     {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl2,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.wineButton,
    borderRadius: Radius.xl,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.base },

  fab:     { position: 'absolute', bottom: 28, right: 24, width: 58, height: 58, borderRadius: 29, overflow: 'hidden', ...Shadow.btn },
  fabGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
});
