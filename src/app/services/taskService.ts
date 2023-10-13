import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, finalize, map, retry } from "rxjs/operators";
import { RequestResultModel } from "../models/RequestResultModel";
import { TaskModel, Token, User } from "../models/TaskModel";


@Injectable({
    providedIn: "root",
})
export class taskService {
    constructor(private http: HttpClient) { }

    URL_Str = 'https://localhost:7109/api/';

    
    getToken(user: User) {
        return this.http.post<Token>(this.URL_Str + "Autentication/Validate", user);
    }

    getTaskList(token:string) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })


        return this.http.get<RequestResultModel<TaskModel[]>>(this.URL_Str + "Task/Get", { headers: headers });
    }

    saveTask(objDto: TaskModel,token:string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })

        return this.http.post<RequestResultModel<TaskModel>>(this.URL_Str + "Task/Create", objDto, { headers: headers });
    }

    editTask(objDto: TaskModel,token:string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })

        objDto.state = objDto.state == "C" ? "Completado" : objDto.state == "E"? "En progreso" : objDto.state == "P" ? 'Pendiente' : 'Pendiente';
        return this.http.post<RequestResultModel<TaskModel>>(this.URL_Str + "Task/Edit", objDto, { headers: headers });
    }

    deleteTask(objDto: TaskModel,token:string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })

        return this.http.post<RequestResultModel<TaskModel>>(this.URL_Str + "Task/Delete", objDto, { headers: headers });
    }
}
