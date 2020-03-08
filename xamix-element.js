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
    this.fontSize = 3;
    this.root = '.';
    this.bold = false;
    this.textOutput = [];
    this.screenWidth = window.innerWidth;

    this.setFontSize();
  }

  getSizeFactor() {
    return this.screenWidth / 100;
  }

  setFontSize() {
    this.realFontSize = this.getSizeFactor() * this.fontSize;
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
    height = height * 1.8;

    return this.formViewbox(0, y, 200, height);
  }

  horizontalResize(svg, x, width) {
    this.setViewBox(svg, this.formHorizontalViewbox(x, width));
    svg.setAttribute('height', this.realFontSize);
  }

  verticalResize(svg, y, height) {
    this.setViewBox(svg, this.formVerticalViewbox(y, height));
    svg.setAttribute('width', this.realFontSize);
  }

  resizeSvg(svg) {
    const bbox = svg.getBBox();

    if (this.vertical) {
      const y = bbox.y;
      const height = bbox.height;

      this.verticalResize(svg, y, height);
    } else {
      const x = bbox.x;
      const width = bbox.width;

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
      _changedProperties.has('screenWidth');

    if (isFontSizeSet)
      this.setFontSize();

    for (const svg of svgs)
      this.resizeSvg(svg);

    this.dispatchEvent(new Event('update-done'));
  }
}

window.customElements.define("xamix-element", XamixElement);
