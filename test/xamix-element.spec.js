/* eslint-disable no-unused-expressions */
import { fixture, assert } from "@open-wc/testing";

import "../xamix-element.js";

describe("Suite cases", () => {
  it("Case default", async () => {
    const _element = await fixture("<xamix-element></xamix-element>");
    assert.strictEqual(_element.hello, 'Hello World!');
  });
});
