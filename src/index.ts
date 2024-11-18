import * as express from "express"
import * as bodyParser from "body-parser"
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { RouteDefinition } from "./decorator/RouteDefinition"
import * as createError from "http-errors"
import * as cors from 'cors'

// Entity/Controller imports
import { DepartmentController } from './controllers/DepartmentController'
import { EmployeeController } from './controllers/EmployeeController'
import { ShiftController } from './controllers/ShiftController'

let corsOptions = {
    credentials: true, // allow cookies on a fetch - IF NEEDED
    origin: /localhost:\d{4,5}$/i,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: ""
}

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    app.use((req: Request, res: Response, next: NextFunction) => {
        // Authorization should provide if the user is a employee or a manager
        if((req.headers.authorization).toString().includes('MANAGER')) {
            // If the authorized user is a manager give them full privilege
            corsOptions.methods = "GET,PUT,POST,DELETE,OPTIONS"
        } else if ((req.headers.authorization).toString().includes('EMPLOYEE')) {
            // If the authorized user is a employee give them read access
            corsOptions.methods = "GET"
        } else {
            // If the user is not authorized at all do not give them access
            corsOptions.methods = ""
        }
        console.log(corsOptions? `Allowed methods based on authorization ${corsOptions.methods}`:
            'User has no authorization to the application'
        )
        next()
    })

    app.use((req, res, next) => {
        // Block any requests to unauthorized users
        if (!corsOptions.methods.includes(req.method)) {
            next(createError(403))
        }
        cors(corsOptions)(req, res, next)
    })

    app.options('*', cors(corsOptions))

    // Iterate over all our controllers and register our routes
    const controllers = [
        EmployeeController,
        DepartmentController,
        ShiftController
    ]

    controllers.forEach((controller) => {
        // This is our instantiated class
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

    // start express server
    const port  = process.env.PORT || 3004
    app.listen(port)

    console.log(`Open http://localhost:${port}/employees to see results`)

}).catch(error => console.log(error))
