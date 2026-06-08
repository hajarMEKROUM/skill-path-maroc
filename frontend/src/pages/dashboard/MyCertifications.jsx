import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, Loader2 } from 'lucide-react';
import { useCertifications } from '../../hooks/useDashboard';
import { dashboardService } from '../../services/dashboard.service';
import EmptyState from '../../components/dashboard/EmptyState';

const statusStyles = {
  validated: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  refused: 'bg-red-100 text-red-700',
};

const MyCertifications = ({ compact = false }) => {
  const { certifications, isLoading, error } = useCertifications();
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (id) => {
    setDownloadingId(id);
    try {
      const response = await dashboardService.downloadCertification(id);
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'text/html',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certification-${id}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || 'Download failed.');
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
        {compact ? 'My Certifications' : 'Certifications'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {certifications.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Start learning to earn your first certificate. Complete a course to unlock your achievement."
          action={
            <Link to="/courses" className="btn-primary px-4 py-2 text-sm">
              Browse Courses
            </Link>
          }
        />
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
                  <p className="font-medium text-gray-900">
                    {cert.course_title || `Course #${cert.course_id}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">No. {cert.certificate_number}</p>
                  {cert.issued_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Issued on {new Date(cert.issued_at).toLocaleDateString('en-US')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      statusStyles[status] || statusStyles.pending
                    }`}
                  >
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
