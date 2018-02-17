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
### `customer`
*
### `/courier`
Couriers use this endpoints for their actions.
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
