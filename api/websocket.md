# WebSocket

ADAMANT doesn't require WebSocket connection, but it helps achieve real-time message delivery, reducing delays compared to polling and providing a faster, more efficient connection between the client and the node.

The nodes use [Socket.IO](https://socket.io/) under the hood for communication between clients and nodes, so it's recommended to use a [Socket.IO client](https://socket.io/docs/v4/client-api/) for full compatibility and reliable messaging.

The following examples use native socket.io, but it's still recommended using the [adamant-api-jsclient](https://github.com/adamant-im/adamant-api-jsclient) official library to handle transactions.

## WebSocket vs REST API

WebSocket is a fast and efficient way to receive new transactions, but it should not be the only data source.

- WebSocket connections can drop temporarily, causing missed transactions.
- Nodes only retain transactions for 60 seconds in the WebSocket pool.
- Periodic REST API requests ensure the client has accurate transaction history.

To maintain reliability, use WebSocket for real-time updates and REST API to periodically fetch missed transactions.

## Enabling WebSocket

To enable WebSocket on a node, enable it in the [configuration file](/configuration.md#websocket-client-configuration):

```json
{
  "wsClient": {
    "enabled": true,
    "portWS": 36668
  }
}
```

To check if the node offers WebSocket connections, request its status:

```sh
https://localhost:36668/api/node/status
```

Example response:

```json
{
  "success": true,
  "nodeTimestamp": 226901657,
  // ...
  "wsClient": {
    "enabled": true,
    "port": 36668
  }
}
```

## Listening to transactions

ADAMANT nodes send transactions over WebSocket. This includes both confirmed and unconfirmed transactions.

### Understanding unconfirmed transactions

New transactions do not appear on the blockchain immediately. When a transaction is first created, it is considered **unconfirmed** and does not have a `block_timestamp`.

Most transactions received via WebSocket are unconfirmed since they have just appeared in the ADAMANT network. Until they are included in a block, they remain at **risk of being rejected** by the network and called "unconfirmed".

::: danger

Any logic involving transfer transactions (`amount` > 0) should verify the confirmation status before processing them as final.

:::

### Subscribing to transactions

Clients can subscribe to the `newTrans` event to receive transaction updates from a node.

Example:

```js
import { io } from 'socket.io-client';

const connection = io('https://endless.adamant.im/', {
  reconnection: false,
  timeout: 5000,
});

connection.on('connect', () => {
  console.log('Connected to ADAMANT node.');
});

connection.on('newTrans', (transaction) => {
  console.log('New transaction received:', transaction);
});

connection.on('disconnect', (reason) => {
  console.log(`Disconnected: ${reason}`);
});

connection.on('connect_error', (error) => {
  console.warn(`Connection error: ${error}`);
});
```

### Filtering transactions

By default, **all** transactions are received. Clients should filter transactions based on their needs.

#### Filtering by Address

To receive only transactions related to a specific ADM address, emit `address` event:

```js
connection.on('connect', () => {
  // Subscribe to transactions involving this ADM address
  connection.emit('address', 'U1234567890123456');
});
```

You can also subscribe to **multiple** addresses by passing an array:

```js
connection.on('connect', () => {
  connection.emit('address', ['U1234567890123456', 'U6543210987654321']);
});
```

#### Filtering by Transaction Type

To receive only specific types of transactions, emit the `types` event with an array of transaction types.

```js
connection.on('connect', () => {
  // Subscribe to a single transaction type: "transfer" (0)
  connection.emit('types', 0);

  // OR subscribe to multiple transaction types: "transfer" (0) and "chat message" (8)
  connection.emit('types', [0, 8]);
});
```

A full list of transaction types can be found in the [API Specification](/api/transaction-types.md) section of the documentation.

#### Filtering by Message Type

Chat messages in ADAMANT have different [message types](/api/message-types.md) under `asset.chat.type`. To filter messages by type, emit the `assetChatTypes` event:

```js
connection.on('connect', () => {
  // Subscribe to a single chat message type
  connection.emit('assetChatTypes', 3);

  // OR subscribe to multiple chat message types
  connection.emit('assetChatTypes', [1, 2, 3]);
});
```

This will make you automatically subscribe to Message **transaction type** (type `8`) if you weren't subscribed to it.
