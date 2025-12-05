import React, { useEffect, useState } from "react";
import TestDetailComponent from "./TestDetailComponent";
import AllTestShow from "./AllTestShow";
import SeparateTest from "./SeparateTest";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/useHttp";
import { IoIosSearch } from "react-icons/io";
import { Search, SlidersHorizontal, X } from "lucide-react";
function AllTestComponent({ allTests }) {
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
    <div className="bg-white rounded-3xl px-10 py-10 w-full">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-900">All Tests</h1>

          {/* Search Bar */}
          <div className="relative w-[40%]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Test Name"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center justify-between">
          {/* Filter Pills */}
          <div className="flex items-center gap-3 pb-10">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#160024] text-white rounded-full font-medium hover:bg-[#29083d] cursor-pointer transition-colors">
              Upcoming
              <X className="w-4 h-4" />
            </button>

            <button className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors cursor-pointer">
              Completed
            </button>

            <button className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors cursor-pointer">
              Ongoing
            </button>

            <button className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors cursor-pointer">
              View All
            </button>
          </div>

          {/* Filters Button */}
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#160024] text-white rounded-lg font-medium hover:bg-[#29083d] cursor-pointer transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      <div className="space-y-4 flex min-h-[32%] gap-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[32%]">
          {!loading &&
            !error &&
            tests.length > 0 &&
            tests.map((test) => (
              <SeparateTest key={test.id || test._id} testData={test} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default AllTestComponent;
