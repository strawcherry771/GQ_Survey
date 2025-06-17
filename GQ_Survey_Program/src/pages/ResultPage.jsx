// src/pages/ResultPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { calculateCategoryScores } from '../utils/scoreByCategory';
import { getSummaryMessage } from '../utils/gqSummary';
import { analyzeShapeAndGrowth } from '../utils/gqShape';
import { recommendations } from '../utils/gqRecommendations';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getGrowthStage } from '../utils/getGrowthStage';


Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

// 다국어 텍스트
const TEXTS = {
  ko: {
    resultTitle: '🎉 GQ 테스트 결과',
    totalScore: '총점',
    growthStage: '성장 단계',
    growthDesc: '설명',
    summary: '🧩 종합 해석 메시지',
    areaAnalysis: '📌 영역별 분석',
    shape: '📐 Shape 분석',
    recs: '💡 추천 활동',
    feedbackTitle: '🗣️ 이번 테스트는 어땠나요?',
    feedbackScore: '만족도를 1~5점으로 평가해주세요:',
    feedbackPlaceholder: '피드백이 있다면 적어주세요 (선택 사항)',
    feedbackSubmit: '피드백 제출',
    feedbackThanks: '피드백 감사합니다!',
    feedbackError: '저장 중 오류가 발생했습니다.',
    feedbackAlert: '먼저 설문이 저장되어야 합니다.',
    level: '레벨',
    percent: '%',
    score: '점수',
    area: '영역',
    personalFeedback: '개별 피드백',
    shapeType: '도형 유형',
    areaLabel: area => area.replace('GQ-', ''),
    description: '설명',
    submitDisabled: '만족도 점수를 선택해주세요.',
    tableHeaders: ['영역', '점수', '%', '레벨', '개별 피드백'],
    shapeDetail: ['도형 유형', '설명', '면적', '표준편차', '극값차', '성장 단계'],
    feedbackRequired: '피드백 점수를 선택해주세요.'
  },
  en: {
    resultTitle: '🎉 GQ Test Results',
    totalScore: 'Total Score',
    growthStage: 'Growth Stage',
    growthDesc: 'Description',
    summary: '🧩 Summary Message',
    areaAnalysis: '📌 Area Analysis',
    shape: '📐 Shape Analysis',
    recs: '💡 Recommendations',
    feedbackTitle: '🗣️ How was this test for you?',
    feedbackScore: 'Please rate your satisfaction (1-5):',
    feedbackPlaceholder: 'Any feedback? (Optional)',
    feedbackSubmit: 'Submit Feedback',
    feedbackThanks: 'Thank you for your feedback!',
    feedbackError: 'An error occurred while saving.',
    feedbackAlert: 'Survey must be saved first.',
    level: 'Level',
    percent: '%',
    score: 'Score',
    area: 'Area',
    personalFeedback: 'Personal Feedback',
    shapeType: 'Shape Type',
    areaLabel: area => area.replace('GQ-', ''),
    description: 'Description',
    submitDisabled: 'Please select a satisfaction score.',
    tableHeaders: ['Area', 'Score', '%', 'Level', 'Personal Feedback'],
    shapeDetail: ['Shape Type', 'Description', 'Area', 'Std Dev', 'Delta', 'Growth Stage'],
    feedbackRequired: 'Please select a satisfaction score.'
  }
};

const cellStyle = {
  border: '1px solid #e0e0e0',
  padding: '12px 10px',
  textAlign: 'center',
  fontSize: '0.95rem',
  verticalAlign: 'middle',
};
const headerStyle = {
  ...cellStyle,
  backgroundColor: '#f5f5f5',
  fontWeight: 'bold',
  color: '#333'
};
const rowStyle = {
  backgroundColor: '#ffffff'
};

// 점수 → 레벨 (I~IV)
function getLevel(score) {
  if (score >= 17) return 'IV';
  if (score >= 14) return 'III';
  if (score >= 11) return 'II';
  return 'I';
}

const personalFeedback = {
  'GQ-Drive': {
    I: ['내적 동기 활성화 필요—동료와 함께 동기를 나누는 경험 권장', 'Needs to activate intrinsic motivation—try sharing motivation with colleagues.'],
    II: ['기본적인 의지는 있으나 목표의식과 연결이 필요함', 'Basic will exists but needs stronger sense of purpose.'],
    III: ['높은 내적 동기—팀에 열정 전파 역할 기대', 'High intrinsic motivation—expected to inspire the team.'],
    IV: ['사명감 기반의 몰입과 동기 에너지 중심축 역할 가능', 'Mission-driven focus and key motivational anchor.'],
  },
  'GQ-Knowledge': {
    I: ['정책 언어 및 예산 구조 학습 필요—실전 예시 노출 추천', 'Needs to learn policy terms and budget structure—practice with real examples.'],
    II: ['RFP 구조·예산 편성 실전 사례 학습 필요', 'Needs case studies of RFP structure and budgeting.'],
    III: ['정책 문맥 해석 능력 양호—구조와 수요 해석 가능', 'Good at interpreting policy context and understanding structure and demand.'],
    IV: ['복합 정책 구조와 수요 연결에 통합적 해석 가능', 'Can integratively analyze complex policy structure and needs.'],
  },
  'GQ-Strategy': {
    I: ['문제 정의/차별화 전략 감각 개발 필요', 'Needs to develop problem definition/differentiation strategy.'],
    II: ['논리적 구성력은 있으나 전략적 감각 보완 필요', 'Logical structure is present, but needs strategic sense.'],
    III: ['전략 흐름 기획 가능—제안서 골격 설계 능력 보유', 'Can plan strategy flow and design proposal structure.'],
    IV: ['탁월한 메타-전략 감각—포트폴리오 설계에 참여', 'Excellent meta-strategic sense—can participate in portfolio design.'],
  },
  'GQ-Action': {
    I: ['실행 근력 보강—모의 제안서·코칭 세션 추천', 'Needs to strengthen execution—practice/mock proposals and coaching.'],
    II: ['추진력 있음—리소스 분배와 일정 설계 추가 필요', 'Has drive—needs to improve resource allocation and scheduling.'],
    III: ['기초 실행 구조 이해함—팀 내 실행 리더 가능', 'Understands execution basics—can lead team implementation.'],
    IV: ['실행 조율력 강함—복잡 프로젝트 운영 능력 우수', 'Strong at execution coordination—excellent in complex projects.'],
  },
};



const ResultPage = ({ answers, name, position }) => {
  const { lang } = useParams();
  const t = TEXTS[lang] || TEXTS.ko;
  const [docId, setDocId] = useState(null);
  const [feedbackScore, setFeedbackScore] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const scores = calculateCategoryScores(answers);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const growthStage = getGrowthStage(totalScore, lang);
  const shapeInfo = analyzeShapeAndGrowth(scores, lang);
  const gqType = getGQType(scores, lang);

  const data = {
    labels: Object.keys(scores),
    datasets: [
      {
        label: 'GQ Score',
        data: Object.values(scores),
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
      },
    ],
  };
  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 20,
        ticks: { stepSize: 5 },
        pointLabels: { font: { size: 14 } },
      },
    },
  };

  useEffect(() => {
    const saveInitialResponse = async () => {
      try {
        const docRef = await addDoc(collection(db, 'gq_responses'), {
          name,
          position,
          scores,
          totalScore,
          lang,
          createdAt: new Date().toISOString()
        });
        setDocId(docRef.id);
      } catch (error) {
        // 에러 로그
      }
    };
    saveInitialResponse();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>{t.resultTitle}</h2>
      <p>
        <strong>{name}</strong> / {position}
      </p>
      <p>
        {t.totalScore}: {totalScore} / 80
      </p>
      <p>
        <strong>{t.growthStage}:</strong> {growthStage.level}
      </p>
      <p style={{ fontStyle: 'italic', color: '#555' }}>{growthStage.message}</p>

      <Radar data={data} options={options} />

      <h3 style={{ marginTop: '2rem' }}>{t.summary}</h3>
      <div
        style={{
          backgroundColor: '#f8f8fc',
          padding: '1.2rem',
          borderRadius: '10px',
          border: '1px solid #ddd',
          lineHeight: 1.6
        }}
      >
        {getSummaryMessage(scores, lang)}
      </div>

      <h3 style={{ marginTop: '2rem' }}>{t.areaAnalysis}</h3>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <thead>
          <tr>
            {t.tableHeaders.map((h, i) => (
              <th style={headerStyle} key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(scores).map(([area, score]) => {
            const level = getLevel(score);
            const percent = Math.round((score / 20) * 100);
            const feedbackMsg = personalFeedback[area]?.[level][lang === 'en' ? 1 : 0];
            return (
              <tr key={area} style={rowStyle}>
                <td style={cellStyle}>{t.areaLabel(area)}</td>
                <td style={cellStyle}>{score}</td>
                <td style={cellStyle}>{percent} {t.percent}</td>
                <td style={cellStyle}>{t.level} {level}</td>
                <td style={{ ...cellStyle, textAlign: 'left' }}>{feedbackMsg}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 style={{ marginTop: '2rem' }}>{t.shape}</h3>
      <div
        style={{
          backgroundColor: '#fefefe',
          padding: '1.2rem',
          borderRadius: '10px',
          border: '1px solid #ddd',
          lineHeight: 1.6
        }}
      >
        <p>
          <strong>{t.shapeDetail[0]}:</strong> {shapeInfo.shape}
        </p>
        <p>
          <strong>{t.shapeDetail[1]}:</strong> {shapeInfo.shapeMessage}
        </p>
        <p>
          <strong>{t.shapeDetail[2]}:</strong> {shapeInfo.area} (standardized)
        </p>
        <p>
          <strong>{t.shapeDetail[3]}:</strong> {shapeInfo.sigma}, <strong>{t.shapeDetail[4]}:</strong> {shapeInfo.delta}
        </p>
        <p>
          <strong>{t.shapeDetail[5]}:</strong> {shapeInfo.growth}
        </p>
      </div>

      <h3 style={{ marginTop: '2rem' }}>{t.recs}</h3>
      {Object.entries(scores).map(([area, score]) => {
        const level = getLevel(score);
        const areaLabel = t.areaLabel(area);
        if (level === 'I' || level === 'II') {
          const recs = recommendations[area]?.[level];
          return (
            <div
              key={area}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: '#f9f9f9',
                border: '1px solid #eee',
                borderRadius: '8px'
              }}
            >
              <p>
                <strong>{areaLabel}</strong>{' '}
                {lang === 'en'
                  ? 'Recommendations for improvement:'
                  : '영역 보완을 위한 추천 활동:'}
              </p>
              <ul style={{ marginTop: '0.5rem' }}>
                {recs?.map((item, idx) => (
                  <li key={idx}>🔹 {item[lang]}</li>
                ))}
              </ul>
            </div>
          );
        } else {
          return null;
        }
      })}

      <div style={{ marginTop: '3rem' }}>
        <h3>{t.feedbackTitle}</h3>

        <p style={{ marginBottom: '0.5rem' }}>{t.feedbackScore}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => setFeedbackScore(score)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: feedbackScore === score ? '#0070f3' : '#eee',
                color: feedbackScore === score ? '#fff' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {score}
              {lang === 'en' ? '' : '점'}
            </button>
          ))}
        </div>

        <textarea
          placeholder={t.feedbackPlaceholder}
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          style={{
            width: '100%',
            height: '80px',
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}
        />

        <button
          onClick={async () => {
            if (!docId) {
              alert(t.feedbackAlert);
              return;
            }
            if (!feedbackScore) {
              alert(t.feedbackRequired);
              return;
            }
            try {
              const docRef = doc(db, 'gq_responses', docId);
              await updateDoc(docRef, {
                feedbackScore,
                feedbackText,
                feedbackAt: new Date().toISOString()
              });
              alert(t.feedbackThanks);
              setFeedbackScore(null);
              setFeedbackText('');
            } catch (error) {
              alert(t.feedbackError);
            }
          }}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          disabled={!feedbackScore}
        >
          {t.feedbackSubmit}
        </button>
      </div>
    </div>
  );
};

// 유형 분류 (다국어)
function getGQType(scores, lang) {
  if (scores['GQ-Strategy'] >= 18 && scores['GQ-Action'] >= 17) {
    return {
      name: lang === 'en'
        ? 'Strategic Implementer'
        : '전략적 실행가 (Strategic Implementer)',
      description:
        lang === 'en'
          ? 'Strong logical thinking, strategic judgment, execution, and motivation.'
          : '논리적 사고, 전략적 판단, 실행력과 내적 동기가 강한 유형입니다.',
    };
  }
  return {
    name: lang === 'en' ? 'GQ Growth Type' : 'GQ 성장형',
    description:
      lang === 'en'
        ? 'Has potential, needs further development in some areas.'
        : '잠재력이 있으며 일부 영역에서 심화가 필요합니다.',
  };
}

export default ResultPage;
