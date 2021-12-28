import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigation, defaultNavigation, futuristicNavigation, horizontalNavigation } from 'app/mock-api/common/navigation/data';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi
{
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _authService: AuthService
    )
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                // Fill compact navigation children using the default navigation
                this._compactNavigation.forEach((compactNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === compactNavItem.id )
                        {
                            const hasChildren = defaultNavItem.children !== undefined;
                            const currentPageRight = this._authService.moduleRights() && this._authService.moduleRights().find(el => el.page_name.toLocaleLowerCase() === defaultNavItem.id.toLocaleLowerCase())?.isChecked || false;
                            defaultNavItem.disabled = !currentPageRight && !hasChildren;
                            defaultNavItem.active = !currentPageRight && !hasChildren;
                            compactNavItem.disabled = !currentPageRight && !hasChildren;
                            compactNavItem.active = !currentPageRight && !hasChildren;
                            if(hasChildren) {
                                let isAllChildDisabled = true;
                                defaultNavItem.children.forEach(element => {
                                    const childItemRight = this._authService.moduleRights() && this._authService.moduleRights().find(el => el.page_name.toLocaleLowerCase() === element.id.toLocaleLowerCase())?.isChecked;
                                    element.disabled = !childItemRight;
                                    if(childItemRight) {
                                        isAllChildDisabled = false;
                                    }
                                });
                                defaultNavItem.disabled = isAllChildDisabled;
                                compactNavItem.disabled = isAllChildDisabled;
                            }
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill futuristic navigation children using the default navigation
                this._futuristicNavigation.forEach((futuristicNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === futuristicNavItem.id )
                        {
                            const hasChildren = defaultNavItem.children !== undefined;
                            const currentPageRight = this._authService.moduleRights() && this._authService.moduleRights().find(el => el.page_name.toLocaleLowerCase() === defaultNavItem.id.toLocaleLowerCase())?.isChecked;
                            defaultNavItem.disabled = !currentPageRight && !hasChildren;
                            defaultNavItem.active = !currentPageRight && !hasChildren;
                            futuristicNavItem.disabled = !currentPageRight && !hasChildren;
                            futuristicNavItem.active = !currentPageRight && !hasChildren;
                            if(hasChildren) {
                                let isAllChildDisabled = true;
                                defaultNavItem.children.forEach(element => {
                                    const childItemRight = this._authService.moduleRights() && this._authService.moduleRights().find(el => el.page_name.toLocaleLowerCase() === element.id.toLocaleLowerCase())?.isChecked;
                                    element.disabled = !childItemRight;
                                    if(childItemRight) {
                                        isAllChildDisabled = false;
                                    }
                                });
                                defaultNavItem.disabled = isAllChildDisabled;
                                futuristicNavItem.disabled = isAllChildDisabled;
                            }
                            futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill horizontal navigation children using the default navigation
                this._horizontalNavigation.forEach((horizontalNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === horizontalNavItem.id )
                        {
                            const hasChildren = defaultNavItem.children !== undefined;
                            const currentPageRight = this._authService.moduleRights() && this._authService.moduleRights().find(el => el.page_name.toLocaleLowerCase() === defaultNavItem.id.toLocaleLowerCase())?.isChecked;
                            defaultNavItem.disabled = !currentPageRight && !hasChildren;
                            defaultNavItem.active = !currentPageRight && !hasChildren;
                            horizontalNavItem.disabled = !currentPageRight && !hasChildren;
                            horizontalNavItem.active = !currentPageRight && !hasChildren;
                            if(hasChildren) {
                                let isAllChildDisabled = true;
                                defaultNavItem.children.forEach(element => {
                                    const childItemRight = this._authService.moduleRights() && this._authService.moduleRights().find(el => el.page_name.toLocaleLowerCase() === element.id.toLocaleLowerCase())?.isChecked;
                                    element.disabled = !childItemRight;
                                    if(childItemRight) {
                                        isAllChildDisabled = false;
                                    }
                                });
                                defaultNavItem.disabled = isAllChildDisabled;
                                horizontalNavItem.disabled = isAllChildDisabled;
                            }
                            horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Return the response
                return [
                    200,
                    {
                        compact   : cloneDeep(this._compactNavigation),
                        default   : cloneDeep(this._defaultNavigation),
                        futuristic: cloneDeep(this._futuristicNavigation),
                        horizontal: cloneDeep(this._horizontalNavigation)
                    }
                ];
            });
    }
}
