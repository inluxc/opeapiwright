import { compile } from "ejs";
import { readFileSync as read } from "node:fs";
import { writeFileSync as write } from "node:fs";
import { join } from "node:path";
const str = read(join(__dirname, "./template/spec.ts.ejs"), "utf8");
const openapi = read(join(__dirname, "./openapi/openapi.json"), "utf8");
const openapiJson = JSON.parse(openapi);

const variables = {};

// Loop through paths
for (const path of Object.keys(openapiJson.paths)) {
  // Loop through methods
  for (const method of Object.keys(openapiJson.paths[path])) {
    const specFileName = `${openapiJson.paths[path][method].operationId}.spec.ts`;
    const output = {
      operationId: openapiJson.paths[path][method].operationId,
      tests: [],
    };
    // Loop through Responses
    for (const response of Object.keys(
      openapiJson.paths[path][method].responses,
    )) {
      const test = {};

      // Rewrite path to pass to ejs
      test.path = path.replace(/{/g, "${").replace(/}/g, "}");
      test.method = method;
      test.tags = openapiJson.paths[path][method].tags.join(", ");
      test.statusCode = response;

      if (openapiJson.paths[path][method].responses[response].content) {
        console.log(
          openapiJson.paths[path][method].responses[response].content[
            "application/json"
          ].schema.$ref,
        );
      }

      output.tests.push(test);
    }
    console.log(output);
    // Save spec file
    const content = compile(str)(output);
    write(`specs/${specFileName}`, content, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

/*
  const ret = ejs.compile(str)(openapi);
  console.log(ret);
*/
