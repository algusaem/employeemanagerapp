import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import {HttpErrorResponse} from '@angular/common/http';
import { NgForm }   from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees: Employee[];
  public editEmployee: Employee | null;
  public deleteEmployee: Employee | null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(){
    let loader = document.getElementById('loader-wrapper');
    this.getEmployees();
    loader!.style.display = "none";
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next : data =>{
        this.employees = data; 
      },
      error : error => {
        alert(error);
      }
    });
  }

  public searchEmployees(key: string): void{
    const results: Employee[] = [];
    for(const employee of this.employees) {
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key){
      this.getEmployees();
    }
  }

  // Función que reconoce y acciona el Modal seleccionado.
  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit'){
      this.editEmployee = employee;

      // Comprueba si el empleado es Administrador o no.
      if(this.editEmployee?.id === 1){
        button.setAttribute('data-target', '#deleteEmployeeModalAdmin');
      }else{
        button.setAttribute('data-target', '#updateEmployeeModal');
      }
    }
    if (mode === 'delete'){
      this.deleteEmployee = employee;

      // Comprueba si el empleado es Administrador o no.
      if(this.deleteEmployee?.id === 1){
        button.setAttribute('data-target', '#deleteEmployeeModalAdmin');
      }else{
        button.setAttribute('data-target', '#deleteEmployeeModal');
      }
    }
    container?.appendChild(button);
    button.click();
  }

  // Añadir Empleado
  public onAddEmployee(addForm: NgForm): void{
    document.getElementById('add-employee-form')?.click;
    this.employeeService.addEmployees(addForm.value).subscribe({
      next: data => {
        console.log(data);
        this.getEmployees();
        addForm.reset();
      },
      error: error =>{
        alert(error);
        addForm.reset();
      }
    });
  }

  // Actualizar Empleado
  public onUpdateEmployee(employee: Employee): void{
    this.employeeService.updateEmployees(employee).subscribe({
      next: data => {
        console.log(data);
        this.getEmployees();
      },
      error: error =>{
        alert(error);
      }
    });
  }

  // Borrar Empleado
  public onDeleteEmployee(employeeId: number): void{

    // Error al borrar al Administrador.
    if(employeeId === 1){
      alert("Usuario Protegido");
      return;
    }

    this.employeeService.deleteEmployees(employeeId).subscribe({
      next: data => {
        console.log(data);
        this.getEmployees();
      },
      error: error =>{
        alert(error);
      }
    });
  }

}
