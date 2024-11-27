import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';
import {
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
type MockAnimal = {
  id: number;
  value: number;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'animal-breeding-simulator';
  animals = signal([] as MockAnimal[])
  rawData = [] as MockAnimal[]
  worker!: Worker
  colDefs: ColDef[] = [
    { field: "id" },
    { field: "value" }
  ];

  private gridApi!: GridApi;


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    params.api.setGridOption("rowData", this.rawData);
  }

  public getRowId: GetRowIdFunc = (params: GetRowIdParams) =>
    String(params.data.id);
  constructor( ){
    
  if (typeof Worker !== 'undefined') {
    // Create a new
    this.worker = new Worker(new URL('./app.worker', import.meta.url));
    this.worker.onmessage = ({ data }) => {
      
      this.animals.set(data)
      this.gridApi.applyTransactionAsync({
        update: data
      })
    };
    const data = this.animals()
  } else {
    // Web Workers are not supported in this environment.
    // You should add a fallback so that your program still executes correctly.
  }
    const list = new Array()
    for (let i = 0; i < 100_000; i++) {
      list.push({
        id: i,
        value: 0
      })
    }
    this.rawData = list
    this.animals.set(list)
    //@ts-ignore
setInterval(() => 
  this.worker.postMessage(this.animals()), 500)

  }

}



