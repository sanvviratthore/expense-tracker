import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import SummaryCard from '../components/SummaryCard';
import ExpenseItem from '../components/ExpenseItem';
import {
  loadExpenses, saveExpenses,
  filterByMonth,
} from '../store/expenses';
import { MONTHS } from '../constants/categories';

export default function Dashboard() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear]       = useState(now.getFullYear());
  const [month, setMonth]     = useState(now.getMonth());
  const [expenses, setExpenses] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadExpenses().then(setExpenses);
    }, [])
  );

  const filtered = filterByMonth(expenses, year, month);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  async function handleDelete(id) {
    Alert.alert('Delete Expense', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          const updated = expenses.filter(e => e.id !== id);
          setExpenses(updated);
          await saveExpenses(updated);
        },
      },
    ]);
  }

  function handleEdit(expense) {
    router.push({ pathname: '/add', params: { id: expense.id } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>✦ Spendly</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/add')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
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
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <SummaryCard
            total={total}
            count={filtered.length}
            month={MONTHS[month]}
            year={year}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>◎</Text>
            <Text style={styles.emptyText}>No expenses this month</Text>
            <Text style={styles.emptyHint}>Tap + Add to record one</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0e0e0e' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  logo: {
    color: '#f0ede8',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  addBtn: {
    backgroundColor: '#e8d44d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: { color: '#0e0e0e', fontWeight: '700', fontSize: 14 },
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
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, color: '#3d3d3d', marginBottom: 12 },
  emptyText: { color: '#7a7672', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  emptyHint: { color: '#3d3d3d', fontSize: 13 },
});
