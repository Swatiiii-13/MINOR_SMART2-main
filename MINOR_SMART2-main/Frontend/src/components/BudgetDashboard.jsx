import React, { useRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BudgetDashboard = ({ itineraryData, tripRequestData }) => {
  const dashboardRef = useRef(null);

  const budgetData = itineraryData?.budgetBreakdown || tripRequestData;
  if (!budgetData) return null;

  // Memoize budget extraction, fallbacks, and chart data formatting to avoid redundant operations on re-renders
  const {
    totalCost,
    stayCost,
    transportCost,
    foodCost,
    activitiesCost,
    dailyExpenses,
    perPersonCost,
    avgPerDay,
    pieData,
    barData,
    destination,
    duration
  } = React.useMemo(() => {
    const budgetData = itineraryData?.budgetBreakdown || tripRequestData;
    if (!budgetData) {
      return {
        totalCost: 0,
        stayCost: 0,
        transportCost: 0,
        foodCost: 0,
        activitiesCost: 0,
        dailyExpenses: [],
        perPersonCost: 0,
        avgPerDay: 0,
        pieData: [],
        barData: [],
        destination: 'Trip',
        duration: 1
      };
    }

    const budgetBreakdown = itineraryData?.budgetBreakdown;
    const budget = parseInt(tripRequestData?.budget?.toString().replace(/\D/g, '')) || 0;
    const travelers = parseInt(tripRequestData?.travelers) || 1;
    const duration = parseInt(tripRequestData?.duration) || 1;
    const destination = tripRequestData?.destination || 'Trip';

    let total, stay, transport, food, activities, expenses;

    if (budgetBreakdown && budgetBreakdown.totalCost) {
      total = Number(budgetBreakdown.totalCost) || 0;
      stay = Number(budgetBreakdown.stayCost) || 0;
      transport = Number(budgetBreakdown.transportCost) || 0;
      food = Number(budgetBreakdown.foodCost) || 0;
      activities = Number(budgetBreakdown.activitiesCost) || 0;
      expenses = budgetBreakdown.dailyExpenses || [];
    } else {
      total = budget || (duration * travelers * 5000);
      stay = total * 0.40;
      transport = total * 0.20;
      food = total * 0.28;
      activities = total * 0.12;

      expenses = Array.from({ length: duration }).map((_, i) => ({
        day: i + 1,
        cost: total / duration
      }));
    }

    // Safety checks against NaN/undefined
    total = Math.round(Number(total) || 0);
    stay = Math.round(Number(stay) || 0);
    transport = Math.round(Number(transport) || 0);
    food = Math.round(Number(food) || 0);
    activities = Math.round(Number(activities) || 0);

    const perPerson = travelers > 0 ? (total / travelers) : total;
    const avgDay = duration > 0 ? (total / duration) : total;

    const pie = [
      { name: 'Stay', value: stay, color: '#3b82f6' },
      { name: 'Transport', value: transport, color: '#10b981' },
      { name: 'Food', value: food, color: '#eab308' },
      { name: 'Activities', value: activities, color: '#a855f7' },
    ];

    const bar = expenses.map(item => ({
      name: `Day ${item.day}`,
      cost: Math.round(Number(item.cost) || 0)
    }));

    return {
      totalCost: total,
      stayCost: stay,
      transportCost: transport,
      foodCost: food,
      activitiesCost: activities,
      dailyExpenses: expenses,
      perPersonCost: perPerson,
      avgPerDay: avgDay,
      pieData: pie,
      barData: bar,
      destination,
      duration
    };
  }, [itineraryData, tripRequestData]);

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      // Add a slight delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${destination.replace(/\s+/g, '_')}_trip_plan.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF.');
    }
  };

  const formatCurrency = (val) => Math.round(val).toLocaleString('en-IN');

  return (
    <div className="budget-dashboard" style={{ animation: 'fadeIn 0.5s ease-in-out', marginBottom: '2rem' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Trip Budget Breakdown</h2>
        <button 
          onClick={handleDownloadPDF}
          className="glass-button"
          style={{ padding: '0.5rem 1rem', width: 'auto', margin: 0, backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)' }}
        >
          📄 Download Trip PDF
        </button>
      </div>

      <div ref={dashboardRef} style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
        
        {/* Top Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#93c5fd', fontSize: '0.9rem' }}>Total Cost</h4>
            <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '1.5rem' }}>₹{formatCurrency(totalCost)}</h3>
          </div>
          <div className="stat-card" style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fdba74', fontSize: '0.9rem' }}>Per Person</h4>
            <h3 style={{ margin: 0, color: '#f97316', fontSize: '1.5rem' }}>₹{formatCurrency(perPersonCost)}</h3>
          </div>
          <div className="stat-card" style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#fcd34d', fontSize: '0.9rem' }}>Avg / Day</h4>
            <h3 style={{ margin: 0, color: '#eab308', fontSize: '1.5rem' }}>₹{formatCurrency(avgPerDay)}</h3>
          </div>
          <div className="stat-card" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#d8b4fe', fontSize: '0.9rem' }}>Duration</h4>
            <h3 style={{ margin: 0, color: '#a855f7', fontSize: '1.5rem' }}>{duration} Days</h3>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem', opacity: 0.9 }}>Cost Distribution</h4>
            <div style={{ width: '100%', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${formatCurrency(value)}`} contentStyle={{ background: '#111827', borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem', opacity: 0.9 }}>Day-wise Expenses</h4>
            <div style={{ width: '100%', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 12}} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.7)', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value) => `₹${formatCurrency(value)}`} cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: '#111827', borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Bottom Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Stay Total</div>
              <div style={{ fontWeight: 'bold' }}>₹{formatCurrency(stayCost)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Transport Total</div>
              <div style={{ fontWeight: 'bold' }}>₹{formatCurrency(transportCost)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Food Total</div>
              <div style={{ fontWeight: 'bold' }}>₹{formatCurrency(foodCost)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Activities Total</div>
              <div style={{ fontWeight: 'bold' }}>₹{formatCurrency(activitiesCost)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BudgetDashboard;
