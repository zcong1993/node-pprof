# node-pprof

[![NPM version](https://img.shields.io/npm/v/@zcong/node-pprof.svg?style=flat)](https://npmjs.com/package/@zcong/node-pprof)
[![NPM downloads](https://img.shields.io/npm/dm/@zcong/node-pprof.svg?style=flat)](https://npmjs.com/package/@zcong/node-pprof)

<!-- [![codecov](https://codecov.io/gh/zcong1993/node-pprof/branch/master/graph/badge.svg)](https://codecov.io/gh/zcong1993/node-pprof) -->

> profiling cpu or take a heap snapshot like go tool pprof

## Why

Although `node --inspect` works well enough, but in real world memory leaks or cpu burst happen in production, it's not easy to use node --inpect in a production machine or pod, and it's difficult to simulate real production traffic locally.

## Install

```bash
$ yarn add @zcong/node-pprof -D
# or npm
$ npm i @zcong/node-pprof -D
```

## Usage

**NOTE** A profiler needs to use CPU to work and it collects data into memory. The longer you let it run and the more CPU / memory it will need. This is why you should begin with very short CPU profiling, no more than a few seconds between the start and stop command. So we use a parameter to limit the maximum cpu profile time(aka maxCpuProfileSeconds).

**NOTE2** This package will not work when you use `ts-node`.

### Register (Recommend)

```bash
export PPROF_PORT=9393 # tiny http server port, default 9393
export PPROF_MAX_SECONDS=60 # maxCpuProfileSeconds, default 60

node -r @zcong/node-pprof/register ./your-server.js

# profiling cpu
curl 'localhost:9393/profile?seconds=30'
# {"filename":"1629883324898-68.cpuprofile"}

# take a heap snapshot

curl 'localhost:9393/heap'
# {"filename":"1629883486011-44.heapsnapshot"}
```

### Programmatic

```js
// your-server.js
const { createPprofServer } = require('@zcong/node-pprof')
createPprofServer(9393, 60)

// your code
```

## License

MIT &copy; zcong1993
