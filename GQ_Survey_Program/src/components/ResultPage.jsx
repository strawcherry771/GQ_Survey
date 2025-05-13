import { calculateCategoryScores } from '../utils/scoreByCategory';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { getSummaryMessage } from '../utils/gqSummary';
import { analyzeShapeAndGrowth } from '../utils/gqShape';
import { recommendations } from '../utils/gqRecommendations';




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
  
  // 영역별 레벨 메시지
  const levelDescriptions = {
    'GQ-Drive': {
      I: '외부 자극에 반응하는 경향이 강하며, 내적 동기의 강화가 필요합니다.',
      II: '기본적인 의지는 있으나, 동기의 지속성과 맥락 연결은 약합니다.',
      III: '내적 동기와 책임감이 적절히 작동하고 있습니다.',
      IV: '강력한 사명감과 몰입 에너지가 지속적으로 관찰됩니다.',
    },
    'GQ-Knowledge': {
      I: '정책적 언어와 구조 인식에 대한 기초가 약한 편입니다.',
      II: '실무 이해는 있으나, 제도적 맥락 해석에는 보완이 필요합니다.',
      III: '정책 구조와 실제 맥락을 연결하여 인식하는 역량이 있습니다.',
      IV: '구조, 제도, 사용자 관점까지 아우르는 통찰력이 나타납니다.',
    },
    'GQ-Strategy': {
      I: '문제의 재정의와 전략적 감각이 미흡한 편입니다.',
      II: '전략 설계의 기초는 있으나 구조적 설득력은 다듬을 필요가 있습니다.',
      III: '전략적 구성력과 판단력이 안정적으로 나타납니다.',
      IV: '이슈에 대한 고차원적 재구성과 설계 능력이 뛰어납니다.',
    },
    'GQ-Action': {
      I: '실행의 흐름과 조직 내 조율에서 어려움이 있을 수 있습니다.',
      II: '기본 추진력은 있으나 전략-실행 간 간극이 존재합니다.',
      III: '일정, 협업, 피드백 반영 등 기본 실행 역량이 안정적으로 확보되어 있습니다.',
      IV: '복잡한 실행과제도 유연하게 운영 가능한 고도 실행형입니다.',
    },
  };
  
  const personalFeedback = {
    'GQ-Drive': {
      I: '내적 동기 활성화 필요—동료와 함께 동기를 나누는 경험 권장',
      II: '기본적인 의지는 있으나 목표의식과 연결이 필요함',
      III: '높은 내적 동기—팀에 열정 전파 역할 기대',
      IV: '사명감 기반의 몰입과 동기 에너지 중심축 역할 가능',
    },
    'GQ-Knowledge': {
      I: '정책 언어 및 예산 구조 학습 필요—실전 예시 노출 추천',
      II: 'RFP 구조·예산 편성 실전 사례 학습 필요',
      III: '정책 문맥 해석 능력 양호—구조와 수요 해석 가능',
      IV: '복합 정책 구조와 수요 연결에 통합적 해석 가능',
    },
    'GQ-Strategy': {
      I: '문제 정의/차별화 전략 감각 개발 필요',
      II: '논리적 구성력은 있으나 전략적 감각 보완 필요',
      III: '전략 흐름 기획 가능—제안서 골격 설계 능력 보유',
      IV: '탁월한 메타-전략 감각—포트폴리오 설계에 참여',
    },
    'GQ-Action': {
      I: '실행 근력 보강—모의 제안서·코칭 세션 추천',
      II: '추진력 있음—리소스 분배와 일정 설계 추가 필요',
      III: '기초 실행 구조 이해함—팀 내 실행 리더 가능',
      IV: '실행 조율력 강함—복잡 프로젝트 운영 능력 우수',
    },
  };
  


Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export function getGrowthStage(totalScore) {
    if (totalScore >= 70) {
      return { level: '전문가 단계', message: '고차원적 전략사고와 실행력이 모두 뛰어난 고도화된 상태입니다.' };
    } else if (totalScore >= 55) {
      return { level: '숙련 단계', message: '전략/실행 기반이 균형 있게 갖추어진 단계입니다.' };
    } else if (totalScore >= 40) {
      return { level: '성장 단계', message: '일부 역량이 드러나며, 발전 여지가 큽니다.' };
    } else {
      return { level: '기초 단계', message: '아직 전략적 사고의 틀을 익히는 초기 단계입니다.' };
    }
  }
  

const ResultPage = ({ answers, name, position }) => {
  const scores = calculateCategoryScores(answers);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const growthStage = getGrowthStage(totalScore);
  const shapeInfo = analyzeShapeAndGrowth(scores);
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
      <p><strong>성장 단계:</strong> {growthStage.level}</p>
      <p style={{ fontStyle: 'italic', color: '#555' }}>{growthStage.message}</p>


      <Radar data={data} options={options} />


      <h3 style={{ marginTop: '2rem' }}>🧩 종합 해석 메시지</h3>
      <div style={{
        backgroundColor: '#f8f8fc',
        padding: '1.2rem',
        borderRadius: '10px',
        border: '1px solid #ddd',
        lineHeight: 1.6
      }}>
        {getSummaryMessage(scores)}
      </div>

      

      <h3 style={{ marginTop: '2rem' }}>📌 영역별 분석</h3>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
            <tr>
                <th style={headerStyle}>영역</th>
                <th style={headerStyle}>점수</th>
                <th style={headerStyle}>%</th>
                <th style={headerStyle}>레벨</th>
                <th style={headerStyle}>개별 피드백</th>
            </tr>
        </thead>
      <tbody>
        {Object.entries(scores).map(([area, score]) => {
            const level = getLevel(score);
            const percent = Math.round((score / 20) * 100);
            const feedbackMsg = personalFeedback[area]?.[level];

            return (
                <tr key={area} style={rowStyle}>
                    <td style={cellStyle}>{area.replace('GQ-', '')}</td>
                    <td style={cellStyle}>{score}</td>
                    <td style={cellStyle}>{percent} %</td>
                    <td style={cellStyle}>Level {level}</td>
                    <td style={{ ...cellStyle, textAlign: 'left' }}>{feedbackMsg}</td>
                </tr>
            );
        })}
      </tbody>
    </table>


    <h3 style={{ marginTop: '2rem' }}>📐 Shape 분석</h3>
    <div style={{
        backgroundColor: '#fefefe',
        padding: '1.2rem',
        borderRadius: '10px',
        border: '1px solid #ddd',
        lineHeight: 1.6
    }}>
    <p><strong>도형 유형:</strong> {shapeInfo.shape}</p>
    <p><strong>설명:</strong> {shapeInfo.shapeMessage}</p>
    <p><strong>면적:</strong> {shapeInfo.area} (표준화)</p>
    <p><strong>표준편차:</strong> {shapeInfo.sigma}, <strong>극값차:</strong> {shapeInfo.delta}</p>
    <p><strong>성장 단계:</strong> {shapeInfo.growth}</p>
    </div>

    <h3 style={{ marginTop: '2rem' }}>💡 추천 활동</h3>
{Object.entries(scores).map(([area, score]) => {
  const level = getLevel(score);
  const areaLabel = area.replace('GQ-', '');

  if (level === 'I' || level === 'II') {
    const recs = recommendations[area]?.[level];
    return (
      <div key={area} style={{ marginBottom: '1rem', padding: '1rem', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px' }}>
        <p><strong>{areaLabel}</strong> 영역 보완을 위한 추천 활동:</p>
        <ul style={{ marginTop: '0.5rem' }}>
          {recs?.map((item, idx) => (
            <li key={idx}>🔹 {item}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return null;
  }
})}



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
