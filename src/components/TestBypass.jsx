import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function TestBypass() {
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has a token from login
    const existingToken = localStorage.getItem('userToken');
    
    if (existingToken) {
      console.log('🧪 TEST MODE: Using existing token from login');
      toast.success("Test mode activated with your login!");
      navigate(`/system-compatibility/${testId}`, { replace: true });
    } else {
      // Fallback: Use test token if no login token exists
      const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzUwMGY5MTE2OTExNmE5M2ExNzJmOGYiLCJyb2xlIjoidXNlciIsImlhdCI6MTczMzMyNTIwMSwiZXhwIjoxNzMzMzI4ODAxfQ.ELSRjsQCMsBJ1WaEzW6XgkXiSpf3Wo30h_lmQaMTDC8"; // Replace with actual token
      
      console.log('🧪 TEST MODE: No login token found, using fallback test token');
      localStorage.setItem('userToken', TEST_TOKEN);
      toast.success("Test mode activated with test token!");
      navigate(`/system-compatibility/${testId}`, { replace: true });
    }
  }, [testId, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700 font-semibold">Redirecting to test...</p>
      </div>
    </div>
  );
}

export default TestBypass;