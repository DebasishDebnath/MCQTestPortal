import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import QuestionsGrid from "../../components/user/QuestionsGrid";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import FinalSubmission from "../../components/user/FinalSubmission";

function TestQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFinalSubmission, setShowFinalSubmission] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set()); // Start empty - no questions visited initially

  useEffect(() => {
    // Get questions from navigation state
    const receivedData = location.state?.questions;
    
    console.log("📝 Received data in TestQuestion:", receivedData);

    if (!receivedData) {
      console.log("❌ No data found, redirecting to instructions");
      navigate("/instruction");
      return;
    }

    // Extract questions array from the response
    const questionsList = receivedData.questions || [];
    
    console.log("📊 Questions count:", receivedData.questionCount);
    console.log("📋 Questions list:", questionsList);

    if (!questionsList || questionsList.length === 0) {
      console.log("❌ No questions found, redirecting to instructions");
      navigate("/instruction");
      return;
    }

    setQuestions(questionsList);
    setVisitedQuestions(new Set()); // Don't mark any question as visited initially
  }, [location.state, navigate]);

  useEffect(() => {
    const handleOpenFinalSubmission = () => setShowFinalSubmission(true);

    window.addEventListener('openFinalSubmission', handleOpenFinalSubmission);

    return () => {
      window.removeEventListener('openFinalSubmission', handleOpenFinalSubmission);
    };
  }, []);

  // Generate question grid data based on actual questions and their states
  const getQuestionGridData = () => {
    return questions.map((q, index) => {
      const questionId = q._id;
      const hasAnswer = answers[questionId] !== undefined && 
        (Array.isArray(answers[questionId]) ? answers[questionId].length > 0 : answers[questionId] !== null);
      const isMarked = markedForReview[questionId];
      const isVisited = visitedQuestions.has(index);

      let status = "blank"; // Default is "not visited"
      
      // Only change status if the question has been visited
      if (isVisited) {
        // Check if question is marked for review (highest priority)
        if (isMarked) {
          status = "marked";
        } 
        // Check if question has an answer
        else if (hasAnswer) {
          status = "answered";
        } 
        // Question was visited but not answered
        else {
          status = "unanswered";
        }
      }

      return {
        number: index + 1,
        status: status,
        questionId: questionId
      };
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    console.log(`✅ Selected option ${optionIndex} for question ${currentQuestion._id}`);
    
    // Mark current question as visited when answering
    setVisitedQuestions(prev => new Set([...prev, currentQuestionIndex]));
    
    // For multiple choice, don't save empty arrays
    if (Array.isArray(optionIndex) && optionIndex.length === 0) {
      const updatedAnswers = { ...answers };
      delete updatedAnswers[currentQuestion._id];
      setAnswers(updatedAnswers);
      return;
    }
    
    setAnswers({
      ...answers,
      [currentQuestion._id]: optionIndex
    });
    
    // Remove from marked for review if answer is selected
    if (markedForReview[currentQuestion._id]) {
      const updatedMarked = { ...markedForReview };
      delete updatedMarked[currentQuestion._id];
      setMarkedForReview(updatedMarked);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      console.log(`➡️ Moving to question ${nextIndex + 1}`);
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      console.log(`⬅️ Moving to question ${prevIndex + 1}`);
      setVisitedQuestions(prev => new Set([...prev, prevIndex]));
      setCurrentQuestionIndex(prevIndex);
    }
  };

  const handleClearResponse = () => {
    console.log(`🗑️ Clearing response for question ${currentQuestion._id}`);
    const updatedAnswers = { ...answers };
    delete updatedAnswers[currentQuestion._id];
    setAnswers(updatedAnswers);
    
    // Also remove from marked for review when clearing
    const updatedMarked = { ...markedForReview };
    delete updatedMarked[currentQuestion._id];
    setMarkedForReview(updatedMarked);
  };

  const handleMarkForReview = () => {
    console.log(`🔖 Marking question ${currentQuestion._id} for review`);
    
    // Mark current question as visited
    setVisitedQuestions(prev => new Set([...prev, currentQuestionIndex]));
    
    setMarkedForReview({
      ...markedForReview,
      [currentQuestion._id]: true
    });
  };

  const handleQuestionClick = (index) => {
    console.log(`🎯 Jumping to question ${index + 1}`);
    setVisitedQuestions(prev => new Set([...prev, index]));
    setCurrentQuestionIndex(index);
  };

  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-screen">Loading questions...</div>;
  }

  return (
    <div className={`flex flex-col w-full h-full poppins`}>
      {showFinalSubmission && 
      <div className="w-full min-h-screen bg-black/50 backdrop-blur-xs z-20 absolute top-0 left-0 transition-opacity duration-500">
        <FinalSubmission 
          onClose={() => setShowFinalSubmission(false)}
          questions={questions}
          answers={answers}
          markedForReview={markedForReview}
          questionGridData={getQuestionGridData()}
        />
        </div>
      }

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
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            <div className="h-0.5 w-full bg-gray-300 mt-4"></div>
            
            {/* Question Text */}
            <p className="my-10 text-xl font-semibold">{currentQuestion.questionText}</p>
            
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
                <span className="text-blue-600 font-semibold">Multiple Correct Answers</span>
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
                    type={currentQuestion.questionType === "multiple" ? "checkbox" : "radio"}
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
                        const currentAnswers = answers[currentQuestion._id] || [];
                        const newAnswers = currentAnswers.includes(index)
                          ? currentAnswers.filter(i => i !== index)
                          : [...currentAnswers, index];
                        handleAnswerSelect(newAnswers);
                      } else {
                        handleAnswerSelect(index);
                      }
                    }}
                  />
                  <label htmlFor={`option-${index}`} className="text-lg cursor-pointer flex items-center gap-2">
                    <span>{String.fromCharCode(65 + index)}.</span>
                    {optionObj.optionImageUrl ? (
                      <img src={optionObj.optionImageUrl} alt={`Option ${index + 1}`} className="max-w-xs rounded" />
                    ) : (
                      <span>{optionObj.optionText}</span>
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
            onClick={currentQuestionIndex === questions.length - 1 ? () => setShowFinalSubmission(true) : handleNext}
            className="cursor-pointer w-40 py-1.5 p-2 bg-green-400 text-white rounded-full flex items-center justify-center gap-4"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Save and next'} 
            {currentQuestionIndex !== questions.length - 1 && <FaArrowRightLong />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestQuestion;
