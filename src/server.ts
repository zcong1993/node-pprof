import { createServer, Server } from 'http'
import { cpuProfile, saveProfile } from './cpu'
import { takeHeapSnapshot } from './heap'

const allowPaths = ['/profile', '/heap']
let busy = false

const genFilename = (ext: string) => {
  return `${Date.now()}-${Math.floor(Math.random() * 100)}.${ext}`
}

const isNumeric = (value: any) =>
  ['string', 'number'].includes(typeof value) &&
  !isNaN(parseFloat(value)) &&
  isFinite(value as any)

const parseIntPipe = (str: string) => {
  if (!isNumeric(str)) {
    throw new Error('val should be numeric string')
  }

  return parseInt(str, 10)
}

export const createPprofServer = (
  port: number,
  maxCpuProfileSeconds: number = 60
) => {
  const server = createServer(async (req, res) => {
    const u = new URL(req.url, `http://${req.headers.host}`)

    if (!allowPaths.includes(u.pathname)) {
      res.writeHead(404)
      res.end()
      return
    }

    if (busy) {
      res.writeHead(429)
      res.end()
      return
    }

    busy = true

    try {
      if (u.pathname === '/profile') {
        const seconds = parseIntPipe(u.searchParams.get('seconds'))
        if (seconds > maxCpuProfileSeconds) {
          throw new Error(
            `seconds: ${seconds} in query should less than maxCpuProfileSeconds: ${maxCpuProfileSeconds}`
          )
        }
        const filename = genFilename('cpuprofile')
        await saveProfile(filename, await cpuProfile(seconds))
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ filename }))
      } else {
        const filename = genFilename('heapsnapshot')
        await takeHeapSnapshot(filename)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ filename }))
      }
    } catch (err) {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(500)
      res.end(JSON.stringify({ error: err.message }))
    } finally {
      busy = false
    }
  })

  return new Promise<Server>((resolve) => {
    server.listen(port, () => {
      console.log(`serve pprof on http://localhost:${port}`)
      resolve(server)
    })
  })
}
