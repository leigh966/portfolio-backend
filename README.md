# Portfollio Backend

## Setup
### 0. Prerequisites
- node
- npm
  
### 1. Downloading And Installing Dependencies

 Clone this repo:
```
 git clone https://github.com/leigh966/portfollio-backend
```

 Go into the repository:
```
 cd portfollio-backend
```

 Install dependencies:
```
 npm install
```


### 2. Envronment Variables

In order to use this application you will need the following variables either set in your environment or provided in a .env file at the root of the file structure provided by this repo.

#### PORT

The port that this application should be accessible on.

#### PASSWORD_HASH

A SHA-512 hash of the admin password.

> [!NOTE]
> For now you will need to provide this but at a later date I will look at making a setup procedure that generates PASSWORD_HASH, SALT and SECRET_KEY.

#### SALT

The salt used to generate the PASSWORD_HASH.

> [!NOTE]
> For now you will need to provide this but at a later date I will look at making a setup procedure that generates PASSWORD_HASH, SALT and SECRET_KEY.

#### SECRET_KEY

The key used to generate the rolling code. You can put this into a authenicator app to generate one-time passcodes for 2FA login.

> [!NOTE]
> For now you will need to provide this but at a later date I will look at making a setup procedure that generates PASSWORD_HASH, SALT and SECRET_KEY.

#### BACKEND_URL

The address that this application will be hosted from. This will be used to generate some of the URLs that will be returned so while the application will function to a degree if this is wrong it may generate some broken links.

#### ENABLE_HTTPS

Do you want to use HTTPS. Set as true to use it or false to just use HTTP.

#### DATABASE_URL

The URL of the postgres database (including credentials) to store projects, education records and employment records.

### 3. Start The App
```
node .
```

## Endpoints

### Login

<details>
 <summary><code>POST</code> <code><b>/login</b></code></summary>

##### Parameters

> | Name     | Type     | Data Type     | Description                                                                                                            |
> | -------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
> | password | required | string (JSON) | The admin password for the portfolio                                                                                   |
> | otp      | required | string (JSON) | The rolling password for the portfolio consisting of 6 numbers and changing every 30 seconds according to a secret key |

##### Responses

> | http code | content-type              | response                                                                                                |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
> | `201`     | `text/html;charset=UTF-8` | Session Id that can be used to authenticate future endpoint calls                                       |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to access an input value not provided. I plan to patch this later. |

##### Example cURL

> ```javascript
>  curl --location 'https://localhost:3001/login' --header 'Content-Type: application/json' --data '{"password" : "examplePassword123", "otp": "123456"}'
> ```

</details>

### Images

<details>
 <summary><code>POST</code> <code><b>/image</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type                         | Description                                                                    |
> | ---------- | -------- | --------------------------------- | ------------------------------------------------------------------------------ |
> | session_id | required | string (Header)                   | The session id returned by the login endpoint after successful authentication. |
> | image      | required | Image File (Multipart-Form Entry) | The image you want to upload.                                                  |

##### Responses

> | http code | content-type              | response                                                                                                |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
> | `201`     | `text/html;charset=UTF-8` | Filename of the file on the server                                                                      |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to access an input value not provided. I plan to patch this later. |

</details>

<details>
 <summary><code>GET</code> <code><b>/image_url/:filename</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type                         | Description                                                                    |
> | ---------- | -------- | --------------------------------- | ------------------------------------------------------------------------------ |
> | session_id | required | string (Header)                   | The session id returned by the login endpoint after successful authentication. |
> | filename   | required | Image File (Multipart-Form Entry) | The image you want to upload.                                                  |

##### Responses

> | http code | content-type              | response                                                                                                |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
> | `200`     | `text/html;charset=UTF-8` | URL to access the file matching the filename given                                                      |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to access an input value not provided. I plan to patch this later. |

</details>

### Projects

[comment]: <> (GET)

<details>
 <summary><code>GET</code> <code><b>/projects</b></code></summary>

##### Parameters

> | Name | Type | Data Type | Description |
> | ---- | ---- | --------- | ----------- |
> | None | N/A  | N/A       | N/A         |

##### Responses

> | http code | content-type              | response                                                                            |
> | --------- | ------------------------- | ----------------------------------------------------------------------------------- |
> | `200`     | `text/html;charset=UTF-8` | A list of all the projects currently stored on the server, returned in JSON format. |

##### Example cURL

> ```javascript
>  curl --location 'https://localhost:3001/projects'
> ```

</details>

[comment]: <> (POST)

<details>
 <summary><code>POST</code> <code><b>/projects</b></code></summary>

##### Parameters

> | Name           | Type     | Data Type       | Description                                                                                                                                   |
> | -------------- | -------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
> | session_id     | required | string (Header) | The session id returned by the login endpoint after successful authentication.                                                                |
> | name           | required | string (JSON)   | The name of the project to be added to the portfolio                                                                                          |
> | description    | required | string (JSON)   | The description of the project to be added to the portfolio                                                                                   |
> | tagline        | required | string (JSON)   | The tagline of the project to be added to the portfolio                                                                                       |
> | image_filename | optional | string (JSON)   | The filename of the image that the project should use as its banner. The endpoint will return 404 if this image is not present on the server. |

##### Responses

> | http code | content-type              | response                                                                                                |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
> | `201`     | `text/html;charset=UTF-8` | `Record Added`                                                                                          |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                |
> | `404`     | `text/html;charset=utf-8` | `Image Not Found`                                                                                       |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to access an input value not provided. I plan to patch this later. |

##### Example cURL

> ```javascript
>  curl --location 'https://localhost:3001/projects' --header 'Content-Type: application/json' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' -data '{    "name":"example name!",     "description":"example description!",     "tagline":"example tagline :P", "image_filename":""}'
> ```

</details>

[comment]: <> (PUT)

<details>
 <summary><code>PUT</code> <code><b>/projects/:id</b></code></summary>

##### Parameters

> | Name           | Type     | Data Type       | Description                                                                                                                                       |
> | -------------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
> | id             | required | string (path)   | The id of the project we're going to update.                                                                                                      |
> | session_id     | required | string (header) | The session id returned by the login endpoint after successful authentication.                                                                    |
> | name           | required | string (JSON)   | The new name of the project we're adding.                                                                                                         |
> | description    | required | string (JSON)   | The new description of the project we're editting                                                                                                 |
> | tagline        | required | string (JSON)   | The new tagline of the project we're editting                                                                                                     |
> | image_filename | optional | string (JSON)   | The new filename of the image that the project should use as its banner. The endpoint will return 404 if this image is not present on the server. |

##### Responses

> | http code | content-type              | response                                                                                                                 |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
> | `201`     | `text/html;charset=UTF-8` | `Record Updated` - Should update this to 200 or 204 at some point                                                        |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                                 |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to edit a project that does not exist, will update this to catch the and return 404 |

##### Example cURL

> ```javascript
>  curl --location --request PUT 'https://localhost:3001/project/26' --header 'Content-Type: application/json' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'  --data '{    "name":"updated name",    "description":"updated description",    "tagline": "tagline",    "image_filename": "10998788-f322-4466-8c71-44cedb3ca595.jpg"}'
> ```

</details>

[comment]: <> (DELETE)

<details>
 <summary><code>DELETE</code> <code><b>/projects/:id</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type       | Description                                                                    |
> | ---------- | -------- | --------------- | ------------------------------------------------------------------------------ |
> | id         | required | string (path)   | The id of the project we're going to delete.                                   |
> | session_id | required | string (header) | The session id returned by the login endpoint after successful authentication. |

##### Responses

> | http code | content-type | response |
> | --------- | ------------ | -------- |
> | `204`     | None         | None     |

##### Example cURL

> ```javascript
>  curl --location --request DELETE 'https://localhost:3001/projects/4' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
> ```

</details>

### Education

[comment]: <> (GET)

<details>
 <summary><code>GET</code> <code><b>/education</b></code></summary>

##### Parameters

> | Name | Type | Data Type | Description |
> | ---- | ---- | --------- | ----------- |
> | None | N/A  | N/A       | N/A         |

##### Responses

> | http code | content-type              | response                                                                                     |
> | --------- | ------------------------- | -------------------------------------------------------------------------------------------- |
> | `200`     | `text/html;charset=UTF-8` | A list of all the education entries currently stored on the server, returned in JSON format. |

##### Example cURL

> ```javascript
>  curl --location 'https://localhost:3001/education'
> ```

</details>

[comment]: <> (POST)

<details>
 <summary><code>POST</code> <code><b>/education</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type       | Description                                                                    |
> | ---------- | -------- | --------------- | ------------------------------------------------------------------------------ |
> | session_id | required | string (Header) | The session id returned by the login endpoint after successful authentication. |
> | course     | required | string (JSON)   | The name of the course to be added to the portfolio                            |
> | school     | required | string (JSON)   | The institution that the course to be added to the portfolio was completed at  |
> | start_date | required | date (JSON)     | The start date of the course to be added to the portfolio.                     |
> | end_date   | required | date (JSON)     | The start date of the course to be added to the portfolio.                     |

##### Responses

> | http code | content-type              | response                                                                                                |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
> | `201`     | `text/html;charset=UTF-8` | `Record Added`                                                                                          |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to access an input value not provided. I plan to patch this later. |

##### Example cURL

> ```javascript
>  curl --location 'https://localhost:3001/education' --header 'Content-Type: application/json' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' -data '{ "school":"example school", "course":"example course", "start_date":"2024-08-13",    "end_date":"2024-09-12" }'
> ```

</details>

[comment]: <> (PUT)

<details>
 <summary><code>PUT</code> <code><b>/education/:id</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type       | Description                                                                    |
> | ---------- | -------- | --------------- | ------------------------------------------------------------------------------ |
> | id         | required | string (path)   | The id of the education record we're going to update.                          |
> | session_id | required | string (header) | The session id returned by the login endpoint after successful authentication. |
> | course     | required | string (JSON)   | The name of the updated course .                                               |
> | school     | required | string (JSON)   | The institution of the updated course.                                         |
> | start_date | required | date (JSON)     | The updated start date of the course.                                          |
> | end_date   | required | date (JSON)     | The updated end date of the course to be added to the portfolio.               |

##### Responses

> | http code | content-type              | response                                                                                                                 |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
> | `201`     | `text/html;charset=UTF-8` | `Record Updated` - Should update this to 200 or 204 at some point                                                        |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                                 |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to edit a project that does not exist, will update this to catch the and return 404 |

##### Example cURL

> ```javascript
>  curl --location --request PUT 'https://localhost:3001/education/26' --header 'Content-Type: application/json' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'  --data '{ "school":"example school", "course":"example course", "start_date":"2024-08-13",    "end_date":"2024-09-12" }'
> ```

</details>

[comment]: <> (DELETE)

<details>
 <summary><code>DELETE</code> <code><b>/education/:id</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type       | Description                                                                    |
> | ---------- | -------- | --------------- | ------------------------------------------------------------------------------ |
> | id         | required | string (path)   | The id of the education record we're going to delete.                          |
> | session_id | required | string (header) | The session id returned by the login endpoint after successful authentication. |

##### Responses

> | http code | content-type | response |
> | --------- | ------------ | -------- |
> | `204`     | None         | None     |

##### Example cURL

> ```javascript
>  curl --location --request DELETE 'https://localhost:3001/projects/4' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
> ```

</details>

### Employment

[comment]: <> (GET)

<details>
 <summary><code>GET</code> <code><b>/employment</b></code></summary>

##### Parameters

> | Name | Type | Data Type | Description |
> | ---- | ---- | --------- | ----------- |
> | None | N/A  | N/A       | N/A         |

##### Responses

> | http code | content-type              | response                                                                                      |
> | --------- | ------------------------- | --------------------------------------------------------------------------------------------- |
> | `200`     | `text/html;charset=UTF-8` | A list of all the employment entries currently stored on the server, returned in JSON format. |

##### Example cURL

> ```javascript
>  curl --location 'https://localhost:3001/employment'
> ```

</details>

[comment]: <> (POST)

<details>
 <summary><code>POST</code> <code><b>/employment</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type       | Description                                                                    |
> | ---------- | -------- | --------------- | ------------------------------------------------------------------------------ |
> | session_id | required | string (Header) | The session id returned by the login endpoint after successful authentication. |
> | job_title  | required | string (JSON)   | The position held for this employment record.                                  |
> | employer   | required | string (JSON)   | The employer for this employment record.                                       |
> | start_date | required | date (JSON)     | The start date of the course to be added to the portfolio.                     |
> | end_date   | required | date (JSON)     | The start date of the course to be added to the portfolio.                     |

##### Responses

> | http code | content-type              | response                                                                                                |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
> | `201`     | `text/html;charset=UTF-8` | `Record Added`                                                                                          |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to access an input value not provided. I plan to patch this later. |

##### Example cURL

> ```javascript
>  curl --location 'https://localhost:3001/employment' --header 'Content-Type: application/json' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' -data '{ "employer":"example employer", "job_title":"example job title", "start_date":"2024-08-13",    "end_date":"2024-09-12" }'
> ```

</details>

[comment]: <> (PUT)

<details>
 <summary><code>PUT</code> <code><b>/employment/:id</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type       | Description                                                                    |
> | ---------- | -------- | --------------- | ------------------------------------------------------------------------------ |
> | id         | required | string (path)   | The id of the education record we're going to update.                          |
> | session_id | required | string (header) | The session id returned by the login endpoint after successful authentication. |
> | job_title  | required | string (JSON)   | The position held for this employment record.                                  |
> | employer   | required | string (JSON)   | The employer for this employment record.                                       |
> | start_date | required | date (JSON)     | The updated start date of the course.                                          |
> | end_date   | required | date (JSON)     | The updated end date of the course to be added to the portfolio.               |

##### Responses

> | http code | content-type              | response                                                                                                                 |
> | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
> | `201`     | `text/html;charset=UTF-8` | `Record Updated` - Should update this to 200 or 204 at some point                                                        |
> | `401`     | `text/html;charset=utf-8` | `Failed To Authenticate`                                                                                                 |
> | `500`     | `text/html;charset=utf-8` | Internal error as a result of trying to edit a project that does not exist, will update this to catch the and return 404 |

##### Example cURL

> ```javascript
>  curl --location --request PUT 'https://localhost:3001/employment/26' --header 'Content-Type: application/json' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'  --data '{ "employer":"example employer", "job_title":"example job title", "start_date":"2024-08-13",    "end_date":"2024-09-12" }'
> ```

</details>

[comment]: <> (DELETE)

<details>
 <summary><code>DELETE</code> <code><b>/employment/:id</b></code></summary>

##### Parameters

> | Name       | Type     | Data Type       | Description                                                                    |
> | ---------- | -------- | --------------- | ------------------------------------------------------------------------------ |
> | id         | required | string (path)   | The id of the employment record we're going to delete.                         |
> | session_id | required | string (header) | The session id returned by the login endpoint after successful authentication. |

##### Responses

> | http code | content-type | response |
> | --------- | ------------ | -------- |
> | `204`     | None         | None     |

##### Example cURL

> ```javascript
>  curl --location --request DELETE 'https://localhost:3001/projects/4' --header 'session_id: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
> ```

</details>
