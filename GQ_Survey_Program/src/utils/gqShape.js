export function analyzeShapeAndGrowth(scores) {
    const values = [
      scores['GQ-Drive'] / 20,
      scores['GQ-Knowledge'] / 20,
      scores['GQ-Strategy'] / 20,
      scores['GQ-Action'] / 20,
    ];
    const P = [...values];
    P.push(P[0]); // for circular calculation
  
    // 면적 계산
    let area = 0;
    for (let i = 0; i < 4; i++) {
      area += P[i] * P[i + 1];
    }
    area = 0.5 * area;
  
    // 평균, 표준편차
    const avg = values.reduce((a, b) => a + b, 0) / 4;
    const sigma = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / 4);
    const delta = Math.max(...values) - Math.min(...values);
  
    // SHAPE 분류
    let shape = '';
    let shapeMessage = '';
    if (sigma <= 0.07 && delta <= 0.15) {
      shape = 'Balanced Circle';
      shapeMessage = '네 능력이 고르게 발달되어 있습니다. 새로운 분야나 리더십에 도전해 보세요.';
    } else if (sigma <= 0.15 && delta <= 0.25) {
      shape = 'Elliptic';
      shapeMessage = '전체적으로 균형 잡힌 편이나, 살짝 낮은 축이 있습니다. 보강하면 큰 성장이 가능합니다.';
    } else if (delta > 0.25 && Math.max(...values) >= 0.8) {
      shape = 'Spike';
      shapeMessage = '강점이 뚜렷하나 약점도 명확합니다. 약점 보완이 성과에 큰 영향을 줄 수 있습니다.';
    } else {
      shape = 'L-Shape';
      shapeMessage = '기초 역량 중 일부가 부족할 수 있습니다. 멘토링이나 기본기 재정립이 필요합니다.';
    }
  
    // 성장 단계 분류 (면적 기반)
    let growth = '';
    if (area >= 0.75) {
      growth = '전문단계 — Thought-Leader Pool';
    } else if (area >= 0.55) {
      growth = '숙련단계 — 프로젝트 리더 후보';
    } else if (area >= 0.35) {
      growth = '성장단계 — 집중 트레이닝 필요';
    } else {
      growth = '기초단계 — 입문과정부터 재설계';
    }
  
    return {
      shape,
      shapeMessage,
      sigma: sigma.toFixed(3),
      delta: delta.toFixed(3),
      area: area.toFixed(3),
      growth,
    };
  }
  