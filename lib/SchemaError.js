class SchemaError extends Error {
  constructor(msg, schemaStack) {
    super(
        (schemaStack ? 'Schema error at ' + schemaStack.join('.') + '. ' : '') +
        (msg instanceof Error ? msg.message : msg));
    if (schemaStack)
      this.schemaStack = schemaStack;
    if (msg instanceof Error)
      this.stack = msg.stack;
  }
}

module.exports = SchemaError;
