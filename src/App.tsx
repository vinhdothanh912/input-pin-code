import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";

import "./App.scss";

enum InputRule {
  ONLY_NUMBER = "ONLY_NUMBER",
  ALL = "ALL",
}

const App = () => {
  const [inputs, setInputs] = useState([
    { index: 0, value: "" },
    { index: 1, value: "" },
    { index: 2, value: "" },
    { index: 3, value: "" },
    { index: 4, value: "" },
  ]);
  const [numberInput, setNumberInput] = useState(5);
  const [hidden, setHidden] = useState(false);
  const [inputRule, setInputRule] = useState(InputRule.ONLY_NUMBER);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const value = e.target.value.replaceAll(" ", "");

    let numberValue = Number(value);
    if (value === "") {
      const newInputs = inputs.map((input) =>
        input.index === currentIndex ? { ...input, value: "" } : input
      );

      setInputs(newInputs);
      return;
    }

    if (
      (numberValue >= 0 && inputRule === InputRule.ONLY_NUMBER) ||
      inputRule === InputRule.ALL
    ) {
      let i = -1;
      const newInputs = inputs.map((input) => {
        if (input.index >= currentIndex && i < value.length - 1) {
          i += 1;
          return { ...input, value: value[i] };
        }

        return input;
      });

      setInputs(newInputs);

      // focus to next index
      document.getElementById(`input${currentIndex}`)!.blur();

      const nextIndex = currentIndex + i + 1;
      if (nextIndex >= inputs.length) return;
      document.getElementById(`input${nextIndex}`)!.focus();
    }
  };

  const handleChangeNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.includes(" ")) return;

    if (Number(value) >= 0) {
      setNumberInput(Number(value));
    }
  };

  const handleSaveNumberInput = () => {
    let newInputs = [...inputs];

    if (numberInput < inputs.length) {
      newInputs = inputs.slice(0, numberInput);
    } else {
      for (let i = inputs.length; i < numberInput; i++) {
        newInputs.push({ index: i, value: "" });
      }
    }

    setInputs(newInputs);
  };

  const handleKeyDown = (event: { key: any }, index: number) => {
    if (event.key === "Backspace" && index > 0 && !inputs[index].value) {
      document.getElementById(`input${index - 1}`)!.focus();
    }
  };

  const handleChangeRuleInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: nextValue } = e.target;
    if (inputRule === InputRule.ALL && nextValue === InputRule.ONLY_NUMBER) {
      const newInputs = inputs.map((input) =>
        isNaN(Number(input.value)) ? { ...input, value: "" } : input
      );

      if (!_.isEqual(newInputs, inputs)) {
        setInputs(newInputs);
      }
    }

    setInputRule(e.target.value as InputRule);
  };

  const handleResetInput = () => {
    const newInputs = inputs.map((input) => ({ ...input, value: "" }));
    setInputs(newInputs);

    document.getElementById(`input${0}`)!.focus();
  };

  const handleSubmit = useCallback(() => {
    if (inputs.some((input) => !input.value)) {
      setIsError(true);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(
          `Code Input Params: ${JSON.stringify(
            inputs.map((input) => input.value).join("")
          )}`
        );
      }, 1000);
    }
  }, [inputs]);

  useEffect(() => {
    document.getElementById(`input${0}`)!.focus();
  }, []);

  useEffect(() => {
    if (inputs.every((input) => input.value)) {
      handleSubmit();
    }
  }, [handleSubmit, inputs]);

  return (
    <div className="App">
      <h2 className="App-title">PIN CODE TEST</h2>

      <div>
        <div className="App-inputs">
          {inputs.map((input, index) => (
            <input
              key={`input${index}`}
              id={`input${index}`}
              className="App-inputs__input"
              value={input.value}
              type={hidden ? "password" : "text"}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onChange={(e) => handleChangeInput(e, index)}
              onFocus={(e) => e.target.select()}
              disabled={loading}
            />
          ))}
        </div>
        {isError && <p className="error-text">Please fill all input boxs</p>}
      </div>

      <div>
        <div className="App-numberInput">
          <label htmlFor="numberInput" className="App-numberInput__label">
            Number of Input:
          </label>
          <input
            id="numberInput"
            className="App-numberInput__input"
            value={numberInput}
            onChange={handleChangeNumberInput}
          />
          <button
            className="App-numberInput__button"
            disabled={numberInput < 3 || numberInput > 200}
            onClick={handleSaveNumberInput}
          >
            Save
          </button>
        </div>
        {(numberInput < 3 || numberInput > 200) && (
          <p className="error-text">
            Please enter a number greater than or equal to 3 and less than or
            equal 200
          </p>
        )}
      </div>

      <div>
        <div className="App-ruleInput">
          <label htmlFor="ruleInput" className="App-ruleInput__label">
            Rules of Input:
          </label>
          <select
            id="ruleInput"
            className="App-ruleInput__input"
            value={inputRule}
            onChange={handleChangeRuleInput}
          >
            {Object.values(InputRule).map((key) => (
              <option key={key} value={InputRule[key]}>
                {InputRule[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="App-footer">
        <button onClick={() => setHidden(!hidden)} disabled={loading}>
          {hidden ? "Show" : "Hide"} PIN CODE
        </button>
        <button onClick={handleResetInput} disabled={loading}>
          Reset
        </button>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submiting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default App;
