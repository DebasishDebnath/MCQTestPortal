import React from "react";
import { MdArrowDropDown } from "react-icons/md";
import QuestionsGrid from "../../components/user/QuestionsGrid";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

function TestQuestion() {
  const question = {
    id: 1,
    text: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
  };

  const data = [
    { number: 1, status: "answered" },
    { number: 2, status: "marked" },
    { number: 3, status: "unanswered" },
    { number: 4, status: "blank" },
    { number: 5, status: "blank" },
    { number: 6, status: "answered" },
    { number: 7, status: "marked" },
    { number: 8, status: "unanswered" },
    { number: 9, status: "blank" },
    { number: 10, status: "blank" },
    { number: 11, status: "answered" },
    { number: 12, status: "marked" },
    { number: 13, status: "unanswered" },
    { number: 14, status: "blank" },
    { number: 15, status: "blank" },
    { number: 16, status: "answered" },
    { number: 107, status: "marked" },
    { number: 18, status: "unanswered" },
    { number: 19, status: "blank" },
    { number: 20, status: "blank" },
  ];
  return (
    <div className="flex flex-col w-full h-full poppins">
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
              Question {question.id}
            </h1>
            <div className="h-[2px] w-full bg-gray-300 mt-4"></div>
            <p className="my-10 text-xl font-semibold">{question.text}</p>
            <div className="flex flex-col gap-4">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 font-medium text-md"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    id={`option-${index}`}
                    className="w-5 h-5"
                  />
                  <label htmlFor={`option-${index}`} className="text-lg">
                    {String.fromCharCode(65 + index)}. {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Right section */}
          <div className="max-w-1/4 w-fit">
            <QuestionsGrid questions={data} />
          </div>
        </div>

        <div className="flex justify-center items-center max-w-[1440px] mx-auto w-full px-6 gap-6 p-6 justify-center text-sm">
          <button className="cursor-pointer w-40 py-1.5 p-2 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center gap-4">
            <FaArrowLeftLong />
            Previous
          </button>
          <button className="cursor-pointer w-40 py-1.5 p-2 bg-red-400 text-white rounded-full flex items-center justify-center gap-4">
            Clear Response
          </button>
          <button className="cursor-pointer w-40 py-1.5 p-2 bg-gray-400 text-white rounded-full flex items-center justify-center gap-4">
            Mark for review
          </button>
          <button className="cursor-pointer w-40 py-1.5 p-2 bg-green-400 text-white rounded-full flex items-center justify-center gap-4">
            Save and next <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestQuestion;
