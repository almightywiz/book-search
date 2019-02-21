# BookSearch2019

A simple search engine wrapper around the OpenLibrary APIs.

## Contents

- [Features](#Features)
- [Configuration](#Configurations)
  - [Required](#Required-Configurations)
  - [Optional](#Optional-Configurations)
- [Requirements](#Requirements)
- [Known Issues](#Known-Issues)
- [Demos](#Demos)
- [Major Release Notes](#Major-Release-Notes)

## Description

This application is a simple wrapper around the OpenLibrary API.

### Exercise Description

Create a responsive (phone, tablet, desktop) web application that allows the user to quick filter a list of things. The top of the page will have a search input field and then below that a list of things in response to the filter. The things should be sorted alphabetically. The things could be anything, but should be AJAX pulled from a backend service that you write and should ultimately be pulled from an open public API.

Here’s an example list of API’s curated on GitHub, https://github.com/toddmotto/public-apis but feel free to use any public API you wish.

### Solution Description

Using the APIs provided by http://openlibrary.org, a simple search application was created to query for documents as stored in the OpenLibrary database.  The initial search page contains a text field to enter search criteria and a single, paged grid to display base information about returned documents.  There is a detailed view available for each document which is accessible by selecting a row from the search results' grid.

## Technical Details

### Technologies

This application was built using NodeJS as the dependency management system and Angular as the core framework.  In addition to these core technologies, the following external tools have been included to allow for various features to be present:

#### AG-Grid

The `ag-grid-community` and `ag-grid-angular` Node modules were installed to allow for a cleaner grid presentation for search results.  This also allows for the ability to sort data, which is not present in the current OpenLibrary API.

#### Search Text Tokenizer

The `search-text-tokenizer` Node module was installed to provide a more robust query syntax for searching through documents via the OpenLibrary API.

### API Issues

While developing the application, several issues were discovered with the existing OpenLibrary APIs.

#### Sorting

The OpenLibrary API does not currently support sorting.  This is a problem since the problem description requires that a `name` field be the default sort of returned data.  To get around this, all search results are required to be returned to the client and be displayed in a paginated grid.

#### API Formatting

The OpenLibrary API does not contain very good documentation on how to get from one set of data to the next (i.e. document data to specific book data).  At the same time, many of the data reponses contain URIs to related data, but those URIs point to data that is of a different format than expected.  For example, when querying for a `document`, the data is returned in JSON format.  Within this data, there is a URI in the `key` property.  Navigating to this URI gives a server-side generated web page that is templated to the OpenLibrary native application; this is not something that is appropriate in a public API since the web page response cannot be used outside of the OpenLibrary application.

Along with this example, while the majority of the public APIs return JSON data by default, there is one API (http://openlibrary.org/api/books) that returns a JavaScript string by default.  This requires additional implementation details to ensure that the data is easily consumable in a reusable fashion.

#### Data Inconsistency

It has been seen in several isolated cases that some data returned via the `document` API is not present when requesting related data from the `book` API.  To be more precise, it has been seen that there are cases where a `document` response returns the names of authors, but the related `book` data does not contain any authors.  This issue was not addressed specifically in this exercise.

## Features

### Search Directives

Aside from a standard search query, which is the default directive, it is also possible to search against specific fields.  Only a few fields are supported in this application to keep scope down:

- author
- title
- text
- subject

In order use these directives, simply specify the field to search against and the value, separated by a colon (:).

Example:
`title:dune author:"Frank Herbert" children` - This search will attempt to find all books with `Dune` in the title, `Frank Herbert` as the author, and the keyword `children` in any field of the document.

If a directive other than those supported is used, it will be ignored in the search.

## Installation & Execution

### Required Software

NodeJS is required to install all required dependencies.

In order to start the application server, the `angular-cli` Node module will need to be installed globally.

### Application Standup

To install and execute the application, the following steps are required.

1. Checkout this project.
2. Install the application by navigating to the application directory and executing `npm install`.
3. Start the project server by navigating to the application directory and executing `ng serve`.

Once the server is started, it will be accessible by navigating to http://localhost:4200.

## Backlog (in no specific priority)

1. Complete automated testing.
- Due to the nature of this exercise, only a few tests were created to showcase my ability to write tests.
2. Improve layout.
- I'm not much of a UI/UX designer, so my designs are a little minimalistic/spartan.
3. Improve data display.
- Current data displayed to user is a small subset of available data.
