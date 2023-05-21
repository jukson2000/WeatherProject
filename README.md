# WeatherAPI
 This project is a Node.js-based RESTful API. The API enables users to access historical weather information for a certain time period as well as current weather conditions for a particular place as well as weather forecasts. For situations like incorrect location inputs and server failures, it supports error management.


# # A server must be functioning in order for an API call to be made.
User authentication is required.
Genuine API key.

# # Retrieves the current weather data for a certain place using the /weather/current command.

# # Retrieves the weather prediction for a specified place using the /weather/forecast command.

# # Historical weather information may be retrieved using the weather/history command for a particular location.

# # Authorization
Because it is easier, dummy data was used for permission.

# # Successful case
A person who has successfully signed in and submitted accurate information has done so. To obtain weather data through the Weather App API, the user performs an API request. The request is successfully processed by the API, which then gives the user the necessary weather information. The obtained weather information is formatted by the API into a JSON response object, which contains information like the temperature, humidity, and weather description. The proper HTTP status code, such as 200 OK, which denotes a successful request, is set by the API. The user may then show the weather data to end users or use it in their application.

# # A successful API call illustration API Endpoint: /weather/current

 The GET request method

Demand Parameters:

Place: "Vienna"

# # Response:

Vienna is the location, the temperature is 23.5, the humidity is 65, and the description is partly overcast.

# # Dealing with API errors
Errors that could happen when using the API must be handled properly to give the user a positive experience. 
The API responds with a suitable error message when users supply erroneous inputs, such as an inaccurate location or missing parameters. 
For instance, delivering a JSON response with an error message detailing the problem and the status code 400 Bad Request.

# # Logging The API is equipped with logging to help with debugging and problem-solving. 
To make it simple to find issues and pinpoint the problem's origin, 
information about each request and answer is recorded in a log file called console.log.

# # Swagger
Interactive API documentation is produced using Swagger. 
The specification is formatted and verified using the Swagger Editor,
and documentation with an interactive interface for exploring the API endpoints is generated using the Swagger UI.

# # Performance-Based Caching
To enhance API speed, caching is used. In order to reduce the number of queries to the weather API provider,
weather data that doesn't change regularly is cached for a predetermined period of time (for example, 5–10 minutes).
