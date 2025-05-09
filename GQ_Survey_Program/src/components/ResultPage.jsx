import { calculateCategoryScores } from '../utils/scoreByCategory';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const ResultPage = ({ answers, name, position }) => {
  const scores = calculateCategoryScores(answers);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const gqType = getGQType(scores);

  const data = {
    labels: Object.keys(scores),
    datasets: [
      {
        label: 'GQ 스코어',
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

  return (
    <div style={{ padding: 20 }}>
      <h2>🎉 GQ 테스트 결과</h2>
      <p><strong>{name}</strong> / {position}</p>
      <p>총점: {totalScore} / 80</p>
      <p>등급: {'★'.repeat(Math.round(totalScore / 20)) + '☆'.repeat(5 - Math.round(totalScore / 20))}</p>

      <Radar data={data} options={options} />

      <h3>🧭 당신의 유형: {gqType.name}</h3>
      <p>{gqType.description}</p>

      <h4>📌 영역별 설명</h4>
      <ul>
        {Object.entries(scores).map(([area, score]) => (
          <li key={area}><strong>{area}</strong>: {score}/20 — {gqComments[area](score)}</li>
        ))}
      </ul>
    </div>
  );
};

// 유형 분류
function getGQType(scores) {
  if (scores['GQ-Strategy'] >= 18 && scores['GQ-Action'] >= 17) {
    return {
      name: '전략적 실행가 (Strategic Implementer)',
      description: '논리적 사고, 전략적 판단, 실행력과 내적 동기가 강한 유형입니다.',
    };
  }
  return {
    name: 'GQ 성장형',
    description: '잠재력이 있으며 일부 영역에서 심화가 필요합니다.',
  };
}

// 각 영역 점수에 따른 코멘트
const gqComments = {
  'GQ-Drive': (s) =>
    s >= 17 ? '내적 동기가 강하고 도전적입니다.'
    : s >= 14 ? '기본적인 열의는 있으나 지속성 보완 필요'
    : '외부 동기 중심으로 작동할 수 있습니다.',
  'GQ-Knowledge': (s) =>
    s >= 17 ? '정책·RFP 구조에 대한 이해도가 높습니다.'
    : s >= 14 ? '기본 인식은 있으나 맥락적 해석력이 보완 필요'
    : '기초 개념에 대한 재정리가 필요할 수 있습니다.',
  'GQ-Strategy': (s) =>
    s >= 17 ? '전략적 사고가 매우 뛰어납니다.'
    : s >= 14 ? '구조 파악력은 있으나 전략 설계 보완 필요'
    : '문제 재정의나 차별화 전략에서 약점을 보입니다.',
  'GQ-Action': (s) =>
    s >= 17 ? '실행력과 적응력이 우수합니다.'
    : s >= 14 ? '기본 추진력은 있지만 계획-실행 간 간극 존재'
    : '현장 적용력과 피드백 반영에 어려움이 있을 수 있습니다.',
};

export default ResultPage;
