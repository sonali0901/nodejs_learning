Database and collection creation details is covered in "DB setup" file.
The app.js file handles 2 API calls
1. API 1: /api/first
    takes in the type of location along with the date and returns a list of locations matching the same.
2. API 2: /api/second
    takes in longitude, latitude and type of location and returns a lsit of locations of the same time in 10 km radius.
    
Both the API take in get requests and return JSON output.
To run: ``` node app.js```

Request for API 1
```
{
    "type": "A",
    "createdAt": "2019-10-19",
    "pageNumber": 1
}
```
Request for API 2
```
{
    "type": "A",
    "latitude": "23.0",
    "longitude": "40.0"
}
```
Implemented: 
1. MongoDB connection
2. HTTPS server
3. Pagination

To-do:
1. System health API
2. Maps and Vue.js rendering
