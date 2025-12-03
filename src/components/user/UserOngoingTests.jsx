import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useHttp } from "../../hooks/useHttp.jsx";
import UserSeparateTest from "./UserSeparateTest.jsx";

function UserAllTests() {
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
    <div className="bg-white rounded-3xl px-10 py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="text-blue-theme font-semibold text-[24px]">
          Ongoing Tests
        </div>
        <div className="flex gap-6 items-center text-sm">
          
          <div className="flex items-center gap-2 text-blue-theme font-medium whitespace-nowrap cursor-pointer hover:text-indigo-400 transition-colors">
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

        {!loading && !error && tests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tests available
          </div>
        )}

        {!loading &&
          !error &&
          tests.length > 0 &&
          tests.map((test) => (
            <UserSeparateTest key={test.id || test._id} testData={test} />
          ))}
      </div>
    </div>
  );
}

export default UserAllTests;
