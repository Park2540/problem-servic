import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 import { MatPaginator } from '@angular/material/paginator';
 import { NgForm,FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SettingService } from 'src/app/servics/setting/setting.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import {MultiSelectModule} from 'primeng/multiselect';
interface System {
  id: number;
  name: string
}
// ส่วนของแบบฟรอมส่ง
export class Systemlis{
  id:number
  name: string;
}
// ส่วนของการแสดง
export class Systemlist{
  id:number;
  name: string;
}
@Component({
  selector: 'app-statustics',
  templateUrl: './Statistics.component.html',
  styleUrls: ['./Statistics.component.css']
})

// ...........เป็นการเรียกใช้tableในprimeng..........
export class StatisticsComponent implements OnInit { 
  details: any;
  displayedColumns: string[] = ['name','delete','detail'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('modalupdate') modalupdate: ElementRef;
  @ViewChild('modaldelete') modaldelete: ElementRef;
  @ViewChild(MatSort) sort !: MatSort;
  Systemlis: Systemlis = new Systemlis();
  dataSource = new MatTableDataSource<Systemlist>()
  
  Systemlisform: FormGroup;
  updateSystemlis: FormGroup;
  // systems: System[] = []
  private modalRef: NgbModalRef;
  
  constructor(
    private action: FormBuilder,
    private Us: FormBuilder,
    private actrouter: ActivatedRoute,
    private router: Router,
    private SettingService: SettingService,
    private modalService: NgbModal,
    private changeDetectorRefs: ChangeDetectorRef,
    // private dialogRef: MatDialogRef<OpenDialogdelete>
    ) { }
    
  ngOnInit(): void {
    this. Systemlisform =this.Us.group({
      name : ['',Validators.required],
  
    });
    this.updateSystemlis =this.action.group({
      name : ['',Validators.required],
    });
   
    this.getListSystem()
    // this.getSystems()
    
  }

  onSubmit(){
    if (this.Systemlisform.valid){
      this.SettingService.createNewSystem(this.Systemlisform.value).subscribe((res:any) => {
        console.log(this.Systemlisform.value);
        console.log(res);
        this.getListSystem()
        this.comfirms()
        this.closeDialog()
        this.Systemlisform.reset(); 
      })
      
    }
  }
  onSubmitUpdate(){
   
    if (this.updateSystemlis.valid){
      this.SettingService.updateSystem(this.Systemlis.id,this.updateSystemlis.value).subscribe((res:any) => {
        console.log(this.updateSystemlis.value);
        console.log(res);
        this.getListSystem()
        this.comfirms()
        this.closeDialog()
        
      })
      
    }
    
  }
  onSubmitdelete(){
    console.log('hello');
      this.SettingService.deleteSystem(this.Systemlis.id).subscribe((res:any) => {
        this.getListSystem()
        this.comfirms()
        this.closeDialog()
        
      })
  }
  
  OpenDialog(enteranimation: any, exitanimation: any,code:any) {
    console.log('open modal')
    this.modalService.open(this.modal, {
    size: 'lg'
  }
  
  );
  }
  OpenDialogupdate(enteranimation: any, exitanimation: any,code:any) {
    console.log(code)
    this.Systemlisform.controls['name'].setValue(code.name)
    this.Systemlis.id = code.id;
    this.Systemlis.name = code.name;
    
    
    this.modalService.open(this.modalupdate, {
    size: 'lg'
  });}
  OpenDialogdelete(enteranimation: any, exitanimation: any,code:any) {
    console.log(code)
    this.Systemlisform.controls['name'].setValue(code.name)
    this.Systemlis.id = code.id;
    this.Systemlis.name = code.name;
    
    this.modalService.open(this.modaldelete, {
    size: 'lg'}
    );
    
}
closeDialog(){
  this.modalService.dismissAll();

}
getListSystem(){
    this.SettingService.getListSystem().subscribe((data:any ) => {
      console.log(data);
      var newdata:Systemlis[] = data;
      this.details = data[0]
      console.log(newdata);
      this.dataSource.data = newdata;
      this.changeDetectorRefs.detectChanges()
    })

  }
  // getSystems() {
  //   this.SettingService.getListSystem().subscribe((res: any)=> {
  //     this.systems = res
  //     console.log(this.systems)
  //     this.changeDetectorRefs.detectChanges()
  //   })
  // }
  comfirms(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'บันทึกรายการสำเร็จ',
      showConfirmButton: false,
      timer: 1500
    })
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
