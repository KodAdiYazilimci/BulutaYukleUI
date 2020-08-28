import { Injectable, OnInit } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationRepository } from '../repositories/repositories.authentication';
import { TokenModel } from '../models/model.token';
import { ServiceResultData } from '../models/model.serviceresult';

@Injectable()
export class AuthenticationService implements OnInit, HttpInterceptor {

    constructor(private _authenticationRepository: AuthenticationRepository) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            return throwError(error);
        }));
    }

    ngOnInit(): void { }

    public async login(email: string, password: string, region: string): Promise<boolean> {
        let serviceResult: ServiceResultData<TokenModel> = await this._authenticationRepository.getToken(email, password, region);

        if (serviceResult.isSuccess && serviceResult.resultObject.token.length > 0) {
            localStorage.setItem("token", serviceResult.resultObject.token);
            return true;
        }

        return false;
    }
}