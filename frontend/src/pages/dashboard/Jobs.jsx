import React, { useState } from 'react';
import { Briefcase, Building2, Tag } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import ErrorState from '../../components/shared/ErrorState';
import SkeletonCard from '../../components/shared/SkeletonCard';

const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const budget =
    job.budget_min != null && job.budget_max != null
      ? `${job.budget_min} – ${job.budget_max} MAD`
      : job.budget_min != null
        ? `À partir de ${job.budget_min} MAD`
        : null;

  return (
    <div className="page-card">
      <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
        {job.client?.name && (
          <span className="flex items-center gap-1">
            <Building2 size={16} className="text-purple-600" />
            {job.client.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Tag size={16} className="text-purple-600" />
          Freelance
        </span>
        {budget && (
          <span className="text-purple-600 font-medium">{budget}</span>
        )}
      </div>
      {expanded && job.description && (
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">{job.description}</p>
      )}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="btn-secondary mt-4 text-sm"
      >
        {expanded ? 'Masquer' : 'Voir l\'offre'}
      </button>
    </div>
  );
};

export default function Jobs() {
  const { jobs, loading, error, refetch } = useJobs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Briefcase className="text-purple-600" />
          Espace Freelance
        </h1>
        <p className="text-gray-500 mt-1">Découvrez les missions freelance disponibles.</p>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="page-card text-center py-10">
          <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-700 font-medium mb-2">Aucune offre disponible pour le moment.</p>
          <p className="text-gray-500 text-sm">Revenez bientôt pour découvrir de nouvelles missions.</p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
