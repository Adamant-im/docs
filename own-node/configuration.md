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

  Control Public API behavior with the `api` object:

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
          "max": 0,
          "delayMs": 0,
          "delayAfter": 0,
          "windowMs": 60000
        }
      }
    }
  }
  ```

  - `enabled`: Enable or disable the Public API (e.g., `true`).
  - `access.public`: Allow public API access for any IP address (recommended: `false`).
  - `access.whiteList`: List of allowed IP addresses if `access.public` is `false` (e.g., `["127.0.0.1"]`).
  - `options.limits`: API rate-limiting options:
    - `max`: Max requests per window (e.g., `0`, unlimited).
    - `delayMs`: Delay (ms) before responding to requests (e.g., `0`).
    - `delayAfter`: Start delaying after N requests (e.g., `0`).
    - `windowMs`: Time window for rate limits (e.g., `60000`).

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
          "max": 0,
          "delayMs": 0,
          "delayAfter": 0,
          "windowMs": 60000
        },
        "timeout": 5000
      }
    }
  }
  ```

  - `enabled`: Enable or disable peer connections (default: `true`).
  - `list`: List of peer IPs and ports. See the full list in [config.default.json](https://github.com/Adamant-im/adamant/blob/master/config.default.json).
  - `access.blackList`: List of blocked IPs (e.g., `["222.222.222.222"]`).
  - `options.limits`: Peer rate-limiting options:
    - `max`: Max requests per window (e.g., `0`, unlimited).
    - `delayMs`: Delay (ms) before responding (e.g., `0`).
    - `delayAfter`: Start delaying after N requests (e.g., `0`).
    - `windowMs`: Time window for rate limits (e.g., `60000`).
  - `options.timeout`: Peer connection timeout (ms, default: `5000`).

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
      "loadPerIteration": 5000
    }
  }
  ```

  - `loadPerIteration`: Max blocks to verify per iteration (recommended: `5000`).

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
      "portWS": 36668
    }
  }
  ```

  - `enabled`: Enable or disable WebSocket client (e.g., `true`).
  - `portWS`: WebSocket client port (e.g., `36668` for mainnet, `36665` for testnet).

## WebSocket Node Configuration

- **WebSocket Node**

  Configure WebSocket node-to-node connection for syncing with the `wsNode` object:

  ```json
  {
    "wsNode": {
      "enabled": true,
      "maxBroadcastConnections": 15,
      "maxReceiveConnections": 25
    }
  }
  ```

  - `enabled`: Enable or disable WebSocket node-to-node communication.
  - `maxBroadcastConnections`: Maximum number of outbound WebSocket connections used to broadcast data to other nodes.
  - `maxReceiveConnections`: Maximum number of inbound WebSocket connections from other nodes.

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
