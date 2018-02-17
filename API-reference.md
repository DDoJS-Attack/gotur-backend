# Götür RESTful API Reference

## Endpoints


### `/cargo`
* GET `/:id`: find cargo by ID
* POST `/` : search cargos with parameters.

### `customer`

### `/courier`
* POST `/` : Create a courier.
  * POST data:
  ```javascript
  {
    "name": <name>,
    "phone": <phone>
  }
  ```
