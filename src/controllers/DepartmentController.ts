import {Route} from "../decorator/Route"
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {Department} from "../entity/Department";
import {AppDataSource} from "../data-source";
import {Like, Repository} from "typeorm";
import {Controller} from "../decorator/Controller";

@Controller('/departments')
export class DepartmentController {

    // make a connection to the DB using a repository to only the student table
    departmentRepo: Repository<Department> = AppDataSource.getRepository(Department);

    validOptions : ValidatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        validationError: {
            target: false,
            value: false
        }
    }

    /**
     * READ one department
     * @param req - the HTTP request
     * @param res - the HTTP response
     * @param next - callback function
     */
    @Route('get', '/:uuid*?') // *? makes the param optional
    async read(req: Request, res: Response, next: NextFunction) {
        if (req.params.uuid) {
            return this.departmentRepo.findOneBy({id: req.params.uuid})
        } else {
            const findOptions = {where: [], order:{}}
            const existingColumns = this.departmentRepo.metadata.ownColumns.map(c => c.propertyName)

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
            return this.departmentRepo.find(findOptions); // returns all if there are no other options specified
        }
    }

    /**
     * DELETE one department
     * @param req - the HTTP request
     * @param res - the HTTP response
     * @param next - callback function
     */
    @Route('delete', '/:uuid') // param is required
    async delete(req: Request, res: Response, next: NextFunction) {
        if (await this.departmentRepo.existsBy({ id: req.params.uuid })) {
            await this.departmentRepo.delete({ id: req.params.uuid })
            return ''
            res.statusCode = 204 // success no content
        } else {
            next(); // let the catchall in index.ts handle the 404
        }
    }

    /**
     * CREATE a new department
     * @param req - the HTTP request
     * @param res - the HTTP response
     * @param next - callback function
     */
    @Route('post')
    async create(req: Request, res: Response, next: NextFunction) {
        // copy the data we want into the object with all the rules
        const departmentToCreate = Object.assign(new Department(), req.body)
        // validate the department with all the data and the rules
        const violations : ValidationError[] = await validate(departmentToCreate, this.validOptions)
        if (violations.length) { // there are errors
            res.statusCode = 422 // unprocessable content
            return violations
        } else {
            res.statusCode = 201 // created
            return this.departmentRepo.insert(departmentToCreate)
        }
    }

    /**
     * UPDATE an existing department
     * @param req - the HTTP request
     * @param res - the HTTP response
     * @param next - callback function
     */
    @Route('put', '/:uuid')
    async update (req: Request, res: Response, next: NextFunction) {
        // ensure department exists
        const departmentToUpdate = await this.departmentRepo.findOneBy({ id:req.params.uuid })
        Object.assign(departmentToUpdate, req.body)
        // update the department
        if (!departmentToUpdate) {
            next() // gets caught by the UMBRELLA code in index.ts to a 404
        } else {
            // validate & save
            const violations : ValidationError[] = await validate(departmentToUpdate, this.validOptions)
            if (violations.length) {
                res.statusCode = 422
                return violations
            } else {
                return this.departmentRepo.update(req.params.uuid, departmentToUpdate)
            }
        }
    }
}