import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

export const downloadGQResponsesAsCSV = async () => {
  const snapshot = await getDocs(collection(db, 'gq_responses'));
  const rows = [];

  // 헤더
  rows.push([
    '이름',
    '직급',
    '총점',
    'GQ-Drive',
    'GQ-Knowledge',
    'GQ-Strategy',
    'GQ-Action',
    '피드백 점수',
    '피드백 내용',
    '응답 시각',
    '피드백 시각'
  ]);

  // 데이터
  snapshot.forEach((doc) => {
    const data = doc.data();
    rows.push([
      data.name,
      data.position,
      data.totalScore,
      data.scores?.['GQ-Drive'],
      data.scores?.['GQ-Knowledge'],
      data.scores?.['GQ-Strategy'],
      data.scores?.['GQ-Action'],
      data.feedbackScore ?? '',
      data.feedbackText ?? '',
      data.createdAt ?? '',
      data.feedbackAt ?? ''
    ]);
  });

  // CSV 문자열 변환
  const csv = rows
    .map((row) =>
      row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  // ✅ UTF-8 with BOM을 위해 '\uFEFF' (BOM) 추가
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });

  // 다운로드 처리
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'gq_responses.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
