# Apprenticeship Project

## Overview Of Project

The proposed project is a messenger application with a REST API and realtime communication
using websockets. The interface will consist of 3 primary screens - a list of all users, a
list of conversations, and a chat window. Authentication will be implemented as a modal which
prompts the user for their credentials when they are not logged in. The project is designed
to have components that span the entire stack of modern web development - backend including
database schema design, business logic, and API server; frontend including UI design, API client,
UI programming, and session persistence; and finally deployment and dev ops including automated
builds and deploys in a continuous integration environment (GitHub Actions).

The technology of interest to Acadium is websocket libraries in relation to messaging - a
core feature of the Acadium product, and one which currently uses a polling-based system
for keeping in sync. We are interested in investigating websockets as they would allow for
a system that has updates pushed to it rather than one which must query for changes periodically,
improving performance and latency.

## Apprenticeship Breakdown

### Month 1 - backend focus

The first month will be focused on setting up the backend for the project. The month will
break down, by week, as follows:

- Week 1 - Onboarding and schema design
- Week 2 - MERN stack intro and starting to build out endpoints
- Week 3 - Testing APIs and continuing to build out endpoints
- Week 4 - Finishing the API

### Month 2 - frontend focus

The second month will be focused on adding a frontend to the project. The month will break
down, by week, as follows:

- Week 1 - UI design
- Week 2 - React + Redux review and users screen
- Week 3 - Conversations screen
- Week 4 - Chat screen

### Month 3 - frontend and deployment

The third month will be focused on finishing the frontend and deploying the project. The month
will break down, by week, as follows:

- Week 1 - Authentication - frontend and backend
- Week 2 - Realtime communication - websockets
- Week 3 - Running tests and builds in a CI environment
- Week 4 - Deploying the project and wrap-up

## Finishing The Project

By the end, with any luck, you should have a fully functioning project which you can use
as a portfolio piece. I will also transfer ownership of the GitHub repository over to you
so that it can be on your GitHub, which will be a great way to showcase your abilities to
potential employers down the road. There is of course a lot more that can't be covered in
3 short months, and I can provide you with a list of suggestions on where you can try taking
the project afterwards if you are interested in doing so.
