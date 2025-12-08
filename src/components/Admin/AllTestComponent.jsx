import React, { useEffect, useState } from "react";
import TestDetailComponent from "./TestDetailComponent";
import AllTestShow from "./AllTestShow";
import SeparateTest from "./SeparateTest";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/useHttp";
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
    <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="text-blue-theme font-semibold text-2xl">
          All Tests
        </div>

          {/* Search Bar */}
          <div className="relative w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Test Name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-12 py-3 border border-gray-200 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => handleFilterClick("draft")}
              className={`px-4 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeFilter === "draft"
                  ? "bg-black text-white"
                  : "bg-indigo-100 text-blue-theme"
              }`}
            >
              Upcoming
            </button>

            <button
              onClick={() => handleFilterClick("closed")}
              className={`px-4 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeFilter === "closed"
                  ? "bg-black text-white"
                  : "bg-indigo-100 text-blue-theme"
              }`}
            >
              Completed
            </button>

            <button
              onClick={() => handleFilterClick("live")}
              className={`px-4 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeFilter === "live"
                  ? "bg-black text-white"
                  : "bg-indigo-100 text-blue-theme"
              }`}
            >
              Ongoing
            </button>

            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeFilter === null
                  ? "bg-black text-white"
                  : "bg-indigo-100 text-blue-theme"
              }`}
            >
              View All
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
