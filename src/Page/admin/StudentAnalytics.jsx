import React from 'react'
import StudentPerformance from '../../components/Admin/StudentPerformance.jsx'

function StudentAnalytics() {
  return (
    <div
        className="flex w-full min-h-screen bg-[#313d55] bg-cover bg-center justify-center xl:p-20 p-10 bg-blend-overlay poppins"
        style={{
          backgroundImage: "url(/regbg.png)",
        }}
      >
            <StudentPerformance />
    </div>
  )
}

export default StudentAnalytics