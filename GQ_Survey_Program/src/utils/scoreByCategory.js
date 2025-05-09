import { questions } from '../questions';
import { scoringTable } from '../scoring';

// 영역별 점수 계산 함수
export function calculateCategoryScores(answers) {
  const categoryScores = {
    'GQ-Drive': 0,
    'GQ-Knowledge': 0,
    'GQ-Strategy': 0,
    'GQ-Action': 0
  };

  const categoryMap = {
    '동기': 'GQ-Drive',
    '지식': 'GQ-Knowledge',
    '전략': 'GQ-Strategy',
    '행동': 'GQ-Action'
  };

  questions.forEach((q) => {
    const userChoice = answers[q.id];
    if (userChoice !== undefined) {
      const score = scoringTable[q.id]?.[userChoice] || 0;
      const gqKey = categoryMap[q.category];
      categoryScores[gqKey] += score;
    }
  });

  return categoryScores;
}
