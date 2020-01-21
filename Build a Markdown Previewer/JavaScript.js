// Using Marked.js library to parse text into markdown

const MarkdownContainer = (props) => {
  return (
    <>
      <textarea
        className="inputField"
        id="editor"
        onChange={(event) => props.getTextInput(event.target.value)}
        key={props.rerender}
      >
        {props.markdownText}
      </textarea>
    </>
  );
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      markdownText: `# A simple markdown previewer
**Here's some** *examples* **of what it can do**

> Blockquotes

Even list:
  1. Big
  2. Brain
  3. Time

\`\`\`
//And Code blocks
function *infiniteOddOrEven(oddOrEven) {
  //yield 1;
  for (i = 0+oddOrEven ; i > -1 ; i++) {
    yield i;
    i++;
  }
}
it = infiniteOddOrEven(1);
\`\`\`

\`console.log(it.next());\`
## Images too
![I'm an inline-style link with title](https://octodex.github.com/images/yaktocat.png)

[Link to Picture](https://octodex.github.com/images/yaktocat.png)
`,
      rerender: true
    }
  }
  
  getTextInput = (text) => {
    this.translateTextIntoMarkdown(text);
  }
  
  translateTextIntoMarkdown = (text) => {
//  Using Marked.js instead
//     const rules = [
//       [/#{6}\s?([^\n]+)\n/g, "<h6>$1</h6>"],
//       [/#{5}\s?([^\n]+)\n/g, "<h5>$1</h5>"],
//       [/#{4}\s?([^\n]+)\n/g, "<h4>$1</h4>"],
//       [/#{3}\s?([^\n]+)\n/g, "<h3>$1</h3>"],
//       [/#{2}\s?([^\n]+)\n/g, "<h2>$1</h2>"],
//       [/#{1}\s?([^\n]+)\n/g, "<h1>$1</h1>"],
//       [/([^\n]+)]\n\s+=+/g, "<h1>$1</h1><hr/>"],
//       [/([^\n]+)]\n\s+-+/g, "<h2>$1</h2><hr/>"],
//       [/\*\*([^\*\n]+)\*\*/g, "<b>$1</b>"],
//       [/\*([^\*\n]+)\*/g, "<i>$1</i>"],
//       [/__([^_]+)__/g, "<b>$1</b>"],
//       [/_([^_]+)_/g, "<i>$1</i>"],
//       [/((\n\d\..+)+)/g, "<ol>$1</ol>"],
//       [/((\n*.+)+)/g, "<ul>$1</ul>"],
//       [/\n\d\.([^\n]+)/g, "<li>$1</li>"],
//       [/\n\*([^\n]+)/g, "<li>$1</li>"],
//       [/\!\[([^\]]+)\]\(([^\)]+)\)/g, "<img src=\"$2\" alt=\"$1\">"], 
//       [/\[([^\]]+)\]\(([^\)]+)\)/g, "<a href=\"$2\">$1</a>"],
//       [/([^\n]+\n)/g, "<p>$1</p>"],
//     ]

//     rules.forEach(([rule, template]) => {
//       text = text.replace(rule, template);
//     });
    
    text = marked(text);

    this.setState({
      markdownText: text
    });
  }
  
  clearInputText = () => {
    this.setState({markdownText: "", rerender: !this.state.rerender});
    this.forceUpdate();
  }
  
  render() {
    return (
      <main>
        <h1 id="header">Markdown Previewer</h1>
        <button onClick={this.clearInputText} className="btn">Clear</button>
        <MarkdownContainer 
          getTextInput={this.getTextInput}
          markdownText={this.state.markdownText}
          rerender={this.state.rerender} />
        <div 
          // dangerouslySetInnerHTML = {{__html: this.state.markdownText}}
          dangerouslySetInnerHTML = {{__html: marked(this.state.markdownText)}}
          className="outputField"
          id="preview" />
      </main>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#root"));