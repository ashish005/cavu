import {Injectable, Injector} from "@angular/core";
import { OrgResourceService } from "@app-global";
import {PostMaster, PostMasterSerializer} from "../domains/post.serializer";

@Injectable()
export class PostMasterService extends OrgResourceService<PostMaster>{
  constructor(public override injector: Injector) {
    super(injector, 'masterType/employeePost', new PostMasterSerializer());
  }
}
