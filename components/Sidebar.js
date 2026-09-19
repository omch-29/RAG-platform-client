// 'use client';

// import { useEffect, useState } from 'react';
// import { api } from '../lib/api';

// export default function Sidebar({ onLogout }) {
//   const [documents, setDocuments] = useState([]);
//   const [usage, setUsage] = useState(null);
//   const [title, setTitle] = useState('');
//   const [text, setText] = useState('');
//   const [ingesting, setIngesting] = useState(false);
//   const [error, setError] = useState(null);

//   const [inviteEmail, setInviteEmail] = useState('');
//   const [invitePassword, setInvitePassword] = useState('');
//   const [inviting, setInviting] = useState(false);
//   const [inviteMessage, setInviteMessage] = useState(null);
//   const [inviteError, setInviteError] = useState(null);

//   async function refresh() {
//     try {
//       const [docsRes, usageRes] = await Promise.all([api.listDocuments(), api.getUsage()]);
//       setDocuments(docsRes.documents || []);
//       setUsage(usageRes.totals || null);
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   useEffect(() => {
//     refresh();
//   }, []);

//   async function handleIngest(e) {
//     e.preventDefault();
//     if (!title.trim() || !text.trim()) return;
//     setIngesting(true);
//     setError(null);
//     try {
//       await api.ingestDocument({ title, text });
//       setTitle('');
//       setText('');
//       await refresh();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIngesting(false);
//     }
//   }

//   async function handleInvite(e) {
//     e.preventDefault();
//     if (!inviteEmail.trim() || !invitePassword.trim()) return;
//     setInviting(true);
//     setInviteError(null);
//     setInviteMessage(null);
//     try {
//       const result = await api.inviteMember({ email: inviteEmail, password: invitePassword, role: 'member' });
//       setInviteMessage(result.message || 'Teammate added.');
//       setInviteEmail('');
//       setInvitePassword('');
//     } catch (err) {
//       // a 403 here means the current user isn't an admin — only admins can invite
//       setInviteError(err.message);
//     } finally {
//       setInviting(false);
//     }
//   }

//   return (
//     <aside style={styles.rail}>
//       <div style={styles.railHeader}>
//         <span className="eyebrow">rag-platform</span>
//         <button onClick={onLogout} style={styles.logoutButton}>
//           sign out
//         </button>
//       </div>

//       <section style={styles.section}>
//         <div className="eyebrow" style={styles.sectionTitle}>
//           Add a document
//         </div>
//         <form onSubmit={handleIngest} style={styles.ingestForm}>
//           <input
//             placeholder="Document title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//           <textarea
//             placeholder="Paste document text…"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             rows={5}
//             required
//             style={{ resize: 'vertical' }}
//           />
//           <button type="submit" disabled={ingesting} style={styles.ingestButton}>
//             {ingesting ? 'Indexing…' : 'Ingest'}
//           </button>
//         </form>
//         {error && <div style={styles.error}>{error}</div>}
//       </section>

//       <section style={styles.section}>
//         <div className="eyebrow" style={styles.sectionTitle}>
//           Documents ({documents.length})
//         </div>
//         <div style={styles.docList}>
//           {documents.length === 0 && <div style={styles.emptyHint}>No documents yet — add one above.</div>}
//           {documents.map((doc) => (
//             <div key={doc._id} style={styles.docRow}>
//               <span style={styles.docTitle}>{doc.title}</span>
//               <span style={{ ...styles.statusBadge, ...statusColor(doc.status) }}>{doc.status}</span>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section style={styles.section}>
//         <div className="eyebrow" style={styles.sectionTitle}>
//           Invite a teammate
//         </div>
//         <form onSubmit={handleInvite} style={styles.ingestForm}>
//           <input
//             type="email"
//             placeholder="teammate@company.com"
//             value={inviteEmail}
//             onChange={(e) => setInviteEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Temporary password"
//             value={invitePassword}
//             onChange={(e) => setInvitePassword(e.target.value)}
//             required
//           />
//           <button type="submit" disabled={inviting} style={styles.ingestButton}>
//             {inviting ? 'Adding…' : 'Add to workspace'}
//           </button>
//         </form>
//         {inviteMessage && <div style={styles.successText}>{inviteMessage}</div>}
//         {inviteError && <div style={styles.error}>{inviteError}</div>}
//         <div style={styles.emptyHint}>
//           New team members belong to this workspace. 
//           They sign in using the workspace slug, their email, and the password assigned when they were added.
//            (signing up creates a brand new, separate workspace).
//         </div>
//       </section>

//       {usage && (
//         <section style={{ ...styles.section, marginTop: 'auto' }}>
//           <div className="eyebrow" style={styles.sectionTitle}>
//             Usage (all-time)
//           </div>
//           <div className="mono" style={styles.usageGrid}>
//             <span>requests</span>
//             <span>{usage.requestCount}</span>
//             <span>tokens</span>
//             <span>{usage.totalTokens}</span>
//             <span>est. cost</span>
//             <span>${usage.estimatedCostUSD.toFixed(4)}</span>
//           </div>
//         </section>
//       )}
//     </aside>
//   );
// }

// function statusColor(status) {
//   if (status === 'ready') return { color: 'var(--green)', borderColor: 'var(--green)' };
//   if (status === 'failed') return { color: 'var(--coral)', borderColor: 'var(--coral)' };
//   return { color: 'var(--text-dim)', borderColor: 'var(--border)' };
// }

// const styles = {
//   rail: {
//     width: 'var(--rail-width)',
//     minWidth: 'var(--rail-width)',
//     height: '100vh',
//     background: 'var(--surface)',
//     borderRight: '1px solid var(--border)',
//     display: 'flex',
//     flexDirection: 'column',
//     padding: 20,
//     gap: 24,
//     overflowY: 'auto',
//   },
//   railHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   logoutButton: {
//     background: 'none',
//     border: 'none',
//     color: 'var(--text-dim)',
//     fontSize: 11,
//   },
//   section: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 10,
//   },
//   sectionTitle: {
//     marginBottom: 2,
//   },
//   ingestForm: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 8,
//   },
//   ingestButton: {
//     background: 'var(--surface-raised)',
//     border: '1px solid var(--amber-dim)',
//     color: 'var(--amber)',
//     borderRadius: 3,
//     padding: '9px 12px',
//     fontSize: 12.5,
//   },
//   error: {
//     fontSize: 12,
//     color: 'var(--coral)',
//     fontFamily: 'var(--font-mono)',
//   },
//   successText: {
//     fontSize: 12,
//     color: 'var(--green)',
//     fontFamily: 'var(--font-mono)',
//   },
//   docList: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 6,
//   },
//   emptyHint: {
//     fontSize: 12.5,
//     color: 'var(--text-dim)',
//   },
//   docRow: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     gap: 8,
//     fontSize: 13,
//     padding: '6px 0',
//     borderBottom: '1px solid var(--border)',
//   },
//   docTitle: {
//     color: 'var(--text-bright)',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     whiteSpace: 'nowrap',
//   },
//   statusBadge: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 10,
//     border: '1px solid',
//     borderRadius: 2,
//     padding: '2px 6px',
//     flexShrink: 0,
//     textTransform: 'uppercase',
//   },
//   usageGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'auto 1fr',
//     gap: '4px 12px',
//     fontSize: 12,
//     color: 'var(--text-dim)',
//   },
// };

'use client';

import { useEffect, useState } from 'react';
import { api, getSlug, getRole } from '../lib/api';

export default function Sidebar({ onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [usage, setUsage] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDoc, setExpandedDoc] = useState(null); // doc._id of open row
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [inviteError, setInviteError] = useState(null);

  const slug = getSlug();
  const isAdmin = getRole() === 'admin';

  async function refresh() {
    try {
      const [docsRes, usageRes] = await Promise.all([api.listDocuments(), api.getUsage()]);
      setDocuments(docsRes.documents || []);
      setUsage(usageRes.totals || null);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleIngest(e) {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    setIngesting(true);
    setError(null);
    try {
      await api.ingestDocument({ title, text });
      setTitle('');
      setText('');
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIngesting(false);
    }
  }

  async function handleDelete(docId) {
    if (!confirm('Delete this document? This removes it from search and cannot be undone.')) return;
    try {
      await api.deleteDocument(docId);
      setExpandedDoc(null);
      await refresh();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail.trim() || !invitePassword.trim()) return;
    setInviting(true);
    setInviteError(null);
    setInviteMessage(null);
    try {
      const result = await api.inviteMember({ email: inviteEmail, password: invitePassword, role: 'member' });
      setInviteMessage(result.message || 'Teammate added.');
      setInviteEmail('');
      setInvitePassword('');
    } catch (err) {
      setInviteError(err.message);
    } finally {
      setInviting(false);
    }
  }

  return (
    <aside style={styles.rail}>
      {/* Header — shows workspace slug */}
      <div style={styles.railHeader}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 2 }}>workspace</div>
          <div className="mono" style={styles.slugDisplay}>{slug || '—'}</div>
        </div>
        <button onClick={onLogout} style={styles.logoutButton}>sign out</button>
      </div>

      {/* Ingest — text only, admin only */}
      {isAdmin && (
        <section style={styles.section}>
          <div className="eyebrow" style={styles.sectionTitle}>Add a document</div>
          <form onSubmit={handleIngest} style={styles.ingestForm}>
            <input placeholder="Document title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Paste document text…" value={text} onChange={(e) => setText(e.target.value)}
              rows={5} required style={{ resize: 'vertical' }} />
            <button type="submit" disabled={ingesting} style={styles.ingestButton}>
              {ingesting ? 'Indexing…' : 'Ingest'}
            </button>
          </form>
          {error && <div style={styles.error}>{error}</div>}
        </section>
      )}

      {/* Documents list — expandable for admins */}
      <section style={styles.section}>
        <div className="eyebrow" style={styles.sectionTitle}>
          Documents ({documents.length})
        </div>
        <div style={styles.docList}>
          {documents.length === 0 && <div style={styles.emptyHint}>No documents yet.</div>}
          {documents.map((doc) => (
            <div key={doc._id}>
              {/* row header */}
              <div style={styles.docRow}>
                <span style={styles.docTitle}>{doc.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ ...styles.statusBadge, ...statusColor(doc.status) }}>{doc.status}</span>
                  {/* only admins see the expand toggle */}
                  {isAdmin && (
                    <button
                      style={styles.expandBtn}
                      onClick={() => setExpandedDoc(expandedDoc === doc._id ? null : doc._id)}
                      title={expandedDoc === doc._id ? 'Collapse' : 'View content'}
                    >
                      {expandedDoc === doc._id ? '▲' : '▼'}
                    </button>
                  )}
                </div>
              </div>

              {/* expandable content — admin only */}
              {isAdmin && expandedDoc === doc._id && (
                <div style={styles.docExpanded}>
                  <div style={styles.docMeta}>
                    <span>{doc.chunkCount} chunk(s)</span>
                    <span style={{ color: 'var(--text-dim)' }}>·</span>
                    <span style={{ textTransform: 'uppercase', fontSize: 10 }}>{doc.sourceType}</span>
                  </div>
                  {doc.rawText && (
                    <pre style={styles.rawTextBox}>{doc.rawText.slice(0, 800)}{doc.rawText.length > 800 ? '\n…' : ''}</pre>
                  )}
                  <button onClick={() => handleDelete(doc._id)} style={styles.deleteBtn}>
                    Delete document
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Invite — admin only */}
      {isAdmin && (
        <section style={styles.section}>
          <div className="eyebrow" style={styles.sectionTitle}>Invite a teammate</div>
          <form onSubmit={handleInvite} style={styles.ingestForm}>
            <input type="email" placeholder="teammate@company.com" value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)} required />
            <input type="password" placeholder="Temporary password" value={invitePassword}
              onChange={(e) => setInvitePassword(e.target.value)} required />
            <button type="submit" disabled={inviting} style={styles.ingestButton}>
              {inviting ? 'Adding…' : 'Add to workspace'}
            </button>
          </form>
          {inviteMessage && <div style={styles.successText}>{inviteMessage}</div>}
          {inviteError && <div style={styles.error}>{inviteError}</div>}
          <div style={styles.emptyHint}>
            They log in (not sign up) with this workspace slug + their email + this password.
          </div>
        </section>
      )}

      {/* Usage */}
      {usage && (
        <section style={{ ...styles.section, marginTop: 'auto' }}>
          <div className="eyebrow" style={styles.sectionTitle}>Usage (all-time)</div>
          <div className="mono" style={styles.usageGrid}>
            <span>requests</span><span>{usage.requestCount}</span>
            <span>tokens</span><span>{usage.totalTokens}</span>
            <span>est. cost</span><span>${usage.estimatedCostUSD.toFixed(4)}</span>
          </div>
        </section>
      )}
    </aside>
  );
}

function statusColor(status) {
  if (status === 'ready') return { color: 'var(--green)', borderColor: 'var(--green)' };
  if (status === 'failed') return { color: 'var(--coral)', borderColor: 'var(--coral)' };
  return { color: 'var(--text-dim)', borderColor: 'var(--border)' };
}

const styles = {
  rail: { width: 'var(--rail-width)', minWidth: 'var(--rail-width)', height: '100vh', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: 20, gap: 24, overflowY: 'auto' },
  railHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  slugDisplay: { fontSize: 13, color: 'var(--amber)', fontWeight: 600 },
  logoutButton: { background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 11, cursor: 'pointer', marginTop: 4 },
  section: { display: 'flex', flexDirection: 'column', gap: 10 },
  sectionTitle: { marginBottom: 2 },
  ingestForm: { display: 'flex', flexDirection: 'column', gap: 8 },
  ingestButton: { background: 'var(--surface-raised)', border: '1px solid var(--amber-dim)', color: 'var(--amber)', borderRadius: 3, padding: '9px 12px', fontSize: 12.5, cursor: 'pointer' },
  error: { fontSize: 12, color: 'var(--coral)', fontFamily: 'var(--font-mono)' },
  successText: { fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)' },
  docList: { display: 'flex', flexDirection: 'column', gap: 2 },
  emptyHint: { fontSize: 12.5, color: 'var(--text-dim)' },
  docRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--border)' },
  docTitle: { color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 },
  statusBadge: { fontFamily: 'var(--font-mono)', fontSize: 10, border: '1px solid', borderRadius: 2, padding: '2px 6px', textTransform: 'uppercase' },
  expandBtn: { background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 10, cursor: 'pointer', padding: '2px 4px' },
  docExpanded: { background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 3, padding: 10, marginBottom: 6, display: 'flex', flexDirection: 'column', gap: 8 },
  docMeta: { display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' },
  rawTextBox: { fontSize: 11, color: 'var(--text)', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 160, overflowY: 'auto', margin: 0, background: 'var(--bg)', padding: 8, borderRadius: 2, border: '1px solid var(--border)' },
  deleteBtn: { background: 'none', border: '1px solid var(--coral)', color: 'var(--coral)', borderRadius: 3, padding: '6px 10px', fontSize: 11.5, fontFamily: 'var(--font-mono)', cursor: 'pointer' },
  usageGrid: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 12, color: 'var(--text-dim)' },
};