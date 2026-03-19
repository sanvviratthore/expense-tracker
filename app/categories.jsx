import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { loadExpenses, filterByMonth, getTotalByCategory } from '../store/expenses';
import { CATEGORIES, getCategoryById, MONTHS } from '../constants/categories';

export default function Categories() {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [expenses, setExpenses] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadExpenses().then(setExpenses);
    }, [])
  );

  const filtered  = filterByMonth(expenses, year, month);
  const totals    = getTotalByCategory(filtered);
  const grandTotal = filtered.reduce((s, e) => s + e.amount, 0);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const rows = CATEGORIES
    .map((cat) => ({ ...cat, total: totals[cat.id] || 0 }))
    .filter((cat) => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>By Category</Text>
      </View>

      {/* Month Navigator */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{MONTHS[month]} {year}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>◎</Text>
            <Text style={styles.emptyText}>No expenses this month</Text>
          </View>
        }
        renderItem={({ item }) => {
          const pct = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
          return (
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '33' }]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.rowTop}>
                  <Text style={styles.catName}>{item.label}</Text>
                  <Text style={styles.catAmount}>₹{item.total.toFixed(2)}</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={styles.pct}>{pct.toFixed(1)}% of total</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0e0e0e' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  title: { color: '#f0ede8', fontSize: 20, fontWeight: '800' },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 20,
  },
  navBtn: { padding: 8 },
  navArrow: { color: '#e8d44d', fontSize: 28, fontWeight: '300' },
  monthLabel: { color: '#f0ede8', fontSize: 16, fontWeight: '600', minWidth: 140, textAlign: 'center' },
  list: { padding: 16, paddingBottom: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 22 },
  info: { flex: 1 },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catName: { color: '#f0ede8', fontSize: 14, fontWeight: '600' },
  catAmount: { color: '#e8d44d', fontSize: 14, fontWeight: '700' },
  barBg: {
    height: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 2 },
  pct: { color: '#7a7672', fontSize: 11 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, color: '#3d3d3d', marginBottom: 12 },
  emptyText: { color: '#7a7672', fontSize: 15 },
});
