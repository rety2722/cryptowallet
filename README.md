# Cryptowallet transaction viewer

To use the project, need to fill the .env files with data from .example.env files in both frontend/ and server/ folders.

**To start server need to write from the root:**
$ cd server # go to server directory
$ npm i # install packages
$ npm start # start server

To use frontend need:
$ cd frontend # go to frontend directory
$ npm i
$ npm run dev # run in dev mode

## Frontend .env:

### VITE_PROJECT_ID = "Project ID obtained from https://cloud.reown.com"

Needed for wallet connect usage

## VITE_BASE_SERVER_URL = "server url, for local testing: http://localhost:PORT/api"

For local testing on macos http://localhost:8080 is fine. In backend PORT should be specified to the same number as here. In this case: 8080.

## Server .env:

### DATABASE_URL = "URL of Database to connect to"

Used for sqlite usage. In my case it is ../../database.db
However, any path is fine

### PORT = "Port the server is listening to"

As described above, should be the same as for frontend. Here: 8080

### NODE_ENV = ""

For me development

### ETHERSCAN_API_KEY= "API KEY obtained from https://etherscan.io for getting blockchain data"

Need to register on their site. It shows the key after registration.

### ETHERSCAN_BASE_URL=https://api.etherscan.io/api

The base URL part

### INFURA_API_KEY="API KEY obtained from https://developer.metamask.io for listening for blockchain"

Needed for listening for the blockchain for a given wallet address.

### INFURA_URL="wss://mainnet.infura.io/ws/v3/{INFURA_API_KEY}"

URL for using to listen to the ethereum blockchain.
