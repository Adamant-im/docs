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

## Logging

- **Log file path**

  Specify path to the log file using `logFileName` property:

  ```json
  {
    "logFileName": "path/to/your/log/file.txt"
  }
  ```

  You can use `.log`, `.txt` or any other extension.

- **Logging Level**

  The logging level can differ between the file and the console for debugging purposes:

  ```json
  {
    "fileLogLevel": "warn",
    "consoleLogLevel": "debug"
  }
  ```

  Possible log levels:

  - `trace`
  - `debug`
  - `log`
  - `info`
  - `warn`
  - `error`
  - `fatal`
  - `none`

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
> Even when a node's Public API is disabled (including `api.enabled` = `false`, `api.access.public` = `false`), other nodes can still connect to it for block exchange—such nodes still participate in blockchain synchronization.

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
        { "ip": "5.161.68.61", "port": 36666 },
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
  - `list`: List of peer IPs and ports.
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

  - `releaseLimit`: The number of transactions, blocks and signatures included in each broadcast (recommended: `25`).

    - Example: If 10 transactions are waiting to be broadcasted and `releaseLimit = 5`, only 5 will be sent in the next broadcast

  - `relayLimit`: The maximum relay count at which a node will still broadcast an unconfirmed transaction (recommended: `4`).

    - Example: If a transaction has already been broadcasted to 5 nodes and `relayLimit = 4`, the node will process the transaction but won't broadcast it further.

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
  - `secret`: List of forging pass phrases.
  - `access.whiteList`: Allowed forging IPs (e.g., `["127.0.0.1"]`).

## Loading Configuration

- **Loading Settings**

  Control loading behavior with the `loading` object:

  ```json
  {
    "loading": {
      "verifyOnLoading": false,
      "loadPerIteration": 5000
    }
  }
  ```

  - `verifyOnLoading`: Verify data during loading (e.g., `false`).
  - `loadPerIteration`: Max items to load per iteration (recommended: `5000`).

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
  - `masterpassword`: Master password (e.g., `"<empty>"`).
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
  - `portWS`: WebSocket client port (e.g., `36668`).

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

  You can find or generate a `nethash` using the genesis block (`genesisBlock.json` or `test/genesisBlock.json` based on your blockchain network).

## CORS

- **Cors**

  By default, ADAMANT Node allows any origins to make requests. You can control [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) with the `cors` object option in `config.json` that accepts following properties:

  - `origin`: Configures the **Access-Control-Allow-Origin** CORS header. Possible values:
    - `Boolean` - set `origin` to `true` to reflect the [request origin](http://tools.ietf.org/html/draft-abarth-origin-09), as defined by `req.header('Origin')`, or set it to `false` to disable CORS.
    - `String` - set `origin` to a specific origin. For example if you set it to `"http://example.com"` only requests from "http://example.com" will be allowed.
    - `Array` - set `origin` to an array of valid origins. For example `["http://example1.com", "http://example2.com/"]` will accept any request from "http://example1.com" or "example2.com".
  - `methods`: Configures the **Access-Control-Allow-Methods** CORS header. Expects a comma-delimited string (ex: 'GET,PUT,POST') or an array (ex: `['GET', 'PUT', 'POST']`).

  Example:

  ```json
  {
    "cors": {
      "origin": "http://example1.com",
      "methods": "GET,PUT,POST"
    }
  }
  ```
