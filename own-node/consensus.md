# Consensus

Consensus is the process that makes sure all nodes in the network agree on the state of the blockchain. It controls how transactions are confirmed and how new blocks are added, keeping the network consistent and secure.

This page describes changes to the consensus rules.

## Spaceship

- **Target block for activation:** `100,000,000`

- **Description**

  As part of this update, transactions can now include a new optional field: `timestampMs`.

  - `timestampMs` is a timestamp in milliseconds.
  - It shows when the transaction was created on the **client side**.
  - This field is **optional**. Transactions without it are still valid.
  - If included, the field must be close to the `timestamp`. If it's too far in the past or future, the transaction may be rejected.

  This change improves the user experience and ensures the correct order of messages.

- **Example**

  ```json
  {
    // ...
    "timestamp": 1716829200,
    "timestampMs": 1716829200000,
    "signature": "..."
  }
  ```
