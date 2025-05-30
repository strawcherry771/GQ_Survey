import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminTable = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'gq_responses'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResponses(data);
    };

    fetchData();
  }, []);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>이름</th>
          <th>직급</th>
          <th>총점</th>
          <th>Drive</th>
          <th>Knowledge</th>
          <th>Strategy</th>
          <th>Action</th>
          <th>피드백 점수</th>
          <th>피드백 내용</th>
          <th>작성 시간</th>
        </tr>
      </thead>
      <tbody>
        {responses.map((res) => (
          <tr key={res.id}>
            <td>{res.name}</td>
            <td>{res.position}</td>
            <td>{res.totalScore}</td>
            <td>{res.scores?.['GQ-Drive']}</td>
            <td>{res.scores?.['GQ-Knowledge']}</td>
            <td>{res.scores?.['GQ-Strategy']}</td>
            <td>{res.scores?.['GQ-Action']}</td>
            <td>{res.feedbackScore ?? '-'}</td>
            <td>{res.feedbackText ?? '-'}</td>
            <td>{res.createdAt?.slice(0, 10) ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminTable;
