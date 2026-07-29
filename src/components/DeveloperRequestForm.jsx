import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function DeveloperRequestForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    namaPengaju: '',
    noWhatsapp: '',
    email: '',
    namaFitur: '',
    deskripsiRequest: '',
    prioritas: 'Medium'
  });

  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.namaPengaju.trim()) newErrors.namaPengaju = 'Nama Pengaju wajib diisi';
    if (!formData.noWhatsapp.trim()) newErrors.noWhatsapp = 'Nomor WhatsApp wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.namaFitur.trim()) newErrors.namaFitur = 'Nama Fitur wajib diisi';
    if (!formData.deskripsiRequest.trim()) newErrors.deskripsiRequest = 'Deskripsi Request wajib diisi';
    if (!formData.prioritas) newErrors.prioritas = 'Pilih salah satu prioritas';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePrioritySelect = (priority) => {
    setFormData((prev) => ({ ...prev, prioritas: priority }));
    if (errors.prioritas) {
      setErrors((prev) => ({ ...prev, prioritas: null }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.smlone.cloud/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_pengaju: formData.namaPengaju,
          no_whatsapp: formData.noWhatsapp,
          email: formData.email,
          nama_fitur: formData.namaFitur,
          deskripsi: formData.deskripsiRequest,
          prioritas: formData.prioritas || 'Medium'
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Gagal mengirim request (${response.status})`);
      }

      const result = await response.json().catch(() => null);

      // Normalize request payload for display & local storage
      const requestData = {
        id: (result && (result.id || result.request_id || result.data?.id)) ? (result.id || result.request_id || result.data?.id) : ('REQ-' + Date.now().toString().slice(-6)),
        namaPengaju: formData.namaPengaju,
        noWhatsapp: formData.noWhatsapp,
        email: formData.email,
        namaFitur: formData.namaFitur,
        deskripsiRequest: formData.deskripsiRequest,
        prioritas: formData.prioritas || 'Medium',
        tanggal: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        createdAt: new Date().toISOString()
      };

      onSubmitSuccess(requestData);

      setFormData({
        namaPengaju: '',
        noWhatsapp: '',
        email: '',
        namaFitur: '',
        deskripsiRequest: '',
        prioritas: 'Medium'
      });
      setErrors({});
    } catch (err) {
      setToastMessage('');
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <div style={{ color: '#E74C3C', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <AlertCircle size={14} /> {errors[field]}
      </div>
    ) : null;

  return (
    <div className="form-card">
      <div className="form-header">
        <h2 className="form-title">REQUEST DEVELOPER</h2>
        <p className="form-subtitle">Formulir pengajuan fitur baru atau perubahan sistem untuk tim developer.</p>
      </div>

      {toastMessage && (
        <div className="toast-success">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Nama Pengaju */}
        <div className="form-group">
          <label className="form-label" htmlFor="namaPengaju">
            Nama Pengaju <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="namaPengaju"
            name="namaPengaju"
            className="form-control"
            placeholder="Contoh: Budi Santoso"
            value={formData.namaPengaju}
            onChange={handleChange}
            style={{ borderColor: errors.namaPengaju ? '#E74C3C' : undefined }}
          />
          <ErrorMsg field="namaPengaju" />
        </div>

        {/* WA & Email dalam 2 kolom */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="wa-email-grid">

          {/* No WhatsApp */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="noWhatsapp">
              No. WhatsApp <span className="required-star">*</span>
            </label>
            <input
              type="tel"
              id="noWhatsapp"
              name="noWhatsapp"
              className="form-control"
              placeholder="Contoh: 08123456789"
              value={formData.noWhatsapp}
              onChange={handleChange}
              style={{ borderColor: errors.noWhatsapp ? '#E74C3C' : undefined }}
            />
            <ErrorMsg field="noWhatsapp" />
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="email">
              Email <span className="required-star">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Contoh: budi@smlone.com"
              value={formData.email}
              onChange={handleChange}
              style={{ borderColor: errors.email ? '#E74C3C' : undefined }}
            />
            <ErrorMsg field="email" />
          </div>

        </div>

        {/* Nama Fitur */}
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label" htmlFor="namaFitur">
            Nama Fitur <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="namaFitur"
            name="namaFitur"
            className="form-control"
            placeholder="Contoh: Export PDF Laporan Penjualan"
            value={formData.namaFitur}
            onChange={handleChange}
            style={{ borderColor: errors.namaFitur ? '#E74C3C' : undefined }}
          />
          <ErrorMsg field="namaFitur" />
        </div>

        {/* Deskripsi Request */}
        <div className="form-group">
          <label className="form-label" htmlFor="deskripsiRequest">
            Deskripsi Request <span className="required-star">*</span>
          </label>
          <textarea
            id="deskripsiRequest"
            name="deskripsiRequest"
            className="form-control"
            placeholder="Jelaskan kebutuhan fitur secara rinci, alur kerja (workflow), atau syarat spesifik lainnya..."
            value={formData.deskripsiRequest}
            onChange={handleChange}
            style={{ borderColor: errors.deskripsiRequest ? '#E74C3C' : undefined }}
          />
          <ErrorMsg field="deskripsiRequest" />
        </div>

        {/* Prioritas */}
        <div className="form-group">
          <label className="form-label">
            Prioritas <span className="required-star">*</span>
          </label>
          <div className="priority-grid">
            {['Low', 'Medium', 'High'].map((p) => {
              const pLower = p.toLowerCase();
              const isSelected = formData.prioritas === p;
              return (
                <div
                  key={p}
                  className={`priority-option priority-${pLower} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePrioritySelect(p)}
                >
                  <input
                    type="radio"
                    name="prioritas"
                    value={p}
                    checked={isSelected}
                    onChange={() => handlePrioritySelect(p)}
                  />
                  <span className="priority-indicator">
                    {isSelected && '✓'}
                  </span>
                  <span>{p}</span>
                </div>
              );
            })}
          </div>
          <ErrorMsg field="prioritas" />
        </div>

        {errors.submit && (
          <div style={{ background: '#FDF2F0', border: '1px solid #F6C4BF', color: '#9B2C20', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {errors.submit}
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
          <Send size={18} /> {isSubmitting ? 'Mengirim...' : 'Kirim Request Developer'}
        </button>

      </form>
    </div>
  );
}
