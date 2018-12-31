import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from '../services/common.service';
import * as OT from '@opentok/client';

@Injectable()
export class opentokService { 
    
    session: OT.Session;
    token: string;

    constructor( private http: Http, private CommonService: CommonService) {}

    url = this.CommonService.base_url;

    getOT() {
        return OT;
    }

    createSession() {
        return this.http.get(this.url+'/opentok/createsession').map((res: Response) => res.json());
    }

    generateToken(data) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data);
        return this.http.post(this.url+'/opentok/generatetoken', body, options ).map((res: Response) => res.json());
    }

    initSession(config) {
        this.session = this.getOT().initSession(config.apikey, config.sessionId);
        return Promise.resolve(this.session);
        
    }

    connect(config) {
        return new Promise((resolve, reject) => {
            this.session.connect(config.token, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(this.session);
            }
            });
        });
    }

} 