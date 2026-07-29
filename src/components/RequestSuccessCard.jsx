import React, { useState } from 'react';
import { CheckCircle2, ExternalLink, PlusCircle, Copy, Check, Clock, User, Phone, Mail, FileText, Info } from 'lucide-react';

export default function RequestSuccessCard({ requestData, onNewRequest }) {
  const [copied, setCopied] = useState(false);

  if (!requestData) return null;

  const handleCopy = () => {
    const text = `*REQUEST DEVELOPER #${requestData.id}*
----------------------------------------
*Nama Pengaju:* ${requestData.namaPengaju}
*No. WhatsApp:* ${requestData.noWhatsapp}
*Email:* ${requestData.email}
*Nama Fitur:* ${requestData.namaFitur}
*Prioritas:* ${requestData.prioritas}
*Status:* Menunggu Review Developer
*Waktu:* ${requestData.tanggal || new Date().toLocaleString('id-ID')}

*Deskripsi:*
${requestData.deskripsiRequest}
----------------------------------------
Pantau Status: https://admin.smlone.id`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToPortal = () => {
    window.location.href = 'https://admin.smlone.id';
  };

  return (
    <div className="status-card-wrapper">
      <div className="form-card status-card-inner">
        
        {/* Animated Check Icon */}
        <div className="status-icon-circle">
          <CheckCircle2 size={40} />
        </div>

        <h2 className="status-heading">
          Request Berhasil Dikirim!
        </h2>
        <p className="status-subheading">
          Pengajuan fitur Anda telah resmi diterima oleh tim developer. Berikut adalah rincian tiket pengajuan Anda:
        </p>

        {/* Detailed Ticket Card */}
        <div className="ticket-card-box">
          
          {/* Top Bar ID & Priority */}
          <div className="ticket-top-bar">
            <div>
              <span className="ticket-label">ID TIKET REQUEST</span>
              <div className="ticket-id-value">
                #{requestData.id || 'REQ-839201'}
              </div>
            </div>

            <div className="ticket-priority-wrap">
              <span className={`badge-priority ${requestData.prioritas ? requestData.prioritas.toLowerCase() : 'medium'}`}>
                Prioritas: {requestData.prioritas || 'Medium'}
              </span>
            </div>
          </div>

          {/* Feature Name */}
          <div className="ticket-section">
            <div className="ticket-label">NAMA FITUR</div>
            <div className="ticket-feature-title">
              {requestData.namaFitur}
            </div>
          </div>

          {/* Status Badge */}
          <div className="ticket-status-pill">
            <Clock size={16} className="status-clock-icon" />
            <span>Status: <strong>Menunggu Review Developer</strong></span>
          </div>

          {/* Requester Info Grid */}
          <div className="ticket-info-grid">
            <div className="info-cell">
              <div className="cell-label">
                <User size={13} /> Nama Pengaju
              </div>
              <div className="cell-value bold">{requestData.namaPengaju}</div>
            </div>

            <div className="info-cell">
              <div className="cell-label">
                <Phone size={13} /> WhatsApp
              </div>
              <div className="cell-value break-word">{requestData.noWhatsapp}</div>
            </div>

            <div className="info-cell full-width">
              <div className="cell-label">
                <Mail size={13} /> Email Contact
              </div>
              <div className="cell-value break-word">{requestData.email}</div>
            </div>
          </div>

          {/* Description */}
          <div className="ticket-section">
            <div className="ticket-label flex-align">
              <FileText size={13} /> DESKRIPSI REQUEST
            </div>
            <div className="ticket-desc-box">
              {requestData.deskripsiRequest}
            </div>
          </div>

        </div>

        {/* Action Buttons Grid */}
        <div className="status-actions-container">
          
          {/* Main Portal Button */}
          <button
            onClick={handleGoToPortal}
            className="btn-submit btn-portal-primary"
          >
            <span>Lihat Status di Portal (admin.smlone.id)</span>
            <ExternalLink size={18} />
          </button>

          {/* Secondary Buttons Row */}
          <div className="secondary-btns-grid">
            <button
              onClick={handleCopy}
              className="btn-action btn-secondary-touch"
            >
              {copied ? (
                <>
                  <Check size={16} style={{ color: '#27AE60' }} /> Tersalin!
                </>
              ) : (
                <>
                  <Copy size={16} /> Salin Ringkasan
                </>
              )}
            </button>

            <button
              onClick={onNewRequest}
              className="btn-action btn-secondary-touch"
            >
              <PlusCircle size={16} /> Buat Request Baru
            </button>
          </div>

        </div>

        {/* Bottom Note Banner */}
        <div className="status-notice-box">
          <Info size={20} className="notice-icon" />
          <div className="notice-content">
            <strong>Informasi Pengerjaan Website:</strong>
            <p>
              Website akan siap <strong>1-7 hari</strong> ke depan tergantung tingkat kesulitan. Silakan dipantau di{' '}
              <a href="https://admin.smlone.id" target="_blank" rel="noreferrer" className="notice-link">
                admin.smlone.id
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
