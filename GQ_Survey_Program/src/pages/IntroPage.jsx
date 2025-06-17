import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const TEXTS = {
  ko: {
    lang: '한국어',
    guide: 'GQ (Grantsmanship Quotients)',
    title: '당신의 제안 역량은 어디에 있을까요?',
    description1: '제안서 작성의 본질은 단지 논리를 구성하는 것이 아니라,',
    description2: '문제에 대한 통찰, 동기, 실행력까지 종합적으로 설계하는 일입니다.',
    description3: '본 테스트는 전략적 제안 역량을 4가지 영역으로 진단합니다: Drive (동기) / Knowledge (지식 기반) / Strategy (전략 감각) / Action (실행력)',
    description4: '실전 기반 문항을 통해 사고 패턴을 분석하고, 개별 피드백 + 종합 해석 + 성장 추천 활동까지 안내해 드립니다.',
    quote: '지금, 당신은 문제를 해결하는 사람인가요?\n아니면 문제를 정의하는 사람인가요?',
    start: '한국어로 시작 →',
    notice: '※ 본 테스트는 현재 알파 버전이며, 결과는 테스트 목적으로 제공됩니다.'
  },
  en: {
    lang: 'English',
    guide: 'GQ (Grantsmanship Quotients)',
    title: 'Where does your proposal competency stand?',
    description1: "The essence of proposal writing is not just constructing logic,",
    description2: "but holistically designing insight, motivation, and execution.",
    description3: "This test diagnoses strategic proposal competency in four areas: \n Motivation / Knowledge / Strategy / Action",
    description4: "We analyze your thinking patterns through practical questions and provide personalized feedback, a summary, and growth recommendations.",
    quote: "Now, are you a problem solver?\nOr are you a problem definer?",
    start: 'Start in English →',
    notice: '※ This test is currently in alpha. Results are for testing purposes only.'
  }
};

const LANGS = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' }
];

const IntroPage = () => {
  const [lang, setLang] = useState('ko');
  const navigate = useNavigate();
  const t = TEXTS[lang];

  return (
    <div style={{
      padding: '2rem', maxWidth: '720px', margin: '0 auto',
      fontFamily: 'sans-serif', lineHeight: 1.6, minHeight: '100vh'
    }}>
      {/* 상단 고스트 버튼 */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: '1rem',
        marginBottom: '2rem'
      }}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: lang === l.code ? 700 : 400,
              color: lang === l.code ? '#007bff' : '#aaa',
              borderBottom: lang === l.code ? '2px solid #007bff' : '2px solid transparent',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '0.5rem 0.7rem',
              transition: 'color 0.2s'
            }}
            aria-current={lang === l.code ? "page" : undefined}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* 가장 큰 제목 */}
      <motion.h1
        custom={0}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center', letterSpacing: '-0.5px' }}
      >
        {t.guide}
      </motion.h1>

      {/* 도입 질문 - 본문 크기 */}
      <motion.p
        custom={1}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{ fontSize: '1.35rem', marginBottom: '1.2rem', color: '#223', fontWeight: 600, textAlign: 'center' }}
      >
        {t.title}
      </motion.p>

      <motion.p custom={2} variants={fadeInUp} initial="hidden" animate="visible">
        {t.description1}<br />
        <strong>{t.description2}</strong>
      </motion.p>

      <motion.p custom={3} variants={fadeInUp} initial="hidden" animate="visible" style={{ marginTop: '1rem' }}>
        {t.description3}
      </motion.p>

      <motion.p custom={4} variants={fadeInUp} initial="hidden" animate="visible">
        {t.description4}
      </motion.p>

      <motion.blockquote
        custom={5}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1rem',
          borderLeft: '5px solid #ccc',
          margin: '2rem 0',
          fontStyle: 'italic',
          whiteSpace: 'pre-line'
        }}>
        {t.quote}
      </motion.blockquote>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <motion.button
          custom={6}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          onClick={() => navigate(`/${lang}/start`)}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: lang === 'ko' ? '#007bff' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
          {t.start}
        </motion.button>
      </div>

      <motion.p
        custom={7}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{
          marginTop: '1rem',
          fontSize: '0.85rem',
          color: '#888',
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
        {t.notice}
      </motion.p>
    </div>
  );
};

export default IntroPage;
