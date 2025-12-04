import React, { createContext, useContext, useState } from "react";
import { useHttp } from "../hooks/useHttp";
import { toast } from "react-hot-toast";

const QuestionAttemptContext = createContext();

export function useQuestionAttempt() {
  return useContext(QuestionAttemptContext);
}

export function QuestionAttemptProvider({ children }) {
  const { post } = useHttp();
  const [attempts, setAttempts] = useState({}); // { [questionId]: { answered: bool, value: [], cleared: bool } }

  // Helper to normalize selectedIndex to array
  const normalizeSelectedIndex = (value) => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  };

  // Save answer (create)
  const saveAnswer = async (examId, questionId, value) => {
    const token = localStorage.getItem("userToken");
    const selectedIndex = normalizeSelectedIndex(value);

    const body = {
      examId,
      answer: { questionId, selectedIndex },
    };

    const res = await post("/api/attempts/create", body, {
      Authorization: `Bearer ${token}`,
    });

    if (res && res.success) {
      setAttempts((prev) => ({
        ...prev,
        [questionId]: {
          answered: selectedIndex.length > 0,
          value: selectedIndex,
          cleared: false,
        },
      }));
      return true;
    }
    toast.error("Failed to save answer");
    return false;
  };

  // Edit answer
  const editAnswer = async (examId, questionId, value) => {
    const token = localStorage.getItem("userToken");
    const selectedIndex = normalizeSelectedIndex(value);

    const body = {
      examId,
      answer: { questionId, selectedIndex },
    };

    const res = await post("/api/attempts/edit", body, {
      Authorization: `Bearer ${token}`,
    });

    if (res && res.success) {
      setAttempts((prev) => ({
        ...prev,
        [questionId]: {
          answered: selectedIndex.length > 0,
          value: selectedIndex,
          cleared: false,
        },
      }));
      return true;
    }
    toast.error("Failed to update answer");
    return false;
  };

  // Clear answer
  const clearAnswer = async (examId, questionId) => {
    const token = localStorage.getItem("userToken");
    const body = { examId, questionId };

    const res = await post("/api/attempts/delete", body, {
      Authorization: `Bearer ${token}`,
    });

    if (res && res.success) {
      setAttempts((prev) => ({
        ...prev,
        [questionId]: { answered: false, value: [], cleared: true },
      }));
      return true;
    }
    toast.error("Failed to clear answer");
    return false;
  };

  return (
    <QuestionAttemptContext.Provider
      value={{ attempts, saveAnswer, editAnswer, clearAnswer }}
    >
      {children}
    </QuestionAttemptContext.Provider>
  );
}