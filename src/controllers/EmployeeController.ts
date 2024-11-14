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

    /**
     * READ one employee
     * @param req - the HTTP request
     * @param res - the HTTP response
     * @param next - callback function
     */
    @Route('get', '/:uuid*?') // *? makes the param optional
    async read(req: Request, res: Response, next: NextFunction) {
        if (req.params.uuid) {
            return this.employeeRepo.findOneBy({id: req.params.uuid});
        } else {
            const findOptions = { where: [], order: {} };
            const existingColumns = this.employeeRepo.metadata.ownColumns.map(c => c.propertyName);

            const sortByField = existingColumns.includes(req.query.sort as string) ? req.query.sort as string : 'id';
            const sortDirection = req.query.sortorder ? "DESC" : "ASC";
            findOptions.order[sortByField] = sortDirection;
            console.log('Order Clause: \n', findOptions.order);

            if (req.query.search) { // only add the where clauses if the search query exists
                for (const columnName of existingColumns) {
                    findOptions.where.push({ [columnName]: Like(`%${req.query.search}%`) });
                }
            }
            console.log('Where Clause: ', findOptions.where);
            return this.employeeRepo.find(findOptions); // returns all if there are no other options specified
        }
    }

    /**
     * DELETE for one employee
     * @param req - The HTTP request
     * @param res - The HTTP response
     * @param next - callback function
     */
    @Route('delete', '/:uuid') // param is required
    async delete(req: Request, res: Response, next: NextFunction) {
        if (await this.employeeRepo.existsBy({ id: req.params.uuid })) {
            await this.employeeRepo.delete({ id: req.params.uuid })
            return ''
            res.statusCode = 204 // Success "no content"
        } else {
            next(); // let the catchall in index.ts handle the 404
        }
    }

    /**
     * CREATE Employee
     * @param req - the HTTP request
     * @param res - the HTTP response
     * @param next - callback function
     */
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

        // ensure employee exists
        const employeeToUpdate = await this.employeeRepo.findOneBy({ id:req.params.uuid })
        Object.assign(employeeToUpdate, req.body)

        // update the employee
        if (!employeeToUpdate) {
            next() // gets caught by the UMBRELLA code in index.ts to thorugh a 404
        } else {
            // validate & save
            const violations : ValidationError[] = await validate(employeeToUpdate, this.validOptions)
            if (violations.length) {
                res.statusCode = 422 // Unprocessable Content
                return violations
            } else {
                return this.employeeRepo.update(req.params.uuid, employeeToUpdate)
            }
        }
    }
}