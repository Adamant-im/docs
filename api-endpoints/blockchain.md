# Node and Blockchain

List of endpoints useful in work with ADAMANT blockchain in general.

## Get Peers List

```sh
GET /api/peers
```

- **Description**

  Get list of connected peer nodes using endpoint `/api/peers`.

  Node's information includes:

  - `ip` — IPv4 address of node
  - `port` — port number of ADAMANT node. 36666 for mainnet or 36667 for testnet.
  - `state` — state of the peer. Available values: Connected (2), Disconnected, Banned
  - `os` — node's operating system
  - `version` — ADAMANT node software version
  - `broadhash` — broadhash on the peer node. Broadhash is established as an aggregated rolling hash of the past five blocks present in the database.
  - `height` — current node's blockchain height
  - `updated` — Unix timestamp based in ms, when peer updated
  - `nonce` — unique Identifier for the peer. Random string.

  Available parameters:

  - `limit` — how many nodes to retrieve, integer
  - `offset` — offset value for results, integer
  - You can use `os`, `ip`, and other parameters for filtering results

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/peers
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58052600,
    "peers": [
      {
        "ip": "194.32.79.175",
        "port": 36666,
        "state": 2,
        "os": "linux4.15.0-36-generic",
        "version": "0.4.0",
        "broadhash": "3dfdf6c7bbaf7537eac9c70432f7ba1cae835b9b15e4ecd97e147616dde67e62",
        "height": 10146365,
        "clock": null,
        "updated": 1562424199553,
        "nonce": "jxXV6g0sHJhmDubq"
      },
      {
        "ip": "144.217.93.8",
        "port": 36666,
        "state": 2,
        "os": "linux4.4.0-141-generic",
        "version": "0.4.0",
        "broadhash": "febfb2ac6fbf0a456fdb6a22d08e37dbe514e547ec7772a1f46c2d2595c89baa",
        "height": 10146364,
        "clock": null,
        "updated": 1562424195742,
        "nonce": "YngSDjA5MeUNk2iZ"
      }
    ]
  }
  ```

## Get Loading Status

```sh
GET /api/loader/status
```

- **Description**

  Endpoint `/api/loader/status` returns information on node's loading process.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/loader/status
  ```

  Response for node on actual blockchain height:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58052355,
    "loaded": true,
    "now": 10144343,
    "blocksCount": 0
  }
  ```

  Response for node in sync process:

  ```json
  {
    "success": true,
    "nodeTimestamp": 66424794,
    "loaded": true,
    "now": 1,
    "blocksCount": 1
  }
  ```

## Get Synchronization Status

```sh
GET /api/loader/status/sync
```

- **Description**

  Endpoint `/api/loader/status/sync` returns information on node's sync process with other peers:

  - `syncing` — `true` if node is still in sync process
  - `blocks` — current blockchain height to achieve if in sync process; `0` if syncing is done
  - `height` — node's blockchain height
  - `broadhash` — broadhash on the peer node. Broadhash is established as an aggregated rolling hash of the past five blocks present in the database.
  - `consensus` — consensus percentage with other nodes

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/loader/status/sync
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58052432,
    "syncing": false,
    "blocks": 0,
    "height": 10146332,
    "broadhash": "09f2f5614cf7209979dc1df2dd92d16aade904dae6c9b68bccaeb234647b3c18",
    "consensus": 94.32
  }
  ```

## Get Ping Status

```sh
GET /api/loader/status/ping
```

- **Description**

  Ping `/api/loader/status/ping` to check if the node is alive.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/loader/status/ping
  ```

  Response:

  ```json
  {
    "success": true
  }
  ```

## Get Node Version

```sh
GET /api/peers/version
```

- **Description**

  Endpoint `/api/peers/version` returns node's software information: `version`, `build`, and `commit`.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/peers/version
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58052984,
    "build": "",
    "commit": "b07aaf9580dffb5cc95cc65f303f6f1e5fca7d9c",
    "version": "0.5.2"
  }
  ```

## Get Blockchain Broadhash

```sh
GET /api/blocks/getBroadhash
```

- **Description**

  Endpoint `/api/blocks/getBroadhash` returns `broadhash` on the node. Broadhash is established as an aggregated rolling hash of the past five blocks present in the database.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getBroadhash
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58645139,
    "broadhash": "e1aedd2818679c174e3f6e31891c34f4069927f33f145e1b81fe5d978733e794"
  }
  ```

## Get Blockchain Epoch

```sh
GET /api/blocks/getEpoch
```

- **Description**

  Endpoint `/api/blocks/getEpoch` returns the time when blockchain epoch starts. Value `2017-09-02T17:00:00.000Z` is for ADAMANT mainnet.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getEpoch
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58646306,
    "epoch": "2017-09-02T17:00:00.000Z"
  }
  ```

## Get Blockchain Height

```sh
GET /api/blocks/getHeight
```

- **Description**

  Endpoint `/api/blocks/getHeight` returns current node's blockchain height.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getHeight
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58047354,
    "height": 10145318
  }
  ```

## Get Blockchain Fee

```sh
GET /api/blocks/getFee
```

- **Description**

  Endpoint `/api/blocks/getFee` returns the current fee value for [`type 0` (token transfer)](/api/transaction-types.md#type-0-token-transfer-transaction) transactions. Integer amount of 1/10^8 ADM tokens (1 ADM = 100000000).

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getFee
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58046803,
    "fee": 50000000
  }
  ```

## Get Blockchain Fees

```sh
GET /api/blocks/getFees
```

- **Description**

  Endpoint `/api/blocks/getFees` returns current fee values for different [transaction types](/api/transaction-types.md):

  - `send` — token transfer, type 0
  - `vote` — voting for delegate, type 3
  - `delegate` — registration of a new delegate, type 2
  - `old_chat_message` — sending a message (not used for now)
  - `chat_message` — sending a message, type 8
  - `state_store` — storing data in KVS, type 9
  - `profile_update` — not used for now
  - `avatar_upload` — not used for now

  All values are integer amounts of 1/10^8 ADM tokens (1 ADM = 100000000).

- **Example**

  Request:

  ```sh
  GET http://endless.adamant.im/api/blocks/getFees
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58046908,
    "fees": {
      "send": 50000000,
      "vote": 5000000000,
      "delegate": 300000000000,
      "old_chat_message": 500000,
      "chat_message": 100000,
      "state_store": 100000,
      "profile_update": 5000000,
      "avatar_upload": 10000000
    }
  }
  ```

## Get Blockchain Nethash

```sh
GET /api/blocks/getNethash
```

- **Description**

  Endpoint `/api/blocks/getNethash` describes the network. The nethash describes e.g. the Mainnet or the Testnet, that the node is connecting to.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getNethash
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58047702,
    "nethash": "bd330166898377fb28743ceef5e43a5d9d0a3efd9b3451fb7bc53530bb0a6d64"
  }
  ```

## Get Blockchain Milestone

```sh
GET /api/blocks/getMilestone
```

- **Description**

  Endpoint `/api/blocks/getMilestone` returns `milestone` — current slot height, which determines the reward a delegate will get for forging a block.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getMilestone
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58047777,
    "milestone": 1
  }
  ```

## Get Blockchain Reward

```sh
GET /api/blocks/getReward
```

- **Description**

  Endpoint `/api/blocks/getReward` returns `reward` — the reward a delegate will get for forging a block. Integer amount of 1/10^8 ADM tokens (1 ADM = 100000000). Depends on the slot height.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getReward
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58047028,
    "reward": 45000000
  }
  ```

## Get Total Supply of ADAMANT Tokens

```sh
GET /api/blocks/getSupply
```

- **Description**

  Endpoint `/api/blocks/getSupply` returns total current supply of ADM tokens in the network. Integer amount of 1/10^8 ADM tokens (1 ADM = 100000000). Total supply increases with every new forged block.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getSupply
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58047218,
    "supply": 10198038140000000
  }
  ```

## Get ADAMANT Blockchain Network Info

```sh
GET /api/blocks/getStatus
```

- **Description**

  Integrative endpoint `/api/blocks/getStatus` returns ADAMANT blockchain network information with a single request:

  - [`broadhash`](#get-blockchain-broadhash)
  - [`epoch`](#get-blockchain-epoch)
  - [`height`](#get-blockchain-height)
  - [`fee`](#get-blockchain-fee)
  - [`milestone`](#get-blockchain-milestone)
  - [`nethash`](#get-blockchain-nethash)
  - [`reward`](#get-blockchain-reward)
  - [`supply`](#get-total-supply-of-adamant-tokens)

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/blocks/getStatus
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58047435,
    "broadhash": "4a28272c915f74d118120bb47db547a18a7512e1d48092c48be86939a6d45b89",
    "epoch": "2017-09-02T17:00:00.000Z",
    "height": 10145334,
    "fee": 50000000,
    "milestone": 1,
    "nethash": "bd330166898377fb28743ceef5e43a5d9d0a3efd9b3451fb7bc53530bb0a6d64",
    "reward": 45000000,
    "supply": 10198040075000000
  }
  ```

## Get Blockchain and Network Status

```sh
GET /api/node/status
```

- **Description**

  Integrative endpoint `/api/node/status` returns both ADAMANT blockchain network information and Node information with a single request. Result includes [`network`](#get-adamant-blockchain-network-info), [`version`](#get-node-version), and `wsClient` info.

  `wsClient` describes if node allows socket connections and port to connect.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/node/status
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 58640735,
    "network": {
      "broadhash": "56327efc1c370dd3b1188e88a881d560e4822b2195a04b302afb87ed0d261bac",
      "epoch": "2017-09-02T17:00:00.000Z",
      "height": 10262516,
      "fee": 50000000,
      "milestone": 1,
      "nethash": "bd330166898377fb28743ceef5e43a5d9d0a3efd9b3451fb7bc53530bb0a6d64",
      "reward": 45000000,
      "supply": 10203313265000000
    },
    "version": {
      "build": "",
      "commit": "b07aaf9580dffb5cc95cc65f303f6f1e5fca7d9c",
      "version": "0.5.2"
    },
    "wsClient": {
      "enabled": true,
      "port": 36668
    }
  }
  ```
