import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {OrderService} from "../services/order.service";
import {Order} from "../model/order.model";
import {AddressService} from "../services/address.service";
import {Address} from "../model/address.model";
import {TypeCargo} from "../model/typeCargo.model";
import {TypeCargoService} from "../services/typeCargo.service";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {NotificationService} from "../services/notification.service";
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['name', 'price', 'loc', 'dest', 'volume', 'weight'];
  dataSource: any;

  public pageSize = 7;

  @ViewChild('mapElement')
  mapElement: ElementRef;

  @ViewChild
  (MatPaginator) paginator: MatPaginator;

  constructor(private authService: AuthService,
              private orderService: OrderService,
              private addressService: AddressService,
              private typeService: TypeCargoService,
              private notificationService: NotificationService) {
  }

  public orderList: Order[] = [];
  public addressListDest: Address[] = [];
  public addressListLoc: Address[] = [];
  public typeList: TypeCargo[] = [];


  dest: Address = new Address();
  loc: Address = new Address();
  type: TypeCargo = new TypeCargo();
  price: number;

  isLoaderAddress: boolean = false;
  isLoaderType: boolean = false;
  isLoaderOrder: boolean = false;
  isMap: boolean = false;
  keyMap: boolean = true;
  public map: mapboxgl.Map;


  controlDest = new FormControl();
  controlLoc = new FormControl();
  controlType = new FormControl();

  filteredAddressDest: Observable<Address[]>;
  filteredAddressLoc: Observable<Address[]>;
  filteredType: Observable<TypeCargo[]>;


  inputDest: string = '';
  inputLoc: string = '';
  inputType: string = '';

  STATUS_OPEN: string = 'open';


  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxKey;

    this.getAddressCityDistinct();
    this.getType();

    this.filteredAddressDest = this.controlDest.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDest(value))
    );

    this.filteredAddressLoc = this.controlLoc.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLoc(value))
    );

    this.filteredType = this.controlType.valueChanges.pipe(
      startWith(''),
      map(value => this._filterType(value))
    );

  }

  ngAfterViewInit(){
    console.log(this.mapElement)
    this.map = new mapboxgl.Map({
      container: this.mapElement.nativeElement, // container id
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [49.3859888, 53.5431899], // starting position
      zoom: 11
    });
    this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: false
          },
          trackUserLocation: true,
          fitBoundsOptions: {maxZoom:11}
        })
    );
  }


  private _filterDest(value: string): Address[] {
    const filterValue = this._normalizeValue(value);
    return this.addressListDest.filter(address => this._normalizeValue(address.city).includes(filterValue));
  }

  private _filterLoc(value: string): Address[] {
    const filterValue = this._normalizeValue(value);
    return this.addressListLoc.filter(address => this._normalizeValue(address.city).includes(filterValue));
  }

  private _filterType(value: string): TypeCargo[] {
    const filterValue = this._normalizeValue(value);
    return this.typeList.filter(type => this._normalizeValue(type.name).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  getAddressCityDistinct(): void {
    this.addressService.getAddressAllCityDistinct().subscribe((data: Address[]) => {
        this.addressListDest = data;
        this.addressListLoc = data;
      },
      () => {
        this.isLoaderAddress = false;
      },
      () => {
        this.isLoaderAddress = true;
      });
  }

  public getType(): void {
    this.typeService.getType().subscribe((data: TypeCargo[]) => {
        this.typeList = data
      },
      () => {
      },
      () => {
        this.isLoaderType = true
      });
  }

  addDestination(dest: Address): void {
    this.dest = dest;
  }

  clearDest(): void {
    if (this.inputDest == '') {
      this.dest.addressId = null;
    } else {
      return;
    }
  }

  addLocation(loc: Address): void {
    this.loc = loc;
  }

  clearLoc(): void {
    if (this.inputLoc == '') {
      this.loc.addressId = null;
    } else {
      return;
    }
  }

  addType(type: TypeCargo): void {
    this.type = type;
  }

  clearType(): void {
    if (this.inputType == '') {
      this.type.typeId = null;
    } else {
      return;
    }
  }


  fillTableOrderByStatusOpen(): void {
    if (this.loc.city != null && this.dest.city != null && this.type.typeId != null && this.price != null) {

      if (this.price > 0 && this.price < 9999999){
        this.orderService.getOrderListByLocDestTypePriceStatus(this.loc.city, this.dest.city, this.type.typeId, this.price, this.STATUS_OPEN)
          .subscribe((result: Order[]) => {
              let array = [];
              result.forEach(function (item) {
                array.push({
                  "id": item.id,
                  "name": item.name,
                  "status": item.status.name,
                  "price": item.price,
                  "loc": item.location.city + ', ' + item.location.street,
                  "dest": item.destination.city + ', ' + item.destination.street,
                  "volume": item.box.volume.toFixed(4),
                  "weight": item.box.weight
                });
              })
              this.dataSource = new MatTableDataSource<any>(array);
              this.dataSource.paginator = this.paginator;
              this.orderList = result;
              this.createMarkers();
            }, () => {
              this.isLoaderOrder = false
            },
            () => {
              this.isLoaderOrder = true;
            });

      }else{
        this.notificationService.add('priceError');
        setTimeout(()=>{this.notificationService.remove('priceError')}, 2000);
      }

    } else {
      this.notificationService.add('dataError');
      setTimeout(() => {
        this.notificationService.remove('dataError')
      }, 2000);
    }
}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  mapOn():void{
    this.isMap = true;
    this.keyMap = false;
  }

  mapOff():void{
    this.isMap = false;
    this.keyMap = true;
  }

  public createMarkers(){
    for (var i = 0; i < this.orderList.length; i++) {

      var html = '<h2>' + this.orderList[i].box.name +'</h2>'+
          '<b>To:</b><br> ' +
          '<b>Country: </b> ' +
          '<span>' + this.orderList[i].destination.country + ' </span>' +
          '<b>City: </b> ' +
          '<span>' + this.orderList[i].destination.city + ' </span><br>' +
          '<b>Street: </b> ' +
          '<span>' + this.orderList[i].destination.street+ ' </span><br> ' +
          '<b>Home: </b> ' +
          '<span>' + this.orderList[i].destination.home+ ' </span> ' +
          '<b>Apartment: </b> ' +
          '<span>' + this.orderList[i].destination.apartment + '</span><br>' ;

      var popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(html);
      const marker = new mapboxgl.Marker({
        draggable: false
      })
          .setLngLat([this.orderList[i].location.lng, this.orderList[i].location.lat])
          .setPopup(popup)
          .addTo(this.map);
    }
  }
}
