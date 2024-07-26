import axios from "axios";
import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";

const App = () => {
  const [inputs, setInputs] = useState(["", "", "", "", ""]);
  const [wordKey, setWordKey] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("Please enter a word");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const DATE = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const getCurrentQuestion = async () => {
      const { data } = await axios.get(`/api/nytimes/${DATE}.json`);
      setWordKey(data?.solution);
    };
    getCurrentQuestion();
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const isWordValid = async (word: string): Promise<boolean> => {
    try {
      const { data } = await axios.get(`/api/dictionary/${word}`);
      return !!data?.[0]?.word;
    } catch (error) {
      return false;
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newInputs = [...inputs];
    newInputs[index] = value.toUpperCase();
    setInputs(newInputs);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const enteredWord = inputs.join("").toLowerCase();
    const valid = await isWordValid(enteredWord);

    if (valid) {
      if (wordKey === enteredWord) {
        setDisplayText("Correct guess");
      } else {
        setDisplayText("Try again...");
      }
    } else {
      setDisplayText("Word is invalid");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inputs.every((input) => input.length === 1)) {
      handleSubmit();
    }
  }, [inputs]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "white", backgroundColor: "#343434", minHeight: "100vh" }}>
      <h1 style={{fontFamily: 'monospace'}}>WORDLE CLONE</h1>
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {inputs.map((input, index) => (
          <input key={index} value={input} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} ref={(el) => (inputRefs.current[index] = el)} maxLength={1} style={{ width: "20px", textAlign: "center", minHeight: "5rem", minWidth: "5rem", border: 'solid 1px #e0e0e0' , borderRadius: '15%', margin: '0.5rem', fontFamily: 'monospace', fontSize: '1.5rem', backgroundColor: '#343434', color: '#e0e0e0' }} />
        ))}
      </form>
      <p style={{fontFamily: 'monospace', fontSize: '0.75rem'}}>{loading ? "Checking..." : displayText}</p>
    </div>
  );
};

export default App;
