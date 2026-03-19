import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCategoryById } from '../constants/categories';

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const cat = getCategoryById(expense.category);
  const date = new Date(expense.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: cat.color + '33' }]}>
        <Text style={styles.emoji}>{cat.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={1}>
          {expense.note || cat.label}
        </Text>
        <Text style={styles.meta}>{cat.label} · {date}</Text>
      </View>

      <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(expense)} style={styles.actionBtn}>
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(expense.id)} style={styles.actionBtn}>
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 20 },
  info: { flex: 1 },
  label: {
    color: '#f0ede8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  meta: { color: '#7a7672', fontSize: 12 },
  amount: {
    color: '#e8d44d',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  actions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 6 },
  editIcon: { color: '#7a7672', fontSize: 16 },
  deleteIcon: { color: '#e85d5d', fontSize: 14 },
});
