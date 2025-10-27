import {ClientAPIResolver, ClientByIdAPIResolver} from "./api.resolver";
import {ClientContactService} from "./client-contacts.service";

export {ClientAPIResolver, ClientByIdAPIResolver} from "./api.resolver";
export {ClientContactService} from "./client-contacts.service";

export const CLIENT_SERVICES = [
    ClientAPIResolver, ClientByIdAPIResolver, ClientContactService
];