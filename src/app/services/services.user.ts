import { Injectable, OnInit } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserRepository } from '../repositories/repositories.user';
import { UserGroupModel } from '../models/model.usergroup';
import { ServiceResultData } from '../models/model.serviceresult';
import { UserModel } from '../models/model.user';

@Injectable()
export class UserService implements OnInit, HttpInterceptor {

    constructor(
        private _userRepository: UserRepository
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public async getGroups(): Promise<Array<UserGroupModel>> {
        let serviceResult: ServiceResultData<Array<UserGroupModel>> = await this._userRepository.getGroups();

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }

    public async getUsers(): Promise<Array<UserModel>> {
        let serviceResult: ServiceResultData<Array<UserModel>> = await this._userRepository.getUsers();

        if (serviceResult.isSuccess == false) {
            throw new Error(serviceResult.errorMessage);
        }

        return serviceResult.resultObject;
    }
}