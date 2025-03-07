import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { response } from 'express';
import { jwtDecode } from 'jwt-decode';



@Injectable({
 providedIn: 'root',
})
export class AuthService {
 private token = new BehaviorSubject<string | null>(null);
 // BehaviorSubject almacena el token y permite a otros componentes reaccionar cuando cambia.


 constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) {}


 /**
  * Método para autenticar al usuario.
  * @param username - Nombre de usuario ingresado.
  * @param password - Contraseña ingresada.
  * @returns Observable que emite un objeto con el token de autenticación si la solicitud es exitosa.
  */
 login(username: string, password: string): Observable<{ token: string }> {
   return this.http.post<{ token: string }>(
     `${environment.apiUrl}/v1/authenticate`,
     { username, password },
     { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
   ).pipe(
    tap(response => {
      this.setToken(response.token);
      console.log('Login exitoso, conectado a WebSockets...');

      this.notificationService.connect();
    })
   );
 }


 /**
  * Almacena el token de autenticación en el BehaviorSubject.
  * @param token - Token recibido tras una autenticación exitosa.
  */
 setToken(token: string): void {
   this.token.next(token); // Actualiza el valor del token.
 }


 /**
  * Obtiene el token actual almacenado en el BehaviorSubject.
  * @returns El token actual o null si no está definido.
  */
 getToken(): string | null {
   return this.token.value;
 }


 /**
  * Devuelve un observable que emite el estado de autenticación basado en la existencia del token.
  * @returns Observable<boolean>
  */
 isLoggedIn(): Observable<boolean> {
   // Verifica si el token existe y emite un valor booleano.
   return this.token.asObservable().pipe(map((token: string | null) => !!token));
 }


 /**
  * Método para cerrar la sesión del usuario.
  * Elimina el token y redirige al usuario a la página de inicio de sesión.
  */
 logout(): void {
   this.token.next(null); // Limpia el token almacenado.
   this.notificationService.disconnect();
   this.router.navigate(['/']); // Redirige al usuario a la ruta raíz.
 }

 getUsername(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.sub || null;
  } catch (error) {
    console.error('Error al decodificar el token', error);
    return null;
  }
 }
}
