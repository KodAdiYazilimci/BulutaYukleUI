import { PermissionModel } from "../models/model.permission";

export class GridItemModel {
    type: number;
    id: number;
    checked: boolean = false;
    shareUrl: string;
    virtualPath: string;
    logo: string;
    name: string;
    size: string;
    createDate: string;
    modifyDate: string;

    permissions: Array<PermissionModel>;
}