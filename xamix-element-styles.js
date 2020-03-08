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

.text {
  direction: rtl;
  font-family: Arial;
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
