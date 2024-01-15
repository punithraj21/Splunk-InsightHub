# Contributing to InsightHub

## Overview

The project contains a variety of packages that are published and versioned collectively. Each package lives in its own
directory in the `/packages` directory. Each package is self contained, and defines its dependencies in a package.json file.

## Getting Started

1. Clone the repo.
2. Install yarn (>= 1.2) if you haven't already: `npm install --global yarn`.
3. Run the setup task: `yarn run setup`.

After this step, the following tasks will be available:

-   `start` – Run the `start` task for each project
-   `build` – Create a production bundle for all projects
-   `test` – Run unit tests for each project
-   `lint` – Run JS and CSS linters for each project
-   `format` – Run prettier to auto-format `*.js`, `*.jsx` and `*.css` files. This command will overwrite files without
    asking, `format:verify` won't.

Running `yarn run setup` once is required to enable all other tasks. The command might take a few minutes to finish.

## Serverless Docs

Refer Readme document Provided in the packages/serverless

## Clear Splunk Cache

`${Splunk_host}:${Splunk_port}/en-GB/_bump`

## For App Login

Use the username and password which you are using for splunk login
