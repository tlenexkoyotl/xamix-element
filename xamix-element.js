import {html, LitElement, svg} from 'lit-element';
import style from './xamix-element-styles.js';

class XamixElement extends LitElement {
  static get properties() {
    return {
      fontSize: {
        type: Number,
        reflect: true
      },
      realFontSize: {type: Number},
      xOffset: {type: Number},
      yOffset: {type: Number},
      widthOffset: {type: Number},
      heightOffset: {type: Number},
      root: {type: String},
      vertical: {
        type: Boolean,
        reflect: true
      },
      bold: {
        type: Boolean,
        reflect: true
      },
      textInput: {
        type: String,
        reflect: true
      },
      textOutput: {type: Array},
      screenHeight: {
        type: Number,
        reflect: true
      },
      screenWidth: {
        type: Number,
        reflect: true
      }
    };
  }

  static get styles() {
    return style;
  }

  constructor() {
    super();
    this.fontSize = 30;
    this.root = '.';
    this.bold = false;
    this.textOutput = [];
    this.screenHeight = 100;
    this.screenWidth = 100;

    this.setFontSize();
    this.setOffset();
  }

  setFontSize() {
    console.log(`this.screenHeight: ${this.screenHeight}`);
    console.log(`this.fontSize / this.screenHeight = ${this.fontSize} / ${this.screenHeight} = ${this.fontSize / this.screenHeight}`);
    console.log(`100 / this.screenHeight = ${100} / ${this.screenHeight} = ${100 / this.screenHeight}`);
    // this.fontSize = this.fontSize * (100 / this.screenHeight);
    console.log(`this.fontSize: ${this.fontSize}`);
    console.log(`this.screenWidth: ${this.screenWidth}`);
    console.log(`this.fontSize / this.screenWidth = ${this.fontSize} / ${this.screenWidth} = ${this.fontSize / this.screenWidth}`);
    console.log(`100 / this.screenWidth = ${100} / ${this.screenWidth} = ${100 / this.screenWidth}`);
    this.realFontSize = this.fontSize;
  }

  setOffset() {
    let widthProportion = 6;
    let heightProportion = 2;

    if (this.fontSize > 50)
      this.xOffset = 25;
    else if (this.fontSize > 30 && this.fontSize <= 50)
      this.xOffset = 50;
    else if (this.fontSize <= 30 && this.fontSize > 15)
      this.xOffset = 75;
    else if (this.fontSize <= 15) {
      this.xOffset = 90;
      widthProportion = 25;
      heightProportion = heightProportion * 4;
    }

    this.yOffset = 5 + this.xOffset;
    this.widthOffset = (widthProportion / 5) * this.xOffset;
    this.heightOffset = this.yOffset * heightProportion;
  }

  setViewBox(svg, viewBox) {
    svg.setAttribute('viewBox', viewBox);
  }

  formViewbox(x, y, width, height) {
    return `${x} ${y} ${width} ${height}`;
  }

  formHorizontalViewbox(x, width) {
    x = x - ((this.xOffset / 100) * this.fontSize);
    width = width + ((this.widthOffset / 100) * this.fontSize);

    return this.formViewbox(x, 0, width, 200);
  }

  formVerticalViewbox(y, height) {
    y = y - ((this.yOffset / 100) * this.fontSize);
    height = height + ((this.heightOffset / 100) * this.fontSize);

    return this.formViewbox(0, y, 200, height);
  }

  horizontalResize(svg, x, width) {
    this.setViewBox(svg, this.formHorizontalViewbox(x, width));
    svg.setAttribute('height', this.fontSize);
  }

  verticalResize(svg, y, height) {
    this.setViewBox(svg, this.formVerticalViewbox(y, height));
    svg.setAttribute('width', this.fontSize);
  }

  resizeSvg(svg) {
    const bbox = svg.getBBox();
    const width = bbox.width;
    const height = bbox.height;
    const x = bbox.x;
    const y = bbox.y;

    if (this.vertical) {
      this.verticalResize(svg, y, height);
    } else {
      this.horizontalResize(svg, x, width);
    }
  }

  render() {
    let promises = [];

    if (typeof this.textInput === 'string') {
      this.textInput = this.textInput.toLowerCase().split(' ');

      for (const text of this.textInput)
        promises = [...promises,
          fetch(`${this.root}/data/${this.bold ? 'bold' : 'regular'}/${text}.svg`,
            {mode: 'no-cors'})
            .then(file => file.text())
        ];

      Promise.all(promises)
        .then(files => {
          for (const file of files) {
            const template = document.createElement('svg');
            template.innerHTML = `<svg>${file}</svg>`;

            this.textOutput = [...this.textOutput, template.children[0].children[0]];
          }
        });
    }

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
    const isFontSizeSet = _changedProperties.has('fontSize') ||
      _changedProperties.has('screenHeight') ||
      _changedProperties.has('screenHeight');

    if (isFontSizeSet) {
      this.setFontSize();
      this.setOffset();
    }

    for (const svg of svgs)
      this.resizeSvg(svg);

    this.dispatchEvent(new Event('update-done'));
  }
}

window.customElements.define("xamix-element", XamixElement);
