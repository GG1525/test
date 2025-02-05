declare module "modules/ModuleBase" {
    import SdkBase from "libs/SdkBase";
    export type IModules<T extends SdkBase = SdkBase> = {
        [key: string]: T;
    };
    export type ModuleBase<T = IModules> = {
        modules: T;
    } & SdkBase;
}
declare module "libs/ExtensionBase" {
    import SdkBase from "libs/SdkBase";
    export default abstract class ExtensionBase {
        protected sdk: SdkBase;
        protected config: unknown;
        private initialization;
        constructor(sdk: SdkBase);
        /**
         * 是否具备拓展调用权限
         */
        abstract getPermission(): Promise<void>;
        init(): Promise<void>;
    }
}
declare module "extensions/company/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise } from "@ecis/request/node_modules/axios";
    export type CompInfo = {
        attrName: string;
        attrValue: string;
    };
    export type CompanyParam = {
        compDisplay?: string[];
        roleIds?: number[];
    };
    export type PersonalSpace = {
        account: string;
        creator: {
            avatar: string;
            id: number;
            name: string;
        };
        department: {
            abs_path: string;
            name: string;
        }[];
        email: string;
        groupid: number;
        total: number;
        used: number;
    };
    export type GroupsSpace = {
        creator: {
            avatar: string;
            id: number;
            name: string;
        };
        group_name: string;
        group_type: string;
        groupid: number;
        total: number;
        used: number;
    };
    export type CompaniesInfo = {
        id: number;
        name: string;
        phone: string;
        ctype: string;
        status: string;
        ctime: number;
        logo: string;
        domain: string;
        file_corp_icon: string;
        is_default_icon: boolean;
    };
    export type GroupInfo = {
        id: number;
        applyid: number;
        corpid: number;
        name: string;
        type: string;
        ctime: number;
        mtime: number;
        creator: {
            id: number;
            name: string;
            avatar: string;
            corpid: number;
        };
        user_role: string;
        secure: boolean;
        group_type: string;
        admin_file_perm: boolean;
        forbid_flag: boolean;
    };
    /**
     * 用户激活状态
     * @source
     */
    export type MemberStatus = "active" | "notactive" | "disabled";
    /**
     * 团队成员信息
     * @source
     */
    export type MemberInfo = {
        account: string;
        avatar: string;
        city: string;
        comp_uid: string;
        country: string;
        depts: any;
        email: string;
        employer: string;
        employment_status: string;
        employment_type: string;
        gender: string;
        leader: string;
        name: string;
        phone: string;
        role_id: number;
        source: string;
        status: MemberStatus;
        third_union_id: string;
        title: string;
        user_id: number;
        work_place: string;
    };
    /**
     * 企业 拓展模块
     * @source
     * @example await sdk.company.getCompanys({ comp_display: ["active"], role_ids: [1,2,3] })
     */
    export default class CompanyExtenssion extends ExtensionBase {
        /**
         * 是否具备权限
         * @returns
         */
        getPermission(): Promise<void>;
        /**
         * 获取所有企业
         * @param compDisplay 默认仅查询激活公司，其余参数（禁用："disabled"；激活："active"）
         * @param roleIds 默认所有成员，其余参数（创建者："1"；管理员："2"；普通成员："3"）
         * @returns
         */
        getCompanys(params?: CompanyParam): AxiosPromise<{
            companies: CompaniesInfo[];
            result: string;
        }>;
        /**
         * 获取企业中用户信息
         * @param companyId 企业ID(如果不传则为默认)
         * @returns
         */
        getCompanyUserInfo(companyId?: string): AxiosPromise<{
            atime: number;
            avatar: string;
            comp_id: number;
            comp_uid: string;
            def_dept_id: string;
            login_name: string;
            roleid: string;
            status: string;
            user_name: string;
            userid: number;
        }>;
        /**
         * 获取企业详细信息
         * @param companyId 企业id
         * @returns
         */
        getCompanyDetail(companyId: string): AxiosPromise<{
            address: string;
            creator: number;
            ctime: number;
            ctype: string;
            domain: string;
            email: string;
            id: number;
            industry_type: string;
            industry_type_code: string;
            logo: string;
            name: string;
            phone: string;
            scale: number;
            status: string;
            wire_phone: string;
        }>;
        /**
         * 修改企业信息(注：仅超管有权限修改)
         * @param companyId 企业id
         * @param companyInfo 企业信息
         * @returns
         */
        updateCompanyInfo(companyId: string, companyInfo: CompInfo): AxiosPromise<{
            result: string;
        }>;
        /**
         * 个人空间设置获取加检索接口
         * @param companyId 企业id
         * @param offset 分页获取成员列表初始值
         * @param limit 数量
         * @param name 姓名
         * @returns
         */
        getPersonalSpace(companyId: string, offset?: number, limit?: number, name?: string): AxiosPromise<{
            groups: PersonalSpace[];
            result: string;
            total: number;
        }>;
        /**
         * 团队空间设置获取加检索接口
         * @param companyId 企业id
         * @param offset 分页获取成员列表初始值
         * @param limit 数量
         * @param groupType 团队类型 "corpdep" 部门团队 | "corpnormal" 普通团队
         * @param name 团队名称
         * @returns
         */
        getGroupsSpace(companyId: string, offset: number, limit: number, groupType: "corpdep" | "corpnormal", groupName?: string): AxiosPromise<{
            groups: GroupsSpace[];
            result: string;
            total: number;
        }>;
        /**
         * 当前用户的组织架构
         * @param companyId 企业id
         * @param userId 用户id
         * @returns
         */
        getUserPlain(companyId: string, userId: string): AxiosPromise<{
            depts: {
                abs_path: string;
            }[];
            email: string;
        }>;
        /**
         * 获取筛选后的团队成员信息
         * @param companyId 企业id
         * @param departId 部门id
         * @param status 成员激活状态：未激活 | 已激活 | 禁用
         * @param recursive 当前部门成员 -> false | 当前部门及子部门成员 -> true
         * @param offset 分页获取成员列表初始值
         * @param limit 分页数量上限，最大值为1000
         * @returns
         */
        getCompanyDepartmentInfo(companyId: number, departId: string, status: MemberStatus[], recursive: boolean, offset?: number, limit?: number): AxiosPromise<{
            max_deptmember_num: number;
            next_comp_uid: string;
            total: number;
            users: MemberInfo[];
        }>;
        /**
         * 获取团队列表
         * @param companyId 企业id
         * @param offset 分页偏移量
         * @param count 每页的个数,最大500
         * @returns
         */
        getCompanyGroups(companyId: number, offset?: number, count?: number): AxiosPromise<GroupInfo[]>;
        /**
         * 获取我的文档备份文档信息
         * @param companyId 企业id
         * @returns
         */
        getMyDocumentInfo(companyId: number): AxiosPromise<{
            groups: {
                company_id: number;
                group_id: number;
                name: string;
                type: string;
            }[];
        }>;
    }
}
declare module "extensions/file/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise } from "@ecis/request/node_modules/axios";
    export type LinkInfo = {
        sid: string;
        link_permission: string;
        groupid: number;
        group_corpid: number;
        fileid: number;
        status: string;
        expire_time: number;
        download_perm: number;
        expire_period: number;
        ranges: string;
        link_url: string;
        creator: creator;
    };
    export type creator = {
        id: number;
        name: string;
        avatar: string;
        corpid: number;
    };
    export type FileParam = {
        with_clink?: boolean;
        with_corp_file_flag?: boolean;
        v?: string | number;
        [k: string]: unknown;
    };
    export type FileDownloadInfo = {
        url: string;
        sha1: string;
        store: string;
        md5: string;
    };
    export type UserAcl = {
        comment: number;
        copy: number;
        delete: number;
        download: number;
        history: number;
        manage_perm: number;
        move: number;
        new_empty: number;
        read: number;
        rename: number;
        saveas: number;
        secret: number;
        share: number;
        update: number;
        upload: number;
    };
    export type LinkUserAcl = {
        copy: number;
        delete: number;
        download: number;
        history: number;
        move: number;
        new_empty: number;
        read: number;
        rename: number;
        secret: number;
        share: number;
        update: number;
        upload: number;
    };
    export type FileMetadata = {
        file_acl: {
            modify: string;
        };
        fileinfo: {
            fileid: number;
            groupid: number;
            parentid: number;
            fname: string;
            fsize: number;
            fsha: string;
            ftype: string;
            fver: number;
            mtime: number;
            user_nickname: string;
        };
        result: string;
        user_acl: UserAcl;
    };
    export type UpdateLinkInfo = {
        range?: string;
        period?: number;
        permission?: string;
        sid: string;
        clink?: boolean;
        status?: string;
        ext_perm_list?: string[];
    };
    export type UpdateLinkInfoResponse = {
        corpid: number;
        creator: creator;
        ctime: number;
        deleted: false;
        fname: string;
        fsha: string;
        fsize: number;
        ftype: string;
        fver: number;
        groupid: number;
        id: number;
        link: {
            sid: string;
            fileid: number;
            userid: number;
            ctime: number;
            chkcode: string;
            clicked: number;
            groupid: number;
            status: string;
            ranges: string;
            permission: string;
            expire_period: number;
            expire_time: number;
            file_mtime: number;
            download_perm: number;
            creator: creator;
            corp_id: string;
            ext_perm_list: string[];
        };
        link_url: string;
        members: [];
        modifier: {
            id: number;
            name: string;
            avatar: string;
            corpid: number;
        };
        mtime: number;
        parentid: number;
        store: number;
        storeid: string;
        user_ext_perm: string[];
        user_permission: string;
    };
    export type UpdateFolderLinkInfo = {
        range?: string;
        period?: number;
        sid: string;
        clink?: boolean;
        status?: string;
    };
    export type UpdateFolderLinkInfoResponse = {
        folderinfo: FolderInfo;
        linkinfo: FolderLinkInfo;
        result: string;
    };
    export type FileInfo = {
        id: number;
        groupid: number;
        parentid: number;
        deleted: boolean;
        fname: string;
        ftype: string;
        fsha: string;
        fsize: number;
        fver: number;
        store: number;
        storeid: string;
        ctime: number;
        mtime: number;
        creator: creator;
        modifier: {
            id: number;
            name: string;
            avatar: string;
            corpid: number;
        };
    };
    export type FileLinkInfo = {
        fileinfo: FileInfo;
        linkinfo: {
            sid: string;
            fileid: number;
            link_permission: string;
            groupid: number;
            group_corpid: number;
            status: string;
            ranges: string;
            chkcode: string;
            clicked: number;
            ctime: number;
            file_mtime: number;
            expire_period: number;
            expire_time: number;
            link_url: string;
            download_perm: number;
            creator: creator;
            ext_perm_list: string[] | null;
        };
        result: string;
        user_ext_perm: string[];
        user_permission: string;
    };
    export type FolderInfo = {
        id: number;
        fname: string;
        ctime: number;
        mtime: number;
    };
    export type FolderLinkInfo = {
        sid: string;
        folderid: number;
        link_permission: string;
        groupid: number;
        status: string;
        ranges: string;
        expire_time: number;
        link_url: string;
        download_perm: number;
        creator: creator;
    };
    export type FolderLinkResponseInfo = {
        allow_setup: boolean;
        folderinfo: FolderInfo;
        linkinfo: FolderLinkInfo;
        result: string;
    };
    /** folder link */
    export const flinkFormat: (data: any) => any;
    /**
     * 文件 拓展模块
     * @source
     * @example await sdk.extensions.file.getFileMeta('fid_xxx')
     */
    export default class FileExtenssion extends ExtensionBase {
        /**
         * 是否具备权限
         * @returns
         */
        getPermission(): Promise<void>;
        /**
         * 获取文件/目录接口
         * @param fileId 文件id，无法使用回收站中的文件id获取文件信息
         * @returns
         */
        getFileMeta(fileId: string): AxiosPromise<FileMetadata>;
        /**
         * 更新文件分享链接信息
         * @param sid 文件分享id
         * @param formdata 文件分享信息
         * @returns
         */
        updateFileLink(sid: string, formdata: UpdateLinkInfo): AxiosPromise<UpdateLinkInfoResponse>;
        /**
         * 更新文件夹分享链接信息
         * @returns
         */
        updateFolderLink(sid: string, formdata: UpdateFolderLinkInfo): AxiosPromise<UpdateFolderLinkInfoResponse>;
        /**
         * 获取文件分享链接信息
         * @returns
         */
        getFileLink(fileId: string, params?: FileParam): AxiosPromise<FileLinkInfo>;
        /**
         * 获取文件夹分享链接信息
         * @returns
         */
        getFolderLink(folderId: string): AxiosPromise<FolderLinkResponseInfo>;
        /**
         * 根据分享链接获取文件信息
         * @returns
         */
        getFileInfoByShareLink(key: string): AxiosPromise<{
            approver_info: {
                approver_id: number;
                approver_nickname: string;
                approver_avatar: string;
            };
            fileinfo: FileInfo;
            linkinfo: LinkInfo;
            result: string;
            user_acl: LinkUserAcl;
            user_permission: string;
        }>;
        /**
         * 获取文件下载信息 1.1.3
         * @returns
         */
        getFileDownloadInfoV5(groupId: number, fileId: number, isblocks: boolean, support_checksums: string): AxiosPromise<{
            checksums: {
                sha1: string;
            };
            fsize: number;
            fver: number;
            result: string;
            store: string;
            url: string;
        }>;
        /**
         * 通过ShareId获取文件夹分享中的文件下载信息
         * @returns
         */
        getFolderLinkDownloadInfoByShareId(shareId: string, fileId: number, isblocks: boolean): AxiosPromise<{
            fileinfo: FileDownloadInfo;
            result: string;
        }>;
        /**
         * 通过ShareId获取文件下载信息
         * @returns
         */
        getFileDownloadInfoByShareId(shareId: string): AxiosPromise<{
            download_url: string;
        }>;
        /**
         * 根据shareid获取文件夹信息和链接信息
         * @returns
         */
        getFolderLinkInfoByShareId(shareId: string): AxiosPromise<UpdateFolderLinkInfoResponse>;
        /**
         * 根据文件id跟文件类型获取当前文件标签
         * @param object_id 文件id
         * @param object_type 文件类型
         * @param company_id 企业id
         * @returns
         */
        getListItemBottom(params: {
            object_id: number[];
            object_type: string;
            company_id: number;
        }): AxiosPromise;
        /**
         * 获取用户空间信息
         * @returns
         */
        getUserSpaces(): AxiosPromise<{
            used: number;
            total: number;
            id: number;
            name: string;
        }>;
        /**
         * 批量下载文件
         * @returns
         */
        downloadFilesInBatches(groupId: string, fileIds: number[]): AxiosPromise<{
            url: string;
            result: string;
        }>;
        /**
         * 文件/文件夹信息修改
         * @returns
         */
        fileOrFolderInformationModification(groupId: string, fileId: string, fileName: string): AxiosPromise<FileInfo>;
        /**
         * 文件/文件夹删除
         * @returns
         */
        fileOrFolderDelete(groupId: string, fileId: string): AxiosPromise<{
            result: string;
        }>;
        /**
         * 添加协作成员
         * @returns
         */
        addCollaborators(data: {
            sid: string;
            permission: "read" | "write";
            contacts: {
                recent?: number[];
                company?: {
                    userid: number;
                    companyid: number;
                }[];
            };
            message?: boolean;
            without_send_message?: boolean;
        }): AxiosPromise<{
            result: string;
            members: {
                account: string;
                avatar: string;
                corpid: number;
                extends: object;
                id: number;
                name: string;
                permission: "read" | "write";
                status: string;
                ext_perm_list: unknown[] | null;
            }[];
        }>;
        /**
         * 添加协作组协作成员
         * @returns
         */
        addTeamCollaborators(data: {
            sid: string;
            permission: "read" | "write";
            contacts: {
                company_dept?: {
                    deptid: string;
                    companyid: number;
                }[];
            };
        }): AxiosPromise<{
            result: string;
            corp_dept_members: {
                companyid: number;
                deptid: string;
                name: string;
                permission: "read" | "write";
                ext_perm_list: unknown[] | null;
            }[];
            woa_team_members: {
                teamid: string;
                permission: "read" | "write";
            }[];
        }>;
        /**
         * 修改分享链接指定成员权限
         * @returns
         */
        setShareLinkMemberRight(shareId: string, memberId: number, permission: string, ext_perm_list?: string[]): AxiosPromise<{
            result: string;
        }>;
        /**
         * 批量修改分享链接所有成员权限
         * @returns
         */
        setManyShareLinkAllMemberRight(shareId: string, permission: string, exclude_ids: string, ext_perm_list?: string[]): AxiosPromise<{
            result: string;
        }>;
        /**
         * 批量修改分享链接指定成员权限
         * @returns
         */
        setManyShareLinkMemberRight(shareId: string, permission: string, member_ids: string, ext_perm_list?: string[]): AxiosPromise<{
            fail_list: unknown[];
            result: string;
        }>;
        /**
         * 删除分享链接指定成员权限
         * @returns
         */
        removeShareLinkMemberRight(shareId: string, memberId: string): AxiosPromise<{
            result: string;
        }>;
        /**
         * 批量删除分享链接所有成员权限
         * @returns
         */
        removeManyShareLinkAllMemberRight(shareId: string, exclude_ids: string): AxiosPromise<{
            result: string;
        }>;
        /**
         * 批量删除分享链接指定成员权限
         * @returns
         */
        removeManyShareLinkMemberRight(shareId: string, memberIds: string): AxiosPromise<{
            fail_list: unknown[];
            result: string;
        }>;
        /**
         * 文件添加部门权限
         * @returns
         */
        addTeamFileRight(shareId: string, permission: string, contacts: {
            company_dept: {
                deptid: string;
                companyid: number;
            }[];
        }, ext_perm_list?: string[]): AxiosPromise<{
            corp_dept_members: {
                deptid: number;
                name: string;
                companyid: number;
                permission: string;
                ext_perm_list?: string[];
            }[];
            result: string;
            woa_team_members: string[];
        }>;
        /**
         * 文件修改部门权限
         * @returns
         */
        setTeamFileRight(shareId: string, permission: string, teamId: string, teamType: string, ext_perm_list?: string[]): AxiosPromise<{
            result: string;
        }>;
        /**
         * 文件删除部门权限
         * @returns
         */
        removeTeamFileRight(shareId: string, teamId: string, teamType: string): AxiosPromise<{
            result: string;
        }>;
        /**
         * 取消分享
         * @param groupId 团队id
         * @param fileId 文件/文件夹id
         * @returns
         */
        cancelShare(groupId: string, fileId: string): AxiosPromise<{
            result: string;
        }>;
    }
}
declare module "extensions/account/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise } from "@ecis/request/node_modules/axios";
    export type UserInfo = {
        id: number;
        name: string;
        avatar: string;
        status: string;
        roamingswitch: number;
        regtime: number;
        vipinfo: {
            expire_time: number;
            memberid: number;
            has_ad: number;
            name: string;
            enabled: [
                {
                    memberid: number;
                    name: string;
                    expire_time: number;
                }
            ];
        };
        corp: {
            id: number;
            name: string;
        };
        first_login: number;
        web_guide_versions: [];
        privilege: {
            create_group: true;
            remain_group_num: number;
        };
        curtime: number;
        is_plus: true;
    };
    /**
     * 用户信息拓展模块
     * @source
     * @example await sdk.extensions.account.getUnLoginCompanyInfo()
     */
    export default class AccountExtenssion extends ExtensionBase {
        getPermission(): Promise<void>;
        /**
         * 获取sid
         */
        getPasskey(): AxiosPromise;
        /**
         * 修改密码
         */
        getSsidAndEncryptedPwd(pwdObj: {
            oldPwd: string;
            newPwd: string;
        }): Promise<AxiosPromise>;
        /**
         * 当前登录的用户信息
         * @returns
         */
        getUserInfo(): AxiosPromise<UserInfo>;
    }
}
declare module "extensions/group/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise } from "@ecis/request/node_modules/axios";
    export type GroupParam = {
        id?: number;
        name?: string;
        avatar?: string;
        corpid?: number;
        role: string;
        status?: string;
        account?: string;
        extends?: {
            email?: string;
            phone?: string;
        };
        new_role?: string;
        userid?: number;
        checked?: boolean;
    };
    export type GroupInfo = {
        id: number;
        applyid: number;
        corpid: number;
        name: string;
        type: string;
        default_type: string;
        ctime: number;
        mtime: number;
        creator: {
            id: number;
            name: string;
            avatar: string;
            corpid: number;
        };
        member_count: number;
        member_count_limit: number;
        user_role: string;
        event_alert: number;
        recent_members: {
            id: number;
            name: string;
            avatar: string;
            corpid: number;
            role: string;
            status: string;
            account: string;
            extends: {
                email: string;
                phone: string;
            };
            new_role: string;
        }[];
        secure: boolean;
        group_type: string;
    };
    export type UpdateGroupInfo = {
        id: number;
        applyid: number;
        corpid: number;
        name: string;
        type: string;
        default_type: string;
        ctime: number;
        mtime: number;
        creator: {
            id: number;
            name: string;
            avatar: string;
            corpid: number;
        };
        member_count: number;
        member_count_limit: number;
        user_role: string;
        event_alert: number;
        secure: boolean;
        group_type: string;
    };
    export type GroupMembers = {
        id: number;
        name: string;
        avatar: string;
        corpid: number;
        role: string;
        status: string;
        account: string;
        extends: {
            email: string;
            phone: string;
        };
        new_role: string;
    };
    type AddStaffRightType = {
        compound_id: number;
        compound_name?: string;
        compound_type?: string;
        subfiles_update?: boolean;
        subjects: {
            subject_id: number;
            subject_type: string;
        }[];
    };
    type SetStaffRightType = {
        compound_id: number;
        compound_name?: string;
        compound_type?: string;
        subfiles_update?: boolean;
        subject: {
            subject_id: string;
            subject_type: string;
        };
    };
    type BackType = {
        compound_id: number;
        compound_name: string;
        compound_type: string;
        id: number;
        subject_avatar?: string;
        subject_id: string;
        subject_name: string;
        subject_type: string;
    };
    /**
     * 团队 拓展模块
     * @source
     * @example await sdk.group.getGroup('groupid_xxx', { include: "recent_members", category: false })
     */
    export default class GroupExtenssion extends ExtensionBase {
        /**
         * 是否具备权限
         * @returns
         */
        getPermission(): Promise<void>;
        /**
         * 加入团队
         * @param groupId 团队id
         * @returns
         */
        joinGroup(params: {
            groupId: number;
            userids: number[];
        }): AxiosPromise<{
            failList: unknown[];
            members: {
                id: number;
                name: string;
                avatar: string;
                corpid: number;
                role: string;
                status: string;
                account: string;
                extends: {
                    email: string;
                    phone: string;
                };
                new_role: string;
            }[];
        }>;
        /**
         * 设置添加成员设置信息
         * @returns
         */
        setInviteContactSetting(params: {
            groupId: number;
            allowInvite: boolean;
            linkPeriod: number;
            memberReadonly: boolean;
            needApprove: boolean;
        }): AxiosPromise<{
            result: string;
        }>;
        /**
         * 后台管理设置是否创建团队需要管理员审批
         * @param companyId 企业id
         * @returns
         */
        setCreatGroupSetting(params: {
            value: "false" | "true";
            companyId: string;
        }): AxiosPromise;
        /**
         * 获取添加成员设置信息
         * @param groupId 团队id
         * @returns
         */
        getInviteContactSetting(groupId: number): AxiosPromise<{
            admin_file_perm: boolean;
            allow_invite: boolean;
            link_period: number;
            member_readonly: boolean;
            need_approve: boolean;
            result: string;
        }>;
        /**
         * 获取团队信息
         * @param groupId 团队id
         * @param include 是否返回最近10个成员(recent_members)
         * @returns
         */
        getGroup(groupId: string, params: {
            include?: string;
        }): AxiosPromise<GroupInfo>;
        /**
         * 修改团队名
         * @param groupId 团队id
         *  @param groupName 团队名称
         * @returns
         */
        updateGroupInfo(groupId: string, groupName: string): AxiosPromise<UpdateGroupInfo>;
        /**
         * 删除团队
         * @param groupId 团队id
         * @returns
         */
        deleteGroup(groupId: string): AxiosPromise;
        /**
         * 团队成员设置管理员、取消设置管理员
         * @param groupId 团队id
         * @param memberId 成员id
         * @returns
         */
        setAdmin(groupId: string, memberId: string, formdata: GroupParam): AxiosPromise<{
            result: string;
        }>;
        /**
         * 删除团队成员
         * @param groupId 团队id
         * @param memberId 成员id
         * @returns
         */
        deleteMembers(groupId: string, memberId: string): AxiosPromise;
        /**
         * 获取团队所有成员
         * @param groupId 团队id
         * @returns
         */
        getGroupAllMembers(groupId: number): AxiosPromise<{
            members: number[];
        }>;
        /**
         * 获取团队成员详细信息
         * @param groupId 团队id
         * @param offset 分页获取成员列表初始值
         * @param count 获取成员数量,默认50,最大值为200
         * @returns
         */
        getGroupMembers(groupId: string, count: number, offset: number): AxiosPromise<{
            members: GroupMembers[];
        }>;
        /**
         * 团队文件增加授权成员
         * @param groupId 团队id
         * @param fileId 文件id
         * @returns
         */
        addStaffRight(groupId: number, fileId: number, formdata: AddStaffRightType): AxiosPromise<{
            perms: BackType[];
        }>;
        /**
         * 团队成员修改权限
         * @param groupId 团队id
         * @param fileId 文件id
         * @returns
         */
        setStaffRight(groupId: number, fileId: number, formdata: SetStaffRightType): AxiosPromise<BackType>;
        /**
         * 团队成员删除权限
         * @param groupId 团队id
         * @param fileId 文件id
         * @param subjectId 成员ID
         * @param subjectType 成员类型(user/role/dept/userGroup)
         * @returns
         */
        removeStaffRight(groupId: number, fileId: number, subjectId: number, subjectType: string): AxiosPromise;
        /**
         * 查询团队授权成员
         * @param groupId 团队id
         * @param fileId 文件id
         * @returns
         */
        getGroupStaffRight(groupId: number, fileId: number): AxiosPromise<{
            is_selfperm: boolean;
            perms: {
                compound_id: number;
                compound_name?: string;
                compound_type?: string;
                id: number;
                subject_avatar?: string;
                subject_id: string;
                subject_name: string;
                subject_type: string;
                user_role_id?: number;
            }[];
        }>;
        /**
         * 新建文件
         * @param groupId 团队id
         * @param name 文件名
         * @param parentId parentid
         * @returns
         */
        createNewFile(groupId: number, name: string, parentId: number, owner: boolean, parsed: boolean, addNameIndex: boolean): AxiosPromise<{
            creator: {
                avatar: string;
                corpid: number;
                id: number;
                name: string;
            };
            ctime: number;
            deleted: false;
            fname: string;
            fsha: string;
            fsize: number;
            ftype: string;
            fver: number;
            groupid: number;
            id: number;
            link_id: string;
            link_url: string;
            modifier: {
                avatar: string;
                corpid: number;
                id: number;
                name: string;
            };
            mtime: number;
            parentid: number;
            store: number;
            storeid: string;
        }>;
    }
}
declare module "extensions/axios/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise } from "@ecis/request/node_modules/axios";
    import { AxiosRequestConfig } from "axios";
    /**
     * 请求 拓展模块
     * @source
     * @example await sdk.extensions.axios.get({ url: '/api/init', service: 'ecis' })
     */
    export default class AxiosExtension extends ExtensionBase {
        private instance;
        getPermission(): Promise<void>;
        init(): Promise<void>;
        private getAxiosInstance;
        get<T>(config: {
            url: string;
            data?: any;
            service: string;
            headers?: any;
            encrypt?: boolean;
        }): AxiosPromise<T>;
        post<T>(config: {
            url: string;
            data?: any;
            service: string;
            headers?: any;
            encrypt?: boolean;
        }): AxiosPromise<T>;
        request<T>(config: AxiosRequestConfig, service?: string, encrypt?: boolean): AxiosPromise<T>;
    }
}
declare module "extensions/data/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import SdkBase from "libs/SdkBase";
    interface IOptions {
        toJs: boolean;
    }
    /**
     * 存储 拓展模块
     * @source
     * @example await sdk.store.set('key', {name: 'hello'})
     */
    export default class DataExtenssion extends ExtensionBase {
        proxyData: {};
        private $data;
        private $watch;
        getPermission(): Promise<void>;
        constructor(sdk: SdkBase);
        private proxy;
        get(key: string, options?: IOptions): any;
        set<T>(key: string, data: T, options?: IOptions & {
            override: boolean;
        }): T;
        watch(key: string, callback: (value: any, oldValue: any) => void): () => void;
    }
}
declare module "extensions/login/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise } from "@ecis/request/node_modules/axios";
    type LoginConfig = {
        auto_login: boolean;
        comp_id: number;
        comp_logo: string;
        comp_name: string;
        comp_oauth_url: string;
        multi_tenant: boolean;
        need_captcha: boolean;
        password_compexity: {
            password_len_max: number;
            password_len_min: number;
            type: string[];
        };
        super_admin_name: string;
        no_operation_logout: number;
    };
    /**
     * 用户信息拓展模块
     * @source
     * @example await sdk.account.getUnLoginCompanyInfo()
     */
    export default class LoginExtenssion extends ExtensionBase {
        getPermission(): Promise<void>;
        /**
         * 获取登录环境配置
         * @param comp_id 企业id
         * @returns
         */
        getLoginConfig(comp_id?: string): AxiosPromise<LoginConfig>;
        /**
         * 获取登录上下文
         * @param ssid
         * @returns
         */
        getLoginContext(ssid?: string): AxiosPromise<{
            expired: number;
            pass_key: string;
            ssid: string;
        }>;
        /**
         * 获取登录校验码
         * @returns
         */
        getLoginCaptcha(): AxiosPromise<{
            id: string;
            img: string;
        }>;
        /**
         * 登录账密校验
         * @returns
         * wpsua需要携带
         */
        getLoginPasswoldVerify(params: {
            account: string;
            captcha?: string;
            captcha_id?: string;
            company_id?: string;
            from?: string;
            keep_online?: number;
            password: string;
            ssid: string;
        }, pass_key: string): AxiosPromise<{
            is_need_change_pwd: boolean;
            is_need_second_verify: boolean;
            second_verify_cb: string;
            second_verify_type: string;
            ssid: string;
        }>;
        /**
         * 登录
         * @returns
         */
        getLogin(params: {
            cb?: string;
            ssid: string;
        }): AxiosPromise<{
            cb: string;
        }>;
        /**
         * 忘记密码
         * @returns
         */
        getForgetpassword(params: {
            new_password: string;
            ssid: string;
        }, pass_key: string): AxiosPromise;
    }
}
declare module "extensions/contact/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise } from "@ecis/request/node_modules/axios";
    /**
     *
     * @source
     * @example
     */
    export default class ContactExtenssion extends ExtensionBase {
        /**
         * 是否具备权限
         * @returns
         */
        getPermission(): Promise<void>;
        /**
         * 金山文档首页（获取子部门parentId不传默认是0）
         */
        getDepartmentChilds(params: {
            companyId: string;
            parentId: string;
        }): AxiosPromise<{
            infos: {
                id: string;
                name: string;
                comp_id: number;
                abs_path: string;
                id_path: string;
                weight: string;
                has_children: boolean;
                in_visibility: boolean;
            }[];
            result: string;
        }>;
        /**
         * 搜索查找部门
         */
        searchDepartmentChilds(params: {
            companyId: string;
            parentId: string;
            size: number;
            page: number;
            search: string;
        }): AxiosPromise<{
            departments: {
                abs_path: string;
                children: null | unknown[];
                comp_id: number;
                highlight: {
                    name: string[];
                };
                id: string;
                id_path: string;
                name: string;
                parent_id: string;
                star: number;
                weight: string;
            }[];
            result: string;
            total: number;
        }>;
        /**
         * 金山文档首页（获取部门下面的人员)
         */
        getDepartmentUsers(params: {
            companyId: string;
            parentId: string;
            size: number;
            page: number;
        }): AxiosPromise<{
            result: string;
            total: number;
            userlist: {
                comp_uid: string;
                userid: number;
                avatar: string;
                comp_id: number;
                user_name: string;
                status: string;
                roleid: string;
                phone: string;
                email: string;
            }[];
        }>;
        /**
         * 搜索查找部门下面的人员
         */
        searchDepartmentUsers(params: {
            companyId: string;
            parentId: string;
            size: number;
            page: number;
            search: string;
        }): AxiosPromise<{
            members: {
                avatar: string;
                comp_id: number;
                comp_uid: string;
                department: string;
                dept_path: string;
                email: string;
                highlight: {
                    user_name: string[];
                };
                id: string;
                name: string;
                phone: string;
                role: number;
                status: string;
            }[];
            result: string;
            total: number;
        }>;
    }
}
declare module "extensions/at/index" {
    import ExtensionBase from "libs/ExtensionBase";
    import { AxiosPromise, AxiosResponse } from "@ecis/request/node_modules/axios";
    type AtParam = {
        from_id: string;
        from_type: number;
        op_source_id: string;
        op_source_type: number;
        receive: {
            uuid: string;
            rcvr_source_id: string;
            rcvr_source_type: number;
            type: string;
        }[];
    };
    type EventParam = {
        at_from_id: string;
        at_from_type: number;
        need_delay: boolean;
        delay: number;
        type: number;
        event_map: {
            [k: string]: {
                args: {
                    type: number;
                    terminals: number[];
                    file_name: string;
                    company_id: number;
                };
                content: {
                    name: string;
                };
            };
        };
    };
    /**
     * at 拓展模块
     * @source
     * @example await sdk.extensions.at.inquireAt('uuid_xxx', 'from_id_xxx', 'from_type_xxx')
     */
    export default class AtExtenssion extends ExtensionBase {
        /**
         * 是否具备权限
         * @returns
         */
        getPermission(): Promise<void>;
        /**
         * 创建at关系
         * @returns
         */
        createAt(formdata: AtParam): AxiosPromise<{
            code: number;
            result: string;
        }>;
        /**
         * 创建at关系依赖接口
         * @returns
         */
        createUuid(size: number): AxiosPromise<{
            code: number;
            result: string;
            data: string;
        }>;
        /**
         * 用于发起通知
         * @returns
         */
        initiateNotice(formdata: EventParam): AxiosPromise<{
            code: number;
            result: string;
            data: {
                id_list: number[];
            };
        }>;
        /**
         * 查询at关系
         * @returns
         */
        inquireAt(uuid: string, from_id: string, from_type: string): Promise<AxiosResponse<{
            data: {
                uuid: string;
                from_id: string;
                from_type: number;
                op_source_id: string;
                op_source_type: number;
                rcvr_source_id: string;
                rcvr_source_type: number;
                create_time: number;
                update_time: number;
                op_source_name: string;
                rcvr_source_name: string;
                op_source_avatar: string;
                rcvr_source_avatar: string;
            }[];
        }>>;
        /**
         * 撤销一个事件
         * @returns
         */
        revokeEvent(id_list: number[]): AxiosPromise<{
            code: number;
            result: string;
        }>;
        /**
         * at恢复撤销事件
         * @returns
         */
        recoverRevokeEvent(id_list: number[]): AxiosPromise;
    }
}
declare module "extensions/index" {
    import SdkBase from "libs/SdkBase";
    import CompanyExtenssion from "extensions/company/index";
    import FileExtenssion from "extensions/file/index";
    import AccountExtenssion from "extensions/account/index";
    import GroupExtenssion from "extensions/group/index";
    import AxiosExtension from "extensions/axios/index";
    import DataExtenssion from "extensions/data/index";
    import LoginExtenssion from "extensions/login/index";
    import ContactExtenssion from "extensions/contact/index";
    import AtExtenssion from "extensions/at/index";
    export default function init(sdk: SdkBase): {
        company: CompanyExtenssion;
        file: FileExtenssion;
        account: AccountExtenssion;
        group: GroupExtenssion;
        axios: AxiosExtension;
        store: DataExtenssion;
        login: LoginExtenssion;
        contact: ContactExtenssion;
        at: AtExtenssion;
    };
}
declare module "libs/PlugBase" {
    import SdkBase, { BASE } from "libs/SdkBase";
    import { IModules } from "modules/ModuleBase";
    export type InitOption<T = ISdkLanguageVue | ISdkLanguageReact> = {
        webpath: string;
        [name: string]: any;
    } & T;
    export interface ISdkLanguageVue {
        Vue: BASE.TYPE.VUE;
    }
    export interface ISdkLanguageReact {
        React: BASE.TYPE.REACT;
    }
    export default class PlugBase {
        private initialized;
        sdk: SdkBase;
        private plugApi;
        private moduleName;
        constructor(sdk: SdkBase, plugApi: string, moduleName: string);
        /**
         * sdk的入口
         * @param option
         * @returns
         */
        init(option: InitOption): Promise<void>;
        private initPlugins;
        private mountSdk;
        private getPlugins;
        private getWebpath;
        getModule(key: string): IModules;
        get<T>(key: string, defaultValue?: T): T | null;
        emit(name: string, data: any): void;
        ask(name: string, data: any): any;
        try(name: string, data: any): void;
        _load(pluginUrl: string): void;
        _clear(): void;
    }
}
declare module "libs/SdkBase" {
    import { IModules } from "modules/ModuleBase";
    import { createRequest } from "@ecis/request";
    import getExtensions from "extensions/index";
    import { InitOption, ISdkLanguageReact, ISdkLanguageVue } from "libs/PlugBase";
    type PromiseType<T> = (args: any) => Promise<T>;
    type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;
    global {
        interface Window {
            _babelPolyfill: boolean;
            __ECIS_REACT: BASE.TYPE.REACT;
            __ECIS_VUE: BASE.TYPE.VUE;
            __ECIS_PLUGINS: {
                init: (sdk: SdkBase, attachs: Partial<InitOption<ISdkLanguageReact & ISdkLanguageVue>>) => void;
                meta: {
                    name: string;
                    desc: string;
                    version: string;
                };
            }[];
            __ECIS_PLUGHUB: {
                sdk: SdkBase;
                [propName: string]: any;
            };
        }
    }
    type VueConstructor = import("vue").VueConstructor;
    type ReactElement = import("react").ReactElement;
    export namespace BASE {
        namespace CONFIG {
            type RETURN_SAME<T> = (p: T) => T;
        }
        namespace TYPE {
            type VUE = VueConstructor;
            type REACT = ReactElement;
        }
    }
    export interface Events {
        name: string;
        callback: (data?: any) => any;
    }
    export enum LinkEnum {
        CONFIG = 0,
        EVENT = 1
    }
    /**
     * 静态配置
     * @source
     */
    export interface ILink {
        type: LinkEnum;
        discard: string;
        target: string;
    }
    export interface IConfigLink extends ILink {
        type: LinkEnum.CONFIG;
    }
    export interface IEventLink extends ILink {
        type: LinkEnum.EVENT;
    }
    export default class SdkBase {
        static loaded: boolean;
        private _values;
        private _events;
        private _modules;
        /**
         * 私有化根路径
         * @source
         */
        webpath: string;
        /**
         * 插件代码语言
         * @source
         */
        codeLanguage: "react" | "vue" | "unknown";
        /**
         * 请求模块
         * @source
         */
        request: UnPromisify<typeof createRequest>;
        private _extensions;
        get modules(): IModules;
        /**
         * @source
         */
        get extensions(): ReturnType<typeof getExtensions>;
        constructor(_modules?: IModules);
        /**
         * 文件链接
         * @source
         */
        links: ILink[];
        private setValue;
        private isObject;
        private isPromise;
        private mergeObj;
        private merge;
        private loadScript;
        set(value: Object, prefix?: string): void;
        setKeys(keys: string[], value: any): void;
        private getLinkKey;
        private getValue;
        get(key: string): any;
        on(name: string, callback: (data?: any) => any): void;
        off(name?: string, callback?: () => any): void;
        emit(name: string, data: any): void;
        ask(name: string, data: any): any;
        try(name: string, data: any): void;
        load(urls: string[]): Promise<void>;
        createAxios(_webpath: string): Promise<void>;
        initExtensions(): void;
        private randomString;
        /**
         * 根节点挂载组件
         * @source
         */
        createContainer(): [HTMLDivElement, () => void];
        /**
         * 根节点挂载修改企业logo页面
         * @source
         */
        createUpdateCompanyLogoIframe(companyId: string): [HTMLIFrameElement, () => void];
    }
}
declare module "modules/kso/index" {
    import SdkBase, { BASE } from "libs/SdkBase";
    import { AxiosRequestConfig, AxiosResponse } from "axios";
    /**
     * 分享弹窗-分享信息
     * @source
     */
    export type ShareDilogInfo = {
        /**
         * 分享链接
         */
        addr: string;
        /**
         * 分享链接前缀
         */
        linkSuffix?: string;
        /**
         * 文件名称
         */
        fname: string;
    };
    /**
     * 团队成员管理
     * @source
     */
    export type TeamMemberInfo = {
        avatar: string;
        corpid?: number;
        company_id?: number;
        id: number;
        name: string;
        role?: string;
        [key: string]: any;
    };
    /**
     * 联系人选中成员列表
     * @source
     */
    export type MemberSelectList = {
        avatar: string;
        name: string;
        userid: number;
        _from: string;
        _id: number;
        _source: {
            ref_type_name: string;
            time: number;
            source: string;
            [key: string]: any;
        };
        _type: string;
        [key: string]: any;
    };
    /**
     * 联系人选中成员来源
     * @source
     */
    export type MemberSelectSource = {
        id: number;
        clink_url?: string;
        name?: string;
        fname?: string;
        member_count?: number;
        link?: {
            fileid: number;
            sid: string;
            [key: string]: any;
        };
        [key: string]: any;
    };
    /**
     * 团队成员信息
     * inviteLink 邀请好友加入
     * barcode 二维码邀请
     * compantContact 从联系人中添加
     * @source
     */
    export type RecentMembersInfo = {
        key: "inviteLink" | "barcode" | "compantContact";
    };
    /**
     * 团队成员- 设置- 操作项屏蔽
     * LinkPeriod 允许成员邀请联系人加入团队
     * AdminFilePermission 加入时需要管理员审核
     * NeedApprove 允许管理员访问团队所有文件和管理文件权限
     * AllowMemberInvite 邀请链接/二维码有效期
     * @source
     */
    export type MemberSetModalKey = {
        key: "LinkPeriod" | "AdminFilePermission" | "NeedApprove" | "AllowMemberInvite";
    };
    /**
     * 团队成员信息
     * inviteLink 邀请好友加入
     * barcode 二维码邀请
     * compantContact 从联系人中添加
     * @source
     */
    export type MemberChecked = {
        avatar: string;
        checked: boolean | undefined;
        name: string;
        onCheck: () => void | null;
        onItemClick: () => void | null;
        [key: string]: any;
    };
    /**
     * 团队信息
     * @source
     */
    export type ITeamInfo = {
        applyid: number;
        corpid: number;
        creator: {
            avatar: string;
            corpid: number;
            id: number;
            name: string;
        };
        ctime: number;
        default_type: string;
        group_type: string;
        id: number;
        member_count: number;
        member_count_limit: number;
        mtime: number;
        name: string;
        secure: boolean;
        type: string;
        user_role: string;
        [key: string]: any;
    };
    /**
     * 创建分享弹窗-权限菜单数据
     * anyoneClose：仅指定人可查看/评论/编辑  companyRead：本企业成员查看  companyWrite：本企业人员可编辑 companyComment: 本企业成员可评论 anyoneRead: 任何人可查看 anyoneComment: 任何人可评论 anyoneWrite: 任何人可编辑
     * @source
     */
    export type CreateFileMenuType = "anyoneClose" | "companyRead" | "companyWrite" | "companyComment" | "anyoneRead" | "anyoneComment" | "anyoneWrite";
    /**
     * 创建分享弹窗文件信息
     * @source
     */
    export type FileInfoPart = {
        /**
         * 文件id
         */
        fileid: number;
        /**
         * 团队id
         */
        groupid?: number;
        /**
         * 入口
         */
        entrance: string;
        /**
         * 位置
         */
        position: string;
        /**
         * 类型
         */
        type: string;
    };
    /**
     * 分享弹窗-权限
     * @source
     */
    export type SharePremission = {
        /**
         * 分享弹窗权限数组
         */
        data: FilePermissionArr[];
        /**
         * 文件信息
         */
        link: FileLinkInfo;
    };
    /**
     * 分享弹窗-文件分享链接信息
     * @source
     */
    export type FileLinkInfo = {
        /**
         * 文件id
         */
        fileid: number;
        /**
         * 团队id
         */
        groupid?: number;
        /**
         * 用户id
         */
        userid?: number;
        /**
         * 分享id
         */
        sid: string;
        [key: string]: any;
    };
    /**
     * 分享弹窗-文件分享权限数据
     * @source
     */
    export type FilePermissionArr = "read" | "comment" | "write" | "company_read" | "company_comment" | "company_write" | "owner" | "reset" | "del";
    /**
     * 分享弹窗-分享成员的权限屏蔽
     * @source
     */
    export type ShareMemberPremission = {
        /**
         * 用户权限数组
         */
        data: MemberPremissionData[];
        /**
         * 文件信息
         */
        link: FileLinkInfo;
    };
    /**
     * 分享弹窗-分享成员的权限
     * @source
     */
    export type MemberPremissionData = {
        /**
         * 类型
         */
        type: "read" | "comment" | "write" | "remove";
        /**
         * 文字描述
         */
        text: "可查看" | "可评论" | "可编辑" | "移除";
        /**
         * 文字描述说明
         */
        subText?: string;
    };
    /**
     * 分享弹窗-批量分享成员的权限屏蔽
     * @source
     */
    export type ShareBatchMemberPremission = {
        /**
         * 用户权限数组
         */
        data: BatchMemberPremissionData[];
        /**
         * 文件信息
         */
        link?: FileLinkInfo;
    };
    /**
     * 分享弹窗-批量分享成员的权限
     * @source
     */
    export type BatchMemberPremissionData = {
        /**
         * 类型
         */
        type: "read" | "comment" | "write" | "remove";
        /**
         * 文字描述
         */
        text: "设为 可查看" | "设为 可评论" | "设为 可编辑" | "批量移除";
        /**
         * 文字描述说明
         */
        subText?: string;
    };
    /**
     * @source
     */
    export interface IConfig {
        /**
         * 自定义权限组
         */
        DocsPermissionModal?: {
            /**
             * 添加成员按钮
             */
            addMemberButton?: {
                /**
                 * 添加成员按钮是否可见 1.1.0
                 */
                visible?: boolean;
            };
            /**
             * 新增自定义权限组按钮
             */
            addGroupButton?: {
                /**
                 * 新增自定义权限组按钮是否可见 1.1.0
                 */
                visible?: boolean;
            };
            /**
             * 删除自定义组成员
             */
            deleteMemberButton?: {
                /**
                 * 删除自定义组成员按钮是否可见 1.1.0
                 */
                visible?: boolean;
            };
        };
        /**
         * 团队设置弹窗
         */
        TeamSettingModal?: {
            /**
             * 文档设置
             */
            docSetting?: {
                /**
                 * 文档加密保护
                 */
                securePermission: {
                    /**
                     * 文档加密保护项是否可见 1.1.2
                     */
                    visible?: boolean;
                };
            };
        };
        /**
         * 企业模板设置弹窗
         */
        CompanyTemplateModal?: {
            /**
             * 云文档上传按钮
             */
            cloudUploadButton?: {
                /**
                 * 云文档上传按钮是否可见 1.1.2
                 */
                visible?: boolean;
            };
            /**
             * 本地上传按钮
             */
            localUploadButton?: {
                /**
                 * 本地上传按钮是否可见 1.1.5
                 */
                visible?: boolean;
            };
        };
        /**
         * 分享弹窗-高级设置
         */
        ShareAdvanceSettingsModal?: {
            /**
             * 下载项是否可见 1.1.5
             */
            downLoadPerm?: {
                visible?: boolean;
            };
        };
        /**
         * 用户信息卡片
         */
        MemberDetailCard?: {
            /**
             * 添加到我的联系人按钮
             */
            addMemberButton?: {
                /**
                 * 添加到我的联系人按钮是否可见 1.1.4.1
                 */
                visible?: boolean;
            };
        };
        /**
         * 创建分享弹窗
         */
        CreateShareFileModal?: {
            publicShare?: {
                /**
                 * 公开分享区域屏蔽 1.1.6
                 */
                visible?: boolean;
            };
            rangeShare?: {
                /**
                 * 指定范围分享区域屏蔽 1.1.6
                 */
                visible?: boolean;
            };
        };
        /**
         * 分享弹窗
         */
        ShareFileModal?: {
            memberContent?: {
                /**
                 * 分享弹窗-已加入分享的人区域屏蔽 1.1.6
                 */
                visible?: boolean;
            };
        };
    }
    /**
     * @declaration
     */
    export interface IKsoSDK {
        set(data: IConfig): void;
        /**
         * 根据接口已有字段判断<…>操作入口可隐藏 1.1.0
         * @param action
         * @param callback
         * data：列表项数据
         */
        on(action: "DocsPermissionModal.moreMenu.visible", callback: (data: {
            tag_name: string;
            tag_id: number;
        }) => boolean): void;
        /**
         * 分享弹窗-分享链接 1.1.0
         * @param action
         * @param callback
         */
        on(action: "ShareFileModal.shareLink.reset", callback: (info: ShareDilogInfo) => string): void;
        /**
         * 翻译 需要兼容ksoui.translate 1.1.4
         * @param action
         * @param callback
         * key: 文案唯一标识, text: 文案
         */
        on(action: "translate", callback: (text: {
            key: string;
            text: string;
        }) => string): void;
        /**
         * 团队成员管理-操作项-固定位置新增插槽 1.1.3
         * @param action
         * @param callback
         */
        on(action: "TeamMemberModal.menu.expand", callback: () => BASE.TYPE.VUE): void;
        /**
         * 团队成员管理-操作项屏蔽 1.1.3
         * @param action
         * @param callback
         * data：操作项数据 folder：普通文件夹 linkfolder：共享文件夹 info：团队信息
         */
        on(action: "TeamMemberModal.menu.filter", callback: (data: {
            data: {
                key: string;
            }[];
            extra: {
                ftype: "folder" | "linkfolder" | "";
                info: {
                    name: string;
                    group_type: string;
                    id: number;
                    type: string;
                    recent_members: RecentMembersInfo[];
                    [key: string]: any;
                };
            };
        }) => {
            key: string;
        }[]): void;
        /**
         * 团队成员- 设置- 操作项屏蔽 1.1.3
         * @param action
         * @param callback
         */
        on(action: "MemberSetModal.menu.filter", callback: (data: MemberSetModalKey[]) => MemberSetModalKey[]): void;
        /**
         * 联系人邀请成员拦截 1.1.3
         * @param action
         * @param callback
         * goback 返回 groupId 团队id memberList 选中的成员或者团队 source来源信息
         * 通过source里面是否有clink_url判断是否是分享
         */
        on(action: "MemberSelectModal.inviteButton.intercept", callback: (param: {
            goback: () => void;
            groupId: number;
            memberList: MemberSelectList[];
            source: MemberSelectSource;
        }) => Promise<boolean>): void;
        /**
         * 响应拦截器 1.1.3
         * @param action
         * @param callback
         */
        on(action: "response", callback: (config: AxiosResponse) => AxiosResponse): void;
        /**
         * 接口拦截(1.1.6)
         * @param action
         * @param callback
         */
        on(action: "request", callback: (config: AxiosRequestConfig) => AxiosRequestConfig): void;
        /**
         * 团队设置-团队名下方增加插槽 1.1.3
         * @param action
         * @param callback props 传参：teamInfo: ITeamInfo 团队信息
         */
        on(action: "TeamSettingModal.TeamNameBottom.expand", callback: () => BASE.TYPE.VUE): void;
        /**
         * 端内嵌-团队设置-团队名下方增加插槽 1.1.3
         * @param action
         * @param callback props 传参：teamInfo: ITeamInfo 团队信息
         */
        on(action: "OfficeTeamSettingModal.TeamNameBottom.expand", callback: () => BASE.TYPE.VUE): void;
        /**
         * 创建团队点击确认按钮拦截邀请的成员，该api的返回值不会影响本身创建团队逻辑 1.1.3
         * @param action
         * @param callback props 传参：teamInfo: ITeamInfo 团队信息
         */
        on(action: "CreateGroupModal.inviteMember.intercept", callback: (props: {
            groupId: number;
            memberList: {
                avatar: string;
                id: number;
                name: string;
                userid: number;
                [key: string]: any;
            }[];
        }) => Promise<boolean>): void;
        /**
         * 图标组件-文件类型图标拓展 1.1.4
         * @param action
         * @param callback
         * type：文件类型 h：渲染图标函数
         * ecisFileName：文件名称
         */
        on(action: "Icon.expand", callback: (info: {
            type: string;
            h: () => BASE.TYPE.REACT;
            ecisFileName?: string;
        }) => BASE.TYPE.VUE): void;
        /**
         * 添加成员-二维码邀请-二维码、下载重绘 1.1.4
         * @param action
         * @param callback
         */
        on(action: "TeamInviteQRcodeModal.QRcode.render", callback: (info: {
            description: string;
            linkTitle: string;
            link: string;
        }) => BASE.TYPE.VUE): void;
        /**
         * 分享-二维码邀请-二维码、下载重绘 1.1.4
         * @param action
         * @param callback
         */
        on(action: "ShareFileQRcodeModal.QRcode.render", callback: (fileInfo: {
            clink: {
                sid: string;
                fileid: number;
                groupid: number;
                link_url: string;
                [key: string]: any;
            };
            clink_url: string;
            creator: {
                avatar: string;
                corpid: number;
                id: number;
                name: string;
            };
            ctime: number;
            deleted: boolean;
            fname: string;
            fsha: string;
            fsize: string;
            ftype: string;
            group: {
                id: number;
                name: string;
                [key: string]: any;
            };
            groupid: number;
            id: number;
            link: {
                sid: string;
                permission: string;
                link_url: string;
                groupid: string;
                fileid: string;
                ctime: number;
                [key: string]: any;
            };
            link_members: [];
            link_url: string;
            user_permission: string;
            [key: string]: any;
        }) => BASE.TYPE.VUE): void;
        /**
         * 团队文档-团队设置弹窗-文档设置-底部插槽 1.1.5
         * @param action
         * @param callback props 传参：teamInfo: ITeamInfo 团队信息
         */
        on(action: "TeamSettingModal.docSetting.bottom.expand", callback: () => BASE.TYPE.VUE): void;
        /**
         * 创建分享弹窗-权限过滤 (1.1.6)
         * @param action
         * @param callback
         */
        on(action: "CreateShareFileModal.permission.filter", callback: (info: {
            /**
             * 权限菜单
             */
            menus: {
                key: CreateFileMenuType;
            }[];
            /**
             * 文件信息
             */
            fileInfo: FileInfoPart;
        }) => Promise<{
            key: CreateFileMenuType;
        }[]>): void;
        /**
         * 创建分享弹窗-权限默认选中 (1.1.6)
         * @param action
         * @param callback
         * companyRead  本企业成员可查看
         * companyWrite 本企业成员可编辑
         * companyComment 本企业成员可评论
         * anyoneClose 仅指定人可查看/评论/编辑
         * anyoneWrite 任何人可编辑
         * anyoneRead 任何人可查看
         * anyoneComment 任何人可评论
         */
        on(action: "CreateShareFileModal.permission.active", callback: (info: FileInfoPart) => Promise<"companyRead" | "companyWrite" | "companyComment" | "anyoneClose" | "anyoneWrite" | "anyoneRead" | "anyoneComment">): void;
        /**
         * 分享弹窗-权限过滤 (1.1.6)
         * @param action
         * @param callback
         */
        on(action: "ShareFileModal.permission.filter", callback: (info: SharePremission) => Promise<FilePermissionArr[]>): void;
        /**
         * 分享弹窗-分享成员的权限过滤 (1.1.6)
         * @param action
         * @param callback
         */
        on(action: "ShareFileModal.memberListPermission.filter", callback: (info: ShareMemberPremission) => Promise<MemberPremissionData[]>): void;
        /**
         * 分享弹窗-选中成员批量权限过滤 (1.1.6)
         * @param action
         * @param callback
         */
        on(action: "ShareFileModal.batchPermission.filter", callback: (info: ShareBatchMemberPremission) => Promise<BatchMemberPremissionData[]>): void;
    }
    export class KsoModule extends SdkBase implements IKsoSDK {
        on(name: string, callback: (data?: any) => any): void;
    }
}
declare module "modules/uikit/index" {
    import SdkBase, { BASE } from "libs/SdkBase";
    import { AxiosResponse, AxiosRequestConfig } from "axios";
    /**
     * 通讯录选择器-tab信息
     * @source
     */
    export type MemberSelectTab = {
        /**
         * key tab标识
         */
        key: "latest" | "contact" | string;
        /**
         * title tab文案
         */
        title: number;
        [propName: string]: any;
    };
    /**
     * 通讯录选择器-权限数据
     * @source
     */
    export type MemberPremission = {
        /**
         * 权限key
         */
        key: "read" | "write" | "comment";
        /**
         * 权限名称
         */
        title: "可查看" | "可编辑" | "可评论";
        /**
         * 权限选中项
         */
        active: boolean;
        /**
         * 权限是否显示
         */
        isHide?: boolean;
    }[];
    /**
     * 文件选择器-左侧导航栏
     * @source
     */
    export type FolderSelectMenu = {
        /**
         * disabled 是否禁用
         */
        disabled: boolean;
        /**
         * icon 菜单图标
         */
        icon: string;
        /**
         * text 菜单文案
         */
        text: string;
        /**
         * to 路由信息 Latest 最近 Star星标 Share 分享 EnterpriseIndex 我的文档 EnterpriseTeams团队文档  Favorite 常用
         */
        to: {
            name: "Latest" | "Star" | "Share" | "EnterpriseIndex" | "EnterpriseTeams" | "Favorite";
        };
    };
    /**
     * @source
     */
    export interface IConfig {
        /**
         * 通讯录选择器
         */
        MemberSelectModal: {
            /**
             * 通讯录选择器-栏目默认选中可设置  1.1.4.1
             * latest 最近 contact 联系人
             */
            activeTabKey: "latest" | "contact" | string;
            /**
             * 通讯录选择器-自定组tab屏蔽新建自定义组按钮 1.1.0
             */
            addCustomVisible: boolean;
        };
        /**
         * 文件选择器
         */
        FolderSelectModal: {
            /**
             * 文件选择器-栏目默认选中可设置 1.1.6
             * Latest 最近 Star星标 Share 分享 EnterpriseIndex 我的文档 EnterpriseTeams团队文档  Favorite 常用
             */
            activeTabKey: "Latest" | "Star" | "Share" | "EnterpriseIndex" | "EnterpriseTeams" | "Favorite";
        };
    }
    type ISame<T> = (p: T) => T;
    /**
     * @declaration
     */
    export interface IUikitModule {
        set(config: IConfig): any;
        /**
         * 翻译  1.1.3
         * @param action
         * @param callback
         * key: 文案唯一标识, text: 文案
         * @notExported
         */
        on(action: "translate", callback: (text: {
            key: string;
            text: string;
        }) => string): void;
        /**
         * 请求拦截器 1.1.4
         * @param action
         * @param callback
         */
        on(action: "request", callback: (config: AxiosRequestConfig) => AxiosRequestConfig): any;
        /**
         * 响应拦截器 1.1.4
         * @param action
         * @param callback
         */
        on(action: "response", callback: (config: AxiosResponse) => AxiosResponse): any;
        /**
         * 人员选择器h5-底部重绘 1.1.5（仅表单pc/h5生效）
         * @param action
         * @param callback
         * 穿参方式为组件传参数，
         * 组件props接收属性selectedList人员信息，  selectedList:{avatar?:string,name:string,userid?:string,_type:string,_source:{avatar:string,name?:string,userid?:string,[key:string]:any},[key:string]:any}[]
         * 事件showModal弹出人员modal，例：this.$emit('showModal')
         * confirm确定事件 可传入人员信息固定格式例：this.$emit('confirm',[{userid:xx,avatar: "xx",name: "xx",_source:{avatar:"xx",comp_id: xx,user_name: "xx",userid: xx,},_type:'user',}])
         */
        on(action: "MemberSelectModal.bottomArea.render", callback: () => BASE.TYPE.VUE): any;
        /**
         * 人员选择器h5-底部modal重绘 1.1.5（仅表单pc/h5生效）
         * @param action
         * @param callback
         * 穿参方式为组件传参数，
         * 组件props接收属性selectedList人员信息，  selectedList:{avatar?:string,name:string,userid?:string,_type:string,_source:{avatar:string,name?:string,userid?:string,[key:string]:any},[key:string]:any}[]
         * 事件removeMember弹出人员modal，例：this.$emit('removeMember',item)
         */
        on(action: "MemberSelectModal.checkedMemberList.render", callback: () => BASE.TYPE.VUE): any;
        /**
         * 人员选择器h5-列表扩展 1.1.5（仅表单pc/h5生效）
         * @param action
         * @param callback
         */
        on(action: "MemberSelect.memberList.expand", callback: () => BASE.TYPE.VUE): any;
        /**
         * 人员选择器pc-左侧列表扩展 1.1.5（仅表单pc/h5生效）
         */
        on(action: "MemberSelectModal.concatList.expand", callback: () => BASE.TYPE.VUE): any;
        /**
         * 人员选择器pc-右侧列表重绘画 1.1.5（仅表单pc/h5生效）
         * @param action
         * @param callback
         * 穿参方式为组件传参数，
         * 组件props接收属性selectedList人员信息，selectedList:{avatar?:string,name:string,userid?:string,_type:string,_source:{avatar:string,name?:string,userid?:string,[key:string]:any},[key:string]:any}[]
         * 事件removeMember弹出人员modal，例：this.$emit('removeMember',item)
         * confirm确定事件 可传入人员信息固定格式例：this.$emit('confirm',[{userid:xx,avatar: "xx",name: "xx",_source:{avatar:"xx",comp_id: xx,user_name: "xx",userid: xx,},_type:'user',}])
         */
        on(action: "MemberSelectModal.rightArea.render", callback: () => BASE.TYPE.VUE): any;
        /**
         * 通讯录选择器栏目过滤 1.1.4.1
         * @param action
         * @param callback
         */
        on(action: "MemberSelectModal.tab.filter", callback: ISame<MemberSelectTab[]>): any;
        /**
         * 通讯录选择器-权限过滤、修改默认选中；通过isHide属性控制权限过滤，不能通过filter方法过滤 1.1.6
         * @param action
         * @param callback
         */
        on(action: "MemberSelector.permission.filter", callback: (info: MemberPremission) => Promise<MemberPremission>): void;
        /**
         * 文件选择器-左侧导航栏过滤 1.1.6
         * @param action
         * @param callback
         */
        on(action: "FolderSelectModal.menu.filter", callback: ISame<FolderSelectMenu[]>): any;
    }
    export class UikitModule extends SdkBase implements IUikitModule {
    }
}
declare module "packages/weboffice/pcweb/index" {
    import { KsoModule } from "modules/kso/index";
    import { ModuleBase } from "modules/ModuleBase";
    import { UikitModule } from "modules/uikit/index";
    import { InitOption, ISdkLanguageVue } from "libs/PlugBase";
    import { AxiosResponse, AxiosRequestConfig, AxiosInterceptorManager } from "axios";
    global {
        interface Window {
            WPSOpenApi: any;
        }
    }
    /**
     * 文件信息
     * @source
     */
    export type FileInfo = {
        /**
         * 文件id
         */
        id: string;
        /**
         * 文件名称
         */
        name: string;
        /**
         * 文件类型
         */
        type: string;
        [key: string]: any;
    };
    /**
     * 屏蔽恢复版本按钮时要传的文件信息
     * @source
     */
    export type HistoryFileInfo = {
        /**
         * 文件id
         */
        id: string;
        /**
         * 分享链接
         */
        link_url: string;
        /**
         * 分享id
         */
        link_id: string;
        /**
         * 团队id
         */
        groupid: string;
        /**
         * 文件名
         */
        name: string;
        /**
         * 父级id
         */
        parentid: string;
        /**
         * 创建时间
         */
        create_time: number;
        /**
         * 文档创建者
         */
        creator: {
            id: string;
            name: string;
            avatar: string;
            shortName: string;
            isFake: boolean;
            isLogin: boolean;
            logined: boolean;
            real_userid: string;
            attars: {
                real_userid: string;
            };
        };
        [key: string]: any;
    };
    /**
     * 一级菜单
     * @source
     */
    export type MoreMenu = {
        /**
         * 是否禁用
         */
        disabled?: boolean;
        /**
         * 一级菜单点击事件
         */
        execute: () => void;
        /**
         * 菜单标识
         */
        name: "Share" | "FileUpdateNotice" | "NewFile" | "Move" | "SaveAs" | "Export" | "Download" | "Print" | "SaveAsEntTemplate" | "SaveVersion" | "History" | "OpenFileLocation" | "OpenWithOther" | string;
        /**
         * 菜单文案
         */
        text: "分享" | "关注文档更新" | "新建" | "移动到" | "另存为" | "导出为" | "下载" | "打印" | "保存为企业模板" | "保存版本" | "历史记录" | "打开文件位置" | "其他方式打开" | string;
        /**
         * 二级菜单
         */
        subItems?: subItems[];
        /**
         * 是否有分割线
         */
        divider?: boolean;
        [key: string]: any;
    };
    /**
     * 二级菜单
     * @source
     */
    export type subItems = {
        /**
         * 二级菜单点击事件
         */
        execute: () => void;
        /**
         * 菜单图标
         */
        icon?: string;
        /**
         * 菜单id
         */
        id: string;
        /**
         * 菜单名称
         */
        name: "pom" | "pof" | "otl" | "ppt" | "form" | "doc" | "xls" | "ExportOfficeType" | "ExportPdf" | "ExportImg" | "HistoryVersion" | "HistoryRecord" | "LocalShortcut" | "OpenWPS" | string;
        /**
         * 菜单文案
         */
        text: "流程图" | "思维导图" | "文档" | "演示" | "表单" | "WPS文字" | "WPS表格" | "导出为Word(.docx)" | "导出为PDF" | "导出为图片" | "历史版本" | "协作记录" | "生成本地快捷方式" | "用WPS打开" | string;
        [key: string]: any;
    };
    /**
     * 打开wps按钮菜单
     * @source
     */
    export type OpenWpsButton = {
        btnName: "WPS打开" | "金山文档客户端打开";
        id: "openWpsClient" | "openKdocsClient";
    };
    /**
     * 用户信息
     * @source
     */
    export type UserInfo = {
        /**
         * 用户id
         */
        id: string;
        /**
         * 用户头像
         */
        avatar: string;
        /**
         * 企业id
         */
        company_id: number;
        /**
         * 是否登录
         */
        isLogin: true;
        /**
         * 权限
         */
        permission: string;
        [key: string]: any;
    };
    /**
     * @declaration
     * @ModuleBase [kso,uikit]
     */
    export interface IWebOfficeSDK extends ModuleBase<{
        kso: KsoModule;
        uikit: UikitModule;
    }> {
        /**
         * 过滤、新增、修改menu菜单、拦截菜单点击事件(pc、h5) 不支持屏蔽所有的菜单 1.1.4
         * @param action
         * @param callback 注：h5中以下菜单无法实现点击事件拦截：导出为、重命名、查找与替换、协作记录、查看目录、文档加密保护、阅读模式、页面版式
         */
        on(action: "Header.moreMenu.filter", callback: (data: {
            menus: MoreMenu;
            fileInfo: FileInfo;
        }) => boolean): any;
        /**
         * 右上角wps打开按钮隐藏(pc) 1.1.2
         * @param action
         * @param callback return [] 即可实现按钮隐藏
         */
        on(action: "Header.openWpsButton.filter", callback: (data: {
            openClienList: OpenWpsButton[];
            fileInfo: FileInfo;
        }) => OpenWpsButton[]): any;
        /**
         * 右上角wps打开按钮拦截(pc) 1.1.2
         * @param action
         * @param callback openWpsClient：WPS打开  openKdocsClient：金山文档客户端打开
         */
        on(action: "Header.openWpsButton.intercept", callback: (data: {
            fileInfo: FileInfo;
            key: "openWpsClient" | "openKdocsClient";
            userInfo: UserInfo;
        }) => Promise<boolean>): any;
        /**
         * 左上角金山文档提示文案修改(PC) 1.1.4
         * @param action
         * @param callback text 左上角金山文档提示文案
         */
        on(action: "Header.leftLogoTip.reset", callback: (text: string) => string): any;
        /**
         * 文档预览-右侧历史版本面板-屏蔽恢复文档按钮 1.1.5
         * @param action
         * @param callback
         */
        on(action: "HistoryPanel.versionRecovery.visible", callback: (param: {
            fileInfo: HistoryFileInfo;
        }) => Promise<boolean>): any;
        /**
         * 文档预览-右侧历史版本面板-更多菜单过滤 1.1.5
         * @param action
         * @param callback
         */
        on(action: "HistoryPanel.moreMenu.filter", callback: (data: {
            fileInfo: HistoryFileInfo;
            menus: {
                key: "history" | "rename" | "historyMark" | "recover" | "saveAs";
            }[];
        }) => Promise<{
            key: "history" | "rename" | "historyMark" | "recover" | "saveAs";
        }[]>): any;
    }
    /**
     * @interfaceContent
     */
    export interface IMicroAttach extends InitOption<ISdkLanguageVue> {
        interceptors: {
            request: AxiosInterceptorManager<AxiosRequestConfig>;
            response: AxiosInterceptorManager<AxiosResponse>;
        }[];
        getApplication: () => Promise<any>;
        getFileInfo: () => Promise<{
            id: string;
            name: string;
            type: string;
            office_type: string;
            group_id: string;
            ext: string;
            corp_id: string;
            groupid: string;
            [key: string]: any;
        }>;
    }
    /**
     * @notExported
     */
    export namespace ENCS_MICRO {
        type SDK = IWebOfficeSDK;
        type Attach = IMicroAttach;
    }
}
