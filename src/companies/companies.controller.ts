import express, { NextFunction } from 'express';
import { RequestUser } from '../common/interfaces/requestUser.interface';
import { CompaniesDto } from './companies.dto';
import { CompaniesService } from './companies.service';

/**
 * Controller class for handling requests related to companies.
 */
export class CompaniesController {
  private companiesService: CompaniesService;

  constructor() {
    this.companiesService = new CompaniesService();
  }

  /**
   * Creates a new company using the provided request body and sends the created company as a response.
   * @param {RequestUser} req - The request object containing the company data in the request body.
   * @param {express.Response} res - The response object to send the created company as a response.
   * @param {NextFunction} next - The next function to call if there is an error.
   * @returns None
   * @throws {Error} If there is an error creating the company or if the request body is invalid.
   */
  public async create(req: RequestUser, res: express.Response, next: NextFunction) {
    try {
      const companyDto: CompaniesDto = new CompaniesDto({ ...req.body });

      await companyDto.validate(companyDto);

      const companyCreated: CompaniesDto = await this.companiesService.create(companyDto);

      res.send(companyCreated);
    } catch (error) {
      next(error);
    }
  }
}
