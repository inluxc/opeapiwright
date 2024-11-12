#!/usr/bin/env node

import { program } from "commander";
import figlet from "figlet";
import chalk from "chalk";

console.log(
  chalk.yellow(figlet.textSync("OpenapiWright", { horizontalLayout: "full" })),
);

program
  .version("0.0.1")
  .description("OpenAPI to Playwright test generator")
  .option("-i, --input <type>", "OpenAPI file path")
  .option("-o, --ouput <type>", "Playwright test output path")
  .action((options) => {
    console.log(`Hey, ${options.name}!`);
  });

program.parse(process.argv);
