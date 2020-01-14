const CalculatorUI = (props) => {
  let calcButtons = [1,2,3,4,5,6,7,8,9,0,"+","-","X","/","=",".","C","CE"];
  let UIButtons = calcButtons.map(btn => {
    return (
      <div id={`UIButton-${btn}`}>{btn}</div>
    );
  });
  
  return (
    <div className={props.calcClass}>
      {UIButtons}
    </div>
  );
};

const CalculatorScreen = (props) => {
  return(
    <div className={`${props.calcClass}Screen`}>
      <p>123 + 456</p>
    </div>
  );
};


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      calcClass: "myCalc",
      screenValue: "",
      calculation: [],
    }
  }
  
  getButtonPressed = (btn) => {
    console.log(btn);
  }
  
  calculate = (input) => {
    console.log(input);
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
      </main>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));