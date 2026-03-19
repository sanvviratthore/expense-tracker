import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'expenses_v1';

export async function loadExpenses() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function saveExpenses(expenses) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.warn('Failed to save expenses:', e);
  }
}

export function genId() {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function filterByMonth(expenses, year, month) {
  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getTotalByCategory(expenses) {
  const totals = {};
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });
  return totals;
}
