import * as express from 'express'
import * as bodyParser from 'body-parser'
import { NextFunction, Request, Response } from 'express'
import { AppDataSource } from './data-source'
import { RouteDefinition } from './decorator/RouteDefinition'
import * as createError from 'http-errors'
import * as cors from 'cors'

// Entity/Controller imports
import { DepartmentController } from './controllers/DepartmentController'
import { EmployeeController } from './controllers/EmployeeController'
import { ShiftController } from './controllers/ShiftController'
import * as path from 'node:path'
import {Employee} from "./entity/Employee";

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

    // used for looking up the user to determine their access
    const employeeRepo = AppDataSource.getRepository(Employee);

    app.use(async (req: Request, res: Response, next: NextFunction) => {

        if(!req.headers.authorization) { // this will log someone in with email and password if they have not already been logged in
            if (req.body.email && req.body.password) {
                const {email, password} = req.body;
                const user = await employeeRepo.findOneBy({email, password});
                console.log("found this user via email and password: ", user);
                if (user) {
                    // send back bearerToken and level of access
                    res.json({
                        bearerToken: user.id,
                        isManager: user.isManager
                    })
                } else { // invalid user, do nothing
                    console.log("null user");
                }
            }
        } else { // the user is already logged in and has their token
            const user = await employeeRepo.findOneBy({id: req.headers.authorization});
            console.log("found current user via bearerToken: ", user);
            corsOptions.methods = user.isManager ? "GET,PUT,POST,DELETE,OPTIONS" : "GET";
        }

        console.log(`Allowed methods based on authorization ${corsOptions.methods}, Authorization Key Used: ${req.headers.authorization}`)
        next()

    });

    app.use((req, res, next) => {
        // Block any requests to unauthorized users
        if (!corsOptions.methods.includes(req.method)) {
            next(createError(403))
        }
        cors(corsOptions)(req, res, next)
    })

    app.options('*', cors(corsOptions))

    const frontendPath = path.join(__dirname, 'frontend/dist')
    app.use(express.static(frontendPath))

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
