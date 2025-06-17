// src/pages/SurveyPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questions } from '../questions';

const TEXTS = {
  ko: {
    area: '영역',
    allRequired: '모든 문항에 응답해 주세요.',
    next: '다음 영역',
    result: '결과 보기'
  },
  en: {
    area: 'Section',
    allRequired: 'Please answer all questions.',
    next: 'Next Section',
    result: 'View Results'
  }
};

const SurveyPage = ({ name, position, setAnswers }) => {
  const { lang } = useParams(); // "ko" or "en"
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [answersState, setAnswersState] = useState({});
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState({});
  const navigate = useNavigate();

  // 언어별 질문 데이터
  const questionsList = questions[lang];
  const categories = [...new Set(questionsList.map(q => q.category))];
  const currentCategory = categories[categoryIndex];
  const currentQuestions = questionsList.filter(q => q.category === currentCategory);

  function shuffleOptions(options) {
    const arr = options.map((text, originalIndex) => ({ text, originalIndex }));
    return arr.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    const map = {};
    questionsList.forEach(q => {
      map[q.id] = shuffleOptions(q.options);
    });
    setShuffledOptionsMap(map);
    // eslint-disable-next-line
  }, [lang]);

  const handleOptionChange = (questionId, originalIndex) => {
    setAnswersState(prev => ({
      ...prev,
      [questionId]: originalIndex
    }));
  };

  const handleNextCategory = () => {
    const unanswered = currentQuestions.filter(q => answersState[q.id] === undefined);
    if (unanswered.length > 0) {
      alert(TEXTS[lang].allRequired);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (categoryIndex + 1 < categories.length) {
      setCategoryIndex(prev => prev + 1);
    } else {
      setAnswers(answersState);
      navigate(`/${lang}/result`);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2>📘 [{currentCategory}] {TEXTS[lang].area}</h2>
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
        {categoryIndex + 1 === categories.length ? TEXTS[lang].result : TEXTS[lang].next}
      </button>
    </div>
  );
};

export default SurveyPage;
