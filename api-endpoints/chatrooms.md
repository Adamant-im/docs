# Chats and Chatrooms

List of endpoints intended to work with chats and chatrooms in ADAMANT blockchain.

See also:

- [Chats and Message Types](/api/message-types.md)

## Get List of Chats

```sh
GET /api/chatrooms/{ADAMANT_address}
```

- **Description**

  Fetch a list of an account's chats using the `/api/chatrooms` endpoint by specifying an [`ADAMANT address`](/api-endpoints/accounts.md).

  - Supports filtering via [Transactions Query Language](/api/transactions-query-language.md).
  - The `includeDirectTransfers` parameter includes direct token transfers.
  - The `returnUnconfirmed` parameter includes [unconfirmed chats](/api/websocket.md#understanding-unconfirmed-transactions).
  - Returns transactions of:
    - `type = 8` (messages)
    - `type = 0` (direct token transfers)
  - Stores the last message in `asset.chat` (see [Message Types](/api/message-types.md)).
  - Only returns:
    - `type 1` (basic messages)
    - `type 2` (rich messages)
    - **Does not** return `type 3` (signal messages).

  **Response Data**

  - `participants` — sender & recipient (`address` & `publicKey`)
  - `lastTransaction` — last [chat transaction](/api/transaction-types.md) with `asset.chat`
  - `count` — total chats count

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/chatrooms/U839357947177758191
  ```

  Response:

  ```jsonc
  {
    "success": true,
    "nodeTimestamp": 63647775,
    "chats": [
      {
        "lastTransaction": {
          "id": "438452752317142988",
          "height": 10224582,
          "blockId": "5808058151912629759",
          "type": 8,
          "block_timestamp": 58449060,
          "timestamp": 58449055,
          "senderPublicKey": "12d6b3f80221a2b0b6d2ef07ae33fce28204c1906ec1bba1d15be693d3353ec4",
          "senderId": "U839357947177758191",
          "recipientId": "U18018989827016540480",
          "recipientPublicKey": "ec48de9b438ae9f12e271ba28d56eb0b3f3bba7b120df7685eddda97c9f79160",
          "amount": 0,
          "fee": 100000,
          "signatures": [],
          "confirmations": null,
          "asset": {
            "chat": {
              "message": "3e5314dfc9a1095eb874d76cd878ea5a8420ab2a",
              "own_message": "e26b9454b0927c904863e44bca30aa4d05bf3ee3f9084976",
              "type": 1
            }
          }
        },
        "participants": [
          {
            "address": "U839357947177758191",
            "publicKey": "12d6b3f80221a2b0b6d2ef07ae33fce28204c1906ec1bba1d15be693d3353ec4"
          },
          {
            "address": "U18018989827016540480",
            "publicKey": "ec48de9b438ae9f12e271ba28d56eb0b3f3bba7b120df7685eddda97c9f79160"
          }
        ]
      },
      {
        "lastTransaction": {
          "id": "6066206090642273254",
          "height": 10224570,
          "blockId": "8748908063639223318",
          "type": 0,
          "block_timestamp": 58449000,
          "timestamp": 58448986,
          "senderPublicKey": "cdab95b082b9774bd975677c868261618c7ce7bea97d02e0f56d483e30c077b6",
          "senderId": "U15423595369615486571",
          "recipientId": "U839357947177758191",
          "recipientPublicKey": "12d6b3f80221a2b0b6d2ef07ae33fce28204c1906ec1bba1d15be693d3353ec4",
          "amount": 10000000,
          "fee": 50000000,
          "signatures": [],
          "confirmations": null,
          "asset": {}
        },
        "participants": [
          {
            "address": "U15423595369615486571",
            "publicKey": "cdab95b082b9774bd975677c868261618c7ce7bea97d02e0f56d483e30c077b6"
          },
          {
            "address": "U839357947177758191",
            "publicKey": "12d6b3f80221a2b0b6d2ef07ae33fce28204c1906ec1bba1d15be693d3353ec4"
          }
        ]
      }
    ],
    "count": "2"
  }
  ```

## Get Chat Messages

```sh
GET /api/chatrooms/{ADAMANT_address}/{ADAMANT_address}
```

- **Description**

  To fetch messages between two accounts, use the `/api/chatrooms` endpoint and specify two [ADAMANT addresses](/api-endpoints/accounts.md).
  
  Filtering and options are the same as for [Get List of Chats](/api-endpoints/chatrooms.md#get-list-of-chats).

  As a success result in response, you'll get:

  - `participants` — sender and recipient of messages, represented by ADAMANT `address` and `publicKey`
  - `messages` — array of [chat transactions](/api/transaction-types.md) with `asset.chat`

  Endpoint also returns count of messages as an integer value.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/chatrooms/U8916295525136600565/U2707535059340134112?limit=2
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 63653142,
    "messages": [
      {
        "id": "8155501380173522589",
        "height": 10288884,
        "blockId": "4595637117757620800",
        "type": 0,
        "block_timestamp": 58773240,
        "timestamp": 58773230,
        "senderPublicKey": "2ac5eef60303003c90f662d89e60570d8661c8ba569e667296f5c7c97a0413ee",
        "requesterPublicKey": null,
        "senderId": "U8916295525136600565",
        "recipientId": "U2707535059340134112",
        "recipientPublicKey": "5a3c1da429ae925422892e69dc4f0ab6d7ac00cef229d2d992242dcfeca27b91",
        "amount": 1750000000,
        "fee": 50000000,
        "signature": "abf7966546cd99efaa81a...",
        "signSignature": null,
        "signatures": [],
        "confirmations": null,
        "asset": {}
      },
      {
        "id": "9175562912139726777",
        "height": 10288885,
        "blockId": "10475460465898092643",
        "type": 8,
        "block_timestamp": 58773245,
        "timestamp": 58773228,
        "senderPublicKey": "2ac5eef60303003c90f662d89e60570d8661c8ba569e667296f5c7c97a0413ee",
        "requesterPublicKey": null,
        "senderId": "U8916295525136600565",
        "recipientId": "U2707535059340134112",
        "recipientPublicKey": "5a3c1da429ae925422892e69dc4f0ab6d7ac00cef229d2d992242dcfeca27b91",
        "amount": 0,
        "fee": 100000,
        "signature": "287dc2554025d8074d...",
        "signSignature": null,
        "signatures": [],
        "confirmations": null,
        "asset": {
          "chat": {
            "message": "9ae819297240f00b...",
            "own_message": "6802a9e744aa3ba570d7e48fce5fe0f49184d0ce38ea40f7",
            "type": 1
          }
        }
      }
    ],
    "participants": [
      {
        "address": "U8916295525136600565",
        "publicKey": "2ac5eef60303003c90f662d89e60570d8661c8ba569e667296f5c7c97a0413ee"
      },
      {
        "address": "U2707535059340134112",
        "publicKey": "5a3c1da429ae925422892e69dc4f0ab6d7ac00cef229d2d992242dcfeca27b91"
      }
    ],
    "count": "7"
  }
  ```

## Get Chat Transactions

```sh
GET /api/chats/get
```

- **Description**

  Use the `/api/chats/get` endpoint to get messages from ADAMANT blockchain. For filtering and options, see [Transactions Query Language](/api/transactions-query-language.md).

  As a result, you'll get a list of transactions of `type = 8` (messages) with `asset.chat` fields. The structure of `chat` is described in the [Chats and Message Types](/api/message-types.md) section. The `/api/chats/get` endpoint returns messages of all types (basic messages, rich messages, signal messages).

  Endpoint also returns `count` of transactions as an integer value.

- **Example**

  Request:

  ```sh
  GET https://endless.adamant.im/api/chats/get?senderId=U14236667426471084862&type=3&limit=2
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 63653208,
    "transactions": [
      {
        "id": "18398086748267364739",
        "height": 9108352,
        "blockId": "8710389658301166851",
        "type": 8,
        "block_timestamp": 52843040,
        "timestamp": 52842993,
        "senderPublicKey": "8cd9631f9f634a361ea3b85cbd0df882633e39e7d26d7bc615bbcf75e41524ef",
        "requesterPublicKey": null,
        "senderId": "U14236667426471084862",
        "recipientId": "U15243615587463307445",
        "recipientPublicKey": null,
        "amount": 0,
        "fee": 100000,
        "signature": "f559262305b34faa48...",
        "signSignature": null,
        "signatures": [],
        "confirmations": null,
        "asset": {
          "chat": {
            "message": "61321be1e7...",
            "own_message": "875836287f50328027f6bbddbec9c2c020692da371c70d04",
            "type": 3
          }
        }
      },
      {
        "id": "15531885854852734176",
        "height": 10473512,
        "blockId": "16237611910269371025",
        "type": 8,
        "block_timestamp": 59706995,
        "timestamp": 59706978,
        "senderPublicKey": "8cd9631f9f634a361ea3b85cbd0df882633e39e7d26d7bc615bbcf75e41524ef",
        "requesterPublicKey": null,
        "senderId": "U14236667426471084862",
        "recipientId": "U15243615587463307445",
        "recipientPublicKey": null,
        "amount": 0,
        "fee": 100000,
        "signature": "ce19bfd3a00b97e6...",
        "signSignature": null,
        "signatures": [],
        "confirmations": null,
        "asset": {
          "chat": {
            "message": "be0b5367c7c646fc7d3...",
            "own_message": "5682385d31ec3814d6c45b7196a9407f38d6c235e87dec84",
            "type": 3
          }
        }
      }
    ],
    "count": "12"
  }
  ```

## Register Chat Message Transaction

```sh
POST /api/chats/process
```

- **Description**

  Use endpoint `/api/chats/process` to broadcast transactions of [type 8 — Chat/Message](/api/transaction-types.md#type-8-chat-message-transaction). It is used for messaging as well as in-Chat ADM token transfer with comment.

  Make _POST_ request to the endpoint, with payload of [transaction object](/api-endpoints/transactions.md#get-list-of-transactions), where `asset.chat` includes encrypted `message`, nonce `own_message` and message `type`. Set positive `amount` value for in-Chat ADM token transfer with comment.

  `message` contents depends on its [`type`](/api/message-types.md), must be [encrypted](/essentials/encrypting-messages.md), and then transaction must be [formed and signed](/essentials/signing-transactions.md).

  As a success result you'll get ID of transaction registered in ADAMANT blockchain.

- **Example**

  Request:

  ```sh
  POST https://endless.adamant.im/api/chats/process
  ```

  ```json
  {
    "transaction": {
      "type": 8,
      "amount": 0,
      "senderId": "U13246415250845952364",
      "senderPublicKey": "a448d99d5da6907dd022c62723f30971f4c1b5b79441da7f5e67f39d545f755e",
      "asset": {
        "chat": {
          "message": "f96383619244c7e06f39f592b55cc551acc72710",
          "own_message": "d0801b9a647fd1469883f918ec616241c79d6f6f7914ddb0",
          "type": 1
        }
      },
      "recipientId": "U15677078342684640219",
      "timestamp": 63652706,
      "signature": "9d35f06fa5b80df650bc4bdfac25974fecacb53de67d25b485f674102f77205ac1e161b13ddad98f1dd7ae0016cceaa254f401c0ee359e45e982e32b1e4fcf0b"
    }
  }
  ```

  Response:

  ```json
  {
    "success": true,
    "nodeTimestamp": 63652705,
    "transactionId": "2515012750420367858"
  }
  ```
