import { Component, OnInit } from '@angular/core';
import { Order } from "../model/order.model";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { OrderService} from "../services/order.service";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  constructor(public route: ActivatedRoute,
              public location: Location,
              public orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrder();
  }

  public orderDet: Order[] = [];

  getOrder(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderDet = this.orderService.ordersList.filter(o => o.id == id);
  }

  goBack(): void {
    this.location.back();
  }
}