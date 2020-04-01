# API Specification

## Room API

- root resource path; `/rooms`
- endpoints:
  - `GET /rooms`
    - returns a list of rooms
    - example response body:

    ```json
    {
      "data": [
        {
          "id": "<MongoID>",
          "createdAt": "...",
          "lastMessage": "hey there",
          "participants": [
            "<MongoID>",
            "<MongoID>"
          ]
        }
      ]
    }
    ```

    - response codes:
      - 200
  - `POST /rooms`
    - creates a new room
    - example request body:

      ```json
      {
        "participants": [
          "<MongoID>",
          "<MongoID>"
        ]
      }
      ```

    - example response body:

      ```json
      {
        "data": {
          "id": "<MongoID>",
          "createdAt": "...",
          "participants": [
            "<MongoID>",
            "<MongoID>"
          ]
        }
      }
      ```

    - response codes:
      - 202 if room created
      - 400 if a room with the same participants exists
  - `DELETE /rooms/{id}`
    - deletes a single room
    - response codes:
      - 204 if room deleted
      - 404 if room not found

## User API

- root resource path: `/users`
- endpoints:
  - `GET /users`
    - returns a list of users
    - example response body:

      ```json
      {
        "data": [
          { "id": "<MongoID>", "displayName": "John Doe" },
          { "id": "<MongoID>", "displayName": "Homer Simpson" },
          ...
        ]
      }
      ```

    - response codes:
      - 200
  - `GET /users/{id}`
    - returns a single user
    - example response body:

      ```json
      {
        "data": {
          "id": "<MongoID>",
          "displayName": "John Doe"
        }
      }
      ```

    - response codes:
      - 200 if user found
      - 404 if user  not found
  - `POST /users`
    - creates a new user
    - example request body:

      ```json
      {
        "displayName": "John Doe"
        "email": "john.doe@test.com"
      }
      ```

    - example response body:

      ```json
      {
        "data": {
          "id": "<MongoID>",
          "displayName": "John Doe",
          "email": "john.doe@test.com"
        }
      }
      ```

    - response codes:
      - 202 if user created
      - 400 if the request is invalid or the email already exists
  - `PUT /users/{id}`
    - updates a user
    - example request body:

      ```json
      {
        "displayName": "John Doe"
        "email": "john.doe@test.com"
      }
      ```

    - example response body:

      ```json
      {
        "data": {
          "id": "<MongoID>",
          "displayName": "John Doe",
          "email": "john.doe@test.com"
        }
      }
      ```

    - response codes:
      - 200 if user updated
      - 400 if the request is invalid or the email already exists
      - 404 if the user cannot be found
  - `DELETE /users/{id}`
    - deletes a single user
    - response codes:
      - 204 if user deleted
      - 404 if user not found
