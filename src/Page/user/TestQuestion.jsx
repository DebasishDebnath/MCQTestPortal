import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import QuestionsGrid from "../../components/user/QuestionsGrid";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import FinalSubmission from "../../components/user/FinalSubmission";
import { useHttp } from "../../hooks/useHttp";
import { toast } from "react-hot-toast";
import { useQuestionAttempt } from "../../context/QuestionAttemptContext";
// ❌ REMOVE THIS LINE - Delete legacy proctoring
// import { useProctoring } from "../../hooks/useProctoring";
import useVideoProctor from "../../hooks/useVideoProctor";

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

  // 🎥 Video Proctoring Hook
  const videoRef = React.useRef(null);
  const [proctoringLogs, setProctoringLogs] = useState([]);
  const [hardWarnings, setHardWarnings] = useState(0);

  const handleProctoringHardWarning = (reason, count) => {
    toast.error(`⚠️ Warning (${count}/3): ${reason}`, { duration: 3000, position: "top-right" });
    setHardWarnings(count);
  };

  const handleProctoringLog = (msg) => {
    setProctoringLogs((prev) => [...prev, msg]);
    console.log("[PROCTORING]", msg);
  };

  const proctorHook = useVideoProctor(
    videoRef,
    handleProctoringHardWarning,
    handleProctoringLog,
    testid
  );

  // ❌ REMOVE THIS LINE - Delete legacy proctoring hook
  // const { warningCount, isProctoringReady, isInitializing, isExamActive } =
  //   useProctoring(testid, true, true);

  const [showFinalSubmission, setShowFinalSubmission] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [loadedPages, setLoadedPages] = useState(new Set([1]));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [questionMap, setQuestionMap] = useState(new Map());
  const QUESTIONS_PER_PAGE = 10;

  // Start video proctoring when component mounts
  useEffect(() => {
    const startProctoring = async () => {
      const started = await proctorHook.start();
      if (!started) {
        console.warn("Video proctoring failed to start");
      }
    };

    startProctoring();

    return () => {
      proctorHook.stop();
    };
  }, []);

  // Only block browser navigation (beforeunload)
  useEffect(() => {
    const blockBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "Are you sure you want to leave? Your exam progress may be lost.";
    };

    window.addEventListener("beforeunload", blockBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", blockBeforeUnload);
    };
  }, []);

  // Block F5, F12, and all function keys
  useEffect(() => {
    const blockFunctionKeys = (e) => {
      if ((e.keyCode >= 112 && e.keyCode <= 123) || e.key === "F5" || e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Function keys are disabled during the test.");
        return false;
      }
    };
    window.addEventListener("keydown", blockFunctionKeys, true);
    return () => window.removeEventListener("keydown", blockFunctionKeys, true);
  }, []);

  // ✅ FIX: Use useRef to access latest answers without re-registering listener
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ✅ FIX: Stable auto-submit handler (no dependencies that change frequently)
  useEffect(() => {
    const handleAutoSubmit = async (event) => {
      console.log("🚨 AUTO-SUBMIT TRIGGERED", event.detail);
      
      const answeredCount = Object.keys(answersRef.current).length;
      const reason = event.detail?.reason || "Proctoring violations";
      
      const token = localStorage.getItem("userToken");
      try {
        await post("/api/exam/submit", { examId: testid }, {
          Authorization: `Bearer ${token}`,
        });
        console.log("✅ Exam submitted successfully");
        toast.success("Test auto-submitted due to violations");
      } catch (error) {
        console.error("❌ Auto-submit error:", error);
        toast.error("Failed to submit test");
      }

      navigate(`/test/thankyou/${testid}`, { 
        state: { answered: answeredCount, reason },
        replace: true 
      });
    };

    console.log("✅ Registering autoSubmitExam listener");
    window.addEventListener("autoSubmitExam", handleAutoSubmit);
    
    return () => {
      console.log("❌ Removing autoSubmitExam listener");
      window.removeEventListener("autoSubmitExam", handleAutoSubmit);
    };
  }, [testid, navigate, post]); // Only stable dependencies

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
    setDurationMinutes(receivedData.durationMinutes || 120);
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

  const handleAutoExamSubmit = async (reason) => {
    console.log("🚨 MANUAL AUTO-SUBMIT", reason);
    
    const answeredCount = Object.keys(answers).length;
    
    const token = localStorage.getItem("userToken");
    try {
      await post("/api/exam/submit", { examId: testid }, {
        Authorization: `Bearer ${token}`,
      });
    } catch (error) {
      console.error("Auto-submit error:", error);
    }

    navigate(`/test/thankyou/${testid}`, { 
      state: { answered: answeredCount, reason },
      replace: true 
    });
  };

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

  // ✅ FIX 1: Sync answers with attempts on component mount and when attempts change
  useEffect(() => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion._id;
    const attemptStatus = getAttemptStatus(questionId);
    
    // Load existing answer from attempt if available
    if (attemptStatus.answered && attemptStatus.value.length > 0) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: currentQuestion.questionType === "multiple" 
          ? attemptStatus.value 
          : attemptStatus.value[0]
      }));
    }
  }, [currentQuestion, attempts, getAttemptStatus]);

  // ✅ FIX 2: Improved saveOrUpdateAnswer with better logging
  const saveOrUpdateAnswer = async () => {
    if (!currentQuestion) {
      console.log("❌ No current question");
      return false;
    }

    const questionId = currentQuestion._id;
    const answerValue = answers[questionId];
    const attemptStatus = getAttemptStatus(questionId);

    console.log("💾 Saving answer:", {
      questionId,
      answerValue,
      attemptStatus,
      questionType: currentQuestion.questionType
    });

    // Check if there's an answer to save
    const hasAnswer =
      answerValue !== undefined &&
      (Array.isArray(answerValue)
        ? answerValue.length > 0
        : answerValue !== null && answerValue !== "");

    if (!hasAnswer) {
      console.log("ℹ️ No answer to save");
      return true; // Not an error - just no answer
    }

    // Normalize to array format
    let selectedIndex = Array.isArray(answerValue)
      ? answerValue
      : [answerValue];

    console.log("📤 Normalized answer:", selectedIndex);

    try {
      let success = false;
      
      // Determine save vs edit based on attempt status
      if (!attemptStatus.answered || attemptStatus.isNew) {
        console.log("🆕 Creating new answer");
        success = await saveAttempt(testid, questionId, selectedIndex);
      } else {
        console.log("✏️ Editing existing answer");
        success = await editAttempt(testid, questionId, selectedIndex);
      }

      if (success) {
        console.log("✅ Answer saved successfully");
        toast.success("Answer saved", { duration: 1000 });
      } else {
        console.error("❌ Failed to save answer");
        toast.error("Failed to save answer");
      }

      return success;
    } catch (error) {
      console.error("❌ Error saving answer:", error);
      toast.error("Error saving answer");
      return false;
    }
  };

  // ✅ FIX 3: Improved handleNext with proper error handling
  const handleNext = async () => {
    console.log("➡️ Moving to next question");
    
    // Mark current question as visited
    setVisitedQuestions((prev) => new Set([...prev, currentQuestionIndex]));
    
    const saved = await saveOrUpdateAnswer();
    if (!saved && answers[currentQuestion._id]) {
      // If save failed and there was an answer, ask user
      const proceed = window.confirm(
        "Failed to save answer. Do you want to continue anyway?"
      );
      if (!proceed) return;
    }

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

  // ✅ FIX 4: Improved handlePrevious
  const handlePrevious = async () => {
    console.log("⬅️ Moving to previous question");
    
    const saved = await saveOrUpdateAnswer();
    if (!saved && answers[currentQuestion._id]) {
      const proceed = window.confirm(
        "Failed to save answer. Do you want to continue anyway?"
      );
      if (!proceed) return;
    }

    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setVisitedQuestions((prev) => new Set([...prev, prevIndex]));
      setCurrentQuestionIndex(prevIndex);
      
      const prevQuestion = questionMap.get(prevIndex);
      if (prevQuestion) {
        initializeQuestion(prevQuestion._id);
      }
    }
  };

  // ✅ FIX 5: Improved handleClearResponse with confirmation
  const handleClearResponse = async () => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion._id;
    const hasAnswer = answers[questionId] !== undefined;
    
    if (!hasAnswer) {
      toast.error("No answer to clear");
      return;
    }

    const confirmClear = window.confirm(
      "Are you sure you want to clear your response?"
    );
    
    if (!confirmClear) return;

    console.log("🗑️ Clearing answer for question:", questionId);

    try {
      const success = await clearAttempt(testid, questionId);

      if (success) {
        // Clear local state
        const updatedAnswers = { ...answers };
        delete updatedAnswers[questionId];
        setAnswers(updatedAnswers);

        const updatedMarked = { ...markedForReview };
        delete updatedMarked[questionId];
        setMarkedForReview(updatedMarked);

        toast.success("Response cleared");
        console.log("✅ Answer cleared successfully");
      }
    } catch (error) {
      console.error("❌ Error clearing answer:", error);
      toast.error("Failed to clear response");
    }
  };

  // ✅ FIX 6: Improved handleMarkForReview
  const handleMarkForReview = async () => {
    if (!currentQuestion) return;
    
    console.log("🔖 Marking for review");
    
    // Save current answer first
    await saveOrUpdateAnswer();
    
    setMarkedForReview({
      ...markedForReview,
      [currentQuestion._id]: true,
    });
    
    toast.success("Marked for review", { duration: 1000 });
  };

  // ✅ FIX 7: Improved handleQuestionClick
  const handleQuestionClick = async (index) => {
    console.log("🎯 Clicking question:", index + 1);
    
    // Save current answer before switching
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
      {/* 🎥 Hidden Video Proctoring */}
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

      {/* ⚠️ Single Warning Counter Display */}
      {hardWarnings > 0 && (
        <div className="fixed top-20 right-4 space-y-2 z-50">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
            <p className="font-bold">🚨 Warnings: {hardWarnings}/3</p>
            <p className="text-xs mt-1">Auto-submit at 3 warnings</p>
          </div>
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