import React, { useState } from 'react';
import { Award, Download, PartyPopper } from 'lucide-react';
import { lessonService } from '../../services/lesson.service';

const CourseCertificateBanner = ({ certificate }) => {
  const [downloading, setDownloading] = useState(false);

  if (!certificate?.id) return null;

  const issuedDate = certificate.issued_at
    ? new Date(certificate.issued_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await lessonService.downloadCertificate(certificate.id);
    } catch {
      alert('Impossible de télécharger le certificat.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <PartyPopper className="text-emerald-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Félicitations ! Cours terminé</h3>
            <p className="text-sm text-emerald-800 mt-1">
              Vous avez complété <strong>{certificate.course_title}</strong>.
              {issuedDate && <> Certificat délivré le {issuedDate}.</>}
            </p>
            <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
              <Award size={14} />
              N° {certificate.certificate_number}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors shrink-0"
        >
          <Download size={18} />
          {downloading ? 'Téléchargement...' : 'Télécharger le certificat'}
        </button>
      </div>
    </div>
  );
};

export default CourseCertificateBanner;
