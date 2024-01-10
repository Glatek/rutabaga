# @glatek/rutabaga

![Rutabaga Logo](https://i.imgur.com/0eOAq3T.png)

JSON Schema-backed CRUD operations in Service Workers with IndexedDB.

## Description

That short intro is a mouth full. This project takes JSON Schema definitions and:

- Creates API routes for CRUD
- Generates HTML forms
- Stores the data in IndexedDB via Dexie.JS

```mermaid
sequenceDiagram
    participant A as App
    participant S as ServiceWorker
    participant D as IndexedDB
    critical CREATE | POST /api/:table
        A->>S: Request
        S->>D: read
        D-->>S: read success
        S-->>A: Response
    end
    critical READ | GET /api/:table
        A->>S: Request
        S->>D: write
        D-->>S: write success
        S-->>A: Response
    end
    critical UPDATE | PUT /api/:table
        A->>S: Request
        S->>D: update
        D-->>S: update success
        S-->>A: Response
    end
    critical DELETE | DELETE /api/:table
        A->>S: Request
        S->>D: delete
        D-->>S: delete success
        S-->>A: Response
    end
```

## Usage

Coming soon...
