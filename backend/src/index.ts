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

    const employeeRepo = AppDataSource.getRepository(Employee);
    app.use(async (req: Request, res: Response, next: NextFunction) => {
        // new login, find emp by email & pwd
        if(!req.headers.authorization) {
            if (req.body.email && req.body.password) {
                const {email, password} = req.body;
                const user = await employeeRepo.findOneBy({email, password});
                if (user) { // send back bearerToken & level of access if match is found
                    res.json({
                        bearerToken: user.id,
                        isManager: user.isManager
                    })
                } else { // invalid user, do nothing
                    console.log("null user");
                }
            }
        // already logged in, find emp by bearerToken
        } else {
            const user = await employeeRepo.findOneBy({id: req.headers.authorization});
            if (user) {
                corsOptions.methods = user.isManager ? "GET,PUT,POST,DELETE,OPTIONS" : "GET";
            }
        }
        console.log(`Allowed methods based on authorization ${corsOptions.methods}, Authorization Key Used: ${req.headers.authorization}`)
        next()
    });

    // Block any requests by unauthorized users
    app.use((req, res, next) => {
        if (!corsOptions.methods.includes(req.method)) {
            next(createError(403))
        }
        cors(corsOptions)(req, res, next)
    })

    // config
    app.options('*', cors(corsOptions)) // set the cors options we decided on
    const frontendPath = path.join(__dirname, 'frontend/dist')
    app.use(express.static(frontendPath))

    // Iterate over all our controllers and register our routes
    const controllers = [
        EmployeeController,
        DepartmentController,
        ShiftController
    ]
    controllers.forEach((controller) => {
        const instance = new controller()
        const path = Reflect.getMetadata('path', controller)
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller)
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

    // display errors if encountered
    app.use((err, req, res, next) => {
        res.status(err.status || 500)
        res.json({ error: err.message, status: err.status, stack: err.stack.split(/\s{4,}/) })
    })

    // start express server
    const port  = process.env.PORT || 3004
    app.listen(port)
    console.log(`Open http://localhost:${port}/employees to see results`)

}).catch(error => console.log(error))