import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebaseui from './firebaseui-fr'

/*
 * Created by Raphael Jenni
 * Copyright (c) 2017 Raphael Jenni
 */

@Injectable()
export class FirebaseUIService {
    public firebaseUiInstance: firebaseui.auth.AuthUI;

    constructor(angularFireAuth: AngularFireAuth) {
        // store the firebaseui instance on the window object to prevent double initialization
        if (!(<any>window).firebaseUiInstance) {
            (<any>window).firebaseUiInstance = new firebaseui.auth.AuthUI(angularFireAuth.auth);
        }
        this.firebaseUiInstance = (<any>window).firebaseUiInstance as firebaseui.auth.AuthUI;
    }
}