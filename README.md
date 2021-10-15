# Ceramic Starter Next

A NextJS app with the most basic features of [Ceramic Network](https://ceramic.network/) implemented.

## Using Ceramic

Ceramic is a platform for storing and sharing streams of data.

Examples of streams are a social media feed, a list of transactions, and a collaborative document. Anything where changes are made over time.

The Ceramic system is designed to provide [Self-Sovereign Identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) and data.

In Ceramic you control your own identities and the data that is recorded with them. This is in contrast to social media companies, who control your feed; a centralized bank, that controls your transactions, or a cloud provider like Google/AWS that controls your documents. 

The system is also decentralized, providing censorship resistance.


## Running Development Version

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quick Glossary

### [Decentralized ID (DID)](https://en.wikipedia.org/wiki/Decentralized_identifiers)

An identifier like **did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74**
that enables a verifiable, decentralized digital identity.

* A **DID** is an **identifier**.
* A **DID resolver** takes an **DID** and returns a **DID Document**
* A **DID Document** contains metadata about the **DID** e.g. A public key to prove ownership.

Find out more in the [Ceramic Glossary](https://developers.ceramic.network/learn/glossary/#dids).

## Data Models

Ceramic uses **Data Models** to allow new applications to build on existing data.

Data Models are essentially a collection of schemas, which describe the format of data that can be stored, along with some metadata such as a human readable name to make interacting with the schemas easier.

They are wrapped in npm packages so that they can be easily reused within different applications.

## Data Store

The heart of Ceramic is the **Data Store**. This can be viewed as a simple two column table. Each user (DID) has one data store that maps a schema streamId to the user's data that matches that schema.

## Getting Started With Ceramic And JS

For npm v7 need to install the following package:

```
npm install -g node-pre-gyp
```
We need a client to message the Ceramic network from JS:
```
npm install @ceramicnetwork/http-client
```
This [npm install dids](https://github.com/ceramicnetwork/js-did) seemed to be missing from the instructions:

```
npm install dids
import { DID } from 'dids'
```

Need a DID method to perform writes:

```
npm install @3id/connect
npm install @ceramicnetwork/3id-did-resolver
```

Badman need tile ting:

```
npm install @ceramicnetwork/stream-tile
```

Access a node from [Ceramic Nodes](https://developers.ceramic.network/run/nodes/community-nodes/):

```js
import CeramicClient from '@ceramicnetwork/http-client'
const API_URL = 'https://ceramic-clay.3boxlabs.com'
```

**You need to know about DIDs in ceramic**

[https://developers.ceramic.network/learn/glossary/#controllers](https://developers.ceramic.network/learn/glossary/#controllers)

### Using Data Models In JS

See [Glaze Development](https://developers.ceramic.network/tools/glaze/development/).

```js
npm install @glazed/devtools
npm install --dev @datamodels/identity-profile-basic 
npm install --dev @datamodels/identity-accounts-crypto 
npm install --dev @datamodels/identity-accounts-web 
```

```js
import { ModelManager } from '@glazed/devtools'
import { model as basicProfileModel } from '@datamodels/identity-profile-basic'
import { model as cryptoAccountsModel } from '@datamodels/identity-accounts-crypto'
import { model as webAccountsModel } from '@datamodels/identity-accounts-web'

const manager = new ModelManager(ceramic)
manager.addJSONModel(basicProfileModel)
manager.addJSONModel(cryptoAccountsModel)
manager.addJSONModel(webAccountsModel)

const published = await manager.toPublished()
```

Using custom models: 

```js
npm install @glazed/datamodel
npm install @glazed/did-datastore
```

```js
import { DataModel } from '@glazed/datamodel'

const publishedModel = {
  schemas: {
    MySchema: 'ceramic://mySchemaURL',
  },
  definitions: {
    myDefinition: 'myDefinitionID',
  },
  tiles: {},
}

const model = new DataModel({ ceramic, model: publishedModel })

model.getSchemaURL('MySchema') // 'ceramic://mySchemaURL'
```
