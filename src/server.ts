import * as bodyParser from 'body-parser'
import cors from 'cors'
import { Server } from '@overnightjs/core'
import { Sequelize } from 'sequelize'

import { Models } from './definitions/model'
import setupModels from './models/setup'
import { AccountController } from './controllers/account'

export class BaseServer extends Server {
  constructor() {
    super()

    // Setup express before the controllers
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cors())
  }

  private setupControllers(sequelize: Sequelize, models: Models): void {
    super.addControllers([
      new AccountController({ sequelize, models })
    ])
  }

  public start(port: number): void {
    const setup = async () => {
      const { sequelize, models } = await setupModels(true)

      this.setupControllers(sequelize, models)

      this.app.listen(port, () => {
        console.log(`Ready on : http://localhost:${port}`)
      })
    }

    setup()
  }
}
