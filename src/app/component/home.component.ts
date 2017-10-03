import {Component, OnInit} from "@angular/core";
import {UserService} from "../service/user.service";
import {Artist} from "../model/artist";

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

    public recentArtists: Array<Artist>;

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.recentArtists = this.userService.listRecentArtists();
    }
}