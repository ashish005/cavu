export class UserEdit {
    constructor(model) {
        const { currentPassword, newPassword, confirmPassword} = model;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    public currentPassword: string;
    public newPassword: string;
    public confirmPassword: string;

}
