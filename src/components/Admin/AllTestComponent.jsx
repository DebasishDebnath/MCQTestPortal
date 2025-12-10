import React, { useEffect, useState } from "react";
import TestDetailComponent from "./TestDetailComponent";
import AllTestShow from "./AllTestShow";
import SeparateTest from "./SeparateTest";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/useHttp";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function AllTestComponent() {
  const { get } = useHttp();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTests, setTotalTests] = useState(0);
  const [limit] = useState(4);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter]);

  useEffect(() => {
    fetchAllExams();
  }, [debouncedSearch, activeFilter, currentPage]);

  const fetchAllExams = async () => {
    try {
      if (tests.length > 0) {
        setPageLoading(true);
      } else {
        setLoading(true);
      }

      setError(null);
      const token = localStorage.getItem("userToken");
      let url = "/api/exam/getAllExams?";
      const params = [];

      params.push(`limit=${limit}`);
      params.push(`page=${currentPage}`);

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

      const examsData = response.data.exams || response.data.data || response;
      const total =
        response.data.totalCount ||
        response.data.totalExams ||
        examsData.length ||
        0;
      const pages = response.data.totalPages || Math.ceil(total / limit);

      setTests(examsData);
      setTotalTests(total);
      setTotalPages(pages);
    } catch (err) {
      setError(err.message || "Failed to fetch exams");
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-blue-theme font-semibold text-2xl">
              All Tests
            </div>
            {totalTests > 0 && (
              <div className="text-gray-500 text-sm mt-1">
                Showing {(currentPage - 1) * limit + 1} -{" "}
                {Math.min(currentPage * limit, totalTests)} of {totalTests}{" "}
                tests
              </div>
            )}
          </div>

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

        <div className="flex items-center justify-between">
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

      <div className="relative ">
        {pageLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-theme border-t-transparent rounded-full animate-spin"></div>
              <div className="text-gray-600 font-medium">Loading tests...</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {loading && !pageLoading && (
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

      {!loading && !error && tests.length > 0 && totalTests > limit && (
        <div className="flex items-center justify-between">
          
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || pageLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all min-w-36 justify-center ${
              currentPage === 1 || pageLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-theme text-white hover:bg-blue-600 shadow-md"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-2 ">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..." || pageLoading}
                className={`min-w-[40px] h-10 rounded-lg font-medium transition-all cursor-pointer ${
                  page === currentPage
                    ? "bg-blue-theme text-white shadow-md"
                    : page === "..."
                    ? "cursor-default text-gray-400"
                    : pageLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || pageLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all min-w-36 justify-center ${
              currentPage === totalPages || pageLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-theme text-white hover:bg-blue-600 shadow-md"
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AllTestComponent;
