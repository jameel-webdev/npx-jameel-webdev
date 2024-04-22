#!/usr/bin/env node

import fs from "fs";
import os from "os";
import ora from "ora";
import path from "path";
import open from "open";
import axios from "axios";
import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import cliSpinners from "cli-spinners";

// Create a prompt module for interacting with the user via the command line interface
const prompt = inquirer.createPromptModule();

// Get the desktop directory path based on the operating system
const desktopDir = path.join(os.homedir(), "Desktop");

// Define a suggestion to use "cmd/ctrl + click" to open/copy links
const suggestion = [
  `💡 ${chalk.blue.bold("Suggestion:")} Try using ${chalk.yellow.bold(
    "cmd/ctrl +"
  )} ${chalk.green.bold("click")} on the links above to open/copy`,
].join("\n");

// Create a loader to indicate that the resume is being downloaded
const loader = ora({
  text: " Downloading resume",
  spinner: cliSpinners.aesthetic,
});

// Configuration options for the boxen module to customize the appearance of the box
const options = {
  width: 64,
  padding: 1,
  borderStyle: "single",
  title: "Hey there! 👋",
  borderColor: "#66FF66",
  titleAlignment: "center",
};

// Define an array of questions for user interaction, including options for various actions
const questions = [
  {
    type: "list",
    name: "action",
    message: "What you want to do?",
    choices: [
      {
        name: `Send me an ${chalk.green.bold("email")}?`,
        value: () => {
          setTimeout(() => {
            open("mailto:jameel.webdev@gmail.com");
          }, 2000);
          console.log(
            `\n${chalk.green.bold(
              "Done"
            )}, your email client should ${chalk.yellow.bold(
              "open soon"
            )}. \nI'll keep an eye out for your message! ${chalk.bold("👀")}\n`
          );
        },
      },
      {
        name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
        value: () => {
          loader.start();
          axios({
            method: "get",
            url: "https://rb.gy/12wxy9",
            responseType: "stream",
          })
            .then(function (response) {
              const writer = fs.createWriteStream(
                path.join(desktopDir, "JameelAhmed-Resume.pdf")
              );

              response.data.pipe(writer);

              writer.on("finish", () => {
                console.log(
                  "\n\nResume downloaded successfully to desktop 📂 ✅\n"
                );
                loader.stop();
                setTimeout(() => {
                  open(path.join(desktopDir, "jameelwebdev-resume.pdf"));
                }, 2000);
              });
              writer.on("error", (err) => {
                console.error("\nError downloading resume:", err);
                loader.stop();
              });
            })
            .catch(function (error) {
              console.error("\nError downloading resume:", error);
              loader.stop();
            });
        },
      },
      {
        name: "Just quit!",
        value: () => {
          console.log(
            chalk.hex("#FF5733")(
              "\nThanks for stopping by. \nIf you ever decide to return, feel free to reach out. \nHave a great day! 🎉\n"
            )
          );
        },
      },
    ],
  },
];

// Define color-coded labels and their corresponding descriptions for various tech platforms
const data = {
  // LABELS
  labelGitHub: chalk.bgHex("#24292e").white.bold("GitHub    "),
  labelLinkedIn: chalk.bgHex("#0b66c2").black.bold("LinkedIn  "),
  labelDev: chalk.bgHex("#A9A9A9").black.bold("Dev       "),
  labelWeb: chalk.bgHex("#4CAF50").black.bold("Webfolio  "),
  labelFolio: chalk.bgHex("#FEE4CC").black.bold("Portfolio "),

  // LABEL DESCRIPTION
  github: chalk.gray("https://github.com/") + chalk.green("jameel-webdev"),
  dev: chalk.gray("https://dev.to/") + chalk.hex("#B0C4DE")("jameel-webdev"),
  web: chalk.yellowBright.underline("https://www.polywork.com/jameel_webdev"),
  linkedin:
    chalk.gray("https://linkedin.com/in/") + chalk.blueBright("jameel-webdev"),
  portfolio: chalk.green("https://jameel-webdev.vercel.app/"),
  intro:
    chalk.white.bold(
      "I am Jameel Ahmed, a Full Stack Developer known by the handle "
    ) +
    chalk.hex("#7B68EE")("jameel-webdev") +
    chalk.white.bold(
      " working on technologies like React JS, Typescript, Next JS, Node JS, Express JS, MongoDB etc."
    ),
};

// Concatenate data strings to display in the console output
const newline = "\n";
const introduction = `${data.intro}`;
const devto = `${data.labelDev}  ${data.dev}`;
const github = `${data.labelGitHub}  ${data.github}`;
const onlinePortfolio = `${data.labelWeb}  ${data.web}`;
const linkedin = `${data.labelLinkedIn}  ${data.linkedin}`;
const portfolio = `${data.labelFolio}  ${data.portfolio}`;

// Concatenating introduction, tech platform links, and online portfolio link
const output =
  introduction +
  newline +
  newline +
  devto +
  newline +
  github +
  newline +
  linkedin +
  newline +
  onlinePortfolio +
  newline +
  portfolio;

// Display the formatted output in a box and prompt the user with the defined questions then execute the action based on the user's choice
console.log(chalk.white(boxen(output, options)));

console.log(`\n`, suggestion, `\n`);

prompt(questions).then((answer) => answer.action());
