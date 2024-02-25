import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
/* eslint-disable @typescript-eslint/no-explicit-any */

import 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/mode/javascript/javascript';
  
bootstrapApplication(AppComponent, appConfig)
.then(ref => {
    // Ensure Angular destroys itself on hot reloads.
    if ((window as any).ngRef) {
        (window as any).ngRef.destroy();
    }
    (window as any).ngRef = ref;
}).catch((err) => console.error(err));
