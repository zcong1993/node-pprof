import fs from 'fs'
import { Profiler, Session } from 'inspector'

export const cpuProfile = async (seconds: number) => {
  const session = new Session()
  session.connect()

  return new Promise<Profiler.Profile>((resolve, reject) => {
    session.post('Profiler.enable', (err) => {
      if (err) reject(err)

      session.post('Profiler.start', (err) => {
        if (err) reject(err)

        setTimeout(() => {
          session.post('Profiler.stop', (err, res) => {
            if (err) reject(err)

            resolve(res.profile)
          })
        }, seconds * 1000)
      })
    })
  }).finally(() => session.disconnect())
}

export const saveProfile = async (
  filename: string,
  profile: Profiler.Profile
) => {
  return fs.promises.writeFile(filename, JSON.stringify(profile))
}
