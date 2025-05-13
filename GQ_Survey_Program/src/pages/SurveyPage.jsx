// src/pages/SurveyPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../questions';

const SurveyPage = ({ name, position, setAnswers }) => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [answersState, setAnswersState] = useState({});
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState({});
  const navigate = useNavigate();

  const categories = [...new Set(questions.map(q => q.category))];
  const currentCategory = categories[categoryIndex];
  const currentQuestions = questions.filter(q => q.category === currentCategory);

  function shuffleOptions(options) {
    const arr = options.map((text, originalIndex) => ({ text, originalIndex }));
    return arr.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    const map = {};
    questions.forEach(q => {
      map[q.id] = shuffleOptions(q.options);
    });
    setShuffledOptionsMap(map);
  }, []);

  const handleOptionChange = (questionId, originalIndex) => {
    setAnswersState(prev => ({
      ...prev,
      [questionId]: originalIndex
    }));
  };

  const handleNextCategory = () => {
    const unanswered = currentQuestions.filter(q => answersState[q.id] === undefined);
    if (unanswered.length > 0) {
      alert('모든 문항에 응답해 주세요.');
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (categoryIndex + 1 < categories.length) {
      setCategoryIndex(prev => prev + 1);
    } else {
      setAnswers(answersState);
      navigate('/result');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2>📘 [{currentCategory}] 영역</h2>
      {currentQuestions.map((q) => (
        <div key={q.id} style={{ marginBottom: 30 }}>
          <p><strong>{q.id}. {q.text}</strong></p>
          {shuffledOptionsMap[q.id]?.map((opt, idx) => (
            <label key={idx} style={{ display: 'block', margin: '4px 0' }}>
              <input
                type="radio"
                name={`question-${q.id}`}
                checked={answersState[q.id] === opt.originalIndex}
                onChange={() => handleOptionChange(q.id, opt.originalIndex)}
              />
              {' '}{opt.text}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleNextCategory}>
        {categoryIndex + 1 === categories.length ? '결과 보기' : '다음 영역'}
      </button>
    </div>
  );
};

export default SurveyPage;
