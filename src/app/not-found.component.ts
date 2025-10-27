import {Component} from '@angular/core';

@Component({
  template: `<div class="d-flex flex align-items-center h-v">
    <div class="text-center p-5 w-100">
        <h1 class="display-5 my-5 text-theme">pageNotFound</h1>
        <p><a href="/" class="h5 b-b b-theme">backToHome</a></p>
        <p class="my-5 text-muted h4">-- 404 --</p></div>
</div>`, standalone: false
})
export class NotFoundComponent {
  notFound!: any;
}
