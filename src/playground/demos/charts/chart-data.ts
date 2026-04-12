// ─── Line Chart Data ──────────────────────────

export const revenueData = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5800 },
  { label: 'Mar', value: 5200 },
  { label: 'Apr', value: 7100 },
  { label: 'May', value: 6800 },
  { label: 'Jun', value: 9400 },
  { label: 'Jul', value: 8200 },
  { label: 'Aug', value: 11200 },
  { label: 'Sep', value: 10100 },
  { label: 'Oct', value: 12800 },
  { label: 'Nov', value: 14200 },
  { label: 'Dec', value: 16400 },
]

export const multiLineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
export const multiLineDatasets = [
  { label: 'Revenue', data: [4200, 5800, 5200, 7100, 6800, 9400, 8200], color: 'var(--color-chart-1)' },
  { label: 'Expenses', data: [3100, 3400, 2900, 4200, 3800, 5100, 4600], color: 'var(--color-chart-4)' },
  { label: 'Profit', data: [1100, 2400, 2300, 2900, 3000, 4300, 3600], color: 'var(--color-chart-2)' },
]

export const sparkData = [
  { label: 'Mon', value: 34 },
  { label: 'Tue', value: 56 },
  { label: 'Wed', value: 44 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 62 },
  { label: 'Sat', value: 91 },
  { label: 'Sun', value: 85 },
]

// ─── Bar Chart Data ───────────────────────────

export const monthlyBarData = [
  { label: 'Jan', value: 4200, color: 'var(--color-chart-1)' },
  { label: 'Feb', value: 5800, color: 'var(--color-chart-5)' },
  { label: 'Mar', value: 5200, color: 'var(--color-chart-2)' },
  { label: 'Apr', value: 7100, color: 'var(--color-chart-3)' },
  { label: 'May', value: 6800, color: 'var(--color-chart-4)' },
  { label: 'Jun', value: 9400, color: 'var(--color-chart-6)' },
]

export const groupedBarLabels = ['Q1', 'Q2', 'Q3', 'Q4']
export const groupedBarDatasets = [
  { label: 'Product A', data: [4200, 6100, 7800, 9200] },
  { label: 'Product B', data: [3100, 4800, 5200, 7100] },
  { label: 'Product C', data: [1800, 2400, 3100, 4300] },
]

export const hBarData = [
  { label: 'React', value: 78 },
  { label: 'Vue', value: 65 },
  { label: 'Angular', value: 52 },
  { label: 'Svelte', value: 43 },
  { label: 'Next.js', value: 81 },
]

// ─── Pie Chart Data ───────────────────────────

export const marketShareData = [
  { label: 'Desktop', value: 42 },
  { label: 'Mobile', value: 38 },
  { label: 'Tablet', value: 13 },
  { label: 'Other', value: 7 },
]

export const revenueBreakdown = [
  { label: 'SaaS', value: 48200, color: 'var(--color-chart-1)' },
  { label: 'Services', value: 21400, color: 'var(--color-chart-2)' },
  { label: 'Licenses', value: 14800, color: 'var(--color-chart-3)' },
  { label: 'Support', value: 9600, color: 'var(--color-chart-5)' },
]

export const trafficSources = [
  { label: 'Organic', value: 44 },
  { label: 'Direct', value: 22 },
  { label: 'Social', value: 18 },
  { label: 'Referral', value: 10 },
  { label: 'Email', value: 6 },
]

// ─── Dynamic Generators (For live density controls) ───────────────────────────

export function generateTimeSeriesData(days: number) {
  const data = [];
  const date = new Date();
  date.setDate(date.getDate() - days);
  let val = 5000 + Math.random() * 2000;
  const colors = ['var(--color-chart-1)', 'var(--color-chart-5)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-6)'];
  
  for (let i = 0; i < days; i++) {
    date.setDate(date.getDate() + 1);
    val += (Math.random() - 0.5) * 800;
    if (val < 1000) val = 1000 + Math.random() * 500;
    data.push({
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(val),
      color: colors[i % colors.length]
    });
  }
  return data;
}

export function generateMultiSeriesData(days: number) {
  const labels = [];
  const ds1 = [];
  const ds2 = [];
  const ds3 = [];
  const date = new Date();
  date.setDate(date.getDate() - days);
  let v1 = 4000, v2 = 3000, v3 = 1500;
  
  for (let i = 0; i < days; i++) {
    date.setDate(date.getDate() + 1);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    v1 += (Math.random() - 0.45) * 500; if (v1 < 500) v1 = 500;
    v2 += (Math.random() - 0.45) * 400; if (v2 < 500) v2 = 500;
    v3 += (Math.random() - 0.45) * 300; if (v3 < 500) v3 = 500;
    ds1.push(Math.round(v1));
    ds2.push(Math.round(v2));
    ds3.push(Math.round(v3));
  }
  return {
    labels,
    datasets: [
      { label: 'Revenue', data: ds1, color: 'var(--color-chart-1)' },
      { label: 'Expenses', data: ds2, color: 'var(--color-chart-4)' },
      { label: 'Profit', data: ds3, color: 'var(--color-chart-2)' },
    ]
  };
}

// ─── Timeline Chart Data ──────────────────────

export const timelinePeriods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

export const timelineTasks = [
  { person: 'Caleb', task: 'UI Design',     start: 0.5, end: 4.5, color: '#10b981' },
  { person: 'Shaw',  task: 'UX Design',     start: 2.5, end: 5.8, color: '#f43f5e' },
  { person: 'Jane',  task: 'Music',         start: 1.8, end: 5.5, color: '#f59e0b' },
  { person: 'Blake', task: 'Animation',     start: 1,   end: 6.2, color: '#e5e5e5' },
  { person: 'Quinn', task: 'Prototyping',   start: 2.8, end: 7.5, color: '#3b82f6' },
]

// ─── Segment Bar Chart Data ───────────────────

export const logisticsSegments = [
  { label: 'On the way',  value: 33.3, color: '#525252' },
  { label: 'Unloading',   value: 23.5, color: '#737373' },
  { label: 'Loading',     value: 23.1, color: '#a3a3a3' },
  { label: 'Waiting',     value: 20.1, color: '#d4d4d4' },
]

export const browserSegments = [
  { label: 'Chrome',  value: 64.5, color: 'var(--color-chart-1)' },
  { label: 'Safari',  value: 18.8, color: 'var(--color-chart-2)' },
  { label: 'Firefox', value: 8.2,  color: 'var(--color-chart-3)' },
  { label: 'Edge',    value: 5.3,  color: 'var(--color-chart-5)' },
  { label: 'Other',   value: 3.2,  color: 'var(--color-chart-6)' },
]

// ─── Stat Card Chart Data ─────────────────────

export const deviceStats = [
  { label: 'Desktop', percentage: 17, value: 23.8,   trend: 'up' as const,   color: '#a3a3a3' },
  { label: 'Tablet',  percentage: 65, value: 13.604, trend: 'down' as const, color: '#525252' },
  { label: 'Mobile',  percentage: 18, value: 47.146, trend: 'up' as const,   color: '#737373' },
]

// ─── Waffle Chart Data ────────────────────────

export const waffleMultiData = [
  { label: 'Completed', value: 12, color: '#e5e5e5' },
  { label: 'In Progress', value: 4, color: '#d4d4d4' },
  { label: 'Remaining', value: 14, color: '#525252' },
]

