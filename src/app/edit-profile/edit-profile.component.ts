import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Client} from "../model/client.model";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../services/client.service";
import {ProfileComponent} from "../profile/profile.component";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(public modal: NgbActiveModal,
              private route: ActivatedRoute,
              private usersService: ClientService,
              private formBuilder: FormBuilder) { }


  profile: Client;
  editForm: FormGroup;
  isLoading = false;
  passwordConfirm;

  ngOnInit() {
    this.setForm()
  }


  onSubmit() {
    if (this.editForm.getRawValue().password == this.passwordConfirm) {
      this.isLoading = true;
      this.usersService.modify(this.editForm.value)
        .subscribe((response) => {
          this.isLoading = false;
          this.modal.close('Yes');
          if (response.status === 200) {
            console.log("data was updated");
          }
          }, error => {
            alert('error');
        });
      this.isLoading = false;
    } else {
      alert('passwords not equals');
    }
  }

  get editFormData() { return this.editForm.controls; }

  private setForm() {
    console.log(this.profile);

    this.editForm = this.formBuilder.group({
      userId: [this.profile.userId],
      firstName: [this.profile.firstName, Validators.required],
      lastName: [this.profile.lastName, Validators.required],
      phone: [this.profile.phone, Validators.required],
      password: [this.profile.password, Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }
}
