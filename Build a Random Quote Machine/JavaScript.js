const { TransitionGroup, CSSTransition } = ReactTransitionGroup;

const QuoteBox = (props) => {
  return (
        <CSSTransition
      in={true}
      appear={true}
      timeout={1000}
      classNames="previousContainer"
      id="quote-box"
    >
    <div className="boxContainer" id="quote-box">
      <div className="boxCenterColor!IGNORE">
        <div>
          <h6 className="quote" id="text">{props.currentQuote.text}</h6>
        </div>
        <p className="author" id="author">{props.currentQuote.author}</p>
        <div className="footer">
          <a href={`https://twitter.com/intent/tweet?hashtags=InspirationalQuotes&text=${props.currentQuote.text}`}><i className="fab fa-twitter-square tweetIcon" id="tweet-quote"></i></a>
          <button className="btn" id="new-quote" onClick={props.pickRandomQuote} >New Quote</button>
        </div>
      </div>
    </div>
      </CSSTransition>
  );
};

const PreviousQuotesBoxes = (props) => {
  const Quotes = props.previousQuotesArray.map(quote => {
    return (
      <div className="previousContainer">
        <div>
          <h6 className="quote">{quote.text}</h6>
        </div>
        <p className="author">{quote.author}</p>
        <a href={`https://twitter.com/intent/tweet?hashtags=InspirationalQuotes&text=${quote.text}`}><i className="fab fa-twitter-square tweetIcon"></i></a>
      </div>
    );
  });
  return (
    <>
      {Quotes}
    </>
  );
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      quotesDataSet: [
  {
    "text": "Genius is one percent inspiration and ninety-nine pefe jkf ekjefkj efkjefkjefkjefkefjekjfefkj  jkfjjfjfj jfjf jffjjff jf fjf rcent perspiratio fk kfkffkfk fk fk fk fk fk fkfkfkfkffk ffk fkkffk f fffff ff ffe wwkjefkje kjefkje kjefkje kjefkje kjefkje kjefkje kjefkje kjefkjekjefkje kjefkje   w ww ww  w w w w w w w ww  wn.",
    "author": "Thomas Edison"
  },
  {
    "text": "You can observe a lot just by watching.",
    "author": "Yogi Berra"
  }],
      currentQuote: {
    "text": "Genius is one percent inspiration and ninety-nine percent perspiration.",
    "author": "Thomas Edison"
  },
      previousQuotesArray: [],
      showPreviousHeader: false
    }
  }
  
  // componentDidMount() {
  //   axios.get("https://type.fit/api/quotes")
  //     .then(response => {
  //       this.setState({ quotesDataSet: response.data });
  //       this.pickRandomQuote();
  //   });
  // }
  
  pickRandomQuote = () => {
    //console.log(this.state.quotesDataSet[Math.floor(Math.random() * this.state.quotesDataSet.length)]);
    this.setState({
      currentQuote: this.state.quotesDataSet[Math.floor(Math.random() * this.state.quotesDataSet.length)],
      previousQuotesArray: [this.state.currentQuote, ...this.state.previousQuotesArray],
      showPreviousHeader: true
    });
  }
  
  render() {
    return (
      <main>
        <h1>Quote Machine</h1>
        <QuoteBox 
          currentQuote={this.state.currentQuote}
          pickRandomQuote={this.pickRandomQuote} />
        {this.state.showPreviousHeader ? <h1>Previous Quotes</h1> : null}
        <PreviousQuotesBoxes 
          previousQuotesArray={this.state.previousQuotesArray} />
      </main> 
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));