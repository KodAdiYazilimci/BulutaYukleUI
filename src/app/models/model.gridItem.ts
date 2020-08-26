import { PermissionModel } from "../models/model.permission";

export class GridItemModel {
    itemType: number;
    itemId: number;
    checked: boolean;
    shareUrl: string;
    virtualPath: string;
    logo: string;
    name: string;
    size: string;
    createDate: string;
    updateDate: string;

    permissions: Array<PermissionModel>;
}