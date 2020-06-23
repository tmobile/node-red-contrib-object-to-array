import objectToArray from "./object-to-array";
import helper from "node-red-node-test-helper";
import { expect } from "chai";

helper.init(require.resolve("node-red"));

describe("object-to-array Node", function () {
  // beforeEach(function (done) {
  //   helper.startServer(done);
  // });

  afterEach(function (done) {
    helper.unload();
    done();
    // helper.stopServer(done);
  });

  it("should be loaded", function (done) {
    var flow = [{ id: "n1", type: "object-to-array", name: "test name" }];
    helper.load(objectToArray, flow, function () {
      var n1 = helper.getNode("n1");
      expect(n1.name).to.equal("test name");
      done();
    });
  });

  it("should transform payload", function (done) {
    const payload = {"apple": 1, "banana": 2};
    var flow = [
      {
        id: "n1",
        type: "object-to-array",
        name: "test name",
        input: "payload",
        output: "custom",
        wires: [["n2"]],
      },
      { id: "n2", type: "helper" },
    ];
    helper.load(objectToArray, flow, function () {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");

      n2.on("input", function (msg: any) {
        console.log(msg);
        try {
          expect(msg.custom[0]["key"]).to.equal("apple");
          expect(msg.custom[0]["value"]).to.equal(1);
          expect(msg.custom[1]["key"]).to.equal("banana");
          expect(msg.custom[1]["value"]).to.equal(2);
          done();
        } catch (e) {
          done(e);
        }
      });

      n1.receive({ payload });
    });
  });
});
