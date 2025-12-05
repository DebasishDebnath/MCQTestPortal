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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // null, 'upcoming', 'completed', 'ongoing'

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch when debounced search or filter changes
  useEffect(() => {
    fetchAllExams();
  }, [debouncedSearch, activeFilter]);

  const fetchAllExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("userToken");

      // Build URL with query parameters
      let url = "/api/exam/getAllExams?";
      const params = [];

      if (debouncedSearch) {
        params.push(`search=${encodeURIComponent(debouncedSearch)}`);
      }

      if (activeFilter) {
        params.push(`status=${activeFilter}`);
      }

      url += params.join("&");

      const response = await get(url, {
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
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
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center justify-between">
          {/* Filter Pills */}
          <div className="flex items-center gap-3 pb-10">
            <button
              onClick={() => handleFilterClick("draft")}
              className={`px-5 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === "draft"
                  ? "bg-[#160024] text-white"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              Upcoming
            </button>

            <button
              onClick={() => handleFilterClick("closed")}
              className={`px-5 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === "closed"
                  ? "bg-[#160024] text-white hover:bg-[#29083d]"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Completed
            </button>

            <button
              onClick={() => handleFilterClick("live")}
              className={`px-5 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === "live"
                  ? "bg-[#160024] text-white hover:bg-[#29083d]"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Ongoing
            </button>

            <button
              onClick={() => setActiveFilter(null)}
              className={`px-5 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
                activeFilter === null
                  ? "bg-[#160024] text-white hover:bg-[#29083d]"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              View All
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[32%]">
        {loading && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading tests...
          </div>
        )}

        {error && (
          <div className="col-span-full text-center py-8 text-red-500">
            Error: {error}
          </div>
        )}

        {!loading && !error && tests.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm || activeFilter
              ? `No tests found ${searchTerm ? `for "${searchTerm}"` : ""} ${
                  activeFilter ? `in ${activeFilter}` : ""
                }`
              : "No tests available"}
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

export default AllTestComponent;
