import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmEventType, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { RequestResultModel } from 'src/app/models/RequestResultModel';
import { ResponseModelTask } from 'src/app/models/ResponseModel';
import { StateModel, TaskModel, Token, User } from 'src/app/models/TaskModel';
import { taskService } from 'src/app/services/taskService';
import { stateService } from 'src/app/services/stateService';
import { ActionsEnum } from 'src/app/models/EnumActions';

@Component({
  selector: 'ta-app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  taskList: TaskModel[] = [];
  taskModel: TaskModel;
  openDialog: boolean = false;
  isEditTask: boolean = false;
  isAdd: boolean = false;
  token: string="";
  user: User =new User;
  @ViewChild('dt') dt: any;
  


  constructor(private taskService: taskService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private stateService: stateService) {
    this.taskModel = new TaskModel();
  }

  ngOnInit(): void {   
     this.GetToken(this.user);    
  }

  
  
  GetToken= (user: User) => {
    
    this.taskService.getToken(user).subscribe((response: Token) => {

      if (!response) return;

      this.token =response.token;

      this.getTaskList(this.token)
    });
  }

  getTaskList = (token:string) => {
    this.taskService.getTaskList(token).subscribe((response: RequestResultModel<TaskModel[]>) => {

      this.taskList = (response.result || []);
    });
  }

  getStatus = (status: string) => {
    const first = status.substring(0, 1).toUpperCase();
    switch (first) {
      case "C":
        return "success"
        break;

      case "E":
        return "warning"
        break;

      case "P":
        return "danger"
        break;

      default:
        return "danger"
        break;
    }
  }

  addTask = () => {
    this.openDialog = true;
    this.isAdd = true;
    this.isEditTask = false;
    this.taskModel = new TaskModel();
  }

  editTask = (task: TaskModel) => {
    this.openDialog = true;
    this.isAdd = false;
    this.isEditTask = true;
    this.taskModel = task;
  }

  deleteTask = (task: TaskModel) => {
    this.taskService.deleteTask(task,this.token ).subscribe((response: RequestResultModel<TaskModel>) => {
      if (!response) return;

      const state = new StateModel();
      state.key = task.id.toString();
      state.action = ActionsEnum.DELETE;
      state.value = task;

      this.stateService.deleteData(state);

      this.getTaskList(this.token);

      this.messageService.add({
        severity: response.isSuccessful ? 'success' : 'error',
        summary: response.isSuccessful ? 'Completado' : 'error',
        detail: response.isSuccessful ? `Se ha eliminado la tarea ${task.title}` : response.errorMessage,
        life: 3000
      });
    });
  }

  hideDialog = (event: ResponseModelTask) => {
    if (event == null) return;

    this.getTaskList(this.token);
    this.openDialog = (event.openDialog || false);
  }


  deleteTaskConfirm(data: TaskModel) {

    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const { id } = data;
        this.deleteTask(data);
        this.taskModel = new TaskModel();
      },
    });
  }

  applyFilterGlobal = ($event: any, stringVal: string) => {

    const obj = this.dt.filter(($event.target as HTMLInputElement).value, 'dev', stringVal);
    return obj;
  }

}
