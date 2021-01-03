import { Component, OnInit } from '@angular/core';
import { CaixaModel } from '../model/caixa.model';
import { ServiceService } from '../service/service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public caixaForm: FormGroup;
  caixa = {} as CaixaModel;
  caixas: CaixaModel[];

  constructor(
    public caixaService: ServiceService,
    private fb: FormBuilder,
    private rest: ServiceService,
  ) { }

  ngOnInit() {
    this.getCaixas();
    this.caixaForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  getCaixas() {
    this.caixaService.getCaixas().subscribe((caixas: CaixaModel[]) => {
      this.caixas = caixas;
      console.log(this.caixas);
    });
  }

  createCaixa() {
    if(this.caixaForm.value.name != null){
      this.rest.saveCaixa(this.caixaForm.value).subscribe(result => {
        console.log(result);
       }, function(error){
         console.log(error);
       });
    }
    this.caixaForm.reset();
    this.getCaixas();
  }

  deleteCaixa(caixa: CaixaModel) {
    this.rest.deleteCaixas(caixa).subscribe(() => {
      this.getCaixas();
    });
  }

  openModal(caixa: CaixaModel){
    this.caixa = { ...caixa};
  }

  editCaixa(caixa: CaixaModel) {
    
    this.caixa = { ...caixa };
    console.log("this.caixa: " + this.caixa);
    this.rest.updateCaixas(caixa).subscribe(() => {
      
      this.caixa = caixa;
      console.log(this.caixa.id)
    })
  }

  
}
