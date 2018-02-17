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
       "cargoId": Number, required
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
