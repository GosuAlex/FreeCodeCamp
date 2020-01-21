// FCCCalculatorUI was only used to satisfy FreeCodeCamp's user stories requirements
const FCCCalculatorUI = (props) => {
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
  //let current = props.screenValue.split(" ");  
  let current = props.screenValue; 
  return(
    <div className={`${props.calcClass}Screen`}>
      <p id="">{props.history ? props.history : "" }</p>
      <p id="display">{props.screenValue ? current[current.length - 1] ? current[current.length - 1] : current[current.length - 2] : "0" }</p>
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
    console.log(this.state.screenValue);
    console.log(btn);
    
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
        return this.setState({screenValue: []});
        break;
      case "CE":
        return console.log("is CE");
        break;
      case "=":
        return this.calculate(this.state.screenValue);
        break;
      case ".":
        if(this.state.screenValue.charAt(this.state.screenValue.length - 1) == "." || (/(\d[.]+\d+$)*([.]+\d+$)/g).test(this.state.screenValue)) {
          return;
        } else {
          return this.setState(prevState => ({
            screenValue: prevState.screenValue += "."
          }));  
        }
        break;
      default:
        return this.setState({history: "Error!"});
        break;
    }
  }
  
  clearEntry = () => {
    console.log("clearEntry")
  }
  
  addDot = (dot) => {
    const newState = this.state.screenValue;
    
    if((/[.]/).test(this.state.screenValue[this.state.screenValue.length-1]) || Number.isNaN(Number(this.state.screenValue[this.state.screenValue.length-1]))) {
      return;
    } else {
      newState[newState.length-1] += dot;
      this.setState({
        screenValue: newState 
      });
    }
  }
  
  addNumber = (number) => {
    const newState = this.state.screenValue;
    if(!Number.isNaN(Number(newState[newState.length-1]))) {
      /*If last item is number, just add current digit to it*/
      newState[newState.length-1] += number;
    } else if (newState[newState.length-2] == "X" || newState[newState.length-2] == "÷" ) {
      /*If there are X or ÷ before -, move - into current number so it becomes: number (x||÷) -number and not 2 operators after each other.*/
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
    
    if(this.state.screenValue == "" || lastChar == operator) {
      return;
    }
    
    if(secondLastChar == "X" || secondLastChar == "÷") {
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
  
  // Could have used eval(); But nah.
  calculate = (stringToCalc) => {
    const regex = /[÷X\-+]/g;
    if(stringToCalc == "" || !regex.test(stringToCalc)) {
      return;
    } 
    
    let arrayToCalc = stringToCalc.split(" ");
    
    //const regex = \[+](?=\d|-)|(\d|-)\g; //to find only digits and - allowed after operator
    //\D-\D   - around non digits
    
    this.multiplicationAndDivision(arrayToCalc);
    this.additionAndSubtraction(arrayToCalc);
    
    this.setState(state => {
      const history = state.history.concat(state.value);
      return {
        screenValue: Number(arrayToCalc[0].toFixed(4)).toString() == 0 ? "" : Number(arrayToCalc[0].toFixed(4)).toString(),
        history 
      }
    });
  }
  
  multiplicationAndDivision = (arr) => {
    console.log([...arr]);
    
    for(let idx in arr) {
      if (arr[idx] === "-" && (/[÷X+\-]/g).test(arr[idx - 1])) {
        arr.splice(idx ,1);
        arr[idx] = "-" + arr[idx];
      }
    }
    console.log([...arr]);
    
    while(arr.includes("X")) {
      let idx = arr.indexOf("X")
      console.log(arr[idx - 1] + " " + arr[idx] + " " + arr[idx + 1] + "her");
      let calcIteration = Number(arr[idx - 1]) * Number(arr[idx + 1]);
      arr[idx - 1] = calcIteration;
      arr.splice(idx, 2);
    }

    while(arr.includes("÷")) {
      let idx = arr.indexOf("÷")

      let calcIteration = Number(arr[idx - 1]) / Number(arr[idx + 1]);
      arr[idx - 1] = calcIteration;
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
            arr[i - 1] = calcIteration;
            arr.splice(i, 2);
            i--;
            break;
          case "-":
            calcIteration = Number(arr[i - 1]) - Number(arr[i + 1]);
            arr[i - 1] = calcIteration;
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
        {/*<FCCCalculatorUI
          calcClass={this.state.calcClass}
          getButtonPressed={this.getButtonPressed} />*/}
        <CalculatorUI
          calcClass={this.state.calcClass}
          getButtonPressed={this.getButtonPressed} />
      </main>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));