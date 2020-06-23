import { Red, Node, NodeProperties } from "node-red";

export default function objectToArray(RED: Red) {
  function ObjectToArrayNode(config: NodeProperties & { [key: string]: any }) {
    RED.nodes.createNode(this, config);

    const node = this as Node;
    // const context = this.context();

    this.input = config.input || "payload";
    this.inputType = config.inputType || "msg";

    this.output = config.output || "payload";

    this.key = config.key || "key";
    this.value = config.value || "value";

    // DBG console.log("ObjectToArrayNode, constructor", config);

    node.on("input", function (msg, send) {
      const inputValue = RED.util.evaluateNodeProperty(
        this.input, // "payload", "widgets", "gadgets", etc.
        this.inputType, // "msg", "flow", "global"
        node,
        msg
      );

      if (inputValue) {
        // DBG console.log("ObjectToArrayNode, inputValue", inputValue);
        let arrayOutput = [];
        for (let key in inputValue) {
          // DBG console.log("ObjectToArrayNode, key", key);
          // DBG console.log("ObjectToArrayNode, value", key);
          arrayOutput.push({
            [this.key]: key,
            [this.value]: inputValue[key]
          });
        }
        // DBG console.log("ObjectToArrayNode, arrayOutput", arrayOutput);

        msg[this.output] = arrayOutput;
        send(msg);
      }
    });
  }

  RED.nodes.registerType("object-to-array", ObjectToArrayNode);
}

module.exports = objectToArray;
