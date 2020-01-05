class DrumPad extends React.Component {
  constructor() {
    super();
    
  }
  
  componentDidMount() {
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => key.addEventListener("transitionend", this.removeTransition));

    window.addEventListener("keydown", this.playSound);
    //keys.forEach(key => key.addEventListener("click", this.playSound));
    console.log(this.props.volume); 
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.playSound); 
  }
    
  playSound = (eventOrKeyEventCode) => {
    // #heheOrStupidCode
    let audio = undefined;
    let key = undefined;
    if(event.code) {
      audio = document.querySelector(`audio[data-key="${eventOrKeyEventCode.code}"]`);
      key = document.querySelector(`.key[data-key="${eventOrKeyEventCode.code}"]`);
    } else  {
      /*
      audio = document.querySelector(`audio[data-key="${event.target.parentElement.dataset.key}"]`);
      key = document.querySelector(`.key[data-key="${event.target.parentElement.dataset.key}"]`);
      */
      audio = document.querySelector(`audio[data-key="${eventOrKeyEventCode}"]`);
      key = document.querySelector(`.key[data-key="${eventOrKeyEventCode}"]`);
    }

    if(!audio) return;
    audio.currentTime = 0;
    audio.play();
    key.classList.add("hit");
    // setTimeout(function () { 
    //   key.classList.remove("hit");
    // }, 100);
    // };
    this.props.changeDisplay(key.id);
    audio.volume = this.props.volume;
  } 

  removeTransition = (event) => {
    if(event.propertyName !== "transform") return;
    event.originalTarget.classList.remove("hit");
    // this.classList.remove("hit");
  }

  render() {
    const keyboardEventCodeArr = ["KeyQ","KeyW","KeyE","KeyA","KeyS","KeyD","KeyZ","KeyX","KeyC","KeyR","KeyT","KeyY","KeyF","KeyG","KeyH","KeyV","KeyB","KeyN","KeyU","KeyI","KeyO","KeyJ","KeyK","KeyB","KeyL","KeyM"];
    const samples = Object.values(this.props.soundbank).map((sample, idx) => {
      return (
        <Sample URL={sample.URL}
          name={sample.name}
          id={sample.id}
          keyEventCode={keyboardEventCodeArr[idx]}
          className="drum-pad"
          playSound={this.playSound} />
      )
    });
    
    return (
      <div className="pad">
        {samples}
      </div> 
    );
  };
}

function Sample (props) {
  return (
    <>
      <div
        data-key={props.keyEventCode}
        id={props.name}
        className="key drum-pad"
        onClick={() => props.playSound(props.keyEventCode)} >
          <p>{props.keyEventCode[3]}</p>
          {/*<p>{props.name}</p> */}
          <audio
            src={props.URL}
            data-key={props.keyEventCode}
            className="clip"
            id={props.keyEventCode[3]} >
          </audio>
      </div>
    </>
  );
}

const VolumeSlider = (props) => {
  let slider1 = null;

  return (  
    <div className="volumeContainer">
      <p>Volume</p>
      <input type="range" ref={(input) => { slider = input; }} className="slider" min="1" max="50" step="1" onChange={() => props.onChangeVolume(slider.value)}/>
    </div>
  );
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      soundbank: {
        kick: {
          URL: "http://s1download-universal-soundbank.com/mp3/sounds/4816.mp3",
          id: 2,
          name: "Kick"
        },
        tom: {
          URL: "http://s1download-universal-soundbank.com/mp3/sounds/4517.mp3",
          id: 2,
          name: "Tom"
        },
        clap: {
          URL: "http://s1download-universal-soundbank.com/mp3/sounds/1974.mp3",
          id: 2,
          name: "Clap"
        },
        hat: {
          URL: "http://s1download-universal-soundbank.com/mp3/sounds/4871.mp3",
          id: 2,
          name: "Hat"
        },
        pianoD: {
          URL: "https://www.myinstants.com/media/sounds/39189__jobro__piano-ff-042.mp3",
          id: 2,
          name: "PianoD"
        },
        pianoE: {
          URL: "https://www.myinstants.com/media/sounds/39191__jobro__piano-ff-044.mp3",
          id: 2,
          name: "PianoE"
        },
        metalGear: {
          URL: "https://www.myinstants.com/media/sounds/metalgearsolid.swf.mp3",
          id: 2,
          name: "Alert!"
        },
        prydaSnare: {
          URL: "https://www.myinstants.com/media/sounds/prydasnare.mp3",
          id: 2,
          name: "Pryda"
        },
        winXP: {
          URL: "https://www.myinstants.com/media/sounds/erro.mp3",
          id: 2,
          name: "Error"
        }
      },
      display: "Use Keyboard",
      volume: 1
    }
  }
  
  changeDisplay = (newSample) => {
    if (this.display == newSample) return;
    
    this.setState(prevState => {
      return {
        display: newSample
      }
    });
  }
  
  onChangeVolume = (value) => {
    this.setState(prevState => {
      return {
        display: "Volume: " + value,
        volume: value / 100
      }
    });
  }

  render() {
    return (
      <main id="drum-machine">
        <h1>Drum Machine</h1>
        <h3></h3>
        <div id="display">{this.state.display}</div> 
        
        <DrumPad
          soundbank={this.state.soundbank}
          changeDisplay={this.changeDisplay}
          volume={this.state.volume} />
        <VolumeSlider onChangeVolume={this.onChangeVolume} />
      </main>
      
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));
