import { Component, OnInit } from '@angular/core';
import { CaixaModel } from '../model/caixa.model';
import { ServiceService } from '../service/service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';
import { SiteModel } from '@alfresco/adf-core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public caixaForm: FormGroup;
  public caixaFormEdit: FormGroup;
  caixa = {} as CaixaModel;
  caixas: CaixaModel[];

  constructor(
    public caixaService: ServiceService,
    private fb: FormBuilder,
    private rest: ServiceService,
  ) { }

  ngOnInit() {
    this.getCaixas();
    //this.getGroups();
    this.caixaForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.caixaFormEdit = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  getCaixas() {
    this.caixaService.getCaixas().subscribe((caixas: CaixaModel[]) => {
      this.caixas = caixas;
      console.log(this.caixas);
      this.getGroups();
    });
  }

  getGroups(){
    const alfrescoApi = new AlfrescoApi({
      hostEcm: 'http://localhost:4200'
    });
    const groupsApi = new GroupsApi(alfrescoApi);
    groupsApi.listGroups().then((data) => {
      console.log('Chamada a API feita com sucesso: ' + data.list.entries[5].entry.displayName);
    }, function(error){
      console.log(error);
    })
  }

  // addCaixaWithNameGroup(){
  //   const alfrescoApi = new AlfrescoApi({
  //     hostEcm: 'http://localhost:4200'
  //   });
  //   const groupsApi = new GroupsApi(alfrescoApi);

  //   groupsApi.listGroups().then((data) => {
  //     //console.log('Chamada a API feita com sucesso: ' + data.list.entries[5].entry.displayName);
  //     this.rest.saveCaixa(data.list.entries[5].entry.displayName)
  //   }, function(error){
  //     console.log(error);
  //   })
  // }

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
    window.location.reload();
  }

  deleteCaixa(caixa: CaixaModel) {
    this.rest.deleteCaixas(caixa).subscribe(() => {
      this.getCaixas();
    });
  }

  openModal(caixa: CaixaModel){
    this.caixa = { ...caixa};
     console.log(this.caixa);
  }

  openModalDelete(caixa: CaixaModel){
    this.caixa = { ...caixa};
  }

  editCaixa(caixa: CaixaModel) {
    this.rest.updateCaixas(caixa).subscribe(() => {
      this.caixa = caixa;
      console.log(this.caixa.id)
    })
    this.getCaixas();
    this.caixaFormEdit.reset();
    window.location.reload();
  }

  
}
