import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import RecommendationsCard from '../../components/RecommendationsCard';

const PlacementTest = () => {
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [result, setResult] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    const startTest = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await api.post('/placement-test/start');
        const data = response.data;
        const questions = Array.isArray(data?.questions) ? data.questions : [];
        if (questions.length === 0) {
          setLoadError('Aucune question disponible pour le moment. Réessayez plus tard.');
          setTestData(null);
          return;
        }
        setTestData({
          test_id: data.test_id,
          questions,
        });
      } catch (error) {
        console.error('Error starting test', error);
        setLoadError(
          error.response?.data?.message ||
            'Impossible de démarrer le test. Vérifiez que vous êtes connecté.'
        );
        setTestData(null);
      } finally {
        setIsLoading(false);
      }
    };
    startTest();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-gray-600">
        Chargement du test...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl mx-auto p-8 mt-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {loadError}
        </div>
        <Link to="/dashboard/student" className="text-primary-600 hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Test terminé !</h2>
        <RecommendationsCard recommendation={result.recommendation ?? result} />
        {recommendedCourses.length > 0 && (
          <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="font-bold text-gray-900 mb-3">Cours recommandés pour vous</h3>
            <ul className="space-y-2">
              {recommendedCourses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses/${course.slug ?? course.id}`}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    {course.title}
                  </Link>
                  <span className="text-xs text-gray-500 ml-2">({course.level})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/courses"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg text-center hover:bg-primary-700"
          >
            Voir le catalogue
          </Link>
          <Link
            to="/dashboard/student"
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg text-center hover:bg-gray-200"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-gray-500">
        Aucune donnée de test disponible.
      </div>
    );
  }

  const questions = Array.isArray(testData.questions) ? testData.questions : [];
  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const questionId = currentQuestion?.id;
  const rawOptions = currentQuestion?.options;
  const options = Array.isArray(rawOptions)
  ? rawOptions
  : (() => { try { return JSON.parse(rawOptions ?? '[]'); } catch { return []; } })();
  const handleSelectAnswer = (answer) => {
    if (!questionId) return;
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!testData?.test_id) return;
    setIsSubmitting(true);

    const formattedAnswers = Object.keys(answers).map((qId) => ({
      question_id: parseInt(qId, 10),
      selected_answer: answers[qId],
    }));

    try {
      const response = await api.post('/placement-test/submit', {
        test_id: testData.test_id,
        answers: formattedAnswers,
      });
      setResult(response.data);
      try {
        const recRes = await api.get('/recommendations');
        setRecommendedCourses(recRes.data?.data ?? []);
      } catch {
        setRecommendedCourses([]);
      }
    } catch (error) {
      console.error('Error submitting test', error);
      setLoadError(
        error.response?.data?.message || 'Erreur lors de la soumission du test.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-gray-500">
        Question introuvable.
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercent =
    questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg border">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Test de Positionnement</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-right text-sm text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-700 mb-6">
          {currentQuestion.question_text || 'Question'}
        </h3>
        <div className="space-y-3">
          {options.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune option pour cette question.</p>
          ) : (
            options.map((option, idx) => (
              <label
                key={idx}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[questionId] === option
                    ? 'bg-blue-50 border-blue-500'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${questionId}`}
                    value={option}
                    checked={answers[questionId] === option}
                    onChange={() => handleSelectAnswer(option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              Object.keys(answers).length !== questions.length ||
              !questionId
            }
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!questionId || !answers[questionId]}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default PlacementTest;
