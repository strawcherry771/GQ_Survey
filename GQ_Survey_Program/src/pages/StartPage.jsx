import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

const TEXTS = {
  ko: {
    title: '🧠 GQ 셀프 테스트',
    subtitle: '지금 나의 제안 역량은 어떤 모습일까요? \n전략, 실행, 지식, 동기 관점에서 확인해보세요.',
    namePlaceholder: '이름',
    positionPlaceholder: '직급 (예: 팀장, 연구원 등)',
    button: '🚀 테스트 시작',
    alert: '이름과 직급을 입력해 주세요'
  },
  en: {
    title: '🧠 GQ Self Test',
    subtitle: 'What does your proposal competency look like? \nCheck your level in strategy, action, knowledge, and drive.',
    namePlaceholder: 'Name',
    positionPlaceholder: 'Position (e.g., Team Lead, Researcher, etc.)',
    button: '🚀 Start Test',
    alert: 'Please enter your name and position.'
  }
};

const StartPage = ({ name, setName, position, setPosition }) => {
  const { lang } = useParams(); // "ko" or "en"
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const t = TEXTS[lang] || TEXTS.ko; // fallback to ko

  const handleStart = () => {
    if (name.trim() && position.trim()) {
      navigate(`/${lang}/test`);
    } else {
      alert(t.alert);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #eee',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.title}</h1>
        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
          {t.subtitle}
        </p>

        <input
          placeholder={t.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <input
          placeholder={t.positionPlaceholder}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />

        <button
          onClick={handleStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: hovered ? '#0059c1' : '#0070f3',
            color: 'white',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
        >
          {t.button}
        </button>
      </div>
    </div>
  );
};

export default StartPage;
