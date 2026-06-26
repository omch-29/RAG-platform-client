'use client';

import { useRef, useState } from 'react';
import { api } from '../lib/api';

export default function ChatPanel() {
  const [turns, setTurns] = useState([]);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const esRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || busy) return;

    setQuestion('');
    setBusy(true);

    const turnId = Date.now();
    setTurns((prev) => [...prev, { id: turnId, question: q, answer: '', sources: null, done: false, cached: false, error: null }]);

    const url = api.streamUrl(q);
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener('sources', (e) => {
      const data = JSON.parse(e.data);
      updateTurn(turnId, { sources: data.sources });
    });

    es.addEventListener('token', (e) => {
      const data = JSON.parse(e.data);
      updateTurn(turnId, (prev) => ({ answer: prev.answer + data.text }));
    });

    es.addEventListener('done', (e) => {
      const data = JSON.parse(e.data);
      updateTurn(turnId, {
        done: true,
        cached: data.cached,
        answer: data.answer || undefined, // cache-hit path delivers the full answer here directly
        sources: data.sources || undefined,
      });
      es.close();
      setBusy(false);
    });

    es.addEventListener('error', () => {
      updateTurn(turnId, { done: true, error: 'Connection lost or server error.' });
      es.close();
      setBusy(false);
    });
  }

  function updateTurn(turnId, patch) {
    setTurns((prev) =>
      prev.map((t) => {
        if (t.id !== turnId) return t;
        const next = typeof patch === 'function' ? patch(t) : patch;
        return { ...t, ...next };
      })
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.scrollArea}>
        {turns.length === 0 && (
          <div style={styles.emptyState}>
            <div className="eyebrow">no queries yet</div>
            <p style={styles.emptyText}>
              Ask something about a document you've ingested. Answers stream in live, grounded only in
              your tenant's data — and every answer shows exactly which chunks it came from, below.
            </p>
          </div>
        )}

        {turns.map((turn) => (
          <Turn key={turn.id} turn={turn} />
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.inputBar}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your documents…"
          style={styles.input}
          disabled={busy}
        />
        <button type="submit" disabled={busy} style={styles.sendButton}>
          {busy ? '…' : 'Ask'}
        </button>
      </form>
    </main>
  );
}

function Turn({ turn }) {
  return (
    <div style={styles.turn}>
      <div style={styles.questionRow}>
        <span className="eyebrow">question</span>
        <p style={styles.questionText}>{turn.question}</p>
      </div>

      <div style={styles.answerRow}>
        <span className="eyebrow">answer</span>
        <p style={styles.answerText}>
          {turn.answer}
          {!turn.done && <span style={styles.cursor}>▍</span>}
        </p>
        {turn.error && <div style={styles.errorText}>{turn.error}</div>}
      </div>

      {turn.sources && turn.sources.length > 0 && <RetrievalLedger sources={turn.sources} cached={turn.cached} />}
    </div>
  );
}

/**
 * The signature element — exposes the hybrid retrieval mechanics that
 * power the answer above, instead of hiding them like a typical chat UI.
 * Each chip is one retrieved chunk: its vector rank, BM25 rank, and the
 * fused RRF score that determined its position in the final context.
 */
function RetrievalLedger({ sources, cached }) {
  return (
    <div style={styles.ledger}>
      <div style={styles.ledgerHeader}>
        <span className="eyebrow">retrieval ledger</span>
        {cached && <span style={styles.cachedTag}>served from cache</span>}
      </div>
      <div style={styles.ledgerChips}>
        {sources.map((s, i) => (
          <div key={i} style={styles.chip}>
            <div style={styles.chipRow}>
              <span style={styles.chipLabel}>V{s.vectorRank ?? '–'}</span>
              <span style={styles.chipLabel}>B{s.bm25Rank ?? '–'}</span>
              <span style={{ ...styles.chipLabel, color: 'var(--amber)' }}>
                {s.rrfScore?.toFixed(4)}
              </span>
            </div>
            <div style={styles.chipPreview}>{s.preview}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  main: {
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  emptyState: {
    maxWidth: 480,
    margin: '80px auto 0',
    textAlign: 'center',
  },
  emptyText: {
    color: 'var(--text-dim)',
    fontSize: 13.5,
    lineHeight: 1.6,
    marginTop: 10,
  },
  turn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 720,
  },
  questionRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  questionText: {
    color: 'var(--text-bright)',
    fontSize: 15,
    fontWeight: 500,
    margin: 0,
  },
  answerRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingLeft: 14,
    borderLeft: '2px solid var(--amber-dim)',
  },
  answerText: {
    color: 'var(--text)',
    fontSize: 14.5,
    lineHeight: 1.65,
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  cursor: {
    color: 'var(--amber)',
  },
  errorText: {
    color: 'var(--coral)',
    fontSize: 13,
    fontFamily: 'var(--font-mono)',
  },
  ledger: {
    marginTop: 4,
    paddingLeft: 14,
  },
  ledgerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  cachedTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--cyan)',
    border: '1px solid var(--cyan)',
    borderRadius: 2,
    padding: '1px 6px',
  },
  ledgerChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 3,
    padding: '8px 10px',
    width: 220,
  },
  chipRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 5,
  },
  chipLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
  },
  chipPreview: {
    fontSize: 11.5,
    color: 'var(--text-dim)',
    lineHeight: 1.4,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  inputBar: {
    display: 'flex',
    gap: 10,
    padding: '16px 40px',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface)',
  },
  input: {
    flex: 1,
  },
  sendButton: {
    background: 'var(--amber)',
    color: '#1a1305',
    border: 'none',
    borderRadius: 3,
    padding: '0 22px',
    fontWeight: 600,
    fontSize: 14,
  },
};