# bug-got-NODE_TLS_REJECT_UNAUTHORIZED

Bug reporduction for ignored NODE_TLS_REJECT_UNAUTHORIZED in got v12.5.2

```
NODE_TLS_REJECT_UNAUTHORIZED='0' node http.request.mjs
```

With `NODE_TLS_REJECT_UNAUTHORIZED='0'`, Node.js http module request method ignores TLS handshake error, e.g: request a test webserver with production webserver certificate.

In `got` v11, it works as Node.js http request.

**In `got` v12.5.2 occured an error, because NODE_TLS_REJECT_UNAUTHORIZED='0' is ignored.**

## Reproducing

1. Set package.json to `got` v11.8.5
2. `pnpm install`
3. `NODE_TLS_REJECT_UNAUTHORIZED='0' node http.request.mjs`
4. It' ok, `hello world`

Output:

```
➜ NODE_TLS_REJECT_UNAUTHORIZED='0' node http.request.mjs
(node:98836) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use `node --trace-warnings ...` to show where the warning was created)


***** Node.js http.request response *****
hello world


***** GOT response *****
hello world
```

1. Set package.json to `got` v12.5.2
2. `pnpm install`
3. `NODE_TLS_REJECT_UNAUTHORIZED='0' node http.request.mjs`
4. You got a `self signed certificate` error

Output:

```
➜ NODE_TLS_REJECT_UNAUTHORIZED='0' node http.request.mjs
(node:98108) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
(Use `node --trace-warnings ...` to show where the warning was created)


***** GOT response error *****
self signed certificate


***** Node.js http.request response *****
hello world
```
