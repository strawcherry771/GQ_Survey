import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import IntroPage from './pages/IntroPage';
import StartPage from './pages/StartPage';
import SurveyPage from './pages/SurveyPage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [answers, setAnswers] = useState({});

  return (
    <Router>
      <Routes>
        {/* 언어 선택 인트로 */}
        <Route path="/" element={<IntroPage />} />
        
        {/* 언어 파라미터 기반 페이지 (ko/en) */}
        <Route
          path="/:lang/start"
          element={
            <StartPage
              name={name}
              setName={setName}
              position={position}
              setPosition={setPosition}
            />
          }
        />
        <Route
          path="/:lang/test"
          element={
            <SurveyPage
              name={name}
              position={position}
              setAnswers={setAnswers}
            />
          }
        />
        <Route
          path="/:lang/result"
          element={
            <ResultPage
              answers={answers}
              name={name}
              position={position}
            />
          }
        />

        {/* 관리자 페이지 */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
