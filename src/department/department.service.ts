import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { getResponse } from 'src/utils/response';
import { In, Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private deptRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, actorId) {
    const dept = await this.deptRepository.create({
      dept_name: createDepartmentDto.dept_name,
      created_by: actorId
    })
    const result = await this.deptRepository.save(dept);
    throw new HttpException(getResponse('00', result) , HttpStatus.OK);
  }

 async viewAll() {
    const result = await this.deptRepository.find({
      relations: ['created_by', 'updated_by'],
    });
    throw new HttpException(getResponse('00', result) , HttpStatus.OK);
  }

  async viewDepartment(ids: string) {
    const convertIdsToNum = ids.split(',').map(Number);
    const result = await this.deptRepository.find({
      where: {
        id: In(convertIdsToNum),
      },
      relations: ['created_by','updated_by']
    })
    throw new HttpException(getResponse('00', result) , HttpStatus.OK);
  }

  async findById(id: number) {
    const result = await this.deptRepository.findOne(id);
    throw new HttpException(getResponse('00', result), HttpStatus.OK);
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto, actocId) {
    const result = await this.deptRepository.save({
      dept_name: updateDepartmentDto.dept_name,
      id: Number(id), 
      updated_by: actocId
    })
    throw new HttpException(getResponse('00', result), HttpStatus.OK);
  }

  remove(id: number) {
    this.deptRepository.delete(id);
    throw new HttpException(getResponse('00', null), HttpStatus.OK);
  }
}
