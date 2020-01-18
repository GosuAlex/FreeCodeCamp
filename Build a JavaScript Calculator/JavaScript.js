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
  let current = props.screenValue.split(" ");  
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
      screenValue: "",
      history: [],
    }
  }
  
  getButtonPressed = (btn) => {
    console.log(this.state.screenValue);
    console.log(btn);

    if((/[ ]0$|^0(?![.])/g).test(this.state.screenValue) && btn != "=" && btn != "C") {
      if((/[X+÷\-]/g).test(btn)) {
        // const newState = this.state.screenValue.slice(0, this.state.screenValue.length - 3);
        // return this.setState({ screenValue: newState + btn});
        return this.setState(prevState => ({
          screenValue: prevState.screenValue += " " + btn + " "
        }));
      } else {
        console.log("second");
        const newState = this.state.screenValue.slice(0, this.state.screenValue.length - 1);
        return this.setState({ screenValue: newState + btn});
      }
    }
    
    if(!Number.isNaN(Number(btn))) {
      return this.setState(prevState => ({
        screenValue: prevState.screenValue += btn
      }));
    }
    
    // if((/[X+÷\-]/g).test(btn)) {
    //   if(this.state.screenValue == "") {
    //     return;
    //   }
    //   if(
    //     ((this.state.screenValue.charAt(this.state.screenValue.length - 2) !== "+"
    //     && Number.isNaN(Number(this.state.screenValue.charAt(this.state.screenValue.length - 2))))
    //     || (this.state.screenValue.charAt(this.state.screenValue.length - 2) == "+" && btn !== "-"))
    //     && this.state.screenValue.charAt(this.state.screenValue.length - 2) !== "."
    //   ) {
    //     console.log(this.state.screenValue.charAt(this.state.screenValue.length - 2));
    //     if(this.state.screenValue.charAt(this.state.screenValue.length - 5) == "+") {
    //       const newState = this.state.screenValue.slice(0, this.state.screenValue.length - 5);
    //       return this.setState({ screenValue: newState + btn + " "});
    //     } else {
    //       const newState = this.state.screenValue.slice(0, this.state.screenValue.length - 2);
    //       return this.setState({ screenValue: newState + btn + " "});
    //     }
    //   }
    //   return this.setState(prevState => ({
    //     screenValue: prevState.screenValue += " " + btn + " "
    //   }));
    // }

    if((/[X+÷\-]/g).test(btn)) {
      if(this.state.screenValue == "") {
        return;
      }
      if(
        ((!(/[X+÷\-]/g).test(this.state.screenValue.charAt(this.state.screenValue.length - 2))
          && Number.isNaN(Number(this.state.screenValue.charAt(this.state.screenValue.length - 2))))
        || ((/[X+÷\-]/g).test(this.state.screenValue.charAt(this.state.screenValue.length - 2)) ))
        && this.state.screenValue.charAt(this.state.screenValue.length - 2) !== "."
      ) {
        if((/[X+÷\-]/g).test(this.state.screenValue.charAt(this.state.screenValue.length - 4))) {
          console.log("oppe")
          const newState = this.state.screenValue.slice(0, this.state.screenValue.length - 4);
          return this.setState({ screenValue: newState + btn + " "});
        } else if (btn === "-") {
          console.log("mid")
          return this.setState(prevState => ({
            screenValue: prevState.screenValue += btn + " "
          }));
        } else {
          console.log("her")
          const newState = this.state.screenValue.slice(0, this.state.screenValue.length - 2);
          return this.setState({ screenValue: newState + btn + " "});
        }
      }
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
  
  backspace = () => {
    console.log("backspace")
  }
  
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
        {/*<CalculatorUI
          calcClass={this.state.calcClass}
          getButtonPressed={this.getButtonPressed} />*/}
        <FCCCalculatorUI
          calcClass={this.state.calcClass}
          getButtonPressed={this.getButtonPressed} />
      </main>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));