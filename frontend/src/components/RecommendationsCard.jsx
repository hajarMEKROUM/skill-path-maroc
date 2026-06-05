import React from 'react';

const RecommendationsCard = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Résultat de l'analyse IA</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Niveau évalué :</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {recommendation.niveau || recommendation.level}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Score global :</span>
          <span className="text-gray-800 font-bold">{recommendation.score}%</span>
        </div>
        <hr className="my-4" />
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-2">Recommandations pour vous :</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>
              <strong>Parcours conseillé :</strong>{' '}
              {recommendation.parcours_recommande || recommendation.recommended_path}
            </li>
            <li>
              <strong>Technologie à prioriser :</strong>{' '}
              {recommendation.langage_recommande || recommendation.recommended_language}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsCard;
