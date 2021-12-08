import { Component, ViewEncapsulation } from '@angular/core';
import { FuseLoadingService } from '@fuse/services/loading/loading.service';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent
{
    /**
     * Constructor
     */
    constructor(
        private _fuseLoadingService: FuseLoadingService
    )
    {
        this._fuseLoadingService.hide();
    }
}
