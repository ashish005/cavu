import {CoreQueryOptions, CoreResource} from "@app-global";
export class UserDocument {
  id: string;
  documentTypeId: number;
  name: string;
  fileName: string;
  contentType: string;
  fileSize: string;
  file: any;
  fileLocation: string;
  showName: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.documentTypeId = model.documentTypeId;
    this.name = model.name;
    this.fileName = model.fileName;
    this.contentType = model.contentType;
    this.fileSize = model.fileSize;
    this.file = model.file;
    this.fileLocation = model.fileLocation;
    this.showName = model.showName;
  }
}

export class OrgEmployeeQueryOptions extends CoreQueryOptions {}

export class OrgEmployee extends CoreResource {
    title: string;
    fName: string;
    lName: string;
  birthday: string;
  email: string;
  phone: string;
  registrationNo: string;
  registrationDate: string;
  name: string;
  dob: string;
  genderId: number;
  maritalStatusId: number;
  bloodGroupId: number;
  casteId: number;
  reservationCategoryId: number;
  nationalityId: number;
  dutyTypeId: number;
  postId: number;

  accountId: string;
  userTypeId: number;

  religionId: number;
  profileId: string;
  profileUrl: string;

  joiningDate: string;

  orgUserId: string;
  roles: Array<{id, roleId, name}>;

    dutyType: string;
    post: string;

  constructor(model: any = <any>{}){
    super();
    this.id = model.id;
    this.registrationNo = model.registrationNo;
    this.registrationDate = model.registrationDate;
    this.dob = model.dob;
    this.name = model.name;
    this.title = model.title;
    this.fName = model.fName;
    this.lName = model.lName;
    this.phone = model.phone;
    this.genderId = model.genderId;
    this.maritalStatusId = model.maritalStatusId;
    this.bloodGroupId = model.bloodGroupId;
    this.casteId = model.casteId;
    this.reservationCategoryId = model.reservationCategoryId;
    this.nationalityId = model.nationalityId;

    this.accountId = model.accountId;  // important
    this.userTypeId = model.userTypeId;
    this.email = model.email;

    this.profileId = model.profileId;
    this.profileUrl = model.profileUrl;

    this.joiningDate = model.joiningDate;
    this.dutyTypeId = model.dutyTypeId;
    this.postId = model.postId;
    this.religionId  =  model.religionId;

      this.dutyType  =  model.dutyType;
      this.post  =  model.post;

    this.orgUserId = model.orgUserId;
    this.roles = (model.roles || []).map(r => r);
  }
}

export class OrgEmployeeSerializer {
  fromJson(json: any): OrgEmployee {
    return new OrgEmployee(json);
  }

  toJson(data: any): any {
    // let info = {
    //   id: data.id,
    //   registrationNo: data.registrationNo,
    //   registrationDate: data.registrationDate,
    //   title: data.title,
    //   fName: data.fName,
    //   lName: data.lName,
    //   email: data.email,
    //   phone: data.phone,
    //   dob: data.dob,
    //   genderId: data.genderId,
    //   maritalStatusId: data.maritalStatusId,
    //   bloodGroupId: data.bloodGroupId,
    //   religion: data.religion,
    //   casteId: data.casteId,
    //   nationalityId: data.nationalityId,
    //   reservationCategoryId: data.reservationCategoryId,
    //   courseInfo: data.courseInfo,
    //   feePlan: data.feePlan
    // };
    //Hook for profile pic
    //info.profile.documentTypeId = 1;

    /*info['userContact'] = (data.contacts || []).map((model) => {
      let data = new UserContact(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    });

    info['userAddress'] = (data.address || []).map((model) => {
      let data = new UserAddress(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    }).filter((r)=> (r.pinCodeId));

    info['userRelation'] = (data.relation || []).map((model) => {
      let data = new UserRelation(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    });*/

    /*info.courseInfo = (data.courseInfo || []).map((model) => {
      let data = new StudentBatch(model);
      if(!data.id){
        delete data.id;
      }
      return data;
    });*/


    return data;
  }
}
