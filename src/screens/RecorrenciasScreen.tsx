import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../styles/theme';
import { recorrenciasService } from '../api/services';
import type { Recorrencia } from '../types';

const formatBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Ícones por tipo de recorrência (nome do TipoRecorrencia)
const iconePorTipo = (nome?: string) => {
  const n = (nome ?? '').toLowerCase();
  if (n.includes('mensal'))   return '📅';
  if (n.includes('semanal'))  return '🔁';
  if (n.includes('anual'))    return '📆';
  if (n.includes('diária') || n.includes('diario')) return '🔄';
  return '↩';
};

interface Props { onNova: () => void; }

export function RecorrenciasScreen({ onNova }: Props) {
  const [itens,   setItens]   = useState<Recorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await recorrenciasService.getAll();
      setItens(data);
    } catch (_) {}
    finally { setLoading(false); setRefresh(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const deletar = (id: number, descricao: string) => {
    Alert.alert('Remover recorrência', `Deseja remover "${descricao}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          try {
            await recorrenciasService.deletar(id);
            setItens((prev) => prev.filter((r) => r.idRecorrente !== id));
          } catch (_) {
            Alert.alert('Erro', 'Não foi possível remover.');
          }
        },
      },
    ]);
  };

  const totalMensal = itens.reduce((s, r) => s + r.valor, 0);

  const renderItem = ({ item }: { item: Recorrencia }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>{iconePorTipo(item.tipoRecorrencia?.nome)}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowDesc} numberOfLines={1}>{item.descricao}</Text>
        <Text style={styles.rowTipo}>
          {item.tipoRecorrencia?.nome ?? 'Recorrência'}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowVal}>{formatBRL(item.valor)}</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deletar(item.idRecorrente!, item.descricao)}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#12030a', '#3d0b1a']} style={styles.headerGrad}>
        <Text style={styles.headerEye}>RECORRÊNCIAS</Text>
        <Text style={styles.headerTitle}>Compromissos regulares</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total cadastrado</Text>
            <Text style={styles.summaryVal}>{formatBRL(totalMensal)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Recorrências</Text>
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
          keyExtractor={(r) => String(r.idRecorrente)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={() => { setRefresh(true); load(); }} tintColor={Colors.wineButton} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔁</Text>
              <Text style={styles.emptyText}>Nenhuma recorrência cadastrada.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={onNova}>
                <Text style={styles.emptyBtnText}>Adicionar recorrência</Text>
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
  summaryRow:  { flexDirection: 'row', gap: Spacing.xl2 },
  summaryItem: {},
  summaryLabel:{ fontSize: FontSize.xs, color: Colors.white55, fontWeight: '600', marginBottom: 2 },
  summaryVal:  { fontSize: FontSize.xl2, fontWeight: '800', color: '#fff' },

  list: { padding: Spacing.lg, paddingBottom: 100 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: '#fff', borderRadius: Radius.lg,
    padding: Spacing.lg, ...Shadow.card,
  },
  rowIcon: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: '#fde4e9', alignItems: 'center', justifyContent: 'center',
  },
  rowIconText: { fontSize: 20 },
  rowInfo:  { flex: 1 },
  rowDesc:  { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  rowTipo:  { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: Spacing.xs },
  rowVal:   { fontSize: FontSize.base, fontWeight: '700', color: Colors.wineButton },
  deleteBtn:     { padding: Spacing.xs },
  deleteBtnText: { fontSize: FontSize.sm, color: Colors.textMuted },

  center:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty:        { paddingTop: 80, alignItems: 'center', gap: Spacing.md },
  emptyEmoji:   { fontSize: 48 },
  emptyText:    { fontSize: FontSize.base, color: Colors.textMuted },
  emptyBtn:     { marginTop: Spacing.md, paddingHorizontal: Spacing.xl2, paddingVertical: Spacing.md, backgroundColor: Colors.wineButton, borderRadius: Radius.xl },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.base },

  fab:     { position: 'absolute', bottom: 28, right: 24, width: 58, height: 58, borderRadius: 29, overflow: 'hidden', ...Shadow.btn },
  fabGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700', lineHeight: 32 },
});
