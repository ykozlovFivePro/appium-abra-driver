const commands = {
  /**
   * @this {AbraXCUITestDriver}
   */
  async pageLoadTimeoutW3C(ms) {
    await this.setPageLoadTimeout(this.parseTimeoutArgument(ms));
  },
  /**
   * @this {AbraXCUITestDriver}
   */
  async pageLoadTimeoutMJSONWP(ms) {
    await this.setPageLoadTimeout(this.parseTimeoutArgument(ms));
  },

  /**
   * @this {AbraXCUITestDriver}
   */
  async scriptTimeoutW3C(ms) {
    // XXX: this is synchronous
    await this.setAsyncScriptTimeout(this.parseTimeoutArgument(ms));
  },

  /**
   * Alias for {@linkcode AbraXCUITestDriver.scriptTimeoutW3C}.
   *
   * @param {number} ms - the timeout
   * @this {AbraXCUITestDriver}
   * @deprecated Use {@linkcode AbraXCUITestDriver.scriptTimeoutW3C} instead
   */
  async scriptTimeoutMJSONWP(ms) {
    await this.asyncScriptTimeout(ms);
  },

  /**
   * Alias for {@linkcode AbraXCUITestDriver.scriptTimeoutW3C}.
   *
   * @param {number} ms - the timeout
   *
   * @deprecated Use {@linkcode AbraXCUITestDriver.scriptTimeoutW3C} instead
   * @this {AbraXCUITestDriver}
   */
  async asyncScriptTimeout(ms) {
    await this.scriptTimeoutW3C(ms);
  },
};

const helpers = {
  /**
   * @this {AbraXCUITestDriver}
   */
  setPageLoadTimeout(ms) {
    ms = parseInt(ms, 10);
    this.pageLoadMs = ms;
    if (this.remote) {
      this.remote.pageLoadMs = this.pageLoadMs;
    }
    this.log.debug(`Set page load timeout to ${ms}ms`);
  },
  /**
   * @this {AbraXCUITestDriver}
   */
  setAsyncScriptTimeout(ms) {
    this.asyncWaitMs = ms;
    this.log.debug(`Set async script timeout to ${ms}ms`);
  },
};

export default {...helpers, ...commands};

/**
 * @typedef {import('../driver').AbraXCUITestDriver} AbraXCUITestDriver
 */
