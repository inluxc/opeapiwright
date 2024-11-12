const nodeFs = require("node:fs");
const { get } = require("node:https");
xxxx;
const { join } = require("node:path");
const { generate } = require("openapi-to-ts-validator");

// Download latest swagger file
const file = nodeFs.createWriteStream("openapi/openapi.json");
const request = get(
  "https://api.development.dillerapp.com/swagger/v1/swagger.json",
  (response) => {
    response.pipe(file);

    // after download completed close filestream
    file.on("finish", () => {
      file.close();
      console.log("Finished Downloading");
      generate({
        schemaFile: join(__dirname, "openapi/openapi.json"),
        schemaType: "json",
        directory: join(__dirname, "/interfaces"),
        addFormats: true,
      }).then(() => {
        console.log("Patch generated schema");
        // PATCH generated schema
        nodeFs.readFile("interfaces/schema.json", "utf-8", (err, contents) => {
          if (err) {
            return console.error(err);
          }
          // Fix /member_identifier
          const schema = JSON.parse(contents);
          schema.definitions.MemberIdentifier.type = ["object", "null"];
          // Save File
          nodeFs.writeFile(
            "interfaces/schema.json",
            JSON.stringify(schema),
            "utf-8",
            (err2) => {
              if (err2) {
                console.log(err2);
              }
            },
          );
        });
      });
    });
  },
);
