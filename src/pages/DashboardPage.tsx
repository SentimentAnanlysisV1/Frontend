import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { analyzeConversation, signOut } from '../services/api';

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

function DashboardPage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) {
      setError('Please enter conversation text.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await analyzeConversation(text);
      setResult(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Unable to analyze conversation.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Positive', value: result?.positive_percentage ?? 0 },
    { name: 'Neutral', value: result?.neutral_percentage ?? 0 },
    { name: 'Negative', value: result?.negative_percentage ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between gap-4"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">AI Conversation Sentiment Analyzer</p><button className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-300" onClick={() => { signOut(); navigate('/login'); }}>Sign out</button></div>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Modern conversation intelligence for support and CX teams</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-400 sm:text-base">Upload or paste a conversation transcript to analyze overall tone, sentiment, emotion, and recommended actions.</p>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <label className="text-sm font-medium text-slate-300">Conversation text</label>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={12}
              className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0"
              placeholder="Paste the conversation transcript here..."
            />
            <button type="submit" className="mt-4 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
              {loading ? 'Analyzing...' : 'Analyze Conversation'}
            </button>
            {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
            <div className="h-full rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
              <h2 className="text-xl font-semibold">Live insights</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Overall Sentiment', value: result?.overall_sentiment ?? 'Pending' },
                  { label: 'Emotion', value: result?.emotion ?? 'Pending' },
                  { label: 'Customer Satisfaction', value: result?.customer_satisfaction ? `${result.customer_satisfaction}%` : 'Pending' },
                  { label: 'Resolution Status', value: result?.resolution_status ?? 'Pending' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {result ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
              <h3 className="text-xl font-semibold">Sentiment Breakdown</h3>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                      {chartData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
              <h3 className="text-xl font-semibold">Recommendations</h3>
              <ul className="mt-4 space-y-3">
                {result.suggestions?.map((suggestion: string) => (
                  <li key={suggestion} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">{suggestion}</li>
                ))}
              </ul>
              <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Keywords</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.keywords?.map((keyword: string) => (
                    <span key={keyword} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">{keyword}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

export default DashboardPage;
