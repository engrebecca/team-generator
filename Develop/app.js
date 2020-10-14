const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { create } = require("domain");

// Array to hold the created team member objects
let teamMembers = [];

// Prompt user for information to create new manager
async function createManager(){
    const newManager = await inquirer.prompt([
        {
            type: "input",
            message: "What is your manager's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What is your manager's id?",
            name: "id"
        },
        {
            type: "input",
            message: "What is your manager's email?",
            name: "email"
        },
        {
            type: "input",
            message: "What is your manager's office number?",
            name: "officeNumber"
        }
    ])
    return new Manager(newManager.name, newManager.id, newManager.email, newManager.officeNumber);
}

// Prompt user if they would like to add an employee: engineer or intern
async function createEmployees(){
    const answers = await inquirer.prompt([
        {
            type: "list",
            message: "Select a type of team member to add?",
            choices: ["Engineer", "Intern", "No additional team members to add"],
            name: "nextEmployee"
        },
    ])
    let newEmployee;
    if (answers.nextEmployee === "Engineer"){
       newEmployee = await createEngineer();
    } else if (answers.nextEmployee === "Intern"){
        newEmployee = await createIntern();
    } 
    
    if (newEmployee != null){
        teamMembers.push(newEmployee);
        await createEmployees();
    }
}

// Prompt user for engineer information 
async function createEngineer(){
    const newEngineer = await inquirer.prompt([
        {
            type: "input",
            message: "What is your engineer's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What is your engineer's id?",
            name: "id"
        },
        {
            type: "input",
            message: "What is your engineer's email?",
            name: "email"
        },
        {
            type: "input",
            message: "What is your engineer's GitHub username?",
            name: "github"
        },
    ])
    return new Engineer(newEngineer.name, newEngineer.id, newEngineer.email, newEngineer.github);
}

// Prompt user for intern information
async function createIntern(){
    const newIntern = await inquirer.prompt([
        {
            type: "input",
            message: "What is your intern's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What is your intern's id?",
            name: "id"
        },
        {
            type: "input",
            message: "What is your intern's email?",
            name: "email"
        },
        {
            type: "input",
            message: "What school does your intern attend?",
            name: "school"
        },
    ])
    return new Intern(newIntern.name, newIntern.id, newIntern.email, newIntern.school);
}

// Prompt user to enter in manager information and create team of employees
createManager()
    .then (function(manager){
        teamMembers.push(manager);
        return createEmployees();
    })
    .then(function(){
        console.log(teamMembers);
        const renderedHTML = render(teamMembers);
        console.log(renderedHTML);
        if (!fs.existsSync(OUTPUT_DIR)){
            fs.mkdirSync(OUTPUT_DIR);
        }
        fs.writeFileSync(outputPath, renderedHTML);
    })
    .catch(function(err){
        console.log(err);
    })

