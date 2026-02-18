import {CoreQueryOptions, CoreResource} from "@app-global";

export class TeamQueryOptions extends CoreQueryOptions{
  teamId: any;
  constructor(model: any = {}){ super(model);}

  override toQueryString (){
      const obj = {
          teamId:this.teamId
      };
      return super.getParamByObject(obj);
  }
}

export class Team extends CoreResource {
    email: string;
    name: string;
    phone: string;
    userId: string;

  constructor(model: any = <any>{}){
    super();
    const {email, name, mobile, userId} = model;
    this.email = email;
    this.name = name;
    this.phone = mobile;
    this.userId = userId;
  }
}

export class TeamSerializer {
  fromJson(json: any): Team { return new Team(json); }
  toJson(client: any): any { return { name: client.name }; }
}
