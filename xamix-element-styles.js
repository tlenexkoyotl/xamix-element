import { css } from 'lit-element';

export default css`
:host {
  display: inline-block;
  box-sizing: border-box;
}

:host([hidden]), [hidden] {
  display: none !important;
}

*, *:before, *:after {
  box-sizing: inherit;
  font-family: inherit;
}

.word {
  display: inline-block;
  white-space: nowrap;
}

.word > svg {
  display: inline-block;
  white-space: nowrap;
}

.text {
  direction: rtl;
  text-align: justify;
}

.columns {
  display: table;
  direction: ltr;
}

div.columns > div {
  display: table-cell;
}

.horizontal {
  direction: rtl;
}

.vertical {
  direction: ltr;
  -webkit-writing-mode: vertical-rl;
  -moz-writing-mode: vertical-rl;
  -ms-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
}

.latin {
  direction: ltr;
}
`;
