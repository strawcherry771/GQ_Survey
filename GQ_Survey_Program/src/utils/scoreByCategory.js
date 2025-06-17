// 영역별 점수 계산 함수 (lang 필수)
import { questions } from '../questions';
import { scoringTable } from '../scoring';

export function calculateCategoryScores(answers, lang = 'ko') {
  const categoryScores = {
    'GQ-Drive': 0,
    'GQ-Knowledge': 0,
    'GQ-Strategy': 0,
    'GQ-Action': 0
  };

  // 언어별 category → GQ-key 매핑
  const categoryMap = {
    ko: {
      '동기': 'GQ-Drive',
      '지식': 'GQ-Knowledge',
      '전략': 'GQ-Strategy',
      '행동': 'GQ-Action'
    },
    en: {
      'Drive': 'GQ-Drive',
      'Knowledge': 'GQ-Knowledge',
      'Strategy': 'GQ-Strategy',
      'Action': 'GQ-Action'
    }
  };

  // questions는 반드시 questions[lang] 형태로 접근!
  questions[lang].forEach((q) => {
    const userChoice = answers[q.id];
    if (userChoice !== undefined) {
      const score = scoringTable[q.id]?.[userChoice] || 0;
      const gqKey = categoryMap[lang][q.category];
      categoryScores[gqKey] += score;
    }
  });

  return categoryScores;
}
