// FreeCodeCampCalculatorUI component was only used to satisfy FreeCodeCamp's user stories requirements
// todo: make the top showing auto answer after operator or CE
// better screen.. size, font, color, numbers showing
const FreeCodeCampCalculatorUI = (props) => {
  let calcButtons = [1,2,3,4,5,6,7,8,9,0,"+","-","X","÷","=",".","C","CE","<"];
  const FCCRequirements = ["one","two","three","four","five","six","seven","eight","nine","zero","add","subtract","multiply","divide","equals","decimal","clear","CE","<"];
  let UIButtons = calcButtons.map((btn, idx) => {
    return (
      <div id={FCCRequirements[idx]} onClick={(event) => props.getButtonPressed(event.target.textContent)} >
        {btn}
      </div>
    );
  });
  
  return (
    <div className={props.calcClass} >
      {UIButtons}
    </div>
  );
};

const CalculatorUI = (props) => {
  let calcButtons = [1,2,3,4,5,6,7,8,9,0,"+","-","X","÷","=",".","C","CE"];
  let UIButtons = calcButtons.map(btn => {
    return (
      <div id={`UIButton-${btn}`} onMouseDown={(event) => props.getButtonPressed(event.target.textContent)} >
        {btn}
      </div>
    );
  });
  
  return (
    <div className={props.calcClass} >
      {UIButtons}
    </div>
  );
};

const CalculatorScreen = (props) => {
  return(
    <div className={`${props.calcClass}Screen`}>
      {/*<p id="">{props.history ? props.history : "" }</p>
      <p id="display">{props.screenValue[0] != null ? props.screenValue : "0" }</p>*/}
      <p id="topScreen">{props.history ? props.history.join("").length > 16 ? props.history.join("").substring(0,16).concat("..") : props.history : "" }</p>
      <p id="display">{props.screenValue[0] != null ? props.screenValue.join("").length > 16 ? props.screenValue.join("").substring(props.screenValue.join("").length-16,props.screenValue.join("").length) : props.screenValue  : "0" }</p>
    </div>
  );
};


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      calcClass: "myCalc",
      screenValue: [],
      history: [],
    }
  }
  
  getButtonPressed = (btn) => {
    // console.log(this.state.screenValue);
    // console.log(btn);
    
    // STUPID JAVASCRIPT WITH GLOBAL STATE FOR REGEX WITH GLOBAL FLAG!!*@%!! REMEMBER TO regex.lastIndex=0 OR NO /g
    const regexForOperators = /[X+÷\-]/g;

    if(!Number.isNaN(Number(btn))) {
      return this.addNumber(btn);
    }
    
    if(regexForOperators.test(btn)) {
      return this.addOperator(btn);
    }
    
    switch(btn) {
      case ".":
        return this.addDot(btn);
        break;  
      case "C":
        return this.setState({screenValue: [], history: []});
        break;
      case "CE":
        const newState = this.state.screenValue.slice(0,this.state.screenValue.length-1);
        console.log(newState);
        return this.setState({
          screenValue: newState
        });
        break;
      case "=":
        return this.calculate(this.state.screenValue);
        break;
      default:
        return this.setState({screenValue: "Error!"});
        break;
    }
  }
  
  addDot = (dot) => {
    const newState = this.state.screenValue;
    if((newState[newState.length-2] == "X" || newState[newState.length-2] == "÷") && newState[newState.length-1] == "-" ) {
      newState[newState.length-1] += "0" + dot;
    } else if (!newState[newState.length-1] || Number.isNaN(Number(newState[newState.length-1]))) {
      newState.push("0.");
    } else if((/[.]/).test(this.state.screenValue[this.state.screenValue.length-1]) || Number.isNaN(Number(this.state.screenValue[this.state.screenValue.length-1]))) {
      return;
    } else {
      newState[newState.length-1] += dot;
    }
    this.setState({
      screenValue: newState 
    });
  }
  
  addNumber = (number) => {
    const newState = this.state.screenValue;
    if (((/^[0](?![.])/).test(newState[newState.length-1]) || ((/^(\-0)(?![.])/).test(newState[newState.length-1]) || !newState.length) && number == "0")) {
      /*If last number begins with 0 or screenValue state is empty. Deny to add number 0*/
      return;
    } else if (!Number.isNaN(Number(newState[newState.length-1]))) {
      /*If last item is number, just add current digit to it*/
      newState[newState.length-1] += number;
    } else if ((newState[newState.length-2] == "X" || newState[newState.length-2] == "÷" && newState[newState.length-1] == "-") || newState[0] == "-" ) {
      /*If there are X OR ÷ before - OR want first number to be negative, move - into current number so it becomes: number (x||÷) -number and not 2 operators after each other.*/
      newState[newState.length-1] = "-" + number;
    } else {
      newState.push(number);
    }      
    this.setState({
      screenValue: newState 
    });
  }
  
  addOperator = (operator) => {
    const lastChar = this.state.screenValue[this.state.screenValue.length-1];
    const secondLastChar = this.state.screenValue[this.state.screenValue.length-2];
    const newState = this.state.screenValue;
    
    if((this.state.screenValue == "" && operator != "-") || lastChar == operator) {
      return;
    }

    if((secondLastChar == "X" || secondLastChar == "÷") && Number.isNaN(Number(lastChar))) {
      newState.pop();
      newState[this.state.screenValue.length-1] = operator;
      return this.setState({
        screenValue: newState
      });
    }
    
    if(operator == "-" && (lastChar == "X" || lastChar == "÷")) {
       newState.push(operator);
       return this.setState({
         screenValue: newState
       });
    } else if (operator != "-" && (lastChar == "X" || lastChar == "÷")) {
      newState[this.state.screenValue.length-1] = operator;
      return this.setState({
        screenValue: newState
      });        
    }
    
    if(lastChar == "-" || lastChar == "+") {
      newState[this.state.screenValue.length-1] = operator;
      return this.setState({
        screenValue: newState
      });
    }
    
    newState.push(operator);
    return this.setState({
      screenValue: newState
    });
  } 
  
  calculate = (arrayToCalc) => {
    // Could have used eval(); But nah.
    const regexForOperators = /[÷X\-+]/g;
    const newHistory = [].concat(arrayToCalc);

    if((!Array.isArray(arrayToCalc) && !arrayToCalc.length) || !regexForOperators.test(arrayToCalc) || Number.isNaN(Number(arrayToCalc[arrayToCalc.length-1]))) {
      return;
    } 
    
    this.multiplicationAndDivision(arrayToCalc);
    this.additionAndSubtraction(arrayToCalc);
    
    return this.setState({
      screenValue: arrayToCalc,
      history: newHistory
    });
  }
  
  multiplicationAndDivision = (arr) => {  
    while(arr.includes("X")) {
      let idx = arr.indexOf("X")
      let calcIteration = Number(arr[idx - 1]) * Number(arr[idx + 1]);
      arr[idx - 1] = Number(calcIteration.toFixed(4)).toString();
      arr.splice(idx, 2);
    }

    while(arr.includes("÷")) {
      let idx = arr.indexOf("÷")

      let calcIteration = Number(arr[idx - 1]) / Number(arr[idx + 1]);
      arr[idx - 1] = Number(calcIteration.toFixed(4)).toString();
      arr.splice(idx, 2);
    }
    return arr;
  }
  
  additionAndSubtraction = (arr) => {
    for (let i = 0; arr.length > 1 ; i++) {
      let calcIteration;

      if(Number.isNaN(Number(arr[i]))) {
        switch(arr[i]) {
          case "+":
            calcIteration = Number(arr[i - 1]) + Number(arr[i + 1]);
            arr[i - 1] = Number(calcIteration.toFixed(4)).toString();
            arr.splice(i, 2);
            i--;
            break;
          case "-":
            calcIteration = Number(arr[i - 1]) - Number(arr[i + 1]);
            arr[i - 1] = Number(calcIteration.toFixed(4)).toString();
            arr.splice(i, 2);
            i--;
            break;
        }
      }
    }
    return arr;
  }
  
  render() {
    return (
      <main>
        <h1>JavaScript Calculator</h1>
        <CalculatorScreen
          calcClass={this.state.calcClass}
          screenValue={this.state.screenValue}
          history={this.state.history} />
        <CalculatorUI
          calcClass={this.state.calcClass}
          getButtonPressed={this.getButtonPressed} />
      </main>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));