import AdminTable from '../components/AdminTable';
import { downloadGQResponsesAsCSV } from '../utils/downloadGQCSV';

const AdminPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 관리자 페이지</h2>
      <button
        onClick={downloadGQResponsesAsCSV}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        📥 CSV 다운로드
      </button>
      <AdminTable />
    </div>
  );
};

export default AdminPage;
