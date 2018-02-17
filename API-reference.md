# Götür RESTful API Reference

## Endpoints


### `/cargo`
* GET `/:id`: find cargo by ID
* POST `/` : search cargos with parameters.
  ```javascript
  {
    "customer": <customer id>                // get cargos of a specific customer
    "courier":  <courier id>                 // get cargos of a specific courier
    "ids":      <array of cargo IDs>         // select cargos by ID
    "status":   <array of accepted statuses> // filter entities by status
    "near": {                                // get cargos around a point
      "longitude": <longitude>
      "latitude":  <latitude>
      "radius":    <meters>
    }
  }
  ```
### `customer`
*
### `/courier`
* POST `/` : Create a courier.
  * POST data:
  ```javascript
  {
    "name": <name>,
    "phone": <phone>
  }
  ```
