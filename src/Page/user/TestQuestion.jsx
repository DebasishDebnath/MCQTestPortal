import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import QuestionsGrid from "../../components/user/QuestionsGrid";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import FinalSubmission from "../../components/user/FinalSubmission";
import { useHttp } from "../../hooks/useHttp";
import { toast } from "react-hot-toast";

function TestQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { testid } = useParams();
  const { get, post } = useHttp();

  const [showFinalSubmission, setShowFinalSubmission] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());

  // ✅ Pagination states
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loadedPages, setLoadedPages] = useState(new Set([1]));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // ✅ Store questions in a map by their sequential index
  const [questionMap, setQuestionMap] = useState(new Map());
  const QUESTIONS_PER_PAGE = 10;

  useEffect(() => {
    const receivedData = location.state;

    if (!receivedData || !receivedData.initialQuestions) {
      navigate(`/instruction/${testid}`, { replace: true });
      return;
    }

    const questionsList = receivedData.initialQuestions || [];

    if (!questionsList || questionsList.length === 0) {
      navigate(`/instruction/${testid}`, { replace: true });
      return;
    }

    setQuestions(questionsList);
    setTotalQuestions(receivedData.totalQuestions);
    setVisitedQuestions(new Set());

    // ✅ Initialize question map with first page questions
    const initialMap = new Map();
    questionsList.forEach((q, index) => {
      initialMap.set(index, q);
    });
    setQuestionMap(initialMap);
  }, [location.state, navigate, testid]);

  // ✅ Function to load more questions
  const loadMoreQuestions = async (pageNumber) => {
    if (loadedPages.has(pageNumber) || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    const token = localStorage.getItem("userToken");
    const response = await get(
      `/api/questions/all/${testid}?page=${pageNumber}&limit=${QUESTIONS_PER_PAGE}`,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response && response.data && response.data.questions) {
      // ✅ Update question map with new questions
      setQuestionMap((prev) => {
        const newMap = new Map(prev);
        const startIndex = (pageNumber - 1) * QUESTIONS_PER_PAGE;
        response.data.questions.forEach((q, i) => {
          newMap.set(startIndex + i, q);
        });
        return newMap;
      });

      // ✅ Also update questions array for backward compatibility
      setQuestions((prev) => {
        const newQuestions = [...prev];
        const startIndex = (pageNumber - 1) * QUESTIONS_PER_PAGE;
        response.data.questions.forEach((q, i) => {
          newQuestions[startIndex + i] = q;
        });
        return newQuestions;
      });

      setLoadedPages((prev) => new Set([...prev, pageNumber]));
    } else {
      console.error("❌ Failed to load more questions");
      toast.error("Failed to load more questions");
    }

    setIsLoadingMore(false);
  };

  // ✅ Check if we need to load more questions when navigating
  const checkAndLoadQuestions = async (targetIndex) => {
    const pageNeeded = Math.ceil((targetIndex + 1) / QUESTIONS_PER_PAGE);

    if (!loadedPages.has(pageNeeded)) {
      await loadMoreQuestions(pageNeeded);
    }
  };

  useEffect(() => {
    const handleOpenFinalSubmission = () => setShowFinalSubmission(true);
    window.addEventListener("openFinalSubmission", handleOpenFinalSubmission);
    return () => {
      window.removeEventListener(
        "openFinalSubmission",
        handleOpenFinalSubmission
      );
    };
  }, []);

  // ✅ Generate question grid data - FIXED
  const getQuestionGridData = () => {
    const allQuestions = Array.from({ length: totalQuestions }, (_, index) => {
      const loadedQuestion = questionMap.get(index);

      if (!loadedQuestion) {
        return {
          number: index + 1,
          status: "blank",
          questionId: null,
        };
      }

      const questionId = loadedQuestion._id;
      const hasAnswer =
        answers[questionId] !== undefined &&
        (Array.isArray(answers[questionId])
          ? answers[questionId].length > 0
          : answers[questionId] !== null);
      const isMarked = markedForReview[questionId];
      const isVisited = visitedQuestions.has(index);

      let status = "blank";

      if (isVisited) {
        if (isMarked) {
          status = "marked";
        } else if (hasAnswer) {
          status = "answered";
        } else {
          status = "unanswered";
        }
      }

      return {
        number: index + 1,
        status: status,
        questionId: questionId,
      };
    });

    // Log first 5
    return allQuestions;
  };

  const currentQuestion = questionMap.get(currentQuestionIndex);

  const handleAnswerSelect = (optionIndex) => {
    setVisitedQuestions((prev) => new Set([...prev, currentQuestionIndex]));

    if (Array.isArray(optionIndex) && optionIndex.length === 0) {
      const updatedAnswers = { ...answers };
      delete updatedAnswers[currentQuestion._id];
      setAnswers(updatedAnswers);
      return;
    }

    setAnswers({
      ...answers,
      [currentQuestion._id]: optionIndex,
    });

    if (markedForReview[currentQuestion._id]) {
      const updatedMarked = { ...markedForReview };
      delete updatedMarked[currentQuestion._id];
      setMarkedForReview(updatedMarked);
    }
  };

  const handleNext = async () => {
    const saved = await saveAnswer();
    if (!saved) return;
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;

      await checkAndLoadQuestions(nextIndex);

      setVisitedQuestions((prev) => new Set([...prev, nextIndex]));
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handlePrevious = async () => {
    const saved = await saveAnswer(); // ✅ Save current answer before going back
    if (!saved) return;

    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setVisitedQuestions((prev) => new Set([...prev, prevIndex]));
      setCurrentQuestionIndex(prevIndex);
    }
  };

  const handleClearResponse = async () => {
    const token = localStorage.getItem("userToken");
    const questionId = currentQuestion._id;

    const body = {
      examId: testid,
      questionId: questionId,
    };

    const response = await post("/api/attempts/delete", body, {
      Authorization: `Bearer ${token}`,
    });

    if (response && response.success) {
      const updatedAnswers = { ...answers };
      delete updatedAnswers[questionId];
      setAnswers(updatedAnswers);

      // Save updated answers to localStorage
      localStorage.setItem(`answers_${testid}`, JSON.stringify(updatedAnswers));

      const updatedMarked = { ...markedForReview };
      delete updatedMarked[questionId];
      setMarkedForReview(updatedMarked);
    } else {
      toast.error("Failed to clear response");
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentQuestion._id]: true,
    });
  };

  const handleQuestionClick = async (index) => {
    await checkAndLoadQuestions(index);

    setVisitedQuestions((prev) => new Set([...prev, index]));
    setCurrentQuestionIndex(index);
  };
  const saveAnswer = async () => {
    const token = localStorage.getItem("userToken");
    const answerValue = answers[currentQuestion._id];
    
    // ✅ Always send as array - wrap single answer in array
    let selectedIndex = [];
    
    if (answerValue !== undefined) {
      if (Array.isArray(answerValue)) {
        selectedIndex = answerValue;
      } else {
        selectedIndex = [answerValue]; // Wrap single answer in array
      }
    }

    const body = {
      examId: testid,
      answer: {
        questionId: currentQuestion._id,
        selectedIndex: selectedIndex,
      },
    };
    
    const response = await post(`/api/attempts/create`, body, {
      Authorization: `Bearer ${token}`,
    });
    
    if (response && response.success) {
      return true;
    } else {
      console.error("❌ Failed to save answer");
      toast.error("Failed to save answer");
      return false;
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full h-full poppins`}>
      {showFinalSubmission && (
        <div className="w-full min-h-screen bg-black/50 backdrop-blur-xs z-20 absolute top-0 left-0 transition-opacity duration-500">
          <FinalSubmission
            onClose={() => setShowFinalSubmission(false)}
            questions={Array.from(questionMap.values())}
            answers={answers}
            markedForReview={markedForReview}
            questionGridData={getQuestionGridData()}
          />
        </div>
      )}

      <div className=" flex w-full poppins bg-gray-theme">
        <div className="flex justify-start items-center max-w-[1440px] mx-auto w-full px-6 py-3">
          <div className="flex gap-10 rounded-md px-3 py-1 bg-gray-100 text-xs font-medium items-center">
            <p>1. Section A</p>
            <MdArrowDropDown size={20} />
          </div>
        </div>
      </div>
      <div className=" flex flex-col w-full poppins">
        <div className="flex justify-center items-center max-w-[1440px] mx-auto w-full px-6 gap-10 py-16">
          {/* Left section */}
          <div className="w-full">
            <h1 className="text-2xl font-medium text-blue-theme">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h1>
            <div className="h-0.5 w-full bg-gray-300 mt-4"></div>

            {/* Question Text */}
            <p className="my-10 text-xl font-semibold">
              {currentQuestion.questionText}
            </p>

            {/* Question Image if exists */}
            {currentQuestion.questionImageUrl && (
              <img
                src={currentQuestion.questionImageUrl}
                alt="Question"
                className="my-6 max-w-md rounded-lg shadow-md"
              />
            )}

            {/* Question Details */}
            <div className="flex gap-4 text-sm text-gray-600 mb-6">
              <span>Marks: {currentQuestion.marks}</span>
              <span>Negative Marks: {currentQuestion.negativeMarks}</span>
              <span>Difficulty: {currentQuestion.difficulty}</span>
              {currentQuestion.questionType === "multiple" && (
                <span className="text-blue-600 font-semibold">
                  Multiple Correct Answers
                </span>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-4">
              {currentQuestion.options?.map((optionObj, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 font-medium text-md"
                >
                  <input
                    type={
                      currentQuestion.questionType === "multiple"
                        ? "checkbox"
                        : "radio"
                    }
                    name={`question-${currentQuestion._id}`}
                    id={`option-${index}`}
                    className="w-5 h-5"
                    checked={
                      currentQuestion.questionType === "multiple"
                        ? (answers[currentQuestion._id] || []).includes(index)
                        : answers[currentQuestion._id] === index
                    }
                    onChange={() => {
                      if (currentQuestion.questionType === "multiple") {
                        const currentAnswers =
                          answers[currentQuestion._id] || [];
                        const newAnswers = currentAnswers.includes(index)
                          ? currentAnswers.filter((i) => i !== index)
                          : [...currentAnswers, index];
                        handleAnswerSelect(newAnswers);
                      } else {
                        handleAnswerSelect(index);
                      }
                    }}
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className="text-lg cursor-pointer flex items-center gap-2"
                  >
                    <span>{String.fromCharCode(65 + index)}.</span>
                    {optionObj.optionImageUrl ? (
                      <img
                        src={optionObj.optionImageUrl}
                        alt={`Option ${index + 1}`}
                        className="max-w-xs rounded"
                      />
                    ) : (
                      <span>{optionObj.text}</span> // <-- FIXED HERE
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right section - Question Grid */}
          <div className="max-w-1/4 w-fit">
            <QuestionsGrid
              questions={getQuestionGridData()}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center max-w-[1440px] mx-auto w-full px-6 gap-6 p-6 text-sm">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="cursor-pointer w-40 py-1.5 p-2 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowLeftLong />
            Previous
          </button>
          <button
            onClick={handleClearResponse}
            className="cursor-pointer w-40 py-1.5 p-2 bg-red-400 text-white rounded-full flex items-center justify-center gap-4"
          >
            Clear Response
          </button>
          <button
            onClick={handleMarkForReview}
            className="cursor-pointer w-40 py-1.5 p-2 bg-gray-400 text-white rounded-full flex items-center justify-center gap-4"
          >
            Mark for review
          </button>
          <button
            onClick={
              currentQuestionIndex === totalQuestions - 1
                ? () => setShowFinalSubmission(true)
                : handleNext
            }
            disabled={isLoadingMore}
            className="cursor-pointer w-40 py-1.5 p-2 bg-green-400 text-white rounded-full flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isLoadingMore
              ? "Loading..."
              : currentQuestionIndex === totalQuestions - 1
              ? "Submit"
              : "Save and next"}
            {currentQuestionIndex !== totalQuestions - 1 && !isLoadingMore && (
              <FaArrowRightLong />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestQuestion;
