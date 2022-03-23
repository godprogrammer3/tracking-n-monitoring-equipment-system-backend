import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { Role } from 'src/users/entities/role.entity';
import { Roles } from 'src/users/roles.decorator';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { RolesGuard } from './roles.guard';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @Post('/createDepartment')
  create(@Request() req , @Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto, req.actor );
  }

  @Get()
  findAll() {
    return this.departmentService.viewAll();
  }

  @Get('viewDepartment/:id')
  findOne(@Param('id') ids: string) {
    return this.departmentService.viewDepartment(ids);
  }

  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @Patch('updateDepartment/:id')
  update(@Request() req, @Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto, req.actor.id);
  }

  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @Delete('removeDepartment/:id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
