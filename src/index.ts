import * as express from "express"
import * as bodyParser from "body-parser"
import {NextFunction, Request, Response} from "express"
import { AppDataSource } from "./data-source"
import { RouteDefinition } from "./decorator/RouteDefinition"
import * as createError from "http-errors"
import * as cors from 'cors'

// Entity/Controller imports
import { User } from './entity/User'
import { DepartmentController } from './controllers/DepartmentController'
import { EmployeeController } from './controllers/EmployeeController'
import { ShiftController } from './controllers/ShiftController'

const corsOptions = {
    credentials: true, // allow cookies on a fetch - IF NEEDED
    origin: /localhost:\d{4,5}$/i,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET,PUT,POST,DELETE,OPTIONS"
}

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cors(corsOptions))
    app.use((req: Request, res: Response, next: NextFunction) => {
        // Authorization should provide if the user is a employee or a manager
        // YOU CAN ADD MORE RESTRICTIONS like making the X-Requested-With mandatory
        // for super secure api servers
        next()
    })

    app.options('*', cors(corsOptions))

    // Iterate over all our controllers and register our routes
    const controllers = [
        // Add other controllers here
        EmployeeController,
        DepartmentController,
        ShiftController
    ]

    controllers.forEach((controller) => {
        // This is our instantiated class
        // eslint-disable-next-line new-cap
        const instance = new controller()

        // The prefix saved to our controller
        const path = Reflect.getMetadata('path', controller)

        // Our `routes` array containing all our routes for this controller
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller)

        // Iterate over all routes and register them to our express application
        routes.forEach((route) => {
            app[route.method](path+route.param, (req:express.Request, res:express.Response,
                                                 next:express.NextFunction) => {
                const result = instance[route.action]( req, res, next );
                if (result instanceof Promise) {
                    result.then((result) => result !== null && result !== undefined ? res.send(result) :
                        next() )
                        .catch((err) => next(createError(500, err)));
                } else if (result !== null && result !== undefined) res.json(result)
            });
        });
    });

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(createError(404))
    })

    app.use((err, req, res, next) => {
        res.status(err.status || 500)
        res.json({ error: err.message, status: err.status, stack: err.stack.split(/\s{4,}/) })
    })

    // setup express app here
    // ...

    // start express server
    const port  = process.env.PORT || 3004
    app.listen(port)

    // insert new users for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Timber",
            lastName: "Saw",
            age: 27
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Phantom",
            lastName: "Assassin",
            age: 24
        })
    )

    console.log(`Open http://localhost:${port}/users to see results`)

}).catch(error => console.log(error))
