"use client";
import React, { useState, useEffect } from "react";
import { FaGithubSquare } from "react-icons/fa";
import Header from "./components/Header";
import TypingArea from "./components/TypingArea";
import FadeSwitch from "./components/FadeSwitch";
import { IBM_Plex_Mono, Geist } from "next/font/google";
import Link from "next/link";
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type AlgorithmName =
  | "1. Two Sum"
  | "9. Palindrome Number"
  | "13. Roman to Integer"
  | "14. Longest Common Prefix"
  | "20. Valid Parentheses"
  | "21. Merge Two Sorted Lists"
  | "26. Remove Duplicates From Sorted Array"
  | "27. Remove Element";
// | "28. Find the Index of the First Occurrence in a String"
// | "35. Search Insert Position"
// | "58. Length of Last Word"
// | "66. Plus One"
// | "67. Add Binary"
// | "69. Sqrt(x)"
// | "70. Climbing Stairs"
// | "83. Remove Duplicates from Sorted List"
// | "88. Merge Sorted Array"
// | "104. Maximum Depth of Binary Tree"
// | "121. Best Time to Buy and Sell Stock"
// | "125. Valid Palindrome"
// | "367. Valid Perfect Square"
// | "704. Binary Search"

type LanguageName = "Java" | "Python" | "Javascript" | "Cpp";

const algorithms: AlgorithmName[] = [
  "1. Two Sum",
  "9. Palindrome Number",
  "13. Roman to Integer",
  "14. Longest Common Prefix",
  "20. Valid Parentheses",
  "21. Merge Two Sorted Lists",
  "26. Remove Duplicates From Sorted Array",
  "27. Remove Element",
  // "28. Find the Index of the First Occurrence in a String",
  // "35. Search Insert Position",
  // "58. Length of Last Word",
  // "66. Plus One",
  // "67. Add Binary",
  // "69. Sqrt(x)",
  // "70. Climbing Stairs",
  // "83. Remove Duplicates from Sorted List",
  // "88. Merge Sorted Array",
  // "104. Maximum Depth of Binary Tree",
  // "121. Best Time to Buy and Sell Stock",
  // "125. Valid Palindrome",
  // "367. Valid Perfect Square",
  // "704. Binary Search",
];

algorithms.sort((a, b) => {
  const numA = parseInt(a.split(".")[0], 10);
  const numB = parseInt(b.split(".")[0], 10);
  return numA - numB;
});

const Main: React.FC = () => {
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName>(
    algorithms[Math.floor(Math.random() * algorithms.length)]
  );
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageName>("Java");
  const [algorithmContent, setAlgorithmContent] = useState<string>("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [tabPressed, setTabPressed] = useState<boolean>(false);
  const [restartCounter, setRestartCounter] = useState(0);
  const [typingAreaVisible, setTypingAreaVisible] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setTypingAreaVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch source code dynamically based on the selected algorithm and language
  useEffect(() => {
    const fetchAlgorithmContent = async () => {
      try {
        const algorithmFolder = selectedAlgorithm.replace(/\s+/g, "");
        const baseName = selectedAlgorithm.replace(/\s+/g, "");

        const extensions: Record<LanguageName, string> = {
          Java: "java",
          Python: "py",
          Javascript: "js",
          Cpp: "cpp",
        };

        const filePath = `../../algorithms/${algorithmFolder}/${baseName}.${extensions[selectedLanguage]}`;
        const response = await fetch(filePath);
        const content = await response.text();
        setAlgorithmContent(content);
      } catch (error) {
        console.error("Failed to load algorithm content:", error);
        setAlgorithmContent("Error loading content. Please try again.");
      }
    };

    fetchAlgorithmContent();
  }, [selectedAlgorithm, selectedLanguage]);

  const handleTypingStart = () => {
    if (!isTypingStarted) {
      setIsTypingStarted(true);
      setStartTime(Date.now()); // Record the start time only once
    }
  };

const handleTypingComplete = (errors: number) => {
  setTotalErrors(errors);
  if (startTime) {
    const endTime = Date.now();
    setTimeElapsed((endTime - startTime) / 1000); // Convert ms to seconds
  }
  setTypingComplete(true);
};

  useEffect(() => {
    const handleRestart = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Tab") {
        e.preventDefault();
        window.location.href = "/";
      }
    };

    window.addEventListener("keydown", handleRestart);
    return () => window.removeEventListener("keydown", handleRestart);
  }, []);

  const handleRestart = () => {
    if (typingComplete) {
      setResultsVisible(false);
    } else {
      setTypingAreaVisible(false);
    }

    setTimeout(() => {
      setIsTypingStarted(false);
      setTypingComplete(false);
      setStartTime(null);
      setTimeElapsed(0);
      setTotalErrors(0);
      setRestartCounter((prev) => prev + 1);
      setTypingAreaVisible(true);
      setResultsVisible(true);
    }, 500);
  };

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if ((isTypingStarted || typingComplete) && e.key === "Tab") {
        e.preventDefault();
        setTabPressed(true);
      }
      if (
        (isTypingStarted || typingComplete) &&
        e.key === "Enter" &&
        tabPressed
      ) {
        e.preventDefault();
        handleRestart();
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setTabPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [tabPressed, isTypingStarted, typingComplete]);

  return (
    <div
      className={`bg-black relative ${
        isTypingStarted || typingComplete ? "unselectable" : ""
      }`}
    >
      <div className="min-h-screen overflow-x-auto flex flex-col justify-center items-center relative">
        <div className="h-auto w-[99%] md:w-[90%] lg:w-[85%] md:ml-28 lg:ml-40 xl:ml-60 flex flex-col justify-start">
          <div
            className={`transition-opacity duration-500 ${
              isTypingStarted ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Header
              onAlgorithmSelect={(algorithm: AlgorithmName) =>
                setSelectedAlgorithm(algorithm)
              }
              selectedAlgorithm={selectedAlgorithm}
              onLanguageSelect={(language: LanguageName) =>
                setSelectedLanguage(language)
              }
              selectedLanguage={selectedLanguage}
            />
          </div>
          {typingComplete ? (
            <div
              className={`transition-opacity duration-500 ${
                resultsVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <FadeSwitch
                algorithmName={selectedAlgorithm}
                programmingLanguage={selectedLanguage}
                originalContent={algorithmContent}
                totalTimeSpent={timeElapsed}
                totalErrors={totalErrors}
              />
            </div>
          ) : (
            <div
              className={`w-auto transition-opacity duration-500 ${
                typingAreaVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <TypingArea
                key={restartCounter}
                lines={algorithmContent.split("\n")}
                onTypingStart={handleTypingStart}
                onTypingComplete={handleTypingComplete}
              />
            </div>
          )}
        </div>
        <h1
          className={`flex justify-start ${ibmPlexMono.className} text-[#646464] sm:text-xs md:text-md lg:text-lg font-medium top-40 relative space-x-3`}
        >
          <span className="italic">
            <span className="border-2 px-3 py-1 rounded-md border-[#646464]">
              tab
            </span>{" "}
            +{" "}
            <span className="border-2 px-3 py-1 rounded-md border-[#646464]">
              enter
            </span>
          </span>
          <span>to restart</span>
        </h1>
        <footer className="fixed bottom-6 right-6 flex items-center justif-center space-x-3">
          <h2
            className={`text-[#484b52] ${geist.className} font-semibold sm:text-sm md:text-lg transition-all duration-300 hover:text-gray-200 hover:-translate-y-1`}
          >
            made by xinathan
          </h2>
          <Link href="https://github.com/TheDXport/leet.type" className="group">
            <FaGithubSquare
              size={32}
              className="text-[#484b52] transition-all duration-300 group-hover:text-gray-200 group-hover:-translate-y-1"
            />
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Main;
