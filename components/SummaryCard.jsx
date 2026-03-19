import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCard({ total, count, month, year }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Spent</Text>
      <Text style={styles.amount}>₹{total.toFixed(2)}</Text>
      <Text style={styles.sub}>{month} {year} · {count} expense{count !== 1 ? 's' : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },
  label: {
    color: '#7a7672',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  amount: {
    color: '#e8d44d',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 6,
  },
  sub: { color: '#7a7672', fontSize: 13 },
});
