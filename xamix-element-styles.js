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
  width: 50%;
}

.horizontal {
  direction: rtl;
  padding-right: 10px;
}

svg {
  fill: #000000;
}

svg.space {
  fill: #ffffff;
}

.vertical {
  padding-top: 10px;
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
