import { useState, useEffect } from 'react';
import { questions } from './questions';
import { scoringTable } from './scoring';
import ResultPage from './components/ResultPage'; // 결과 페이지 컴포넌트

function App() {
  const [step, setStep] = useState('intro');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState({});

  const categories = [...new Set(questions.map(q => q.category))];
  const currentCategory = categories[categoryIndex];
  const currentQuestions = questions.filter(q => q.category === currentCategory);

  // 보기 배열만 섞기
  function shuffleOptions(options) {
    const arr = options.map((text, originalIndex) => ({ text, originalIndex }));
    return arr.sort(() => Math.random() - 0.5);
  }

  // 첫 로딩 시 각 문항별 보기 섞기
  useEffect(() => {
    const map = {};
    questions.forEach(q => {
      map[q.id] = shuffleOptions(q.options);
    });
    setShuffledOptionsMap(map);
  }, []);

  const handleStart = () => {
    if (name.trim() && position.trim()) {
      setStep('survey');
    } else {
      alert('이름과 직급을 입력해 주세요');
    }
  };

  const handleOptionChange = (questionId, originalIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: originalIndex
    }));
  };

  const handleNextCategory = () => {
    const unanswered = currentQuestions.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert('모든 문항에 응답해 주세요.');
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (categoryIndex + 1 < categories.length) {
      setCategoryIndex(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      {step === 'intro' && (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Pretendard Variable", sans-serif',
    textAlign: 'center',
    padding: '0 1rem',
    background: 'linear-gradient(135deg, #f9fafb, #e0f7fa)'
  }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠 GQ 셀프 테스트</h1>

    <input
      placeholder="이름"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{
        padding: '10px 15px',
        marginBottom: '10px',
        width: '250px',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc'
      }}
    />

    <input
      placeholder="직급"
      value={position}
      onChange={(e) => setPosition(e.target.value)}
      style={{
        padding: '10px 15px',
        marginBottom: '20px',
        width: '250px',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc'
      }}
    />

    <button
      onClick={handleStart}
      style={{
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background 0.3s'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#0059c1'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#0070f3'}
    >
      테스트 시작
    </button>
  </div>
)}


      {step === 'survey' && (
        <>
          <h2>📘 [{currentCategory}] 영역</h2>
          {currentQuestions.map((q) => (
            <div key={q.id} style={{ marginBottom: 30 }}>
              <p><strong>{q.id}. {q.text}</strong></p>
              {shuffledOptionsMap[q.id]?.map((opt, idx) => (
                <label key={idx} style={{ display: 'block', margin: '4px 0' }}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={answers[q.id] === opt.originalIndex}
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
        </>
      )}

      {step === 'result' && (
        <ResultPage answers={answers} name={name} position={position} />
      )}
    </div>
  );
}

export default App;
