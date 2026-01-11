// export class Recipient {
//     id: number | string;
//     userId: string;
//
//     subject: string;
//     message: string;
//
//     name: string;
//     email: string;
//     mobile: string;
//
//     profileUrl: string;
//
//     constructor(model: any = <any>{}){
//         const {
//             id,
//             userId, email, mobile, name, profileUrl,
//             subject, message
//         } = model;
//
//         this.id = id;
//         this.name = name;
//         this.userId = userId;
//         this.email = email;
//         this.mobile = mobile;
//
//         this.subject = subject;
//         this.message = message;
//
//         this.profileUrl = profileUrl;
//     }
// }
//
// export class RecipientSerializer {
//     fromJson(json: any): Recipient { return new Recipient(json); }
//     toJson(data: any): any { }
// }