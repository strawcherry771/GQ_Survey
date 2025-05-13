// src/pages/IntroPage.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.4,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: 1.6 }}>

      <motion.h1
        custom={0}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        당신의 제안 역량은 어디에 있을까요?
      </motion.h1>

      <motion.p custom={1} variants={fadeInUp} initial="hidden" animate="visible">
        제안서 작성의 본질은 단지 논리를 구성하는 것이 아니라,<br />
        <strong>문제에 대한 통찰, 동기, 실행력까지 종합적으로 설계하는 일</strong>입니다.
      </motion.p>

      <motion.p custom={2} variants={fadeInUp} initial="hidden" animate="visible" style={{ marginTop: '1rem' }}>
        본 테스트는 전략적 제안 역량을 4가지 영역으로 진단합니다:<br />
        <strong>Drive (동기) / Knowledge (지식 기반) / Strategy (전략 감각) / Action (실행력)</strong>
      </motion.p>

      <motion.p custom={3} variants={fadeInUp} initial="hidden" animate="visible">
        실전 기반 문항을 통해 사고 패턴을 분석하고,<br />
        <strong>개별 피드백 + 종합 해석 + 성장 추천 활동</strong>까지 안내해 드립니다.
      </motion.p>

      <motion.blockquote
        custom={4}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1rem',
          borderLeft: '5px solid #ccc',
          margin: '2rem 0',
          fontStyle: 'italic'
        }}>
        지금, 당신은 문제를 해결하는 사람인가요?<br />
        아니면 문제를 정의하는 사람인가요?
      </motion.blockquote>

      <motion.button
        custom={5}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        onClick={() => navigate('/start')}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
        계속하기 →
      </motion.button>

      <motion.p custom={1} variants={fadeInUp} initial="hidden" animate="visible"
       style={{
        marginTop: '2rem',
        fontSize: '0.85rem',
        color: '#888',
        fontStyle: 'italic'
        }}>
        ※ 본 테스트는 현재 <strong>알파 버전</strong>이며, 결과는 테스트 목적으로 제공됩니다.
      </motion.p>

    </div>
  );
};

export default IntroPage;
