# Configuration

The configuration file locations are `config.json` for mainnet and `test/config.json` for testnet:

```
├── config.json
└── test
    └── config.json
```

You can copy the configuration files from the default templates.

- For mainnet:

  ```sh
  cp config.default.json config.json
  ```

- For testnet:

  ```sh
  cp test/config.default.json test/config.json
  ```

  You can learn more about testnet on the [Testnet page](./testnet.md).

## Configuration Overrides

You can override specific configuration values at startup without editing `config.json` or `test/config.json` directly. Overrides are applied in this order: selected config file → each `--config-overrides` file in command-line order → repeated `--config-set` values → legacy CLI shortcuts (`--port`, `--address`, `--peers`, `--log`, `--snapshot`). The final resolved config is validated against the node config schema before startup.

Use `--config-set` for individual dot-path values:

```sh
node app.js \
  --config test/config.json \
  --genesis test/genesisBlock.json \
  --config-set consensusActivationHeights.fairSystem=4359465 \
  --config-set 'redis={ "url": "redis://127.0.0.1:6379/1", "password": null }'
```

The same flags work through npm scripts:

```sh
npm run start -- --config-set port=36667
npm run start:testnet -- --config-set api.access.public=true
```

Use `--config-overrides` for a file with multiple overrides. Non-`.json` files are parsed as env-style `key=value` pairs (one per line):

```dotenv
consensusActivationHeights.fairSystem=4359465
redis={ "url": "redis://127.0.0.1:6379/1", "password": null }
```

Files ending in `.json` are parsed as nested JSON partial overrides:

```json
{
  "consensusActivationHeights": {
    "fairSystem": 4359465
  },
  "redis": {
    "url": "redis://127.0.0.1:6379/1",
    "password": null
  }
}
```

Values are parsed as JSON first, so numbers, booleans, `null`, arrays, and objects keep their types. Unknown paths, malformed values, and schema-invalid values fail before startup.

::: warning
Be careful when overriding `consensusActivationHeights.*`: using activation heights that do not match the selected network can make a node diverge from that network. See [Consensus](./consensus.md) for details on consensus activation.
:::

## Logging

The node has three configurable log outputs: a general log, a debug log, and console output.

- **General Log**

  Configures the main log file with `generalLog`:

  ```json
  {
    "generalLog": {
      "enabled": true,
      "fileName": "logs-mainnet/adamant.log",
      "level": "warn",
      "rotate": {
        "enabled": true,
        "maxSize": "300M",
        "retain": 5,
        "rotateInterval": "0 0 0 1 *",
        "rotateOnRestart": true
      }
    }
  }
  ```

  - `enabled`: Enable or disable this log output.
  - `fileName`: Path to the log file. You can use `.log`, `.txt`, or any other extension.
  - `level`: Minimum log level to write.
  - `rotate.enabled`: Enable log rotation.
  - `rotate.maxSize`: Maximum log file size before rotation (e.g., `"300M"`).
  - `rotate.retain`: Number of rotated files to keep.
  - `rotate.rotateInterval`: Cron expression for scheduled rotation.
  - `rotate.rotateOnRestart`: Rotate the log file on every node restart.

- **Debug Log**

  Configures a verbose debug log file with `debugLog`. Accepts the same properties as `generalLog`. Typically set to `level: "trace"` to capture all output.

  ```json
  {
    "debugLog": {
      "enabled": true,
      "fileName": "logs-mainnet/adamant_debug.log",
      "level": "trace",
      "rotate": {
        "enabled": true,
        "maxSize": "300M",
        "retain": 7,
        "rotateInterval": "0 0 * * *",
        "rotateOnRestart": true
      }
    }
  }
  ```

- **Console Log**

  Configures logging to standard output with `consoleLog`:

  ```json
  {
    "consoleLog": {
      "enabled": true,
      "level": "info"
    }
  }
  ```

  - `enabled`: Enable or disable console output.
  - `level`: Minimum log level to print.

Possible log levels (from least to most verbose):

- `fatal`
- `error`
- `warn`
- `info`
- `log`
- `debug`
- `trace`
- `none` — disables all output for that target

## Server Configuration

- **Port**

  Specify the server's API port with the `port` property:

  ```json
  {
    "port": 36666
  }
  ```

- **Address**

  Define the server's listening address using the `address` property:

  ```json
  {
    "address": "0.0.0.0"
  }
  ```

  Example: `0.0.0.0` (binds to all network interfaces).

- **Trust Proxy**

  Enable or disable trusting proxy headers using the `trustProxy` property:

  ```json
  {
    "trustProxy": false
  }
  ```

  Leave `trustProxy` at `false` unless a reverse proxy in front of the node overwrites `X-Forwarded-For`.
  Public REST, peer HTTP, and client WebSocket limits use the resolved address as the client key.

  With `trustProxy: false`, every client behind one proxy shares that proxy address and therefore one limit budget.
  With `trustProxy: true`, a caller that supplies its own forwarding header can choose the address used as the
  limit key.

- **Cache**

  Enable the in-memory Redis cache for API responses with `cacheEnabled`:

  ```json
  {
    "cacheEnabled": false
  }
  ```

  Cache is disabled by default on mainnet and enabled on testnet. Enabling it can improve API response times for high-traffic public nodes.

## Database Configuration

- **Database Connection**

  Configure database connection settings with the `db` object:

  ```json
  {
    "db": {
      "host": "localhost",
      "port": 5432,
      "database": "adamant_main",
      "user": "adamant",
      "password": "password",
      "poolSize": 95,
      "poolIdleTimeout": 30000,
      "reapIntervalMillis": 1000,
      "logEvents": ["error"]
    }
  }
  ```

  - `host`: Database host (e.g., `localhost`).
  - `port`: Database port (e.g., `5432`).
  - `database`: Name of the database (e.g., `adamant_main`).
  - `user`: Database username (e.g., `adamant`).
  - `password`: Database password.
  - `poolSize`: Number of connections in the pool (recommended: `95`).
  - `poolIdleTimeout`: Time (ms) before idle connections close (recommended: `30000`).
  - `reapIntervalMillis`: Interval (ms) to clean idle connections (recommended: `1000`).
  - `logEvents`: List of events to log (e.g., `["error"]`).

## Redis Configuration

Redis is used for caching. Required.

- **Redis Connection**

  Configure Redis connection settings with the `redis` object:

  ```json
  {
    "redis": {
      "url": "redis://127.0.0.1:6379/0",
      "password": null
    }
  }
  ```

  - `url`: Redis server URL (e.g., `redis://127.0.0.1:6379/0`).
  - `password`: Redis password (string or `null`).

## API Configuration

> [!Note]
> Even when a node's Public API is disabled (including `api.enabled` = `false`, `api.access.public` = `false`), other nodes can still connect to it for block exchange — such nodes still participate in blockchain synchronization.

> [!Warning]
> Nodes with a Public API, used by applications, require more CPU since they execute many SQL queries.

- **API Settings**

  Control Public API behavior with the `api` object. The `limits` values below are the v0.11.0 production defaults from
  `config.default.json`. Each route class has its own per-IP budget over `windowMs`.

  ```json
  {
    "api": {
      "enabled": true,
      "access": {
        "public": false,
        "whiteList": ["127.0.0.1"]
      },
      "options": {
        "limits": {
          "limit": 3000,
          "max": 3000,
          "delayMs": 25,
          "delayAfter": 1000,
          "maxDelayMs": 1000,
          "windowMs": 60000,
          "routes": {
            "status": {
              "limit": 12000,
              "delayMs": 0,
              "delayAfter": 0,
              "maxDelayMs": 0
            },
            "read": {
              "limit": 3000,
              "delayMs": 25,
              "delayAfter": 1000,
              "maxDelayMs": 1000
            },
            "publish": {
              "limit": 300,
              "delayMs": 50,
              "delayAfter": 120,
              "maxDelayMs": 1500
            }
          }
        }
      }
    }
  }
  ```

  - `enabled`: Enable or disable the Public API (e.g., `true`).
  - `access.public`: Allow public API access for any IP address (recommended: `false`).
  - `access.whiteList`: List of allowed IP addresses if `access.public` is `false` (e.g., `["127.0.0.1"]`).
  - `options.limits`: Public REST abuse limits. An existing block keeps every key you set. Omitted delay and header keys
    are filled from the defaults. Two keys are not filled over an existing block: when `limit` is absent, legacy `max`
    stays and the default `limit` is dropped; when `routes` is absent, the default route classes are dropped.
    - `limit`: Preferred hard cap for the window. `0` disables the whole public API surface, including `routes`.
    - `max`: Legacy alias. It applies only when `limit` is absent. When both are set, `limit` wins, including `0`.
    - `delayMs`: Extra delay, in milliseconds, added for each request after `delayAfter`. `0` disables slow-down.
    - `delayAfter`: Requests allowed in the window before slow-down starts. Slow-down is not applied when this is `0`.
    - `maxDelayMs`: Maximum slow-down delay, in milliseconds. `0` disables slow-down for that policy.
    - `windowMs`: Window length in milliseconds. Production uses `60000` (one minute). `0` is treated as `60000`.
    - `standardHeaders`: Send standard `RateLimit-*` headers. Default `true`.
    - `legacyHeaders`: Send legacy rate-limit headers. Default `false`.
    - `statusCode`: HTTP status used when a hard cap is hit. An integer from 400 through 599. Default `429`.
    - `message`: `error` text in the JSON body. Default `Too many requests, please try again later.`
    - `requestPropertyName`: Request property that stores rate-limit state. Default `rateLimit`.
    - `routes`: Optional per-class policies. Classes are `status`, `read`, and `publish`. Each class accepts `limit`,
      `max`, `delayMs`, `delayAfter`, `maxDelayMs`, and `windowMs`. If the block has no `routes` object, every counted
      request shares the top-level cap. The top-level production policy matches `read`.

  > [!Warning]
  > A copied legacy block that sets only `max: 0` stays unprotected. The node does not copy the default `limit` or
  > `routes` over that block. Public REST stays unlimited until the operator sets `limit` or removes
  > `api.options.limits`.
  > Startup logs this warning while the surface is disabled, including when `limit` is explicitly `0`:
  >
  > `Public API request limits are disabled. Set api.options.limits.limit above 0, or remove the limits block to inherit defaults.`
  >
  > Setting `limit` without adding `routes` enables one shared budget. Remove the whole `limits` block to inherit the
  > default cap and the per-class `routes`.

  Route classes, when `routes` is present:

  - `status` — `GET` requests for cheap node, loader, fee, and version reads. Production cap: `12000`, no slow-down.
    Paths: `/api/loader/status`, `/api/loader/status/sync`, `/api/loader/status/ping`, `/api/node/status`,
    `/api/blocks/getheight`, `/api/blocks/getepoch`, `/api/blocks/getnethash`, `/api/blocks/getbroadhash`,
    `/api/blocks/getfee`, `/api/blocks/getfees`, `/api/blocks/getmilestone`, `/api/blocks/getreward`,
    `/api/blocks/getsupply`, `/api/blocks/getstatus`, and `/api/peers/version`.
  - `read` — every other counted public API request, including `GET /api/transactions`. Production cap: `3000`,
    slow-down after `1000`, then `25` ms per extra request, capped at `1000` ms.
  - `publish` — `POST` and `PUT` requests that submit transactions or other state changes. Production cap: `300`,
    slow-down after `120`, then `50` ms per extra request, capped at `1500` ms. Paths: `/api/transactions`,
    `/api/transactions/process`, `/api/accounts/new`, `/api/accounts/delegates`, `/api/delegates`,
    `/api/delegates/forging/enable`, `/api/delegates/forging/disable`, `/api/chats/process`, `/api/states/store`,
    `/api/signatures`, `/api/multisignatures`, `/api/multisignatures/sign`, `/api/dapps/launch`, `/api/dapps/install`,
    `/api/dapps/uninstall`, `/api/dapps/stop`, `/api/dapps/transaction`, and `/api/dapps/withdrawal`.

  `OPTIONS` preflight is not counted. A hard cap returns HTTP `429` with `Retry-After` and standard `RateLimit-*`
  headers. The default body does not include `nodeTimestamp`:

  ```json
  {
    "success": false,
    "error": "Too many requests, please try again later."
  }
  ```

  `test/config.default.json` sets public REST `limit` and `max` to `0` so the API suite can send many requests from one
  address. A node started from that file logs the warning above. See [Testnet](./testnet.md).

## Peer Configuration

- **Peer Settings**

  Configure peer connections with the `peers` object:

  ```json
  {
    "peers": {
      "enabled": true,
      "list": [
        { "ip": "95.216.114.252", "port": 36666 },
        { "ip": "149.102.157.15", "port": 36666 }
      ],
      "access": { "blackList": [] },
      "options": {
        "limits": {
          "limit": 12000,
          "max": 12000,
          "delayMs": 5,
          "delayAfter": 6000,
          "maxDelayMs": 200,
          "windowMs": 60000,
          "routes": {
            "status": {
              "limit": 20000,
              "delayMs": 0,
              "delayAfter": 0,
              "maxDelayMs": 0
            },
            "sync": {
              "limit": 12000,
              "delayMs": 5,
              "delayAfter": 8000,
              "maxDelayMs": 200
            },
            "broadcast": {
              "limit": 12000,
              "delayMs": 5,
              "delayAfter": 6000,
              "maxDelayMs": 200
            }
          }
        },
        "timeout": 5000
      }
    }
  }
  ```

  - `enabled`: Enable or disable peer connections (default: `true`).
  - `list`: List of peer IPs and ports. See the full list in [config.default.json](https://github.com/Adamant-im/adamant/blob/master/config.default.json).
  - `access.blackList`: List of blocked IPs (e.g., `["222.222.222.222"]`).
  - `options.limits`: Peer HTTP abuse limits. The keys match [public API limits](#api-configuration): `limit` is the
    preferred hard cap, legacy `max` applies only when `limit` is absent, and `0` disables the whole peer HTTP surface,
    including `routes`. Header fields (`standardHeaders`, `legacyHeaders`, `statusCode`, `message`,
    `requestPropertyName`) use the same defaults as the public API. The top-level production policy matches `broadcast`.
  - `options.timeout`: Peer connection timeout (ms, default: `5000`).

  > [!Warning]
  > A copied legacy `peers.options.limits` block that sets only `max: 0` stays unprotected until the operator sets
  > `limit` or removes that block. Startup logs this warning while peer HTTP limits are disabled:
  >
  > `Peer HTTP request limits are disabled. Set peers.options.limits.limit above 0, or remove the limits block to inherit defaults.`

  Peer route classes, when `routes` is present. Budgets are per IP over `windowMs`. Unknown peer routes use `broadcast`.
  The caps are higher than the public API so normal sync and relay stay on the fast path.

  - `status` — `GET /peer/ping`, `GET /peer/height`, and `GET /peer/list`. Production cap: `20000`, no slow-down.
  - `sync` — `GET /peer/blocks`, `GET /peer/blocks/common`, `GET /peer/transactions`, and `GET /peer/signatures`.
    Production cap: `12000`, slow-down after `8000`, then `5` ms per extra request, capped at `200` ms.
  - `broadcast` — other peer HTTP requests, including posts of blocks, transactions, and signatures.
    Production cap: `12000`, slow-down after `6000`, then `5` ms per extra request, capped at `200` ms.

  A hard cap returns the same `429` body and headers as the public API. Hitting a peer limit does not ban that peer.
  `OPTIONS` is not counted. `test/config.default.json` sets peer HTTP `limit` and `max` to `0` and logs the warning
  above.

## Broadcast Configuration

- **Broadcast Settings**

  Control broadcast behavior with the `broadcasts` object:

  ```json
  {
    "broadcasts": {
      "broadcastInterval": 1500,
      "broadcastLimit": 20,
      "parallelLimit": 20,
      "releaseLimit": 25,
      "relayLimit": 4
    }
  }
  ```

  - `broadcastInterval`: The interval (in ms) at which the node broadcasts unconfirmed transactions (recommended: `1500`).
  - `broadcastLimit`: The number of peers a node broadcasts to per interval (recommended: `20`).
  - `parallelLimit`: The maximum number of asynchronous requests the node can make when broadcasting (recommended: `20`).

    - Example: If `parallelLimit = 5` and `broadcastLimit = 10`, the node will first send transactions to 5 peers asynchronously, then process another 5.

  - `releaseLimit`: The number of transactions, blocks, and signatures included in each broadcast (recommended: `25`).

    - Example: If 10 transactions are waiting to be broadcast and `releaseLimit = 5`, only 5 will be sent in the next broadcast.

  - `relayLimit`: The maximum relay count at which a node will still broadcast an unconfirmed transaction (recommended: `4`).

    - Example: If a transaction has already been broadcast to 5 nodes and `relayLimit = 4`, the node will process the transaction but will not broadcast it further.

## Transaction Configuration

- **Transaction Queue**

  Control transaction queue size with the `transactions` object:

  ```json
  {
    "transactions": {
      "maxTxsPerQueue": 1000
    }
  }
  ```

  - `maxTxsPerQueue`: Max transactions per queue (recommended: `1000`).

## Consensus Activation Heights

The `consensusActivationHeights` object defines the block heights at which consensus upgrades become active:

```json
{
  "consensusActivationHeights": {
    "fairSystem": 4359465,
    "spaceship": 100000000
  }
}
```

- `fairSystem`: Height at which the Fair dPoS voting system activates. On mainnet, this is `4359465`. See [Consensus](./consensus.md#fairsystem) for details.
- `spaceship`: Height at which the `timestampMs` field is preserved in transactions. On mainnet, this is `100000000` (far future; already activated on testnet). See [Consensus](./consensus.md#spaceship) for details.

These values match the mainnet network. **Do not change them for a mainnet node**, as mismatched heights will cause the node to diverge from the network. For testnet or localnet experimentation, you can override these values using [configuration overrides](#configuration-overrides).

## Forging Configuration

- **Forging Settings**

  Configure forging behavior with the `forging` object:

  ```json
  {
    "forging": {
      "force": false,
      "secret": [],
      "access": {
        "whiteList": ["127.0.0.1"]
      }
    }
  }
  ```

  - `force`: Force forging regardless of network state (default: `false`).
  - `secret`: List of forging passphrases.
  - `access.whiteList`: Allowed forging IPs (e.g., `["127.0.0.1"]`).

## Loading Configuration

- **Loading Settings**

  Control blockchain rebuilding in case of invalid data in the database with the `loading` object:

  ```json
  {
    "loading": {
      "loadPerIteration": 5000,
      "memCheckpoints": {
        "enabled": true
      }
    }
  }
  ```

  - `loadPerIteration`: Max blocks to verify per iteration (recommended: `5000`).
  - `memCheckpoints.enabled`: Enable persisted checkpoints of derived `mem_*` tables for crash recovery (default: `true`). When startup detects inconsistent memory mirrors, the node attempts to restore the latest verified checkpoint and replay only blocks after the checkpoint height. If verification or replay fails, behavior falls back to the existing full memory-table rebuild from genesis.

    Checkpoints are created after fully persisted blocks at completed round boundaries. During catch-up sync, creation is throttled to every 100th round. The node keeps three rotating checkpoint slots in the database (`mem_ckpt_0..2_*` plus `mem_state_checkpoint_meta`).

    Checkpoints are a local recovery cache only. They do not replace graceful shutdown, trusted database snapshots, or blocks as the source of truth. Disabling checkpoints does not prevent recovery, but forces a full rebuild from genesis whenever `mem_*` validation fails.

    See [Installation — Mem-table checkpoint recovery](./installation.md#mem-table-checkpoint-recovery) for operator guidance and log examples.

## SSL Configuration

- **SSL Settings**

  Configure SSL options with the `ssl` object:

  ```json
  {
    "ssl": {
      "enabled": false,
      "options": {
        "port": 443,
        "address": "0.0.0.0",
        "key": "./ssl/adamant.key",
        "cert": "./ssl/adamant.crt"
      }
    }
  }
  ```

  - `enabled`: Enable or disable SSL (e.g., `false`).
  - `options.port`: SSL port (e.g., `443`).
  - `options.address`: Listening address for SSL (e.g., `0.0.0.0`).
  - `options.key`: Path to SSL key file.
  - `options.cert`: Path to SSL certificate file.

## DApp Configuration

- **DApp Settings**

  Control DApp settings with the `dapp` object:

  ```json
  {
    "dapp": {
      "masterrequired": true,
      "masterpassword": "",
      "autoexec": []
    }
  }
  ```

  - `masterrequired`: Require master password for DApp execution (recommended: `true`).
  - `masterpassword`: Master password (e.g., `""`).
  - `autoexec`: List of auto-executable scripts (e.g., `[]`).

## WebSocket Client Configuration

- **WebSocket Client**

  Configure WebSocket client settings with the `wsClient` object:

  ```json
  {
    "wsClient": {
      "enabled": true,
      "portWS": 36668,
      "limits": {
        "maxConnections": 1000,
        "maxConnectionsPerIp": 30,
        "maxAddresses": 100,
        "maxTypes": 16,
        "maxAssetChatTypes": 8,
        "maxSubscriptionEvents": 60,
        "windowMs": 10000
      }
    }
  }
  ```

  - `enabled`: Enable or disable WebSocket client (e.g., `true`).
  - `portWS`: WebSocket client port (e.g., `36668` for mainnet, `36665` for testnet).
  - `limits`: Client WebSocket abuse limits. Omitted keys are filled from the production defaults below. `0` disables a
    count cap. `windowMs: 0` is treated as `10000`. These values are also what `test/config.default.json` sets.
    - `maxConnections`: Open client sockets for the whole node. Default `1000`. A socket past the cap is disconnected.
    - `maxConnectionsPerIp`: Open client sockets for one IP. Default `30`. The IP follows
      [`trustProxy`](#server-configuration).
    - `maxAddresses`: Address subscriptions stored for one socket. Default `100`. Values past the cap are ignored.
    - `maxTypes`: Transaction-type subscriptions stored for one socket. Default `16`. Values past the cap are ignored.
    - `maxAssetChatTypes`: Chat-subtype subscriptions stored for one socket. Default `8`. Values past the cap are
      ignored.
    - `maxSubscriptionEvents`: Subscription changes accepted per socket during `windowMs`. Default `60`. Further
      `address`, `types`, `assetChatTypes`, `balances`, and `blocks` events in that window are ignored.
    - `windowMs`: Subscription-change window, in milliseconds. Default `10000`. `0` is treated as `10000`.

## WebSocket Node Configuration

- **WebSocket Node**

  Configure WebSocket node-to-node connection for syncing with the `wsNode` object:

  ```json
  {
    "wsNode": {
      "enabled": true,
      "maxBroadcastConnections": 15,
      "maxReceiveConnections": 25,
      "handshakeLimit": 60,
      "handshakeLimitPerNonce": 30,
      "handshakeWindowMs": 60000
    }
  }
  ```

  - `enabled`: Enable or disable WebSocket node-to-node communication.
  - `maxBroadcastConnections`: Maximum number of outbound WebSocket connections used to broadcast data to other nodes.
  - `maxReceiveConnections`: Maximum number of inbound WebSocket connections from other nodes.
  - `handshakeLimit`: New inbound handshakes allowed per IP during `handshakeWindowMs`. Default `60`. `0` disables this
    cap. A rejected handshake is disconnected with `disconnect_reason` set to `Too many connection attempts`.
  - `handshakeLimitPerNonce`: Handshakes allowed per nonce during the same window. Default `30`. `0` disables this cap.
    The same disconnect reason is used. Nonce, address, and banned-peer checks still reject attempts that are under the
    IP cap. The nonce cap is applied after those checks.
  - `handshakeWindowMs`: Handshake window, in milliseconds. Default `60000`. `0` is treated as `60000`.

  Omitted handshake keys use these defaults. `test/config.default.json` does not set them, so a testnet node uses the
  same handshake caps.

## Nethash Configuration

- **Nethash**

  The `nethash` property represents the unique identifier for the blockchain network. It ensures the application connects to the correct network and prevents accidental cross-network operations (e.g., mixing transactions between `mainnet` and `testnet`).

  Example configuration for **mainnet**:

  ```json
  {
    "nethash": "bd330166898377fb28743ceef5e43a5d9d0a3efd9b3451fb7bc53530bb0a6d64"
  }
  ```

  Example configuration for **testnet**:

  ```json
  {
    "nethash": "38f153a81332dea86751451fd992df26a9249f0834f72f58f84ac31cceb70f43"
  }
  ```

  You can find or verify the `nethash` using the genesis block (`genesisBlock.json` or `test/genesisBlock.json` based on your blockchain network). The node derives `nethash` from `genesisBlock.payloadHash` — the SHA-256 payload hash verified from the genesis block transactions. It is not a random identifier.

## CORS

- **CORS**

  By default, ADAMANT Node allows any origin to make requests. You can control [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) with the `cors` object in `config.json`, which accepts the following properties:

  - `origin`: Configures the **Access-Control-Allow-Origin** CORS header. Possible values:
    - `Boolean` — set `origin` to `true` to reflect the request origin, or set it to `false` to disable CORS.
    - `String` — set `origin` to a specific origin. For example, `"http://example.com"` allows only requests from that origin.
    - `Array` — set `origin` to an array of valid origins. For example `["http://example1.com", "http://example2.com/"]`.
  - `methods`: Configures the **Access-Control-Allow-Methods** CORS header. Expects a comma-delimited string (e.g., `'GET,PUT,POST'`) or an array (e.g., `['GET', 'PUT', 'POST']`).

  Example:

  ```json
  {
    "cors": {
      "origin": "http://example1.com",
      "methods": "GET,PUT,POST"
    }
  }
  ```
