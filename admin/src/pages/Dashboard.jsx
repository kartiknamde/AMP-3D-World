import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, Palette, Users } from 'lucide-react';

export default function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load stats.</div>;

  const cards = [
    { title: 'Total Sales', value: `₹${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: '#10b981' },
    { title: 'Total Orders', value: stats.orderCount, icon: ShoppingBag, color: '#3b82f6' },
    { title: 'Custom Orders', value: stats.customOrderCount, icon: Palette, color: '#8b5cf6' },
    { title: 'Total Users', value: stats.userCount, icon: Users, color: '#f59e0b' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-headings)', marginBottom: '32px', color: 'var(--text-dark)' }}>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: `${card.color}20`, color: card.color }}>
                <Icon size={32} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{card.title}</p>
                <h3 style={{ margin: 0, fontSize: '24px', color: 'var(--text-dark)' }}>{card.value}</h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
