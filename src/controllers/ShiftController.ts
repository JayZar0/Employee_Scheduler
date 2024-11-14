import {Route} from "../decorator/Route"
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {Shift} from "../entity/Shift";
import {AppDataSource} from "../data-source";
import {Like, Repository} from "typeorm";
import {Controller} from "../decorator/Controller";
import { ShiftDTO } from "../entity/ShiftDTO";
import {Employee} from "../entity/Employee";
import {Department} from "../entity/Department";

@Controller('/shifts')
export class ShiftController {

    shiftRepo: Repository<Shift> = AppDataSource.getRepository(Shift);

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
     * READ one or more shifts
     * @param req
     * @param res
     * @param next
     */
    @Route('get', '/:uuid*?') // *? makes the param optional
    async read(req: Request, res: Response, next: NextFunction) {
        if (req.params.uuid) {
            return this.shiftRepo.findOneBy({id: req.params.uuid})
        } else {
            // use js to build the findOptions for sorting and searching
            // looks like this {where: {lowMoneyDefCon: 3}, order: {favHardDrink: "ASC"}}
            const findOptions = {where: [], order:{}}
            const existingColumns = this.shiftRepo.metadata.ownColumns.map(c => c.propertyName)

            const sortByField = existingColumns.includes(req.query.sort as string) ? req.query.sort as string : 'id';
            const sortDirection = req.query.sortorder ? "DESC" : "ASC";
            findOptions.order[sortByField] = sortDirection;
            console.log('Order Clause: \n', findOptions.order);

            if (req.query.search) { // only add the where clauses if the search query exists
                for (const columnName of existingColumns) {
                    findOptions.where.push({ [columnName]: Like(`%${req.query.search}%`) });
                }
            }

            console.log('Where Clause: ', findOptions.where)
            return this.shiftRepo.find(findOptions); // returns all if there are no other options specified
        }
    }

    /**
     * DELETE an existing shift
     * @param req
     * @param res
     * @param next
     */
    @Route('delete', '/:uuid') // param is required
    async delete(req: Request, res: Response, next: NextFunction) {
        if (await this.shiftRepo.existsBy({ id: req.params.uuid })) {
            await this.shiftRepo.delete({ id: req.params.uuid })
            return ''
            res.statusCode = 204 // Success "no content" don't send any content or browser will complain
        } else {
            next(); // let the catchall in index.ts handle the 404
        }
    }

    /**
     * CREATE a new shift
     * @param req
     * @param res
     * @param next
     */
    @Route('post')
    async create(req: Request, res: Response, next: NextFunction) {
        console.log('Request Body:', req.body); // Debugging

        const shiftDTO = Object.assign(new ShiftDTO(), req.body);

        const violations: ValidationError[] = await validate(shiftDTO, this.validOptions);

        if (violations.length) {
            res.statusCode = 422;
            return res.json(violations);
        } else {
            const shiftToInsert = new Shift();
            shiftToInsert.workedBy = await this.shiftRepo.manager.findOne(Employee, { where: { id: shiftDTO.employeeID } });
            shiftToInsert.department = await this.shiftRepo.manager.findOne(Department, { where: { id: shiftDTO.departmentID } });
            shiftToInsert.startHour = shiftDTO.startHour;
            shiftToInsert.endHour = shiftDTO.endHour;

            res.statusCode = 201;
            return res.json(await this.shiftRepo.insert(shiftToInsert));
        }
    }

    /**
     * UPDATE an existing shift
     * @param req
     * @param res
     * @param next
     */
    @Route('put', '/:uuid')
    async update (req: Request, res: Response, next: NextFunction) {

        // ensure shift exists
        const shiftToAssign = await this.shiftRepo.findOneBy({ id:req.params.uuid })
        Object.assign(shiftToAssign, req.body)

        // update the shift
        if (!shiftToAssign) {
            next() // gets caught by the UMBRELLA code in index.ts to thorugh a 404
        } else {
            // validate & save
            const violations : ValidationError[] = await validate(shiftToAssign, this.validOptions)
            if (violations.length) {
                res.statusCode = 422 // Unprocessable Content
                return violations
            } else {
                return this.shiftRepo.update(req.params.uuid, shiftToAssign)
            }
        }
    }
}