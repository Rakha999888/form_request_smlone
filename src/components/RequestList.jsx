import React, { useState } from 'react';
import { Search, Copy, Check, Trash2, Eye, FileText, Download } from 'lucide-react';

export default function RequestList({ requests, onDeleteRequest, onClearAll }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const filteredRequests = requests.filter((item) => {
    const matchesSearch =
      item.namaFitur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.halaman.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaPengaju.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsiRequest.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === 'All' || item.prioritas.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  const handleCopyFormattedText = (item) => {
    const formatted = `*REQUEST DEVELOPER*
--------------------------
*Nama Pengaju:* ${item.namaPengaju}
*Halaman:* ${item.halaman}
*Nama Fitur:* ${item.namaFitur}
*Prioritas:* ${item.prioritas}
*Tanggal:* ${item.tanggal}

*Deskripsi Request:*
${item.deskripsiRequest}
--------------------------`;

    navigator.clipboard.writeText(formatted);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(requests, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `request_developer_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="list-container">
      {/* Filter and Control Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Cari berdasarkan fitur, halaman, pengaju..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="priority-filter">
          {['All', 'Low', 'Medium', 'High'].map((p) => (
            <button
              key={p}
              className={`filter-chip ${priorityFilter === p ? 'active' : ''}`}
              onClick={() => setPriorityFilter(p)}
            >
              {p === 'All' ? 'Semua' : p}
            </button>
          ))}
        </div>

        {requests.length > 0 && (
          <button className="btn-action" onClick={handleExportJSON} title="Download format JSON">
            <Download size={14} /> Export JSON
          </button>
        )}
      </div>

      {/* List items */}
      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <FileText size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '0.75rem' }} />
          <h3>Belum ada Request Developer</h3>
          <p>
            {searchQuery || priorityFilter !== 'All'
              ? 'Tidak ada request yang sesuai dengan filter pencarian.'
              : 'Silakan isi formulir "Request Developer" di tab Formulir.'}
          </p>
        </div>
      ) : (
        filteredRequests.map((item) => (
          <div key={item.id} className="request-card">
            <div className="request-card-header">
              <div>
                <h3 className="request-feature-title">{item.namaFitur}</h3>
                <span className="request-page-badge">📄 Halaman: {item.halaman}</span>
              </div>
              <span className={`badge-priority ${item.prioritas.toLowerCase()}`}>
                Prioritas: {item.prioritas}
              </span>
            </div>

            <div className="request-description">{item.deskripsiRequest}</div>

            <div className="request-meta">
              <div>
                Pengaju: <span className="request-author">{item.namaPengaju}</span> &bull; {item.tanggal}
              </div>

              <div className="card-actions">
                <button
                  className="btn-action"
                  onClick={() => setSelectedDetail(item)}
                  title="Lihat Detail"
                >
                  <Eye size={14} /> Detail
                </button>
                <button
                  className="btn-action"
                  onClick={() => handleCopyFormattedText(item)}
                  title="Salin ke Clipboard"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={14} style={{ color: '#27AE60' }} /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Salin Teks
                    </>
                  )}
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => onDeleteRequest(item.id)}
                  title="Hapus Request"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={() => setSelectedDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', letterSpacing: '0.05em' }}>
                DOCUMENT REQUEST #{selectedDetail.id}
              </span>
              <button
                onClick={() => setSelectedDetail(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {selectedDetail.namaFitur}
            </h2>
            <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="request-page-badge">Halaman: {selectedDetail.halaman}</span>
              <span className={`badge-priority ${selectedDetail.prioritas.toLowerCase()}`}>
                Prioritas: {selectedDetail.prioritas}
              </span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                DESKRIPSI REQUEST:
              </div>
              <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.925rem', whiteSpace: 'pre-wrap' }}>
                {selectedDetail.deskripsiRequest}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Nama Pengaju: <strong>{selectedDetail.namaPengaju}</strong></span>
              <span>{selectedDetail.tanggal}</span>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-action"
                style={{ padding: '0.5rem 1rem' }}
                onClick={() => handleCopyFormattedText(selectedDetail)}
              >
                <Copy size={14} /> Salin Ringkasan
              </button>
              <button
                className="btn-submit"
                style={{ margin: 0, padding: '0.5rem 1.25rem', width: 'auto' }}
                onClick={() => setSelectedDetail(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
