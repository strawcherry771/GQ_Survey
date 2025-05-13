export const saveUserResponse = async (responseData) => {
    try {
      // 추후 Firebase, Supabase, 또는 백엔드 API로 연결 가능
      console.log('📝 Saving user response...', responseData);
      // 예: localStorage 임시 저장
      const existing = JSON.parse(localStorage.getItem('gq_responses') || '[]');
      existing.push(responseData);
      localStorage.setItem('gq_responses', JSON.stringify(existing));
    } catch (error) {
      console.error('❌ Failed to save user response', error);
    }
  };
  