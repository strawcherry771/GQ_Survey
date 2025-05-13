export function getSummaryMessage(scores) {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][0];
    const bottom = sorted[sorted.length - 1][0];
    const gap = sorted[0][1] - sorted[sorted.length - 1][1];
  
    const areaLabels = {
      'GQ-Drive': '내적 동기',
      'GQ-Knowledge': '정책 기반 이해',
      'GQ-Strategy': '전략 감각',
      'GQ-Action': '실행력',
    };
  
    let message = `당신의 주요 강점은 ${areaLabels[top]}이며, `;
    message += `${areaLabels[bottom]}은 상대적으로 약한 편입니다. `;
  
    if (gap >= 6) {
      message += `영역 간 점수 차이가 ${gap}점으로 나타나 불균형이 존재하며, `;
      message += `특정 역량이 다른 요소의 실행 또는 설득 과정에서 제약을 만들 수 있음을 의미합니다. `;
      message += `약점을 보완하고 주요 역량과의 연결을 강화한다면, 제안서 전체의 완성도가 한 단계 상승할 수 있습니다.`;
    } else {
      message += `전체적으로 균형 잡힌 역량 분포를 보이며, `;
      message += `각 요소가 유기적으로 작동할 가능성이 높습니다. `;
      message += `강점을 적극적으로 활용하면서도 실전 문맥에 적용하는 연습을 통해 더욱 강화될 수 있습니다.`;
    }
  
    return message;
  }
  