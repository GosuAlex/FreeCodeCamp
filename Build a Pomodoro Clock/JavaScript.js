function BreakTimer(props) {
  return (
    <div id="break-label">
      <h3>Break time</h3>
      <div className="interval-instance">
        <button id="break-decrement" disabled={props.isPlaying} onClick={props.decreaseTime}>Down</button>
        <p id="break-length" className="interval-number">{props.breakTime}</p>
        <button id="break-increment" disabled={props.isPlaying} onClick={props.increaseTime}>Up</button>
      </div>
    </div>
  );
}

function SessionTimer(props) {
  return (
    <div id="session-label">
      <h3>Session time</h3>
      <div className="interval-instance">
        <button id="session-decrement" disabled={props.isPlaying} onClick={props.decreaseTime}>Down</button>
        <p id="session-length" className="interval-number">{props.sessionTime}</p>
        <button id="session-increment" disabled={props.isPlaying} onClick={props.increaseTime}>Up</button>
      </div>
    </div>
  );
}

class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      inSession: true,
      timerSeconds: 0,
      interval: 0
    }
  }
  
  beeper() {
    if (this.props.timerMinutes == 0 && this.state.timerSeconds == 0) {
      this.audioBeep.play();
    }
  }
  
  playTimer = () => {
    if (this.props.isPlaying) {
      this.stopTimer();
      return;
    }
    // let interval = setInterval(this.secondsCounter, 1000);
    let interval = setInterval(() => {
        this.secondsCounter(); 
        this.beeper();
       }, 1000)
    
    this.setState({
      interval: interval
    })
    
    this.props.onPlayOrStopTimer(true);
    // document.getElementsByClassName("playBtn")[0].disabled = true;
    document.getElementById("start_stop").classList.add("playBtn"); 
    document.getElementsByClassName("timer-container")[0].classList.add("clock-running"); 
  }
  
  stopTimer = () => {
    clearInterval(this.state.interval);
    this.props.onPlayOrStopTimer(false);
    // document.getElementsByClassName("playBtn")[0].disabled = false;
    document.getElementById("start_stop").classList.remove("playBtn");
    document.getElementsByClassName("timer-container")[0].classList.remove("clock-running"); 
  }
  
  resetTimer = () => {
    this.stopTimer();
    this.props.resetSession();
    
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    
    this.setState({
      timerSeconds: 0,
      inSession: true
    })
  }
  
  secondsCounter = () => {
    switch (this.state.timerSeconds) {
      case 0:
        if(this.props.timerMinutes == 0) {
          this.setState({inSession: !this.state.inSession})
          this.props.changeInterval(this.state.inSession);
        } else {
          this.props.countDownHandler();
          this.setState({
            timerSeconds: 59
          })
        }
        break;
      default:
        this.setState(prevState => {
          return {
            timerSeconds: prevState.timerSeconds - 1
          }
        })
        break;
    }
  }
  
  render() {
    return(
      <div>
        <div className="timer-container">
          <h3 id="timer-label">{this.state.inSession ? "Session" : "Break"}</h3>
          {/*
          <span>{this.props.timerMinutes}</span>}
          <span>:</span>
          <span>{(this.state.timerSeconds < 10 ? "0" : "") + this.state.timerSeconds }</span>
          */}
          <span id="time-left">{(this.props.timerMinutes < 10 ? "0" : "") + this.props.timerMinutes}:{(this.state.timerSeconds < 10 ? "0" : "") + this.state.timerSeconds}</span>
        </div>
        <div className="timer-buttons">
          <button onClick={this.playTimer} id="start_stop">Play</button>
          {/*<button onClick={this.stopTimer} >Stop</button>*/}
          <button onClick={this.resetTimer} id="reset">Reset</button>
        </div>
        <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
          ref={(audio) => { this.audioBeep = audio; }} />
      </div>
    );
  }
}


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerMinutes: 25,
      isPlaying: false
    }
  }
  
  increaseTime = (intervalType) => {
    // const newTime = this.state[intervalType] + 1;
    // this.setState({[intervalType]: newTime});
    if (this.state[intervalType] >= 60) {
      return;
    };
    let int;
    intervalType == "breakLength" ? int = 0 : int = 1;
    
    this.setState(prevState => {
      return {
        [intervalType]: prevState[intervalType] + 1,
        timerMinutes: prevState.sessionLength + int
      };
    });
  }
  
  decreaseTime = (intervalType) => {
    if (this.state[intervalType] == 1) {
      return;
    };
    let int;
    intervalType == "breakLength" ? int = 0 : int = 1;
    
    this.setState(prevState => {
      return {
        [intervalType]: prevState[intervalType] - 1,
        timerMinutes: prevState.sessionLength - int
      };
    });
  }
  
  countDownHandler = () => {
    this.setState(prevState => {
      return {
        timerMinutes: prevState.timerMinutes - 1
      };
    })
  }
  
  changeIntervalType = (inSession) => {
    inSession ? 
      this.setState({
        timerMinutes: this.state.sessionLength
      }) : 
      this.setState({
        timerMinutes: this.state.breakLength
      });
  }
  
  resetSession = () => {
    this.setState({
      // timerMinutes: this.state.sessionLength
      breakLength: 5,
      sessionLength: 25,
      timerMinutes: 25
    })
  }
  
  onPlayOrStopTimer = (PlayMode) => {
    this.setState({
      isPlaying: PlayMode
    })
  }
   
  render() {
    return (
      <main>
        <h1>Pomodoro clock</h1>
        <div className="intervals-container">
          <BreakTimer 
            isPlaying={this.state.isPlaying}
            breakTime={this.state.breakLength}
            increaseTime={() => this.increaseTime("breakLength")} //magic strings...? :(
            decreaseTime={() => this.decreaseTime("breakLength")} />
          <SessionTimer
            isPlaying={this.state.isPlaying}
            sessionTime={this.state.sessionLength}
            increaseTime={() => this.increaseTime("sessionLength")}
            decreaseTime={() => this.decreaseTime("sessionLength")} />
        </div>
        <Timer 
          timerMinutes={this.state.timerMinutes} 
          breakLength={this.state.breakLength}
          countDownHandler={this.countDownHandler}
          changeInterval={this.changeIntervalType}
          resetSession={this.resetSession}
          onPlayOrStopTimer={this.onPlayOrStopTimer}
          isPlaying={this.state.isPlaying} />
      </main>
      
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));