import {Route} from "../decorator/Route"
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {Employee} from "../entity/Employee";
import {AppDataSource} from "../data-source";
import {Like, Repository} from "typeorm";
import {Controller} from "../decorator/Controller";

@Controller('/employees')
export class EmployeeController {

    // make a connection to the DB using a repository to only the student table
    employeeRepo: Repository<Employee> = AppDataSource.getRepository(Employee);

    validOptions : ValidatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        validationError: {
            target: false,
            value: false
        },
    }

    // CRUD - create, read, update, and delete
    @Route('get', '/:uuid*?') // *? makes the param optional
    async read(req: Request, res: Response, next: NextFunction) {
        if (req.params.uuid) {
            return this.employeeRepo.findOneBy({id: req.params.uuid})
        } else {
            // use js to build the findOptions for sorting and searching
            // looks like this {where: {lowMoneyDefCon: 3}, order: {favHardDrink: "ASC"}}
            const findOptions = {where: [], order:{}}
            const existingColumns = this.employeeRepo.metadata.ownColumns.map(c => c.propertyName)

            // const sortByField = existingColumns.includes(req.query.mixology)? req.query.mixology : 'id' // if not sort then use default of id
            // const sortDirection = req.query.sortorder? "DESC" : "ASC"
            // findOptions.order[sortByField] = sortDirection
            // console.log('Order Clause: \n', findOptions.order)

            if (req.query.trouve) { // obly add the where clauses if the search query exists
                for (const  columnName of existingColumns) {
                    // sytactic sugar - when creating a JS object wiht a dynamic property name use [ ]
                    findOptions.where.push({ [columnName]: Like(`%${req.query.trouve}%`) })
                }
            }
            console.log('Where Clause: ', findOptions.where)
            return this.employeeRepo.find(findOptions); // returns all if there are no other options specified
        }
    }

    @Route('delete', '/:uuid') // param is required
    async delete(req: Request, res: Response, next: NextFunction) {
        if (await this.employeeRepo.existsBy({ id: req.params.uuid })) {
            await this.employeeRepo.delete({ id: req.params.uuid })
            return ''
            res.statusCode = 204 // Success "no content" don't send any content or browser will complain
        } else {
            next(); // let the catchall in index.ts handle the 404
        }
    }

    @Route('post')
    async create(req: Request, res: Response, next: NextFunction) {
        // copy the data we want into the object with all the rules
        const employeeToAdd = Object.assign(new Employee(), req.body)

        // validate the student with all the data and the rules
        const violations : ValidationError[] = await validate(employeeToAdd, this.validOptions);

        if (violations.length) { // there are errors
            res.statusCode = 422 // unprocessable content
            return violations // these are still ugly - should be cleaned up for teammates
        } else {
            res.statusCode = 201 // created
            return this.employeeRepo.insert(employeeToAdd)
        }
    }

    @Route('put', '/:uuid')
    async update (req: Request, res: Response, next: NextFunction) {
        // to optimize the processor cycles do simple checks first - id. before calling the db
        // if (req.params.uuid != req.body.id) {
        //     next()
        // }

        // ensure student exists
        const studentToUpdate = await this.employeeRepo.findOneBy({ id:req.params.uuid })

        // NO NEED for OBJECT.assign since the repo will return a student object -already has rules
        Object.assign(studentToUpdate, req.body)

        // update the student
        if (!studentToUpdate) {
            next() // gets caught by the UMBRELLA code in index.ts to thorugh a 404
        } else {
            //WHENEVER YOU SAVE/UPDATE - VALIDATE
            const violations : ValidationError[] = await validate(studentToUpdate, this.validOptions)
            if (violations.length) {
                res.statusCode = 422 // Unprocessable Content
                return violations
            } else {
                return this.employeeRepo.update(req.params.uuid, studentToUpdate)
            }
        }
    }
}