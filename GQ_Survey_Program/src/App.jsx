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
  const handleStart = () => {
    if (name.trim() && position.trim()) {
      setStep('survey');
    } else {
      alert('이름과 직급을 입력해 주세요');
    }
  };
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/start" element={<StartPage name={name} setName={setName} position={position} setPosition={setPosition}/>}/>
        <Route path="/test" element={<SurveyPage name={name} position={position} setAnswers={setAnswers} />} />
        <Route path="/result" element={<ResultPage answers={answers} name={name} position={position} />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
