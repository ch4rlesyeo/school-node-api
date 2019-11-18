import { BaseServer } from './server'

const port = 3000
const apiServer = new BaseServer()

apiServer.start(port)
