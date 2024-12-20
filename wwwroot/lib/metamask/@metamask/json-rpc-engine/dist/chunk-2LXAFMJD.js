"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkZ4BLTVTBjs = require('./chunk-Z4BLTVTB.js');

// src/JsonRpcEngine.ts
var _rpcerrors = require('@metamask/rpc-errors');
var _safeeventemitter = require('@metamask/safe-event-emitter'); var _safeeventemitter2 = _interopRequireDefault(_safeeventemitter);




var _utils = require('@metamask/utils');
var DESTROYED_ERROR_MESSAGE = "This engine is destroyed and can no longer be used.";
var _isDestroyed, _middleware, _notificationHandler, _assertIsNotDestroyed, assertIsNotDestroyed_fn, _handleBatch, handleBatch_fn, _handle, handle_fn, _processRequest, processRequest_fn, _runAllMiddleware, runAllMiddleware_fn, _runMiddleware, runMiddleware_fn, _runReturnHandlers, runReturnHandlers_fn, _checkForCompletion, checkForCompletion_fn;
var _JsonRpcEngine = class _JsonRpcEngine extends _safeeventemitter2.default {
  /**
   * Constructs a {@link JsonRpcEngine} instance.
   *
   * @param options - Options bag.
   * @param options.notificationHandler - A function for handling JSON-RPC
   * notifications. A JSON-RPC notification is defined as a JSON-RPC request
   * without an `id` property. If this option is _not_ provided, notifications
   * will be treated the same as requests. If this option _is_ provided,
   * notifications will be passed to the handler function without touching
   * the engine's middleware stack. This function should not throw or reject.
   */
  constructor({ notificationHandler } = {}) {
    super();
    /**
     * Throws an error if this engine is destroyed.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _assertIsNotDestroyed);
    /**
     * Handles a batch of JSON-RPC requests, either in `async` or callback
     * fashion.
     *
     * @param requests - The request objects to process.
     * @param callback - The completion callback.
     * @returns The array of responses, or nothing if a callback was specified.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _handleBatch);
    /**
     * Ensures that the request / notification object is valid, processes it, and
     * passes any error and response object to the given callback.
     *
     * Does not reject.
     *
     * @param callerReq - The request object from the caller.
     * @param callback - The callback function.
     * @returns Nothing.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _handle);
    /**
     * Indicating whether this engine is destroyed or not.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _isDestroyed, false);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _middleware, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _notificationHandler, void 0);
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _middleware, []);
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _notificationHandler, notificationHandler);
  }
  /**
   * Calls the `destroy()` function of any middleware with that property, clears
   * the middleware array, and marks this engine as destroyed. A destroyed
   * engine cannot be used.
   */
  destroy() {
    _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware).forEach(
      (middleware) => {
        if (
          // `in` walks the prototype chain, which is probably the desired
          // behavior here.
          "destroy" in middleware && typeof middleware.destroy === "function"
        ) {
          middleware.destroy();
        }
      }
    );
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _middleware, []);
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _isDestroyed, true);
  }
  /**
   * Add a middleware function to the engine's middleware stack.
   *
   * @param middleware - The middleware function to add.
   */
  push(middleware) {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _assertIsNotDestroyed, assertIsNotDestroyed_fn).call(this);
    _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware).push(middleware);
  }
  handle(req, callback) {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _assertIsNotDestroyed, assertIsNotDestroyed_fn).call(this);
    if (callback && typeof callback !== "function") {
      throw new Error('"callback" must be a function if provided.');
    }
    if (Array.isArray(req)) {
      if (callback) {
        return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handleBatch, handleBatch_fn).call(
          this,
          req,
          // This assertion is safe because of the runtime checks validating that `req` is an array and `callback` is defined.
          // There is only one overload signature that satisfies both conditions, and its `callback` type is the one that's being asserted.
          callback
        );
      }
      return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handleBatch, handleBatch_fn).call(this, req);
    }
    if (callback) {
      return _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handle, handle_fn).call(this, req, callback);
    }
    return this._promiseHandle(req);
  }
  /**
   * Returns this engine as a middleware function that can be pushed to other
   * engines.
   *
   * @returns This engine as a middleware function.
   */
  asMiddleware() {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _assertIsNotDestroyed, assertIsNotDestroyed_fn).call(this);
    return async (req, res, next, end) => {
      var _a, _b;
      try {
        const [middlewareError, isComplete, returnHandlers] = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _runAllMiddleware, runAllMiddleware_fn).call(_a, req, res, _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware));
        if (isComplete) {
          await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _b = _JsonRpcEngine, _runReturnHandlers, runReturnHandlers_fn).call(_b, returnHandlers);
          return end(middlewareError);
        }
        return next(async (handlerCallback) => {
          var _a2;
          try {
            await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a2 = _JsonRpcEngine, _runReturnHandlers, runReturnHandlers_fn).call(_a2, returnHandlers);
          } catch (error) {
            return handlerCallback(error);
          }
          return handlerCallback();
        });
      } catch (error) {
        return end(error);
      }
    };
  }
  /**
   * A promise-wrapped _handle.
   *
   * @param request - The JSON-RPC request.
   * @returns The JSON-RPC response.
   */
  // This function is used in tests, so we cannot easily change it to use the
  // hash syntax.
  // eslint-disable-next-line no-restricted-syntax
  async _promiseHandle(request) {
    return new Promise((resolve, reject) => {
      _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _handle, handle_fn).call(this, request, (error, res) => {
        if (error && res === void 0) {
          reject(error);
        } else {
          resolve(res);
        }
      }).catch(reject);
    });
  }
};
_isDestroyed = new WeakMap();
_middleware = new WeakMap();
_notificationHandler = new WeakMap();
_assertIsNotDestroyed = new WeakSet();
assertIsNotDestroyed_fn = function() {
  if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _isDestroyed)) {
    throw new Error(DESTROYED_ERROR_MESSAGE);
  }
};
_handleBatch = new WeakSet();
handleBatch_fn = async function(requests, callback) {
  try {
    if (requests.length === 0) {
      const response = [
        {
          id: null,
          jsonrpc: "2.0",
          error: new (0, _rpcerrors.JsonRpcError)(
            _rpcerrors.errorCodes.rpc.invalidRequest,
            "Request batch must contain plain objects. Received an empty array"
          )
        }
      ];
      if (callback) {
        return callback(null, response);
      }
      return response;
    }
    const responses = (await Promise.all(
      // 1. Begin executing each request in the order received
      requests.map(this._promiseHandle.bind(this))
    )).filter(
      // Filter out any notification responses.
      (response) => response !== void 0
    );
    if (callback) {
      return callback(null, responses);
    }
    return responses;
  } catch (error) {
    if (callback) {
      return callback(error);
    }
    throw error;
  }
};
_handle = new WeakSet();
handle_fn = async function(callerReq, callback) {
  var _a;
  if (!callerReq || Array.isArray(callerReq) || typeof callerReq !== "object") {
    const error2 = new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.invalidRequest,
      `Requests must be plain objects. Received: ${typeof callerReq}`,
      { request: callerReq }
    );
    return callback(error2, { id: null, jsonrpc: "2.0", error: error2 });
  }
  if (typeof callerReq.method !== "string") {
    const error2 = new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.invalidRequest,
      `Must specify a string method. Received: ${typeof callerReq.method}`,
      { request: callerReq }
    );
    if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _notificationHandler) && !_utils.isJsonRpcRequest.call(void 0, callerReq)) {
      return callback(null);
    }
    return callback(error2, {
      // Typecast: This could be a notification, but we want to access the
      // `id` even if it doesn't exist.
      id: callerReq.id ?? null,
      jsonrpc: "2.0",
      error: error2
    });
  } else if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _notificationHandler) && _utils.isJsonRpcNotification.call(void 0, callerReq) && !_utils.isJsonRpcRequest.call(void 0, callerReq)) {
    try {
      await _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _notificationHandler).call(this, callerReq);
    } catch (error2) {
      return callback(error2);
    }
    return callback(null);
  }
  let error = null;
  const req = { ...callerReq };
  const res = {
    id: req.id,
    jsonrpc: req.jsonrpc
  };
  try {
    await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _processRequest, processRequest_fn).call(_a, req, res, _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _middleware));
  } catch (_error) {
    error = _error;
  }
  if (error) {
    delete res.result;
    if (!res.error) {
      res.error = _rpcerrors.serializeError.call(void 0, error);
    }
  }
  return callback(error, res);
};
_processRequest = new WeakSet();
processRequest_fn = async function(req, res, middlewares) {
  var _a, _b, _c;
  const [error, isComplete, returnHandlers] = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _runAllMiddleware, runAllMiddleware_fn).call(_a, req, res, middlewares);
  _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _b = _JsonRpcEngine, _checkForCompletion, checkForCompletion_fn).call(_b, req, res, isComplete);
  await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _c = _JsonRpcEngine, _runReturnHandlers, runReturnHandlers_fn).call(_c, returnHandlers);
  if (error) {
    throw error;
  }
};
_runAllMiddleware = new WeakSet();
runAllMiddleware_fn = async function(req, res, middlewares) {
  var _a;
  const returnHandlers = [];
  let error = null;
  let isComplete = false;
  for (const middleware of middlewares) {
    [error, isComplete] = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, _a = _JsonRpcEngine, _runMiddleware, runMiddleware_fn).call(_a, req, res, middleware, returnHandlers);
    if (isComplete) {
      break;
    }
  }
  return [error, isComplete, returnHandlers.reverse()];
};
_runMiddleware = new WeakSet();
runMiddleware_fn = async function(request, response, middleware, returnHandlers) {
  return new Promise((resolve) => {
    const end = (error) => {
      const parsedError = error || response.error;
      if (parsedError) {
        response.error = _rpcerrors.serializeError.call(void 0, parsedError);
      }
      resolve([parsedError, true]);
    };
    const next = (returnHandler) => {
      if (response.error) {
        end(response.error);
      } else {
        if (returnHandler) {
          if (typeof returnHandler !== "function") {
            end(
              new (0, _rpcerrors.JsonRpcError)(
                _rpcerrors.errorCodes.rpc.internal,
                `JsonRpcEngine: "next" return handlers must be functions. Received "${typeof returnHandler}" for request:
${jsonify(
                  request
                )}`,
                { request }
              )
            );
          }
          returnHandlers.push(returnHandler);
        }
        resolve([null, false]);
      }
    };
    try {
      middleware(request, response, next, end);
    } catch (error) {
      end(error);
    }
  });
};
_runReturnHandlers = new WeakSet();
runReturnHandlers_fn = async function(handlers) {
  for (const handler of handlers) {
    await new Promise((resolve, reject) => {
      handler((error) => error ? reject(error) : resolve());
    });
  }
};
_checkForCompletion = new WeakSet();
checkForCompletion_fn = function(request, response, isComplete) {
  if (!_utils.hasProperty.call(void 0, response, "result") && !_utils.hasProperty.call(void 0, response, "error")) {
    throw new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.internal,
      `JsonRpcEngine: Response has no error or result for request:
${jsonify(
        request
      )}`,
      { request }
    );
  }
  if (!isComplete) {
    throw new (0, _rpcerrors.JsonRpcError)(
      _rpcerrors.errorCodes.rpc.internal,
      `JsonRpcEngine: Nothing ended request:
${jsonify(request)}`,
      { request }
    );
  }
};
/**
 * For the given request and response, runs all middleware and their return
 * handlers, if any, and ensures that internal request processing semantics
 * are satisfied.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param middlewares - The stack of middleware functions.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _processRequest);
/**
 * Serially executes the given stack of middleware.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param middlewares - The stack of middleware functions to execute.
 * @returns An array of any error encountered during middleware execution,
 * a boolean indicating whether the request was completed, and an array of
 * middleware-defined return handlers.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _runAllMiddleware);
/**
 * Runs an individual middleware function.
 *
 * @param request - The request object.
 * @param response - The response object.
 * @param middleware - The middleware function to execute.
 * @param returnHandlers - The return handlers array for the current request.
 * @returns An array of any error encountered during middleware exection,
 * and a boolean indicating whether the request should end.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _runMiddleware);
/**
 * Serially executes array of return handlers. The request and response are
 * assumed to be in their scope.
 *
 * @param handlers - The return handlers to execute.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _runReturnHandlers);
/**
 * Throws an error if the response has neither a result nor an error, or if
 * the "isComplete" flag is falsy.
 *
 * @param request - The request object.
 * @param response - The response object.
 * @param isComplete - Boolean from {@link JsonRpcEngine.#runAllMiddleware}
 * indicating whether a middleware ended the request.
 */
_chunkZ4BLTVTBjs.__privateAdd.call(void 0, _JsonRpcEngine, _checkForCompletion);
var JsonRpcEngine = _JsonRpcEngine;
function jsonify(request) {
  return JSON.stringify(request, null, 2);
}



exports.JsonRpcEngine = JsonRpcEngine;
//# sourceMappingURL=chunk-2LXAFMJD.js.map