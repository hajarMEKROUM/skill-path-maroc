import React, { useEffect, useState } from 'react';
import { Award, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const statusStyles = {
  validated: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  refused: 'bg-red-100 text-red-700',
};

const statusTranslation = {
  validated: 'validé',
  pending: 'en attente',
  refused: 'refusé',
};

const MyCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCerts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/certifications');
        if (mounted) {
          const data = response.data.data ?? response.data;
          setCertifications(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Impossible de charger les certifications.');
          setCertifications([]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchCerts();

    return () => {
      mounted = false;
    };
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Award className="text-purple-600" size={22} />
        Mes certifications
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <ul className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <li key={i} className="animate-pulse page-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-20" />
            </li>
          ))}
        </ul>
      ) : certifications.length === 0 ? (
        <div className="page-card text-center py-10">
          <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-900 font-medium text-lg">Vous n&apos;avez pas encore de certificat.</p>
          <p className="text-gray-500 mt-1 mb-4">Terminez une formation pour obtenir une certification officielle.</p>
          <Link to="/courses" className="btn-primary py-2 px-6 inline-block">
            Découvrir nos formations
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {certifications.map((cert) => {
            const status = cert.status || 'validated';
            return (
              <li
                key={cert.id}
                className="page-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
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
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[status] || statusStyles.pending}`}>
                    {statusTranslation[status] || status}
                  </span>
                  {status === 'validated' && (
                    <button
                      type="button"
                      onClick={() => handleDownload(cert.id)}
                      disabled={downloadingId === cert.id}
                      className="btn-primary flex items-center gap-2 py-1.5 px-3 text-sm disabled:opacity-50"
                    >
                      <Download size={14} />
                      {downloadingId === cert.id ? 'Téléchargement...' : 'Télécharger'}
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
