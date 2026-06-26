'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [form, setForm] = useState({ tenantName: '', slug: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result =
        mode === 'signup'
          ? await api.signup({
              tenantName: form.tenantName,
              slug: form.slug,
              email: form.email,
              password: form.password,
            })
          : await api.login({ slug: form.slug, email: form.email, password: form.password });

      setToken(result.token);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          rag-platform
        </div>
        <h1 style={styles.heading}>{mode === 'signup' ? 'Create your workspace' : 'Sign in'}</h1>
        <p style={styles.subtext}>
          {mode === 'signup'
            ? 'One workspace per organization — your documents stay isolated from every other tenant.'
            : 'Sign in to your existing workspace.'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <Field
              label="Organization name"
              value={form.tenantName}
              onChange={(v) => update('tenantName', v)}
              placeholder="Acme Corp"
              required
            />
          )}
          <Field
            label="Workspace slug"
            value={form.slug}
            onChange={(v) => update('slug', v)}
            placeholder="acme-corp"
            required
            mono
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update('email', v)}
            placeholder="you@company.com"
            required
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => update('password', v)}
            placeholder="••••••••"
            required
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Working…' : mode === 'signup' ? 'Create workspace' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          style={styles.toggleButton}
        >
          {mode === 'signup' ? 'Already have a workspace? Sign in' : 'Need a workspace? Create one'}
        </button>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', required, mono }) {
  return (
    <label style={styles.fieldLabel}>
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)' }}
      />
    </label>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '32px 28px',
    borderTop: '2px solid var(--amber)',
  },
  heading: {
    fontFamily: 'var(--font-mono)',
    fontSize: 22,
    color: 'var(--text-bright)',
    margin: '4px 0 8px',
  },
  subtext: {
    fontSize: 13.5,
    color: 'var(--text-dim)',
    lineHeight: 1.5,
    margin: '0 0 24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  fieldLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  error: {
    fontSize: 13,
    color: 'var(--coral)',
    fontFamily: 'var(--font-mono)',
  },
  submitButton: {
    background: 'var(--amber)',
    color: '#1a1305',
    border: 'none',
    borderRadius: 3,
    padding: '11px 16px',
    fontSize: 14,
    fontWeight: 600,
    marginTop: 4,
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: 'var(--cyan)',
    fontSize: 12.5,
    marginTop: 18,
    padding: 0,
  },
};