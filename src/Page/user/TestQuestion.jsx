import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import QuestionsGrid from "../../components/user/QuestionsGrid";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import FinalSubmission from "../../components/user/FinalSubmission";
import { useHttp } from "../../hooks/useHttp";
import { toast } from "react-hot-toast";
import { useQuestionAttempt } from "../../context/QuestionAttemptContext";
import { useProctoring } from "../../hooks/useProctoring";

function TestQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { testid } = useParams();
  const { get, post } = useHttp();

  const {
    attempts,
    saveAnswer: saveAttempt,
    editAnswer: editAttempt,
    clearAnswer: clearAttempt,
    initializeQuestion,
    getAttemptStatus,
    isAttempted,
    initializeQuestions,
  } = useQuestionAttempt();

  // 🚨 AI Proctoring Hook - start immediately when component mounts (SILENT)
  const { videoRef, warningCount, isProctoringReady, isInitializing, isExamActive } =
    useProctoring(testid, true, true);

  const [showFinalSubmission, setShowFinalSubmission] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0); // ✅ ADD THIS STATE
  const [loadedPages, setLoadedPages] = useState(new Set([1]));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [questionMap, setQuestionMap] = useState(new Map());
  const QUESTIONS_PER_PAGE = 10;

  // Only block browser navigation (beforeunload) - F5 is already handled in useProctoring
  useEffect(() => {
    const blockBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
      return "Are you sure you want to leave? Your exam progress may be lost.";
    };

    window.addEventListener("beforeunload", blockBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", blockBeforeUnload);
    };
  }, []);

  // Handle auto-submit from proctoring with answered count
  useEffect(() => {
    const handleAutoSubmit = async (event) => {
      const answeredCount = Object.keys(answers).length;
      
      // Save final state before redirect
      const token = localStorage.getItem("userToken");
      try {
        await post("/api/exam/submit", { examId: testid }, {
          Authorization: `Bearer ${token}`,
        });
      } catch (error) {
        console.error("Auto-submit error:", error);
      }

      // Navigate with answered count
      navigate(`/test/thankyou/${testid}`, { 
        state: { answered: answeredCount },
        replace: true 
      });
    };

    window.addEventListener("autoSubmitExam", handleAutoSubmit);
    return () => window.removeEventListener("autoSubmitExam", handleAutoSubmit);
  }, [answers, testid, navigate, post]);

  // Load initial questions
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
    setDurationMinutes(receivedData.durationMinutes || 120); // ✅ SET DURATION (default 120)
    setVisitedQuestions(new Set());

    const initialMap = new Map();
    questionsList.forEach((q, index) => {
      initialMap.set(index, q);
    });
    setQuestionMap(initialMap);

    const questionIds = questionsList.map((q) => q._id);
    initializeQuestions(questionIds);
  }, [location.state, navigate, testid, initializeQuestions]);

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
      setQuestionMap((prev) => {
        const newMap = new Map(prev);
        const startIndex = (pageNumber - 1) * QUESTIONS_PER_PAGE;
        response.data.questions.forEach((q, i) => {
          newMap.set(startIndex + i, q);
        });
        return newMap;
      });

      setQuestions((prev) => {
        const newQuestions = [...prev];
        const startIndex = (pageNumber - 1) * QUESTIONS_PER_PAGE;
        response.data.questions.forEach((q, i) => {
          newQuestions[startIndex + i] = q;
        });
        return newQuestions;
      });

      setLoadedPages((prev) => new Set([...prev, pageNumber]));

      const questionIds = response.data.questions.map((q) => q._id);
      initializeQuestions(questionIds);
    } else {
      console.error("❌ Failed to load more questions");
      toast.error("Failed to load more questions");
    }

    setIsLoadingMore(false);
  };

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
      const attemptStatus = getAttemptStatus(questionId);
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
        } else if (hasAnswer || attemptStatus.answered) {
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

  const saveOrUpdateAnswer = async () => {
    if (!currentQuestion) return false;

    const questionId = currentQuestion._id;
    const answerValue = answers[questionId];
    const attemptStatus = getAttemptStatus(questionId);

    const hasAnswer =
      answerValue !== undefined &&
      (Array.isArray(answerValue)
        ? answerValue.length > 0
        : answerValue !== null && answerValue !== "");

    if (!hasAnswer) {
      return true;
    }

    let selectedIndex = Array.isArray(answerValue)
      ? answerValue
      : [answerValue];

    if (attemptStatus.isNew || attemptStatus.cleared) {
      return await saveAttempt(testid, questionId, selectedIndex);
    } else if (attemptStatus.answered) {
      return await editAttempt(testid, questionId, selectedIndex);
    }

    return true;
  };

  const handleNext = async () => {
    const saved = await saveOrUpdateAnswer();
    if (!saved) return;

    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      await checkAndLoadQuestions(nextIndex);
      setVisitedQuestions((prev) => new Set([...prev, nextIndex]));
      setCurrentQuestionIndex(nextIndex);

      const nextQuestion = questionMap.get(nextIndex);
      if (nextQuestion) {
        initializeQuestion(nextQuestion._id);
      }
    }
  };

  const handlePrevious = async () => {
    const saved = await saveOrUpdateAnswer();
    if (!saved) return;

    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setVisitedQuestions((prev) => new Set([...prev, prevIndex]));
      setCurrentQuestionIndex(prevIndex);
    }
  };

  const handleClearResponse = async () => {
    const questionId = currentQuestion._id;

    const success = await clearAttempt(testid, questionId);

    if (success) {
      const updatedAnswers = { ...answers };
      delete updatedAnswers[questionId];
      setAnswers(updatedAnswers);

      const updatedMarked = { ...markedForReview };
      delete updatedMarked[questionId];
      setMarkedForReview(updatedMarked);
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentQuestion._id]: true,
    });
  };

  const handleQuestionClick = async (index) => {
    await saveOrUpdateAnswer();

    await checkAndLoadQuestions(index);
    setVisitedQuestions((prev) => new Set([...prev, index]));
    setCurrentQuestionIndex(index);

    const clickedQuestion = questionMap.get(index);
    if (clickedQuestion) {
      initializeQuestion(clickedQuestion._id);
    }
  };

  // Only show loading if questions not loaded - DON'T wait for proctoring
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-700 font-semibold text-xl">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full h-full poppins`}>
      {/* 🎥 Hidden Camera Video - COMPLETELY HIDDEN */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "1px",
          height: "1px",
          opacity: 0,
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
        }}
      />

      {/* ⚠️ Warning Counter Display - ONLY SHOW WHEN WARNING EXISTS */}
      {warningCount > 0 && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          <p className="font-bold">⚠️ Warnings: {warningCount}/3</p>
        </div>
      )}

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
          <div className="w-full">
            <h1 className="text-2xl font-medium text-blue-theme">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h1>
            <div className="h-0.5 w-full bg-gray-300 mt-4"></div>

            <p className="my-10 text-xl font-semibold">
              {currentQuestion.questionText}
            </p>

            {currentQuestion.questionImageUrl && (
              <img
                src={currentQuestion.questionImageUrl}
                alt="Question"
                className="my-6 max-w-md rounded-lg shadow-md"
              />
            )}

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
                      <span>{optionObj.text}</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-1/4 w-fit">
            <QuestionsGrid
              questions={getQuestionGridData()}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        </div>

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