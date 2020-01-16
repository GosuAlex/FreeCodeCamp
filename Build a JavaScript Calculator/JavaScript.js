const FCCCalculatorUI = (props) => {
  let calcButtons = [1,2,3,4,5,6,7,8,9,0,"+","-","X","÷","=",".","C","CE","<"];
  const FCCRequirements = ["one","two","three","four","five","six","seven","eight","nine","zero","add","subtract","multiply","divide","equals","decimal","C","clear","<"];
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
  let calcButtons = [1,2,3,4,5,6,7,8,9,0,"+","-","X","÷","=",".","C","CE","<"];
  let UIButtons = calcButtons.map(btn => {
    return (
      <div id={`UIButton-${btn}`} onClick={(event) => props.getButtonPressed(event.target.textContent)} >
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
      <p id="display">{props.screenValue}</p>
    </div>
  );
};


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      calcClass: "myCalc",
      screenValue: "58008",
      history: [],
    }
  }
  
  getButtonPressed = (btn) => {
    console.log(typeof this.state.screenValue);

    if(!Number.isNaN(Number(btn))) {
      return this.setState(prevState => ({
        screenValue: prevState.screenValue += btn
      }));
    }
    
    if(btn === "÷" || btn === "X" || btn === "-" || btn === "+") {
      return this.setState(prevState => ({
        screenValue: prevState.screenValue += " " + btn + " "
      }));
    }
    
    switch(btn) {
      case "C":
        return this.setState({screenValue: ""});
        break;
      case "CE":
        return console.log("is CE");
        break;
      case "<":
        return console.log("is <");
        break;
      case "=":
        return this.calculate(this.state.screenValue);
        break;
      case ".":
        return this.setState(prevState => ({
          screenValue: prevState.screenValue += "."
        }));
        break;
      default:
        return this.setState({screenValue: "Error!"});
        break;
    }
  }
  
  backspace = () => {
    console.log("backspace")
  }
  
  calculate = (stringToCalc) => {
    const regex = /\s÷X-+/;
    let arrayToCalc = stringToCalc.split(" ");
    
    this.multiplicationAndDivision(arrayToCalc);
    this.additionAndSubtraction(arrayToCalc);
    
    this.setState(state => {
      const history = state.history.concat(state.value);
      return {
        screenValue: arrayToCalc.toString(),
        history 
      }
    });
  }
  
  multiplicationAndDivision = (arr) => {
    while(arr.includes("X")) {
      let idx = arr.indexOf("X")

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
          screenValue={this.state.screenValue} />
        <CalculatorUI
          calcClass={this.state.calcClass}
          getButtonPressed={this.getButtonPressed} />
        {/* <FCCCalculatorUI
              calcClass={this.state.calcClass}
              getButtonPressed={this.getButtonPressed} />*/}
      </main>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));