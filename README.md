# Crime Statistics Germany Generator

> [!IMPORTANT]
> This project is still in progress and not considered final yet.

> Authors:
>  Julian Wappler  Juan Rojas
> 
## About the Project
This project presents an interactive data atlas for comparing crime rates 
and socioeconomic indicators across German districts. 
It focuses on exploring possible relationships between 
regional crime statistics and factors such as unemployment, 
age distribution, and social infrastructure.

The goal of the project is to make complex regional data easier to understand through visual analysis and comparison.


## Visualizing the Relationship Between Unemployment and Crime

<img src="statistics.png" alt="statistic" width="600">

## Features
- Interactive crime statistics visualization for German districts
- Comparison of crime rates with selected socioeconomic indicators
- Scatterplot-based analysis of relationships between variables
- Selectable data categories for customized exploration
- Trend line for identifying possible statistical patterns
- Regional overview of differences between districts


## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3dotjs&logoColor=white)
![RDF](https://img.shields.io/badge/RDF-Data-blue)
![SPARQL](https://img.shields.io/badge/SPARQL-Query%20Language-purple)

| Technology / Library | Purpose |
|----------------------|---------|
| HTML | Structure of the static web page |
| CSS | Styling and responsive layout |
| Vanilla JavaScript | Application logic and interaction handling |
| D3.js | Creating interactive data visualizations |
| d3-regression | Displaying regression and trend lines |
| Comunica | Running SPARQL queries directly in the browser |
| N3.js | Parsing and storing RDF/N-Triples data |
| RDF / N-Triples | Structured data format for districts and indicators |
| SPARQL | Querying crime and socioeconomic data |
| Python HTTP Server | Local testing of the static web application |


## Software Bill of Materials

This project does not currently include a separate Software Bill of Materials because it does not use npm, `node_modules`, a build pipeline, or locally installed package dependencies.

The application is a static web project based on HTML, CSS, and Vanilla JavaScript. External browser libraries such as D3.js, d3-regression, Comunica, and N3.js are included directly in the HTML file via script tags.

The data is stored locally in an N-Triples file and queried client-side using SPARQL.
## Requirements

To run and develop this project locally, the following components are required:

- Node.js (LTS, Version >= 18) & npm
- Python 3 (as an alternative development server)
- A modern web browser (Chrome, Firefox, Edge, etc.)
- The external browser libraries: **Comunica**, **N3**, and **D3**
- The local `daten_indikatoren.nt` data file

## 1. Environment Installation (Windows)

Before setting up the project, ensure that Node.js is installed on your Windows system.

### Install via Windows Package Manager (Winget)
Open PowerShell or Command Prompt as Administrator and run:

Install Node.js
```powershell
winget install OpenJS.NodeJS
```

## 2. Project Setup & Verification

Once the environment is ready, verify the installations and install the project dependencies.

### Check installed versions:
```powershell
node -v
```
```powershell
npm -v
```

### Install project-specific development dependencies:
Run this command inside the project root directory (where the `package.json` is located):
```powershell
npm install
```

## 3. Running the Local Development Server

Since the project uses absolute paths and modern JS modules, it must be run through a local server rather than opening the HTML file directly.

### Using Node.js (Recommended)
Start the server using `npx`:
```powershell
npx serve .
```
Access the application in your browser at:
```powershell
http://localhost:3000
```

## 4. Linting & Code Quality

The project enforces the **Google JavaScript Style Guide**. The rules are validated via **ESLint** (configured in `.eslintrc.json`).

### Run the style and syntax check:
```powershell
npm run lint
```

### Manually trigger ESLint for a specific folder:
```powershell
npx eslint Website/
```

### Automatically fix formatting issues and style violations:
```powershell
npm run lint:fix
```
