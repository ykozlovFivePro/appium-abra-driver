import _ from 'lodash';
import {errors, errorFromCode, errorFromW3CJsonCode} from 'appium/driver';
import {util} from 'appium/support';
import {W3C_WEB_ELEMENT_IDENTIFIER} from '@appium/support/build/lib/util';

/**
 *
 * @param {any} value
 * @returns {value is import('@appium/types').Element}
 */
function isElement(value) {
  return _.isObject(value) && (W3C_WEB_ELEMENT_IDENTIFIER in value || 'ELEMENT' in value);
}

export default {
  /**
   * Collect the response of an async script execution
   * @this {XCUITestDriver}
   * @deprecated
   * @privateRemarks It's unclear what this is for. Don't use it.
   */
  // eslint-disable-next-line require-await
  async receiveAsyncResponse(status, value) {
    this.log.debug(`Received async response: ${JSON.stringify(value)}`);
    if (!util.hasValue(this.asyncPromise)) {
      this.log.warn(
        `Received async response when we were not expecting one! ` +
          `Response was: ${JSON.stringify(value)}`
      );
      return;
    }

    if (util.hasValue(status) && status !== 0) {
      // MJSONWP
      return this.asyncPromise.reject(errorFromCode(status, value.message));
    }
    if (!util.hasValue(status) && value && _.isString(value.error)) {
      // W3C
      return this.asyncPromise.reject(
        errorFromW3CJsonCode(value.error, value.message, value.stacktrace)
      );
    }
    return this.asyncPromise.resolve(value);
  },
  /**
   * @this {XCUITestDriver}
   */
  async execute(script, args) {
    if (script.match(/^mobile:/)) {
      // rename deprecated 'element' key to 'elementId'
      args = _.mapKeys(args, (value, key) => (key === 'element' ? 'elementId' : key));

      // many of these functions will "unwrap" an `Element` to get at its id; this
      // just does it automatically for the `elementId` prop. so while most of
      // these `mobile*` methods will accept an `Element|string`, in practice
      // they will only ever get a `string`. this is just for documentation purposes.
      if (isElement(args.elementId)) {
        args.elementId = args.elementId[W3C_WEB_ELEMENT_IDENTIFIER] ?? args.elementId.ELEMENT;
      }

      return await this.executeMethod(script, [args]);
    } else if (this.isWebContext()) {
      args = this.convertElementsForAtoms(args);
      const result = await this.executeAtom('execute_script', [script, args]);
      return this.cacheWebElements(result);
    } else {
      throw new errors.NotImplementedError();
    }
  },
  /**
   * @this {XCUITestDriver}
   * @group Mobile Web Only
   */
  async executeAsync(script, args) {
    if (!this.isWebContext()) {
      throw new errors.NotImplementedError();
    }

    args = this.convertElementsForAtoms(args);
    this.asyncWaitMs = this.asyncWaitMs || 0;
    const promise = this.remote.executeAtomAsync(
      'execute_async_script',
      [script, args, this.asyncWaitMs],
      this.curWebFrames
    );
    return this.cacheWebElements(await this.waitForAtom(promise));
  },
};

/**
 * @typedef {import('../driver').XCUITestDriver} XCUITestDriver
 */
