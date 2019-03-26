## Alert (SwalService)

##### static native

sweetalert2 native object

##### addAlert(res: any, form: FormGroup, reset?: any, customize?: AlertCustomize): Observable< any >

Add a return feedback bar

- **res** Request response result
- **form** Form object
- **reset** FormGroup reset value
- **customize** Custom text
    - **text** Prompt text
    - **error_text** Return error text
    - **confirmButtonText** Confirm button text
    - **cancelButtonText** Cancel button text
- **Return** `Observable<any>`

For example, in the component form submission under the new operation, `status` is `true` for confirmation prompt box.

```typescript

export class AdminAddComponent implements OnInit {

    ...

    submit(data) {
        this.adminService.add(data).pipe(
            switchMap(res => this.swal.addAlert(res, this.form, {
                status: true
            }))
        ).subscribe((status) => {
            // status => true or false
        });
    }
}
```

##### editAlert(res: any, customize?: AlertCustomize): Observable< any >

Modify return feedback bar

- **res** Request response result
- **customize** Custom text
    - **text** Prompt text
    - **error_text** Return error text
    - **confirmButtonText** Confirm button text
    - **cancelButtonText** Cancel button text
- **Return** `Observable<any>`

For example, in the component form submission under the modify operation, `status` is `true` for the confirmation prompt box.

```typescript
export class AdminEditComponent implements OnInit {
    private id: any;

    ...

    submit(data) {
        data.id = this.id;
        this.adminService.edit(data).pipe(
            switchMap(res => this.swal.editAlert(res))
        ).subscribe((status) => {
            // status => true or false
        });
    }
}
```

##### deleteAlert(service: Observable< any >, customize?: AlertCustomize)

Delete return feedback bar

- **service** Delete request object
- **customize** Custom text
    - **text** Prompt text
    - **confirmButtonText** Confirm button text
    - **cancelButtonText** Cancel button text
- **Return** `Observable<any>`

For example, when used under a delete operation, the subscription returns the response value of the delete request object.

```typescript
export class AdminIndexComponent implements OnInit {
    ...

  deleteData(id: any) {
    this.swal.deleteAlert(this.adminService.delete(id)).subscribe(res => {
      if (!res.error) {
        this.notification.success(this.bit.l['operate_success'], this.bit.l['delete_success']);
        this.getLists(true);
      } else {
        switch (res.msg) {
          case 'error:self':
            this.notification.error(this.bit.l['operate_error'], this.bit.l['error_delete_self']);
            break;
          default:
            this.notification.error(this.bit.l['operate_error'], this.bit.l['delete_error']);
        }
      }
    });
  }
}
```