# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Once the server is running, go to your browser and type in `localhost:8080/` on your browser and begin using the app!

## How to use TinyApp

#### Register/Login
In order to create, view or edit links, a user must be registered on the database. Upon entering `localhost:8080/`, users are required to register on the top right corner. Enter your e-mail and password and you are all set to start using TinyApp!

#### Create New Links
Once logged in, press the Create New URL and fill in the submission form. There will also be a 6 character Short URL that will be highlighted in blue. Upon pressing the button the Short URL ID will bring you to your submitted site.

#### Edit or Delete Short URLS
If you no longer wish to have the Short URLS, you are able to delete the Short URL by pressing the TinyApp logo on the top left, or pressing My URLs on the header. Upon accessing those pages, you will be shown your URLs that can either be edited or deleted.