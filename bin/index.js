#!/usr/bin/env node

import fs from "fs"; 
import os from "os";
import ora from 'ora';
import path from "path";
import open from "open";
import axios from "axios";
import boxen from "boxen";
import chalk from "chalk";
import dotenv from 'dotenv';
import inquirer from "inquirer";
import cliSpinners from 'cli-spinners';

dotenv.config();

// Create a prompt module for interacting with the user via the command line interface
const prompt = inquirer.createPromptModule();

// Get the desktop directory path based on the operating system
const desktopDir = path.join(os.homedir(), 'Desktop');

// Create a loader to indicate that the resume is being downloaded
const loader = ora({
    text: ' Downloading resume',
    spinner: cliSpinners.aesthetic,
})

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
                        open("mailto:sharmapriyanka84510@gmail.com");
                    }, 2000); 
                    console.log(`\n${chalk.green.bold("Done")}, your email client should ${chalk.yellow.bold("open soon")}. \nI'll keep an eye out for your message! ${chalk.bold("👀")}\n`);
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                    value: () => {
                        loader.start();
                        axios({
                            method: 'get',
                            url: "https://rb.gy/2venms",
                            responseType: 'stream'
                        })
                        .then(function (response) {
                            const writer = fs.createWriteStream(path.join(desktopDir, 'lassiecoder-resume.pdf'));
                        
                            response.data.pipe(writer);

                            writer.on('finish', () => {
                                console.log('\n\nResume downloaded successfully to desktop 📂 ✅\n');
                                loader.stop();
                                setTimeout(() => {
                                    open(path.join(desktopDir, 'lassiecoder-resume.pdf'));
                                }, 2000); 
                            });
                            writer.on('error', (err) => {
                                console.error('\nError downloading resume:', err);
                                loader.stop();
                            });
                        })
                        .catch(function (error) {
                            console.error('\nError downloading resume:', error);
                            loader.stop();
                        });
                    }
            },
            {
                name: `Schedule a ${chalk.redBright.bold("Meeting")}?`,
                value: () => {
                    setTimeout(() => {
                    open("https://rb.gy/6hb965")
                    }, 2000);
                    console.log(chalk.hex("#4CAF50")(`\nI'm available on ${chalk.yellow("Fridays from 6:00 PM to 6:15 PM")} for a connection. When scheduling a meeting, please include the ${chalk.yellow("subject")} of our discussion. \nLooking forward to meeting you at the scheduled time! 🗓️\n \n`));
                }
            },
            {
                name: "Just quit!",
                value: () => {
                    console.log(chalk.hex("#FF5733")("\nThanks for stopping by. \nIf you ever decide to return, feel free to reach out. \nHave a great day! 🎉\n"));
                }
            }
        ]
    }
];

// Define color-coded labels and their corresponding descriptions for various tech platforms
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

// Concatenate data strings to display in the console output
const newline = "\n";
const working = `${data.work}`;
const introduction = `${data.intro}`;
const devto = `${data.labelDev}  ${data.dev}`;
const github = `${data.labelGitHub}  ${data.github}`;
const onlinePortfolio = `${data.labelWeb}  ${data.web}`;
const insta = `${data.labelInstagram}  ${data.instagram}`;
const twitter = `${data.labelTwitter}  ${data.twitter}`;
const linkedin = `${data.labelLinkedIn}  ${data.linkedin}`;

// Concatenating introduction, tech platform links, and online portfolio link
const output =
    introduction + newline + newline +
    // working + newline + newline +
    devto + newline +
    github + newline +
    twitter + newline +
    onlinePortfolio  + newline +
    insta + newline +
    linkedin;

// Display the formatted output in a box and prompt the user with the defined questions then execute the action based on the user's choice
console.log(chalk.white(boxen(output, options)));

prompt(questions).then(answer => answer.action());