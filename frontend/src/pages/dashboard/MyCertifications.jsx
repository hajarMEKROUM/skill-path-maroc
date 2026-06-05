import React, { useEffect, useState } from 'react';
import { Award, Download, Loader2 } from 'lucide-react';
import api from '../../services/api';

const statusStyles = {
  validated: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  refused: 'bg-red-100 text-red-700',
};

const MyCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/certifications');
        const data = response.data.data ?? response.data;
        setCertifications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les certifications.');
        setCertifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handleDownload = async (id) => {
    setDownloadingId(id);
    try {
      const response = await api.post(
        `/certifications/${id}/download`,
        {},
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certification-${id}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || 'Téléchargement impossible.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Award className="text-primary-600" size={22} />
        Mes certifications
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {certifications.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune certification pour le moment. Terminez un cours pour en obtenir une.</p>
      ) : (
        <ul className="space-y-3">
          {certifications.map((cert) => {
            const status = cert.status || 'validated';
            return (
              <li
                key={cert.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-gray-100 rounded-xl p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{cert.course_title || `Cours #${cert.course_id}`}</p>
                  <p className="text-xs text-gray-500 mt-1">N° {cert.certificate_number}</p>
                  {cert.issued_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Délivrée le {new Date(cert.issued_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[status] || statusStyles.pending}`}>
                    {status}
                  </span>
                  {status === 'validated' && (
                    <button
                      type="button"
                      onClick={() => handleDownload(cert.id)}
                      disabled={downloadingId === cert.id}
                      className="btn-primary flex items-center gap-2 py-1.5 px-3 text-sm disabled:opacity-50"
                    >
                      <Download size={14} />
                      {downloadingId === cert.id ? '...' : 'PDF'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyCertifications;
