import React, { useState } from 'react';
import { CheckCircle, XCircle, ClipboardList, Loader2 } from 'lucide-react';
import useLearningStore from '../../store/learningStore';
import { lessonService } from '../../services/lesson.service';

const getQuestionText = (question) => question.question ?? question.body ?? '';

const LessonQuiz = ({ quiz }) => {
  const { currentLesson, applyProgressUpdate } = useLearningStore();
  const [results, setResults] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);

  if (!quiz?.questions?.length || !currentLesson) return null;

  const total = quiz.questions.length;
  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((r) => r.correct).length;
  const quizScore = currentLesson.quiz_score ?? 0;
  const passingScore = quiz.passing_score ?? 70;
  const passed = quizScore >= passingScore;

  const handleSelect = async (questionIndex, option) => {
    if (results[questionIndex] || loadingIndex !== null) return;

    setLoadingIndex(questionIndex);
    try {
      const data = await lessonService.submitQuizAnswer(currentLesson.id, questionIndex, option);
      setResults((prev) => ({
        ...prev,
        [questionIndex]: {
          selected: option,
          correct: data.correct,
          explanation: data.explanation,
          correct_answer: data.correct_answer,
        },
      }));
      applyProgressUpdate(currentLesson.id, data);
    } catch {
      setResults((prev) => ({
        ...prev,
        [questionIndex]: {
          selected: option,
          correct: false,
          explanation: 'Erreur de validation. Réessayez.',
        },
      }));
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-slate-100">
      <div className="flex items-start gap-2 mb-6">
        <ClipboardList className="text-primary-600 mt-0.5" size={20} />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{quiz.title}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {total} question{total > 1 ? 's' : ''} · Score requis : {passingScore}% · Score actuel : {quizScore}%
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {quiz.questions.map((question, index) => {
          const result = results[index];
          const isLoading = loadingIndex === index;

          return (
            <div key={index} className="rounded-xl border border-slate-200 p-5 bg-slate-50/60">
              <p className="font-medium text-slate-900 mb-4">
                {index + 1}. {getQuestionText(question)}
              </p>
              <div className="space-y-2">
                {question.options?.map((option) => {
                  const isSelected = result?.selected === option;
                  const isCorrect = result && option === (result.correct_answer || (result.correct ? option : null));
                  const showCorrect = result && !result.correct && result.correct_answer === option;
                  const isWrong = result && isSelected && !result.correct;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(index, option)}
                      disabled={Boolean(result) || isLoading}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center justify-between ${
                        result && (isCorrect || showCorrect)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : isWrong
                            ? 'border-red-400 bg-red-50 text-red-800'
                            : isSelected
                              ? 'border-primary-500 bg-primary-50 text-primary-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                      }`}
                    >
                      <span>{option}</span>
                      {isLoading && isSelected && <Loader2 size={16} className="animate-spin" />}
                      {result && (isCorrect || showCorrect) && <CheckCircle size={18} className="text-emerald-600" />}
                      {isWrong && <XCircle size={18} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
              {result && (
                <p
                  className={`mt-3 text-sm rounded-lg px-3 py-2 ${
                    result.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {result.correct ? '✓ Bonne réponse !' : '✗ '}
                  {result.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {answeredCount === total && (
        <div
          className={`mt-6 p-5 rounded-xl border ${
            passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
          }`}
        >
          <p className={`font-bold text-lg ${passed ? 'text-emerald-800' : 'text-amber-800'}`}>
            {passed ? 'Quiz réussi !' : 'Continuez à vous entraîner !'}
          </p>
          <p className={`text-sm mt-1 ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>
            Score : {quizScore}% ({correctCount}/{total} bonne{correctCount > 1 ? 's' : ''} réponse
            {correctCount > 1 ? 's' : ''})
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonQuiz;
