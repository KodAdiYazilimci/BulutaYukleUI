import { PermissionTypeModel } from "../models/model.permissiontype";

export class PermissionModel {
    id: number;
    logo: string;
    name: string;
    userId: number;
    groupId: number;
    fileId: number;
    folderId: number;
    diskId: number;
    permissionTypeId: number;

    groups: Array<PermissionModel>;
    users: Array<PermissionModel>;
    solidPermissions: PermissionModel;
    permissionType: Array<PermissionTypeModel>;
}