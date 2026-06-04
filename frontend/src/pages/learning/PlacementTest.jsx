import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RecommendationsCard from '../../components/RecommendationsCard';

const PlacementTest = () => {
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const startTest = async () => {
      try {
        const response = await api.post('/placement-test/start');
        setTestData(response.data);
      } catch (error) {
        console.error("Error starting test", error);
      }
    };
    startTest();
  }, []);

  if (!testData && !result) {
    return <div className="p-8 text-center">Chargement du test...</div>;
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Test terminé !</h2>
        <RecommendationsCard recommendation={result.recommendation} />
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          >
            Aller au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const questions = testData.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
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
    setIsSubmitting(true);
    
    // Format answers array
    const formattedAnswers = Object.keys(answers).map(qId => ({
      question_id: parseInt(qId),
      selected_answer: answers[qId]
    }));

    try {
      const response = await api.post('/placement-test/submit', {
        test_id: testData.test_id,
        answers: formattedAnswers
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting test", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg border">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Test de Positionnement</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-700 mb-6">{currentQuestion?.question_text}</h3>
        <div className="space-y-3">
          {currentQuestion?.options.map((option, idx) => (
            <label 
              key={idx} 
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${answers[currentQuestion.id] === option ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name={`question-${currentQuestion.id}`} 
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleSelectAnswer(option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        
        {isLastQuestion ? (
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || Object.keys(answers).length !== questions.length}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? 'Traitement par IA...' : 'Soumettre'}
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            disabled={!answers[currentQuestion.id]}
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
