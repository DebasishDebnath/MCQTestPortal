import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import SeparateTest from "./SeparateTest.jsx";
import { useNavigate } from "react-router-dom";
function AllTestShow({response}) {
  const [tests, setTests] = useState([]);
  const [examNumber, setExamNumber] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log(response?.exams,"dsfjhsdgf")
  useEffect(() => {
    fetchAllExams();
  }, [response]);
  // console.log("response", response);
  const fetchAllExams = () => {
    try {
      setLoading(true);
      setError(null);
      
      setExamNumber(response?.totalCount || 0);
      
      setTests(response?.exams);
    } catch (err) {
      setError(err.message || "Failed to fetch exams");
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-2xl p-10 w-full shadow-md poppins">
      <div className="flex justify-between items-center mb-6">
        <div className="text-blue-theme font-semibold text-2xl">
          All Tests({examNumber})
        </div>
        <div className="flex gap-6 items-center text-sm">
          <button
            className="border rounded-full px-10 py-2 border-indigo-400 font-semibold text-indigo-400 cursor-pointer hover:bg-indigo-400 hover:text-white transition-colors"
            onClick={() => navigate("/admin/create-test")}
          >
            Create Test
          </button>
          <div
            className="flex items-center gap-2 text-blue-theme font-medium whitespace-nowrap cursor-pointer hover:text-indigo-400 transition-colors"
            onClick={() => navigate("/admin/all-test")}
          >
            View All {"  "} <FaArrowRightLong />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading tests...</div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        )}

        {!loading && !error && examNumber === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tests available
          </div>
        )}

        {!loading &&
          !error &&
          examNumber > 0 &&
          tests.slice(0, 2).map((test) => (
            <SeparateTest key={test.id || test._id} testData={test} />
          ))}
      </div>
    </div>
  );
}

export default AllTestShow;
