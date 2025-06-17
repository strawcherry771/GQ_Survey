export function getGrowthStage(totalScore, lang) {
    if (totalScore >= 70) {
      return {
        level: lang === 'en' ? 'Expert Stage' : '전문가 단계',
        message: lang === 'en'
          ? 'Highly advanced with both strategic thinking and execution skills.'
          : '고차원적 전략사고와 실행력이 모두 뛰어난 고도화된 상태입니다.'
      };
    } else if (totalScore >= 55) {
      return {
        level: lang === 'en' ? 'Proficient Stage' : '숙련 단계',
        message: lang === 'en'
          ? 'Balanced and solid foundation in strategy and execution.'
          : '전략/실행 기반이 균형 있게 갖추어진 단계입니다.'
      };
    } else if (totalScore >= 40) {
      return {
        level: lang === 'en' ? 'Growth Stage' : '성장 단계',
        message: lang === 'en'
          ? 'Some capabilities are evident, with much room for development.'
          : '일부 역량이 드러나며, 발전 여지가 큽니다.'
      };
    } else {
      return {
        level: lang === 'en' ? 'Foundation Stage' : '기초 단계',
        message: lang === 'en'
          ? 'Still in the initial stage of developing strategic thinking.'
          : '아직 전략적 사고의 틀을 익히는 초기 단계입니다.'
      };
    }
  }