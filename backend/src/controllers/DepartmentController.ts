import {Route} from "../decorator/Route"
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {Department} from "../entity/Department";
import {AppDataSource} from "../data-source";
import {Like, Repository} from "typeorm";
import {Controller} from "../decorator/Controller";

@Controller('/departments')
export class DepartmentController {

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
     * READ one or more department
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

            // Department name as default sort by
            const sortByField = existingColumns.includes(req.query.sort as string) ? req.query.sort as string : 'name';
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
            res.statusCode = 204 // success, no response body
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
        // create & validate
        const departmentToCreate = Object.assign(new Department(), req.body)
        const violations : ValidationError[] = await validate(departmentToCreate, this.validOptions)

        if (violations.length) { // there are errors
            res.statusCode = 422 // throw an error
            return violations
        } else {
            res.statusCode = 201 // create it if its good to go
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

        // ensure department exists & assign it to an object
        const departmentToUpdate = await this.departmentRepo.findOneBy({ id:req.params.uuid })
        Object.assign(departmentToUpdate, req.body)

        if (!departmentToUpdate) {
            next() // if you can't find it boot out to the catch-all
        } else {
            // validate & save if possible
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