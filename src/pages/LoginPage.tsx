import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount, signIn } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await (isRegistering ? createAccount : signIn)({ email, password });
      navigate('/', { replace: true });
    } catch (requestError: any) {
      setError(requestError?.response?.data?.detail || 'Unable to continue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-2xl shadow-black/30 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">AI Sentiment Analyzer</p>
        <h1 className="mt-3 text-3xl font-semibold">{isRegistering ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm text-slate-400">{isRegistering ? 'Create an account to save and review conversation analyses.' : 'Sign in to analyze conversations securely.'}</p>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-300">
            Email
            <input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Password
            <input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </label>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60" disabled={loading} type="submit">
            {loading ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button className="mt-5 w-full text-sm text-emerald-300 hover:text-emerald-200" type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
          {isRegistering ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </button>
      </section>
    </main>
  );
}

export default LoginPage;
