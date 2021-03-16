import {Pipe, PipeTransform} from "@angular/core";
import {Order} from "../model/order.model";

@Pipe({name: 'orderFilterByName'})
export class OrderFilterByNamePipe implements PipeTransform {
  transform(order: Order[], search: string): Order[] {
    return order.filter(order => {return order.id.toString().includes(search)});
  }
}