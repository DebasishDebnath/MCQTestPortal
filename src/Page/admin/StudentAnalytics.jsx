import React from 'react'
import { useLocation } from 'react-router-dom'
import StudentPerformance from '../../components/Admin/StudentPerformance.jsx'

function StudentAnalytics() {
  const location = useLocation();
  const testId = location.state?.testId; // Get testId from navigation state
  const title = location.state?.title;

  return (
    <div
      className="flex w-full min-h-screen bg-[#313d55] bg-cover bg-center justify-center xl:p-20 p-10 bg-blend-overlay poppins"
      style={{
        backgroundImage: "url(/regbg.png)",
      }}
    >
      <StudentPerformance testId={testId} title = {title} />
    </div>
  )
}

export default StudentAnalytics