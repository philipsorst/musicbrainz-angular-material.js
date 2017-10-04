import {Injectable} from "@angular/core";
import {Restangular} from "ngx-restangular";
import {ReleaseGroup} from "../model/release-group";
import {Observable} from "rxjs/Observable";
import {PaginatedArray} from "../module/paginated-array";

@Injectable()
export class MusicbrainzService {

    constructor(private restangular: Restangular) {
    }

    public listAllReleaseGroups(artistId: string): Promise<Array<ReleaseGroup>> {

        let localRestangular = this.restangular;
        let allReleaseGroups: Array<ReleaseGroup> = [];
        let limit = 100;

        function fetchReleaseGroups(artistId: string, offset: number, limit: number = 100): Observable<PaginatedArray<ReleaseGroup>> {
            return localRestangular.all('release-group').getList({
                'artist': artistId,
                'limit': limit,
                'offset': offset
            });
        }

        function fetchmorepages(paginatedReleaseGroups: PaginatedArray<ReleaseGroup>) {
            allReleaseGroups = allReleaseGroups.concat(paginatedReleaseGroups);
            if (paginatedReleaseGroups.pagination.offset + limit < paginatedReleaseGroups.pagination.count) {
                console.log('Fetching more pages');
                return fetchReleaseGroups(artistId, paginatedReleaseGroups.pagination.offset + limit, limit).toPromise().then(fetchmorepages);
            }

            return allReleaseGroups;
        }

        return fetchReleaseGroups(artistId, 0, limit).toPromise().then(fetchmorepages)
    }
}
