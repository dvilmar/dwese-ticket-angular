import { Routes } from '@angular/router';
import { RegionsComponent } from './features/regions/regions.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { TiempoComponent } from './features/tiempo/tiempo.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'regions',
        component: RegionsComponent,
        canActivate: [authGuard],
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent,
    },
    {
        path: 'el-tiempo',
        component: TiempoComponent,
    },
    {
        path: '**',
        component: Error404Component,
    },
];
