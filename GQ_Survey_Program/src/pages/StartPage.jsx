import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const StartPage = ({ name, setName, position, setPosition }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleStart = () => {
    if (name.trim() && position.trim()) {
      navigate('/test'); // 상태가 아닌 라우터 전환
    } else {
      alert('이름과 직급을 입력해 주세요');
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
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🧠 GQ 셀프 테스트</h1>
        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>
          지금 나의 제안 역량은 어떤 모습일까요? <br />
          전략, 실행, 지식, 동기 관점에서 확인해보세요.
        </p>

        <input
          placeholder="이름"
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
          placeholder="직급 (예: 팀장, 연구원 등)"
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
          🚀 테스트 시작
        </button>
      </div>
    </div>
  );
};

export default StartPage;