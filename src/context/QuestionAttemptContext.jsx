import React, { createContext, useContext, useState, useCallback } from "react";
import { useHttp } from "../hooks/useHttp";
import { toast } from "react-hot-toast";

const QuestionAttemptContext = createContext();

export function useQuestionAttempt() {
  return useContext(QuestionAttemptContext);
}

export function QuestionAttemptProvider({ children }) {
  const { post } = useHttp();
  const [attempts, setAttempts] = useState({});

  const normalizeSelectedIndex = (value) => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  };

  const initializeQuestion = useCallback(
    (questionId) => {
      setAttempts((prev) => {
        if (prev[questionId]) return prev;
        return {
          ...prev,
          [questionId]: {
            answered: false,
            value: [],
            cleared: false,
            isNew: true,
          },
        };
      });
    },
    [setAttempts]
  );

  const saveAnswer = async (examId, questionId, value) => {
    const token = localStorage.getItem("userToken");
    const selectedIndex = normalizeSelectedIndex(value);

    const body = {
      examId,
      answer: { questionId, selectedIndex },
    };

    console.log("📤 CREATE API Call:", body);

    const res = await post("/api/attempts/create", body, {
      Authorization: `Bearer ${token}`,
    });

    console.log("📥 CREATE API Response:", res);

    if (res && res.success) {
      setAttempts((prev) => ({
        ...prev,
        [questionId]: {
          answered: true,
          value: selectedIndex,
          cleared: false,
          isNew: false,
        },
      }));

      return true;
    }

    return false;
  };

  const editAnswer = async (examId, questionId, value) => {
    const token = localStorage.getItem("userToken");
    const selectedIndex = normalizeSelectedIndex(value);

    const body = {
      examId,
      answer: { questionId, selectedIndex },
    };

    console.log("📤 EDIT API Call:", body);

    const res = await post("/api/attempts/edit", body, {
      Authorization: `Bearer ${token}`,
    });

    console.log("📥 EDIT API Response:", res);

    if (res && res.success) {
      setAttempts((prev) => ({
        ...prev,
        [questionId]: {
          answered: selectedIndex.length > 0,
          value: selectedIndex,
          cleared: false,
          isNew: false,
        },
      }));

      return true;
    }

    return false;
  };

  const clearAnswer = async (examId, questionId) => {
    const token = localStorage.getItem("userToken");
    const body = { examId, questionId };

    const res = await post("/api/attempts/delete", body, {
      Authorization: `Bearer ${token}`,
    });

    if (res && res.success) {
      setAttempts((prev) => ({
        ...prev,
        [questionId]: {
          answered: false,
          value: [],
          cleared: true,
          isNew: false,
        },
      }));
      return true;
    }
    toast.error("Failed to clear answer");
    return false;
  };

  const getAttemptStatus = useCallback(
    (questionId) => {
      return attempts[questionId] || { answered: false, value: [], cleared: false, isNew: true };
    },
    [attempts]
  );

  const isAttempted = useCallback(
    (questionId) => {
      const status = attempts[questionId];
      return status && !status.isNew;
    },
    [attempts]
  );

  const initializeQuestions = useCallback(
    (questionIds) => {
      setAttempts((prev) => {
        const updated = { ...prev };
        questionIds.forEach((qId) => {
          if (!updated[qId]) {
            updated[qId] = {
              answered: false,
              value: [],
              cleared: false,
              isNew: true,
            };
          }
        });
        return updated;
      });
    },
    [setAttempts]
  );

  return (
    <QuestionAttemptContext.Provider
      value={{
        attempts,
        saveAnswer,
        editAnswer,
        clearAnswer,
        initializeQuestion,
        getAttemptStatus,
        isAttempted,
        initializeQuestions,
      }}
    >
      {children}
    </QuestionAttemptContext.Provider>
  );
}