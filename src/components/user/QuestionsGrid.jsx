import React from "react";

function QuestionsGrid({ questions, onQuestionClick }) {
  const getShape = (type) => {
    if (type === "answered") return "square";
    if (type === "marked") return "triangle";
    if (type === "unanswered") return "circle";
    return "blank";
  };

  const getColor = (type) => {
    if (type === "answered") return "bg-green-400";
    if (type === "marked") return "bg-indigo-400";
    if (type === "unanswered") return "bg-yellow-400";
    return "bg-gray-300";
  };

  return (
    <div className="p-6 border-2 border-gray-300 rounded-2xl ">
      <div className="flex flex-wrap gap-2 text-center font-semibold text-[10px] w-fit">
        {questions.map((q, index) => {
          const shape = getShape(q.status);
          const color = getColor(q.status);

          return (
            <div
              key={index}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onQuestionClick && onQuestionClick(index)}
            >
              {shape === "square" && (
                <div
                  className={`w-8 h-8 flex items-center justify-center text-white ${color}`}
                >
                  {q.number}
                </div>
              )}
              {shape === "triangle" && (
                <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[32px] border-l-transparent border-r-transparent border-b-purple-700 flex items-center justify-center relative">
                  <span className="absolute top-3 text-white font-medium">
                    {q.number}
                  </span>
                </div>
              )}
              {shape === "circle" && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}
                >
                  {q.number}
                </div>
              )}
              {shape === "blank" && (
                <div className="w-8 h-8 bg-gray-200 flex items-center justify-center">
                  {q.number}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 text-xs pt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500"></div> Answered
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-purple-700"></div>
          Marked for Review
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div> Unanswered
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200"></div> Not Visited
        </div>
      </div>
    </div>
  );
}

export default QuestionsGrid;
