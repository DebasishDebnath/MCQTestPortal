import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useHttp } from "../../hooks/useHttp.jsx";
import SeparateTest from "./SeparateTest.jsx";

function AllTestShow() {
  const { get } = useHttp();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAllExams();
  }, []);

  const fetchAllExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("userToken");
      console.log(token, "token");
      const response = await get("/api/exam/getAllExams", {
        Authorization: `Bearer ${token}`,
      });

      console.log(response);
      setTests(response.data || response);
    } catch (err) {
      setError(err.message || "Failed to fetch exams");
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-[15px] px-[7%] py-[3%]">
      <div className="flex justify-between items-center mb-6">
        <div className="text-[#0E2258] font-semibold text-[24px]">
          All Tests
        </div>
        <div className="flex gap-6 items-center">
          <button className="border rounded-[25px] px-14 py-2 border-[#5C7CD4] font-bold text-[#5C7CD4] cursor-pointer hover:bg-[#5C7CD4] hover:text-white transition-colors">
            Create Test
          </button>
          <div className="flex items-center gap-2 text-[#0E2258] font-medium whitespace-nowrap cursor-pointer hover:text-[#5C7CD4] transition-colors">
            View All <FaArrowRightLong />
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

        {!loading && !error && tests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tests available
          </div>
        )}

        {!loading &&
          !error &&
          tests.length > 0 &&
          tests.map((test) => (
            <SeparateTest key={test.id || test._id} testData={test} />
          ))}
      </div>
    </div>
  );
}

export default AllTestShow;
