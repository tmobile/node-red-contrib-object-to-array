/**
Copyright 2020 T-Mobile USA, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See the LICENSE file for additional language around the disclaimer of warranties.
Trademark Disclaimer: Neither the name of “T-Mobile, USA” nor the names of
its contributors may be used to endorse or promote products
*/

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
    const flow = [{ id: "n1", type: "object-to-array", name: "test name" }];
    helper.load(objectToArray, flow, function () {
      const n1 = helper.getNode("n1");
      expect(n1.name).to.equal("test name");
      done();
    });
  });

  it("should transform payload", function (done) {
    const payload = {"apple": 1, "banana": 2};
    const flow = [
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
