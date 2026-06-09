import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, ClipboardList } from 'lucide-react';
import useLearningStore from '../../store/learningStore';

const getQuestionText = (question) => question.question ?? question.body ?? '';
const getAnswer = (question) => question.answer ?? question.correct_answer ?? '';

const LessonQuiz = ({ quiz }) => {
  const { currentLesson, markLessonComplete } = useLearningStore();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz?.questions?.length) return null;

  const total = quiz.questions.length;
  const correctCount = quiz.questions.filter(
    (q, index) => answers[index] === getAnswer(q)
  ).length;
  const score = Math.round((correctCount / total) * 100);
  const passingScore = quiz.passing_score ?? 70;
  const passed = score >= passingScore;

  const handleSelect = (questionIndex, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < total) return;
    setSubmitted(true);
    if (passed && currentLesson) {
      await markLessonComplete(currentLesson.id);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="mt-10 pt-8 border-t border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-2">
          <ClipboardList className="text-primary-600 mt-0.5" size={20} />
          <div>
            <h3 className="text-lg font-bold text-slate-900">{quiz.title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {total} question{total > 1 ? 's' : ''} · Score requis : {passingScore}%
            </p>
          </div>
        </div>
        {submitted && (
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <RotateCcw size={16} />
            Réessayer
          </button>
        )}
      </div>

      <div className="space-y-5">
        {quiz.questions.map((question, index) => {
          const selected = answers[index];
          const correct = getAnswer(question);

          return (
            <div key={index} className="rounded-xl border border-slate-200 p-5 bg-slate-50/60">
              <p className="font-medium text-slate-900 mb-4">
                {index + 1}. {getQuestionText(question)}
              </p>
              <div className="space-y-2">
                {question.options?.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = submitted && option === correct;
                  const isWrong = submitted && isSelected && option !== correct;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(index, option)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center justify-between ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : isWrong
                            ? 'border-red-400 bg-red-50 text-red-800'
                            : isSelected
                              ? 'border-primary-500 bg-primary-50 text-primary-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                      }`}
                    >
                      <span>{option}</span>
                      {isCorrect && <CheckCircle size={18} className="text-emerald-600" />}
                      {isWrong && <XCircle size={18} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < total}
          className="mt-6 w-full sm:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Valider le quiz
        </button>
      ) : (
        <div
          className={`mt-6 p-5 rounded-xl border ${
            passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
          }`}
        >
          <p className={`font-bold text-lg ${passed ? 'text-emerald-800' : 'text-amber-800'}`}>
            {passed ? 'Quiz réussi !' : 'Continuez à vous entraîner !'}
          </p>
          <p className={`text-sm mt-1 ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>
            Votre score : {score}% ({correctCount}/{total} bonne
            {correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''})
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonQuiz;
