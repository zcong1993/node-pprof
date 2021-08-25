import fs from 'fs'
import { Session } from 'inspector'

export const takeHeapSnapshot = async (filename: string) => {
  const stream = fs.createWriteStream(filename)
  const session = new Session()
  session.connect()

  return new Promise<void>((resolve, reject) => {
    session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
      stream.write(m.params.chunk)
    })

    session.post('HeapProfiler.takeHeapSnapshot', null, (err) => {
      if (err) reject(err)
      resolve()
    })
  }).finally(() => {
    session.disconnect()
    stream.end()
  })
}
