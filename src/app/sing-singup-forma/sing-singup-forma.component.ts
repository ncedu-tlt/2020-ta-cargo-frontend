import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sing-singup-forma',
  templateUrl: './sing-singup-forma.component.html',
  styleUrls: ['./sing-singup-forma.component.css']
})
export class SingSingupFormaComponent implements OnInit {

  toggleForm : boolean = false

  constructor() { }

  ngOnInit(): void {
  }

 _clickSignup(): void{
  this.toggleForm = !this.toggleForm
 }
}
