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
  display: var(--xamix-word-display, inline-block);
  white-space: var(--xamix-word-white-space, nowrap);
  background-color: var(--xamix-word-background-color, transparent);
}

.word > svg {
  display: var(--xamix-syllable-display, inline-block);
  white-space: var(--xamix-syllable-white-space, nowrap);
  fill: var(--xamix-text-color, currentColor);
}

xamix-element {
  max-width: var(--xamix-element-max-width, none);
  max-height: var(--xamix-element-max-height, none);
}

a {
  color: var(--xamix-link-color, #0000ff);
}

a:link {
  color: var(--xamix-link-unvisited-color, #0000ff);
}

a:visited {
  color: var(--xamix-link-visited-color, #4b167c);
}

a:focus {
  color: var(--xamix-link-focused-color, #4b167c);
}

a:hover {
  color: var(--xamix-link-hover-color, #ff0000);
}

a:active {
  color: var(--xamix-link-active-color, #ffff00);
}

.word > svg.space {
  fill: var(--xamix-space-color, transparent);
  background-color: var(--xamix-word-space-background-color, transparent);
}

.text {
  text-align: var(--xamix-text-align, justify);
  background-color: var(--xamix-text-background-color, transparent);
  line-height: var(--xamix-text-line-height, 0);
}

.columns {
  display: var(--xamix-columns-display, table);
  direction: var(--xamix-columns-direction, ltr);
  text-align: var(--xmaix-columns-text-align, right);
}

.columns > * {
  display: var(--xamix-columns-contents-display, table-cell);
}

.horizontal {
  direction: var(--xamix-horizontal-direction, rtl);
}

.vertical {
  direction: var(--xamix-vertical-direction, ltr);
  writing-mode: var(--xamix-vertical-writing-mode, vertical-rl);
  -webkit-writing-mode: --xamix-vertical-writing-mode;
  -moz-writing-mode: --xamix-vertical-writing-mode;
  -ms-writing-mode: --xamix-vertical-writing-mode;
}

.foreign {
  direction: var(--xamix-foreign-text-direction, ltr);
}
`;
