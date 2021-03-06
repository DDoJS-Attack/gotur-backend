# Götür RESTful API Reference

## Endpoints

### `/cargo`
  * GET `/:id`: find cargo by ID
  * POST `/` : search cargos with parameters.
    ```javascript
    {
      "customer":    String, optional      // get cargos of a specific customer
      "courier":     String, optional      // get cargos of a specific courier
      "ids":         [String], optional    // select cargos by ID
      "status":      [String], optional    // filter entities by status
      "near": {      Object,  optional     // get cargos around a point
        "longitude": Number, required
        "latitude":  Number, required
        "radius":    Number, required
      }
    }
    ```
### `/customer`
These endpoints are used for customer actions.
  * GET `/?id:<customerID>`: Get customer by ID.
  * GET `/my?id:<customerID>`: Get cargos of a customer.
  * GET `/my/:cargoId` : Get cargo by ID.
  * POST `/create`: Create a new cargo.
  * DELETE `/deleteCargo`: Delete a cargo.
    ```javascript
     { 
       "cargoId": String, required
     }
    ```
  * POST `/createCustomer`: Create a new customer
    ```javascript
    {
      "name":     String, required
      "phoneNum": String, required
    }
    ```
### `/courier`
These endpoints are used for courier actions.
  * POST `/` : Create a courier.
    POST data:
    ```javascript
    { 
      "name": String, required
      "phone": String, required
    }
    ```
  * POST `/own`: Assign a courier to a cargo. Cargo status is set to 'ASSIGNED'.
    ```javascript
    {
      "courierId" : String, required
      "cargoId":    String, required
    }
    ```
  * POST `/pick`: Courier picks a cargo assigned to it. Cargo status is set to 'ONWAY'.
    ```javascript
    {
      "courierId" : String, required
      "cargoId":    String, required
    }
    ```
  * POST `/deliver`: Courier delivers a cargo assigned to it. Cargo status is set to 'DELIVERY'.
    ```javascript
    {
      "courierId" : String, required
      "cargoId":    String, required
    }
    ```
  * POST `/release`: Courier cancels a cargo assignment. Cargo status is set to 'INITIAL'.
    ```javascript
    {
      "courierId" : String, required
      "cargoId":    String, required
    }
    ```
  * GET `/:id`: Get a courier's data.
## TODO
### `/pathfinder`
  * POST `/`: Recommend the most profitable path according to the parameters specified by courier.
    ```javascript
    {
	      "location":{                                // courier's starting point
          "latitude":   Number, required
          "longitude":  Number, required
       },
       "durationLimit": Number, minutes, required  //  
       "weightLimit": Number, grams, required      // courier's weight limit
    }
    ```
    Response format:
    ```javascript
    [
       {
         "location": [source-lat0, source-lon0],
         "action": "Take",
         "cargoId": "<cargo-id-0>"
       },
       {
         "location": [source-lat1, source-lon1],
         "action": "Take",
         "cargoId": "<cargo-id-1>"
       }
       ...
       {
         "location": [destination-lat0, destination-lon0],
         "action": "Deliver",
         "cargoId": "<cargo-id-0>"
       }
    ]
    ```
