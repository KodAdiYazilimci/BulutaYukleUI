import { Component, Input, OnInit } from "@angular/core";
import { RegionModel } from "../../models/model.region";
import { AuthenticationService } from 'src/app/services/services.authentication';
import { AuthenticationRepository } from 'src/app/repositories/repositories.authentication';
import { Router } from '@angular/router';

@Component({
    selector: "login",
    templateUrl: "./component.login.html",
    styleUrls: ["./component.login.css"],
    providers: [AuthenticationService]
})
export class LoginComponent implements OnInit {

    @Input()
    public email: string = "";

    @Input()
    public password: string = "";

    @Input()
    public region: string = "tr-TR";

    public regions: Array<RegionModel>;

    public wrongPassword: boolean = false;

    public getRegions(): Array<RegionModel> {
        let regions: Array<RegionModel> = new Array<RegionModel>();

        let tr: RegionModel = new RegionModel();
        tr.code = "tr-TR";
        tr.name = "Türkçe";
        regions.push(tr);

        let en: RegionModel = new RegionModel();
        en.code = "en-US";
        en.name = "English";
        regions.push(en);

        return regions;
    }

    constructor(private _router: Router,
        private _authenticationService: AuthenticationService) { }

    ngOnInit(): void {
        this.regions = this.getRegions();
    }

    public async Login() {
        if (await this._authenticationService.login(this.email, this.password, this.region)) {
            this._router.navigate(["/Anasayfa"]);
        }
    }
}