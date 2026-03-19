import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadExpenses, saveExpenses, genId } from '../store/expenses';
import { CATEGORIES } from '../constants/categories';

export default function AddExpense() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [amount,   setAmount]   = useState('');
  const [category, setCategory] = useState('food');
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [note,     setNote]     = useState('');
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (isEditing) {
      loadExpenses().then((expenses) => {
        const exp = expenses.find((e) => e.id === id);
        if (exp) {
          setAmount(String(exp.amount));
          setCategory(exp.category);
          setDate(exp.date);
          setNote(exp.note || '');
        }
      });
    }
  }, [id]);

  async function handleSave() {
    setError('');
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (parsed > 10000000) {
      setError('Amount seems too large.');
      return;
    }
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setError('Date must be in YYYY-MM-DD format.');
      return;
    }

    const expenses = await loadExpenses();

    if (isEditing) {
      const updated = expenses.map((e) =>
        e.id === id
          ? { ...e, amount: parsed, category, date, note: note.trim() }
          : e
      );
      await saveExpenses(updated);
    } else {
      const newExp = {
        id: genId(),
        amount: parsed,
        category,
        date,
        note: note.trim(),
        createdAt: Date.now(),
      };
      await saveExpenses([newExp, ...expenses]);
    }

    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Edit Expense' : 'New Expense'}</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form}>
          {/* Amount */}
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#3d3d3d"
            keyboardType="decimal-pad"
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catBtn,
                  category === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '22' },
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catLabel, category === cat.id && { color: cat.color }]}>
                  {cat.label.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date */}
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#3d3d3d"
          />

          {/* Note */}
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor="#3d3d3d"
            multiline
            maxLength={100}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{isEditing ? 'Save Changes' : 'Add Expense'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0e0e0e' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backBtn: { padding: 4 },
  backText: { color: '#e8d44d', fontSize: 15 },
  title: { color: '#f0ede8', fontSize: 17, fontWeight: '700' },
  form: { padding: 20, paddingBottom: 48 },
  label: {
    color: '#7a7672',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1.5,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    padding: 14,
    color: '#f0ede8',
    fontSize: 15,
  },
  noteInput: { height: 80, textAlignVertical: 'top' },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catBtn: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2a2a2a',
    backgroundColor: '#1a1a1a',
  },
  catEmoji: { fontSize: 20, marginBottom: 4 },
  catLabel: { color: '#7a7672', fontSize: 10, textAlign: 'center' },
  error: {
    color: '#e85d5d',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#e8d44d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  saveBtnText: { color: '#0e0e0e', fontSize: 16, fontWeight: '800' },
});
