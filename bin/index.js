#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";

const options = {
    width: 64,
    padding: 1,
    borderStyle: "single",
    title: "Hey there! 👋",
    borderColor: "#66FF66",
    titleAlignment: "center",
};

const data = {
    // LABELS
    labelWork: chalk.bgHex("#008080").black.bold("Work      "),
    labelTwitter: chalk.bgHex("#1d9bf0").black.bold("Twitter   "),
    labelGitHub: chalk.bgHex("#24292e").white.bold("GitHub    "),
    labelLinkedIn: chalk.bgHex("#0b66c2").black.bold("LinkedIn  "),
    labelDev: chalk.bgHex("#A9A9A9").black.bold("Dev       "),
    labelWeb: chalk.bgHex("#4CAF50").black.bold("Webfolio  "),
    labelInstagram: chalk.bgHex("#C13584").black.bold("Instagram "),

    // LABEL DESCRIPTION
    twitter: chalk.gray("https://twitter.com/") + chalk.cyan("lassiecoder"),
    github: chalk.gray("https://github.com/") + chalk.green("lassiecoder"),
    dev: chalk.gray("https://dev.to/") + chalk.hex("#B0C4DE")("lassiecoder"),
    web: chalk.yellowBright.underline("https://www.polywork.com/priyanka_s"),
    instagram: chalk.gray("https://www.instagram.com/") + chalk.hex("#AB1E6B")("lassiecoder"),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blueBright("priyanka-s-b79401142"),
    work: chalk.white.bold("Currently, I am employed at ") + chalk.redBright("The Adecco Group"),
    intro: chalk.white.bold("I am Priyanka Sharma, a Software Developer known by the handle ") + chalk.hex("#7B68EE")("lassiecoder") + chalk.white.bold(" across various tech platforms. My expertise lies in developing both mobile and web solutions."),
};

const newline = "\n";
const working = `${data.work}`;
const introduction = `${data.intro}`;
const devto = `${data.labelDev}  ${data.dev}`;
const github = `${data.labelGitHub}  ${data.github}`;
const onlinePortfolio = `${data.labelWeb}  ${data.web}`;
const insta = `${data.labelInstagram}  ${data.instagram}`;
const twitter = `${data.labelTwitter}  ${data.twitter}`;
const linkedin = `${data.labelLinkedIn}  ${data.linkedin}`;


const output =
    introduction + newline + newline +
    working + newline + newline +
    devto + newline +
    github + newline +
    twitter + newline +
    onlinePortfolio  + newline +
    insta + newline +
    linkedin;

console.log(chalk.white(boxen(output, options)));