import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/service.index';

declare function init_datatables();

@Component({
  selector: 'app-gtrips',
  templateUrl: './gtrips.component.html',
  styles: []
})
export class GtripsComponent implements OnInit {

  users: User[] = [];

  constructor(public userService: UserService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.userService.cargarUsuarios()
    .subscribe( (res: any) => {
        this.users = res.usuarios;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

}
