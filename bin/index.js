#!/usr/bin/env node

import fs from "fs";
import os from "os";
import ora from "ora";
import path from "path";
import open from "open";
import axios from "axios";
import boxen from "boxen";
import chalk from "chalk";
import dotenv from "dotenv";
import inquirer from "inquirer";
import cliSpinners from "cli-spinners";
import terminalLink from "terminal-link";

dotenv.config();

// Create a prompt module for interacting with the user via the command line interface
const prompt = inquirer.createPromptModule();

// Get the desktop directory path based on the operating system
const desktopDir = path.join(os.homedir(), "Desktop");

// Define a suggestion covering terminals that don't support clickable hyperlinks
const suggestion = [
  `💡 ${chalk.blue.bold("Suggestion:")} The links above are clickable — if yours isn't, try ${chalk.yellow.bold("cmd/ctrl +")} ${chalk.green.bold("double click")} to open/copy`,
].join("\n");

// Make link text clickable via the terminal's native OSC 8 hyperlink support,
// falling back to the plain styled text (today's behavior) where unsupported.
const link = (text, url) =>
  terminalLink(text, url, { fallback: (text) => text });

// Plain URLs, reused both for the clickable card links and the "Open a link" menu below
// (opening a link this way needs just Enter — no mouse click or modifier key required)
const urls = {
  portfolio: "https://lassiecoder.com/",
  x: "https://x.com/lassiecoder",
  github: "https://github.com/lassiecoder",
  medium: "https://medium.com/@lassiecoder",
  youtube: "https://www.youtube.com/@lassiecoder",
  instagram: "https://www.instagram.com/lassiecoder",
  linkedin: "https://www.linkedin.com/in/lassiecoder",
  book: "https://fable.co/book/x-9798231622320",
};

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
            open("mailto:lassiecoder@gmail.com");
          }, 2000);
          console.log(
            `\n${chalk.green.bold("Done")}, your email client should ${chalk.yellow.bold("open soon")}. \nI'll keep an eye out for your message! ${chalk.bold("👀")}\n`,
          );
        },
      },
      {
        name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
        value: () => {
          const resumePath = path.join(desktopDir, "lassiecoder-resume.pdf");
          loader.start();
          axios({
            method: "get",
            url: "https://drive.usercontent.google.com/download?id=1IM5U7HsQxKCYihSvW5QY5JBM0b0l1pmy&export=download&confirm=t",
            responseType: "stream",
          })
            .then(function (response) {
              // Google Drive can return a 200 HTML interstitial (e.g. quota/virus-scan
              // notice) instead of the file, so guard on content-type before saving.
              const contentType = response.headers["content-type"] || "";
              if (
                !contentType.includes("pdf") &&
                !contentType.includes("octet-stream")
              ) {
                throw new Error(
                  `Unexpected response type (${contentType || "unknown"}), download aborted`,
                );
              }

              const writer = fs.createWriteStream(resumePath);

              response.data.pipe(writer);

              writer.on("finish", () => {
                console.log(
                  "\n\nResume downloaded successfully to desktop 📂 ✅\n",
                );
                loader.stop();
                setTimeout(() => {
                  open(resumePath);
                }, 2000);
              });
              writer.on("error", (err) => {
                console.error(`\nError saving resume: ${err.message}`);
                loader.stop();
                fs.unlink(resumePath, () => {});
              });
            })
            .catch(function (error) {
              const status = error.response
                ? ` (HTTP ${error.response.status})`
                : "";
              console.error(
                `\nError downloading resume${status}: ${error.message}`,
              );
              loader.stop();
              fs.unlink(resumePath, () => {});
            });
        },
      },
      {
        name: `Schedule a ${chalk.yellowBright.bold("Meeting")}?`,
        value: () => {
          setTimeout(() => {
            open("https://calendly.com/hirepriyankasharma/30min");
          }, 2000);
          console.log(
            chalk.hex("#4CAF50")(
              `\nWhen scheduling a meeting, please include the ${chalk.yellow("subject")} of our discussion. \nLooking forward to meeting you at the scheduled time! 🗓️\n \n`,
            ),
          );
        },
      },
      //   {
      //     name: `Open a ${chalk.cyanBright.bold("link")} directly?`,
      //     value: async () => {
      //       const { link: chosenUrl } = await prompt([
      //         {
      //           type: "list",
      //           name: "link",
      //           message: "Which link would you like to open?",
      //           choices: [
      //             { name: "Portfolio", value: urls.portfolio },
      //             { name: "X", value: urls.x },
      //             { name: "GitHub", value: urls.github },
      //             { name: "Medium", value: urls.medium },
      //             { name: "YouTube", value: urls.youtube },
      //             { name: "Instagram", value: urls.instagram },
      //             { name: "LinkedIn", value: urls.linkedin },
      //           ],
      //         },
      //       ]);
      //       open(chosenUrl);
      //       console.log(
      //         `\n${chalk.green.bold("Done")}, opening it in your default browser now. 🔗\n`,
      //       );
      //     },
      //   },
      {
        name: "Just quit!",
        value: () => {
          console.log(
            chalk.hex("#FF5733")(
              "\nThanks for stopping by. \nIf you ever decide to return, feel free to reach out. \nHave a great day! 🎉\n",
            ),
          );
        },
      },
    ],
  },
];

// Define color-coded labels and their corresponding descriptions for various tech platforms
const data = {
  // LABELS
  labelPortfolio: chalk.bgHex("#4CAF50").black.bold("Portfolio "),
  labelX: chalk.bgHex("#000000").white.bold("X         "),
  labelGitHub: chalk.bgHex("#24292e").white.bold("GitHub    "),
  labelMedium: chalk.bgHex("#02B875").black.bold("Medium    "),
  labelYouTube: chalk.bgHex("#FF0000").white.bold("YouTube   "),
  labelInstagram: chalk.bgHex("#C13584").black.bold("Instagram "),
  labelLinkedIn: chalk.bgHex("#0b66c2").black.bold("LinkedIn  "),
  labelBook: chalk.bgHex("#FFB300").black.bold("e-Book      "),

  // LABEL DESCRIPTION
  portfolio: link(chalk.yellowBright.underline(urls.portfolio), urls.portfolio),
  x: link(
    chalk.gray("https://x.com/") + chalk.whiteBright("lassiecoder"),
    urls.x,
  ),
  github: link(
    chalk.gray("https://github.com/") + chalk.green("lassiecoder"),
    urls.github,
  ),
  medium: link(
    chalk.gray("https://medium.com/@") + chalk.hex("#02B875")("lassiecoder"),
    urls.medium,
  ),
  youtube: link(
    chalk.gray("https://www.youtube.com/@") + chalk.red("lassiecoder"),
    urls.youtube,
  ),
  instagram: link(
    chalk.gray("https://www.instagram.com/") +
      chalk.hex("#AB1E6B")("lassiecoder"),
    urls.instagram,
  ),
  linkedin: link(
    chalk.gray("https://www.linkedin.com/in/") +
      chalk.blueBright("lassiecoder"),
    urls.linkedin,
  ),
  book: link(chalk.yellowBright.underline(urls.book), urls.book),
  intro:
    chalk.white.bold("I'm Priyanka Sharma (") +
    chalk.hex("#7B68EE")("lassiecoder") +
    chalk.white.bold(
      ") — 6 years as a Software Developer crafting mobile & web experiences. I also write about AI + dev, and I'm the author of ",
    ) +
    chalk.italic.yellowBright('"AI + Gemini for Web Developers"') +
    chalk.white.bold("."),
};

// Concatenate data strings to display in the console output
const newline = "\n";
const introduction = `${data.intro}`;
const portfolio = `${data.labelPortfolio}  ${data.portfolio}`;
const x = `${data.labelX}  ${data.x}`;
const github = `${data.labelGitHub}  ${data.github}`;
const medium = `${data.labelMedium}  ${data.medium}`;
const youtube = `${data.labelYouTube}  ${data.youtube}`;
const insta = `${data.labelInstagram}  ${data.instagram}`;
const linkedin = `${data.labelLinkedIn}  ${data.linkedin}`;
const book = `${data.labelBook}  ${data.book}`;

// Concatenating introduction, tech platform links, and online portfolio link
const output =
  introduction +
  newline +
  newline +
  portfolio +
  newline +
  x +
  newline +
  github +
  newline +
  medium +
  newline +
  youtube +
  newline +
  insta +
  newline +
  linkedin +
  newline +
  book;

// The "work with me" form link is too long to fit inside the boxed layout,
// so it's shown as its own call-to-action line beneath the box.
const formUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSchB_qrGNgp8vs8l_EYZR84i_kGHyET0fIgu55idiX43kNmEg/viewform";
const workWithMe = [
  `🤝 ${chalk.bold.hex("#FF6F00")("Want to work together?")} Fill out this form: ${link(chalk.cyan.underline(formUrl), formUrl)}`,
].join("\n");

// Display the formatted output in a box and prompt the user with the defined questions then execute the action based on the user's choice
console.log(chalk.white(boxen(output, options)));

console.log(`\n`, workWithMe, `\n`);

console.log(suggestion, `\n`);

prompt(questions).then((answer) => answer.action());
