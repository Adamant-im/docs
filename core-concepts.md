# Core Concepts

Basic concepts of the ADAMANT blockchain you need to know if you're interacting with the blockchain or just running a node.

## Native Token

**ADM** is the native token of the ADAMANT blockchain. It’s used to pay transaction fees and can be transferred between accounts. For consistency and precision, ADM amounts and **fees** are stored as strings in transactions and measured in 1/10<sup>8</sup> ADM (1 ADM = 100,000,000).

## Transaction Fees

Every transaction in ADAMANT requires a fee, paid in ADM. Fees help prevent spam and support the network. Fees are intentionally very low, making ADAMANT affordable for active messaging.

Most transaction types have a fixed fee, but **Message** and **Key-Value Store** (KVS) transaction fees scale with content length.

You can get blockchain fees using the [`/api/blocks/getFees`](/api-endpoints/blockchain.md#get-blockchain-fees) API endpoint.

## Timestamps

A **timestamp** in ADAMANT shows how many seconds have passed since the creation of the blockchain — the **blockchain epoch**, set at September 2, 2017, 17:00:00 GMT+0.

For example, to convert time to ADAMANT's timestamp using TypeScript:

```ts
const EPOCH = Date.UTC(2017, 8, 2, 17, 0, 0, 0);

/**
 * Converts provided timestamp into ADAMANT's epoch timestamp
 * @param time - timestamp in ms
 */
const getEpochTime = (time: number = Date.now()) =>
  Math.floor((time - EPOCH) / 1000);
```

You can get blockchain's epoch time using [`/blocks/getEpochTime`](/api-endpoints/blockchain.md#get-blockchain-epoch) endpoint. Additionally, consider using [`/blocks/getStatus`](/api-endpoints/blockchain.md#get-adamant-blockchain-network-info) or [`/node/status`](/api-endpoints/blockchain.md#get-blockchain-and-network-status) endpoints to get more blockchain and network information in a single request.

## Milestones

Milestones define block rewards for delegates and are triggered at specific block heights.

You can use REST API to:

- [Get blockchain reward](/api-endpoints/blockchain.md#get-blockchain-reward)
- [Get current milestone number](/api-endpoints/blockchain.md#get-blockchain-milestone)
- [Retrieve both reward and milestone info in one call](/api-endpoints/blockchain.md#get-blockchain-and-network-status)
