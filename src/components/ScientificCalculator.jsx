import React, { useState } from 'react';
import './ScientificCalculator.css';

const ScientificCalculator = ({ onSaveEquation }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [isRadians, setIsRadians] = useState(true);
  const [savedEquations, setSavedEquations] = useState([]);
  const [showEquationsList, setShowEquationsList] = useState(false);

  const handleNumber = (num) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    setExpression(expression + display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleClearEntry = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const toDegrees = (radians) => (radians * 180) / Math.PI;

  const handleScientific = (func) => {
    try {
      const value = parseFloat(display);
      let result;

      switch (func) {
        case 'sin':
          result = Math.sin(isRadians ? value : toRadians(value));
          break;
        case 'cos':
          result = Math.cos(isRadians ? value : toRadians(value));
          break;
        case 'tan':
          result = Math.tan(isRadians ? value : toRadians(value));
          break;
        case 'asin':
          result = isRadians ? Math.asin(value) : toDegrees(Math.asin(value));
          break;
        case 'acos':
          result = isRadians ? Math.acos(value) : toDegrees(Math.acos(value));
          break;
        case 'atan':
          result = isRadians ? Math.atan(value) : toDegrees(Math.atan(value));
          break;
        case 'sinh':
          result = Math.sinh(value);
          break;
        case 'cosh':
          result = Math.cosh(value);
          break;
        case 'tanh':
          result = Math.tanh(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'square':
          result = value * value;
          break;
        case 'cube':
          result = value * value * value;
          break;
        case 'pow':
          setExpression(expression + display + ' ^ ');
          setDisplay('0');
          return;
        case 'exp':
          result = Math.exp(value);
          break;
        case 'abs':
          result = Math.abs(value);
          break;
        case 'factorial':
          result = factorial(value);
          break;
        case 'reciprocal':
          result = 1 / value;
          break;
        case 'percent':
          result = value / 100;
          break;
        case 'negate':
          result = -value;
          break;
        default:
          return;
      }

      setDisplay(result.toString());
      setExpression('');
    } catch (error) {
      setDisplay('Error');
    }
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleEquals = () => {
    try {
      if (expression) {
        const fullExpression = expression + display;
        // Replace ^ with ** for power operation
        const jsExpression = fullExpression.replace(/\^/g, '**');
        const result = eval(jsExpression);
        setDisplay(result.toString());
        setExpression('');
      }
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleMemory = (action) => {
    const value = parseFloat(display);
    switch (action) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(memory.toString());
        break;
      case 'M+':
        setMemory(memory + value);
        break;
      case 'M-':
        setMemory(memory - value);
        break;
      case 'MS':
        setMemory(value);
        break;
      default:
        break;
    }
  };

  const handleConstant = (constant) => {
    switch (constant) {
      case 'pi':
        setDisplay(Math.PI.toString());
        break;
      case 'e':
        setDisplay(Math.E.toString());
        break;
      default:
        break;
    }
  };

  const handleSaveEquation = () => {
    const equation = expression || display;
    if (equation && equation !== '0' && equation !== 'Error') {
      const newEquation = {
        id: Date.now(),
        name: prompt('Enter equation name (optional):') || `Equation ${Date.now()}`,
        expression: expression || display,
        result: display,
        timestamp: new Date().toLocaleString()
      };

      // Add to local state
      setSavedEquations([newEquation, ...savedEquations]);

      // Call parent callback if provided
      if (typeof onSaveEquation === 'function') {
        onSaveEquation(newEquation);
      }
    }
  };

  const handleLoadEquation = (equation) => {
    setExpression(equation.expression);
    setDisplay(equation.result);
    setShowEquationsList(false);
  };

  const handleInsertFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target.result;
            // Try to parse as JSON first
            try {
              const data = JSON.parse(content);
              if (Array.isArray(data)) {
                setSavedEquations([...data, ...savedEquations]);
              }
            } catch {
              // If not JSON, treat as plain text equation
              setExpression(content);
            }
          } catch (error) {
            console.error('Error reading file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Numerical derivative using central difference method
  const calculateDerivative = (func, x, h = 0.0001) => {
    try {
      // f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
      const xNum = parseFloat(x);
      if (isNaN(xNum)) return NaN;

      // For simple expressions like x^2, we'll use numerical differentiation
      const f = (val) => {
        try {
          // Replace x with the value
          const expr = func.replace(/x/g, `(${val})`);
          return eval(expr.replace(/\^/g, '**'));
        } catch {
          return NaN;
        }
      };

      const derivative = (f(xNum + h) - f(xNum - h)) / (2 * h);
      return derivative;
    } catch (error) {
      return NaN;
    }
  };

  // Numerical integration using Simpson's rule
  const calculateIntegral = (func, a, b, n = 1000) => {
    try {
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      if (isNaN(aNum) || isNaN(bNum)) return NaN;

      const f = (val) => {
        try {
          const expr = func.replace(/x/g, `(${val})`);
          return eval(expr.replace(/\^/g, '**'));
        } catch {
          return NaN;
        }
      };

      const h = (bNum - aNum) / n;
      let sum = f(aNum) + f(bNum);

      for (let i = 1; i < n; i++) {
        const x = aNum + i * h;
        sum += i % 2 === 0 ? 2 * f(x) : 4 * f(x);
      }

      return (h / 3) * sum;
    } catch (error) {
      return NaN;
    }
  };

  const handleCalculus = (operation) => {
    try {
      if (operation === 'derivative') {
        const expr = prompt('Enter function (use x as variable):', 'x^2');
        if (!expr) return;

        const x = prompt('Enter x value:', '1');
        if (x === null) return;

        const result = calculateDerivative(expr, x);
        setExpression(`d/dx(${expr}) at x=${x}`);
        setDisplay(result.toString());
      } else if (operation === 'integral') {
        const expr = prompt('Enter function (use x as variable):', 'x^2');
        if (!expr) return;

        const a = prompt('Enter lower limit (a):', '0');
        if (a === null) return;

        const b = prompt('Enter upper limit (b):', '1');
        if (b === null) return;

        const result = calculateIntegral(expr, a, b);
        setExpression(`∫(${expr})dx from ${a} to ${b}`);
        setDisplay(result.toString());
      }
    } catch (error) {
      setDisplay('Error');
      console.error('Calculus error:', error);
    }
  };

  return (
    <div className="scientific-calculator">
      <div className="calculator-header">
        <h2>Scientific Calculator</h2>
        <div className="header-controls">
          <div className="mode-toggle">
            <button
              className={isRadians ? 'active' : ''}
              onClick={() => setIsRadians(true)}
            >
              RAD
            </button>
            <button
              className={!isRadians ? 'active' : ''}
              onClick={() => setIsRadians(false)}
            >
              DEG
            </button>
          </div>
          <div className="equations-dropdown " style={{ display: "none" }}>
            <button
              className="list-btn"
              onClick={() => setShowEquationsList(!showEquationsList)}
              title="Saved Equations"
            >
              List ▼
            </button>
            {showEquationsList && savedEquations.length > 0 && (
              <div className="equations-list">
                {savedEquations.map((eq) => (
                  <div
                    key={eq.id}
                    className="equation-item"
                    onClick={() => handleLoadEquation(eq)}
                  >
                    <div className="equation-expr">{eq.expression}</div>
                    <div className="equation-result">= {eq.result}</div>
                    <div className="equation-time">{eq.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
            {showEquationsList && savedEquations.length === 0 && (
              <div className="equations-list">
                <div className="equation-item empty">No saved equations</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="calculator-display">
        <div className="expression">{expression}</div>
        <div className="result">{display}</div>
      </div>

      <div className="calculator-buttons">
        {/* Row 1: Memory buttons */}
        <button onClick={() => handleMemory('MC')} className="btn-memory">MC</button>
        <button onClick={() => handleMemory('MR')} className="btn-memory">MR</button>
        <button onClick={() => handleMemory('M+')} className="btn-memory">M+</button>
        <button onClick={() => handleMemory('M-')} className="btn-memory">M-</button>
        <button onClick={() => handleMemory('MS')} className="btn-memory">MS</button>
        <button onClick={handleClear} className="btn-clear">C</button>
        <button onClick={handleClearEntry} className="btn-clear">CE</button>
        <button onClick={handleBackspace} className="btn-operator">⌫</button>

        {/* Row 2: Calculus buttons */}
        <button onClick={() => handleCalculus('derivative')} className="btn-calculus" title="Derivative">d/dx</button>
        <button onClick={() => handleCalculus('integral')} className="btn-calculus" title="Definite Integral">∫</button>

        {/* Row 2: Trigonometric functions */}
        <button onClick={() => handleScientific('sin')} className="btn-function">sin</button>
        <button onClick={() => handleScientific('cos')} className="btn-function">cos</button>
        <button onClick={() => handleScientific('tan')} className="btn-function">tan</button>
        <button onClick={() => handleScientific('sqrt')} className="btn-function">√</button>
        <button onClick={() => handleScientific('square')} className="btn-function">x²</button>
        <button onClick={() => handleScientific('cube')} className="btn-function">x³</button>
        <button onClick={() => handleScientific('pow')} className="btn-function">xʸ</button>
        <button onClick={() => handleOperator('/')} className="btn-operator">÷</button>

        {/* Row 3: Inverse trig functions */}
        <button onClick={() => handleScientific('asin')} className="btn-function">sin⁻¹</button>
        <button onClick={() => handleScientific('acos')} className="btn-function">cos⁻¹</button>
        <button onClick={() => handleScientific('atan')} className="btn-function">tan⁻¹</button>
        <button onClick={() => handleScientific('log')} className="btn-function">log</button>
        <button onClick={() => handleScientific('ln')} className="btn-function">ln</button>
        <button onClick={() => handleScientific('exp')} className="btn-function">eˣ</button>
        <button onClick={() => handleConstant('pi')} className="btn-function">π</button>
        <button onClick={() => handleOperator('*')} className="btn-operator">×</button>

        {/* Row 4: Hyperbolic functions */}
        <button onClick={() => handleScientific('sinh')} className="btn-function">sinh</button>
        <button onClick={() => handleScientific('cosh')} className="btn-function">cosh</button>
        <button onClick={() => handleScientific('tanh')} className="btn-function">tanh</button>
        <button onClick={() => handleScientific('factorial')} className="btn-function">n!</button>
        <button onClick={() => handleScientific('abs')} className="btn-function">|x|</button>
        <button onClick={() => handleConstant('e')} className="btn-function">e</button>
        <button onClick={() => handleScientific('reciprocal')} className="btn-function">1/x</button>
        <button onClick={() => handleOperator('-')} className="btn-operator">−</button>

        {/* Row 5: Numbers 7-9 */}
        <button onClick={() => handleNumber('7')} className="btn-number">7</button>
        <button onClick={() => handleNumber('8')} className="btn-number">8</button>
        <button onClick={() => handleNumber('9')} className="btn-number">9</button>
        <button onClick={() => handleScientific('percent')} className="btn-operator">%</button>
        <button onClick={() => handleNumber('(')} className="btn-operator">(</button>
        <button onClick={() => handleNumber(')')} className="btn-operator">)</button>
        <button onClick={() => handleScientific('negate')} className="btn-operator">±</button>
        <button onClick={() => handleOperator('+')} className="btn-operator">+</button>

        {/* Row 6: Numbers 4-6 */}
        <button onClick={() => handleNumber('4')} className="btn-number">4</button>
        <button onClick={() => handleNumber('5')} className="btn-number">5</button>
        <button onClick={() => handleNumber('6')} className="btn-number">6</button>
        <button onClick={handleDecimal} className="btn-number">.</button>
        <button onClick={() => handleNumber('0')} className="btn-number btn-zero">0</button>
        <button onClick={handleEquals} className="btn-equals">=</button>

        {/* Row 7: Numbers 1-3 */}
        <button onClick={() => handleNumber('1')} className="btn-number">1</button>
        <button onClick={() => handleNumber('2')} className="btn-number">2</button>
        <button onClick={() => handleNumber('3')} className="btn-number">3</button>
      </div>

      <div className="calculator-footer">
        <button onClick={handleSaveEquation} className="btn-save">Save</button>
        <button onClick={handleInsertFile} className="btn-insert">Insert</button>
      </div>
    </div>

  );
};

export default ScientificCalculator;
