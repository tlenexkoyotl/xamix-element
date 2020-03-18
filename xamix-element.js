import {html, LitElement} from 'lit-element';
import style from './xamix-element-styles.js';

class XamixElement extends LitElement {
  static get properties() {
    return {
      fontSize: {
        type: Number,
        reflect: true
      },
      root: {type: String},
      vertical: {
        type: Boolean,
        reflect: true
      },
      adaptable: {
        type: Boolean,
        reflect: true
      },
      bold: {
        type: Boolean,
        reflect: true
      },
      unit: {
        type: String,
        reflect: true
      },
      backgroundColor: {
        type: String,
        reflect: true
      },
      fillColor: {
        type: String,
        reflect: true
      },
      textInput: {
        type: String,
        reflect: true
      },
      parsedText: {type: Array},
      textOutput: {type: Array},
      links: {
        type: Array,
        reflect: true
      },
      stage: {type: String}
    };
  }

  static get styles() {
    return style;
  }

  constructor() {
    super();

    this.backgroundColor = 'transparent';
    this.fillColor = 'currentColor';
    this.fontSize = 3;
    this.root = '.';
    this.adaptable = false;
    this.vertical = false;
    this.bold = false;
    this.unit = 'vw';
    this.textOutput = [];
    this.parsedText = [];
    this.links = [];
    this.stages = [
      'on-construct',
      'words-loading',
      'words-loaded',
      'words-resizing',
      'words-resized'
    ];
    this.stage = this.stages[0];
  }

  setViewBox(svg, viewBox) {
    svg.setAttribute('viewBox', viewBox);
  }

  formViewbox(x, y, width, height) {
    return `${x} ${y} ${width} ${height}`;
  }

  formHorizontalViewbox(x, width) {
    if (width < 40) {
      x -= width;
      width = width * 2;
    } else if (40 <= width && width < 60) {
      x -= width * .8;
      width = width * 1.8;
    } else if (60 <= width && width < 80) {
      x -= width * .5;
      width = width * 1.5;
    } else if (80 <= width && width < 90) {
      x -= width * .3;
      width = width * 1.3;
    } else if (90 <= width) {
      x -= width * .2;
      width = width * 1.2;
    }

    return this.formViewbox(x, 0, width, 200);
  }

  formVerticalViewbox(y, height) {
    if (height < 40)
      height = height * 2.3;
    else if (40 <= height && height < 60)
      height = height * 2.1;
    else if (60 <= height && height < 80)
      height = height * 1.7;
    else if (80 <= height && height < 90)
      height = height * 1.6;
    else if (90 <= height)
      height = height * 1.5;

    return this.formViewbox(0, y, 200, height);
  }

  getAspectRatio() {
    return window.innerWidth / window.innerHeight
  }

  getUnit() {
    if (this.adaptable)
      return this.getAspectRatio() > 1 ? 'vw' : 'vh';
    else
      return this.unit;
  }

  horizontalResize(svg, x, width) {
    this.setViewBox(svg, this.formHorizontalViewbox(x, width));
    svg.setAttribute('height', `${this.fontSize}${this.getUnit()}`);
  }

  verticalResize(svg, y, height) {
    this.setViewBox(svg, this.formVerticalViewbox(y, height));
    svg.setAttribute('width', `${this.fontSize}${this.getUnit()}`);
  }

  resizeSvg(svg) {
    const bbox = svg.getBBox();

    if (this.vertical)
      this.verticalResize(svg, bbox.y, bbox.height);
    else
      this.horizontalResize(svg, bbox.x, bbox.width);
  }

  appendSvg(textOutput, content) {
    const template = document.createElement('span');
    template.innerHTML = `${content}`;

    return [...textOutput, template.children[0]];
  }

  fetchSvg(fileName) {
    return fetch(`${this.root}/data/${this.bold ? 'bold' : 'regular'}/${fileName}.svg`,
      {mode: 'no-cors'})
      .then(file => file.text())
  }

  parseText() {
    this.uniqueCharacters = [];

    for (const text of this.textInput) {
      const parsedWord = {word: text};

      if (text.includes('-'))
        parsedWord.components = text.split('-');
      else
        parsedWord.components = [text];

      this.parsedText = [...this.parsedText, parsedWord];
    }

    this.parsedText.map(word => {
      this.uniqueCharacters = [...this.uniqueCharacters, ...word.components];
    });

    this.uniqueCharacters = Array.from(new Set(this.uniqueCharacters));
    this.uniqueCharacters = this.uniqueCharacters.map(char => {
      return {name: char, file: this.fetchSvg(char)}
    });
  }

  setUniqueCharactersContent(files) {
    this.uniqueCharacters.forEach((char, index) => {
      this.uniqueCharacters[index].file = files[index];
    });
  }

  fetchSyllables() {
    Promise.all(this.uniqueCharacters.map(char => char.file))
      .then((files) => {
        this.setUniqueCharactersContent(files);
        this.formTextOutput();
      });
  }

  useWordAsLink(word, index) {
    const link = this.links.filter(link => link.wordsIndexes.includes(index))[0];

    if (link) {
      const linkContent = document.createElement('a');

      linkContent.setAttribute('href', link.href);
      linkContent.appendChild(word.content);

      word.content = linkContent;
    }
  }

  setWordContent(word, index) {
    word.content = document.createElement('div');

    for (const syllable of word.textOutput)
      word.content.appendChild(syllable);

    word.content.classList.toggle('word');
    this.useWordAsLink(word, index);
  }

  formWordOutput(word, index) {
    word.textOutput = [];
    let syllables = word.components
      .map(component =>
        this.uniqueCharacters.find(char => char.name === component).file);

    for (const svgText of syllables)
      word.textOutput = this.appendSvg(word.textOutput, svgText);

    this.setWordContent(word, index);
  }

  finishTextOutput() {
    this.textOutput = [...this.parsedText.map(word => word.content)];
    this.stage = this.stages[2];

    this.dispatchEvent(new Event('words-loaded'));
  }

  formTextOutput() {
    this.parsedText.forEach((word, index) => this.formWordOutput(word, index));
    this.finishTextOutput();
  }

  convertInput() {
    if (typeof this.textInput === 'string') {
      this.stage = this.stages[1];
      this.textInput = this.textInput.toLowerCase().split(' ');
      this.parsedText = [];

      this.parseText();
      this.fetchSyllables();
    }
  }

  dispatchStageEvent(stage, detail) {
    if (!detail)
      this.dispatchEvent(new Event(stage));
    else
      this.dispatchEvent(new CustomEvent(stage, {detail: detail}));
  };

  dispatchCurrentStage(detail) {
    this.dispatchStageEvent(this.stage, detail);
  };

  resizeSvgs() {
    const svgs = this.shadowRoot.querySelectorAll('svg');

    if (this.stage === this.stages[2]) {
      this.stage = this.stages[3];

      this.dispatchCurrentStage();

      for (const svg of svgs)
        this.resizeSvg(svg);

      this.stage = this.stages[4];

      this.dispatchCurrentStage();
    }
  }

  render() {
    this.convertInput();

    const clazz = `text${' ' + (this.vertical ? 'vertical' : 'horizontal')}`;

    return html`
      <div class="${clazz}" style="background-color: ${this.backgroundColor}; color: ${this.fillColor}; line-height: ${this.fontSize}${this.getUnit()};">
          <slot name="before"></slot>
          ${this.textOutput}
          <slot name="after"></slot>
      </div>
      `;
  }

  updated(_changedProperties) {
    this.resizeSvgs();
  }
}

window.customElements.define("xamix-element", XamixElement);
