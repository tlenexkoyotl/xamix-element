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
      textInput: {
        type: String,
        reflect: true
      },
      parsedText: {type: Array},
      textOutput: {type: Array}
    };
  }

  static get styles() {
    return style;
  }

  constructor() {
    super();

    this.fontSize = 3;
    this.root = '.';
    this.adaptable = false;
    this.vertical = false;
    this.bold = false;
    this.unit = 'vw';
    this.textOutput = [];
    this.parsedText = [];
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
    for (const text of this.textInput) {
      const parsedWord = {word: text, syllables: []};

      if (text.includes('-')) {
        parsedWord.components = text.split('-');

        for (const syllable of parsedWord.components)
          parsedWord.syllables = [...parsedWord.syllables, this.fetchSvg(syllable)];
      } else
        parsedWord.syllables = [this.fetchSvg(text)];

      this.parsedText = [...this.parsedText, parsedWord];
    }
  }

  fetchSyllables() {
    for (const word of this.parsedText)
      Promise.all(word.syllables)
        .then(files => {
          word.textOutput = [];
          for (const file of files)
            word.textOutput = this.appendSvg(word.textOutput, file);

          word.content = document.createElement('div');

          for (const syllable of word.textOutput)
            word.content.appendChild(syllable);

          word.content.classList.toggle('word');

          const contents = this.parsedText.map(word => word.content);

          if (contents.length === this.parsedText.length)
            for (const word of this.parsedText)
              this.textOutput = [...this.textOutput, word.content];
        });
  }

  convertInput() {
    if (typeof this.textInput === 'string') {
      this.textInput = this.textInput.toLowerCase().split(' ');
      this.parsedText = [];

      this.parseText();
      this.fetchSyllables();
    }
  }

  render() {
    this.convertInput();

    const clazz = `text${' ' + (this.vertical ? 'vertical' : 'horizontal')}`;

    return html`
    <div class="${clazz}">
        <slot name="before"></slot>
        ${this.textOutput}
        <slot name="after"></slot>
    </div>
    `;
  }

  updated(_changedProperties) {
    const svgs = this.shadowRoot.querySelectorAll('svg');

    for (const svg of svgs)
      this.resizeSvg(svg);

    this.dispatchEvent(new Event('update-done'));
  }
}

window.customElements.define("xamix-element", XamixElement);
