class SchemaError extends Error {
  constructor(msg, schemaStack) {
    super(
        (schemaStack ? 'Schema error at ' + schemaStack.join('.') + '. ' :
            /* istanbul ignore next */ '') +
        (msg instanceof Error ? msg.message :
            /* istanbul ignore next */ msg));
    /* istanbul ignore else */
    if (schemaStack)
      this.schemaStack = schemaStack;
    /* istanbul ignore else */
    if (msg instanceof Error)
      this.stack = msg.stack;
  }
}

module.exports = SchemaError;
