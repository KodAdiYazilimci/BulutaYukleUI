export class ServiceResult {
    isSuccess: boolean;
    errorMessage: string;
}

export class ServiceResultData<T> extends ServiceResult {
    resultObject: T
}