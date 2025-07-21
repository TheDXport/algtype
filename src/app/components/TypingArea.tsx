import React, { useState, useEffect, useRef } from "react";

interface TypingAreaProps {
  lines: string[];
  onTypingStart: () => void;
  onTypingComplete: (totalErrors: number) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  lines,
  onTypingStart,
  onTypingComplete,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>([]);
  // Store the typed characters of the previous line so it can remain
  // visible for one extra iteration when the user moves to the next line
  const [prevLineTypedChars, setPrevLineTypedChars] = useState<string[]>([]);
  const [charIndex, setCharIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [lineTransition, setLineTransition] = useState(false);
  // Track if we've already transitioned off the first line so the first
  // transition does not trigger the slide animation
  const [hasLeftFirstLine, setHasLeftFirstLine] = useState(false);
  const typingContainerRef = useRef<HTMLDivElement>(null);

  const totalChars =
    lines
      .join("\n")
      .split("\n")
      .map((line) => line.replace(/^\s+/, ""))
      .join("\n").length - 1;

  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorBlink);
  }, []);

  useEffect(() => {
    typingContainerRef.current?.focus();
  }, [lines]);

  useEffect(() => {
    if (currentLineIndex > 1) {
      if (hasLeftFirstLine) {
        setLineTransition(true);
        const timeout = setTimeout(() => setLineTransition(false), 300);
        return () => clearTimeout(timeout);
      }
      setHasLeftFirstLine(true);
    }
    // Intentionally omit hasLeftFirstLine from dependencies so the first
    // transition does not trigger the animation when it updates to `true`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLineIndex]);

  const handleTyping = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onTypingStart();

    const keystroke = e.key;
    const currentLine = lines[currentLineIndex];
    const currentChar = currentLine[charIndex];

    // Skip non-printable keys
    if (
      keystroke.length > 1 &&
      keystroke !== "Backspace" &&
      keystroke !== " " &&
      keystroke !== "Enter"
    )
      return;

    // Handle Backspace
    if (keystroke === "Backspace") {
      if (charIndex > 0) {
        const prevCharIndex = charIndex - 1;

        setTypedChars((prev) => prev.slice(0, prevCharIndex));

        setCharIndex(prevCharIndex);
      }
      return;
    }

    // Handle printable characters
    if (charIndex < currentLine.length) {
      const isCorrect = keystroke === currentChar;

      if (!isCorrect) {
        setErrorCount((prev) => (prev < totalChars ? prev + 1 : prev));
      }

      setTypedChars((prev) => {
        const updated = [...prev];
        updated[charIndex] = isCorrect ? "correct" : "incorrect";
        return updated;
      });

      setCharIndex((prev) => prev + 1);
    }

    // Handle space and Enter for line transition
    if (
      (keystroke === " " || keystroke === "Enter") &&
      charIndex >= currentLine.length - 1
    ) {
      const nextLine = lines[currentLineIndex + 1];
      if (nextLine) {
        // Preserve the typed characters of the line just completed
        setPrevLineTypedChars(typedChars);

        const firstNonSpaceIndex = nextLine.search(/\S/);
        setCurrentLineIndex((prev) => prev + 1);
        setCharIndex(firstNonSpaceIndex >= 0 ? firstNonSpaceIndex : 0);
        setTypedChars([]);
      } else {
        handleCompletion();
      }
      return;
    }

    // Check if the last character of the last line is typed (e.g., semicolon)
    if (
      charIndex === currentLine.length - 1 &&
      currentLineIndex === lines.length - 1
    ) {
      handleCompletion();
    }
  };

  // ✅ Function to handle completion and send the typed content
  const handleCompletion = () => {
    onTypingComplete(errorCount);
  };

  return (
    <div
      ref={typingContainerRef}
      tabIndex={0}
      onKeyDown={handleTyping}
      className="w-full overflow-hidden outline-none flex flex-col  "
    >
      <div className={`space-y-4 ${lineTransition ? "slide-up" : ""}`}>
        {(() => {
          const sliceStart = Math.max(currentLineIndex - 1, 0);
          return lines
            .slice(sliceStart, sliceStart + 6)
            .map((line, lineIndex) => {
              const globalLineIndex = sliceStart + lineIndex;
              const isCurrentLine = globalLineIndex === currentLineIndex;
              const isPrevLine = globalLineIndex === currentLineIndex - 1;
              return (
                <div
                  key={lineIndex}
                  className="transition-all duration-500 sm:text-lg md:text-lg lg:text-2xl font-mono text-gray-300 sm:ml-8 md:ml-0"
                >
                  {line.split("").map((char, index) => {
                    const isCursor = isCurrentLine && index === charIndex;
                    const typedState = isCurrentLine
                      ? typedChars[index]
                      : isPrevLine
                      ? prevLineTypedChars[index]
                      : undefined;

                    return (
                      <span
                        key={index}
                        className={`${
                          typedState !== undefined
                            ? typedState === "correct"
                              ? "text-white"
                              : char === " "
                              ? "bg-red-500"
                              : "text-red-500"
                            : "text-gray-500"
                        } ${
                          isCursor && cursorVisible
                            ? "bg-[#3c3c3c] text-black"
                            : ""
                        }`}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    );
                  })}
                </div>
              );
            });
        })()}
      </div>
    </div>
  );
};

export default TypingArea;
