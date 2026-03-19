export const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',    emoji: '🍔', color: '#FF6B6B' },
  { id: 'transport',     label: 'Transport',         emoji: '🚗', color: '#4ECDC4' },
  { id: 'shopping',      label: 'Shopping',          emoji: '🛍️', color: '#45B7D1' },
  { id: 'entertainment', label: 'Entertainment',     emoji: '🎬', color: '#96CEB4' },
  { id: 'health',        label: 'Health',            emoji: '💊', color: '#FFEAA7' },
  { id: 'utilities',     label: 'Utilities',         emoji: '💡', color: '#DDA0DD' },
  { id: 'education',     label: 'Education',         emoji: '📚', color: '#98D8C8' },
  { id: 'other',         label: 'Other',             emoji: '📦', color: '#B0B0B0' },
];

export const getCategoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
