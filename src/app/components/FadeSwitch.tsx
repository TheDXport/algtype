import React, { useState, useEffect } from "react";
import TypingScreen from "./TypingScreen";
import Results from "./Results";

interface FadeSwitchProps {
  algorithmName: string;
  programmingLanguage: string;
  originalContent: string;
  typedContent: string;
  totalTimeSpent: number;
}

const FadeSwitch: React.FC<FadeSwitchProps> = ({
  algorithmName,
  programmingLanguage,
  originalContent,
  typedContent,
  totalTimeSpent,
}) => {
  const [counter, setCounter] = useState<number>(0);
  const [showComponentA, setShowComponentA] = useState<boolean>(true);
  const [showComponentB, setShowComponentB] = useState<boolean>(false);
  const [compAFaded, setCompAFaded] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counter >= 0) {
      setShowComponentA(false);
      setTimeout(() => {
        setCompAFaded(true);
        setShowComponentB(true);
      }, 200);
    }
  }, [counter]);

  return (
    <div>
      {/* Typing Screen */}
      <div
        className={`transition-opacity duration-200 ${
          showComponentA ? "opacity-100" : "opacity-0"
        }`}
      >
        {!compAFaded ? <TypingScreen /> : null}
      </div>

      {/* Results Screen */}
      <div
        className={`${
          showComponentB ? "opacity-100" : "opacity-0"
        } transition-opacity duration-200`}
      >
        {showComponentB ? (
          <Results
            algorithmName={algorithmName}
            programmingLanguage={programmingLanguage}
            originalContent={originalContent}
            typedContent={typedContent}
            totalTimeSpent={totalTimeSpent}
          />
        ) : null}
      </div>
    </div>
  );
};

export default FadeSwitch;
