# Making Requests

All requests to the ADAMANT API must be made over HTTPS in the following format:

```url
https://{NODE_BASE_URL}/api/{METHOD_PATH}
```

Example:

```url
https://endless.adamant.im/api/node/status
```

## Passing Parameters

You can pass parameters in one of the following formats:

- As **URL query strings** (for `GET` requests)

  - E.g., you can find an account by passing `address` parameter:

    ```url
    https://endless.adamant.im/api/accounts?address=U2185870976635709603
    ```

- In the **request body** as `application/json` or `application/x-www-form-urlencoded` (for `POST` requests)

  - Example for creation a new account using cURL:

    ```sh
    curl 'https://clown.adamant.im/api/accounts/new' -X POST \
      -d 'publicKey=bee368cc0ce2974adcbcc97e649ac18a031492a579034abed5f77d667001d450'
    ```

## Transaction Query Language

Since this is a blockchain API, there are many endpoints for working with transactions. They share common parameters for sorting, filtering, and pagination.

To avoid duplication, we’ve created [a dedicated guide](./transactions-query-language.md) explaining how to use and combine these parameters.

## Response format

All responses return a JSON object with the following structure:

- `success` (Boolean) — Indicates whether the request was successful
- `nodeTimestamp` — The node's [ADAMANT timestamp](/#timestamps) after processing the request. It may not match the timestamp you passed in the parameters.
- `error` (String, optional) — A human-readable error message, present only if `success` is `false`

Examples:

- Successful request:

  ```json
  {
    "success": true,
    "nodeTimestamp": 63228852,
    "transactionId": "6146865104403680934"
  }
  ```

- Failed request:

  ```json
  {
    "success": false,
    "nodeTimestamp": 239258018,
    "error": "Object didn't pass validation for format address: U"
  }
  ```

## OpenAPI Schema

You can use the [Swagger UI](https://schema.adamant.im) to explore and test API requests, or download the [OpenAPI schema](https://schema.adamant.im/schema.json) directly—for generating client code, typings, or importing it as a [Postman's](https://www.postman.com/) collection.

You can also contribute by opening a pull request on the schema's [GitHub repository](https://github.com/adamant-im/adamant-schema).
