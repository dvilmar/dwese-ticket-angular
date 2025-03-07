
import { Injectable, PLATFORM_ID, Inject, Injector } from '@angular/core'; 
import { Client, IMessage, StompHeaders } from '@stomp/stompjs'; 
import { BehaviorSubject, Observable, of, tap } from 'rxjs'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class NotificationService {
  private stompClient: Client | null = null;
  private notificationsSubject = new BehaviorSubject<any []>([]); 
  private apiUrl = `${environment.webSocketUrl}/notifications`; 
  private authService!: AuthService;

  constructor(
    @Inject (PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private injector: Injector,
  ) {}

  connect(): void {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }

    const token = this.authService?.getToken();
    const username = this.authService?.getUsername();

    if (!token || !username) {
      console.error('No hay token o usuario autenticado, WebSocket no se conectará.');
      return;
    }

    this.stompClient = new Client({
      brokerURL: `${environment.webSockerBroker}`, 
      reconnectDelay: 5000,
      debug: (msg) => console.log('• STOMP Debug:', msg),
      connectHeaders: {
         Authorization: `Bearer ${token}`
      },
    });

    
    this.stompClient.onConnect = () => {
      console.log('✓ WebSocket conectado');

      const token = this.authService?.getToken();
      const username = this.authService.getUsername();

      console.log(`Usuario autenticado en WebSocket: ${username}`);
      console.log(`Token: ${token ? 'Existe': 'No encontrado'}`);

      const headers: StompHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    
      this.stompClient?.subscribe(
        `/topic/notifications`,
        (message: IMessage) => {
          try {
            const notification = JSON.parse(message.body); console.log('Notificación recibida:', notification);
            
            const currentNotifications = this.notificationsSubject.value;
            this.notificationsSubject.next([...currentNotifications, notification]);
          } catch (error) {
            console.error('X Error al procesar notificación:', error);
          }
        },
        headers
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
    };

    this.stompClient.activate();
  }

  
  loadUserNotifications(): Observable<any []> {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService); // Inyección diferida
    }

    const token = this.authService.getToken();
    if (!token) {
      console.warn('No hay token disponible.');
      return of ([]); // Devuelve un observable vacío si no hay token
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<any []>(this.apiUrl, { headers }).pipe(
      tap(notifications => console.log('• Notificaciones cargadas:', notifications))
    );
  }

  getNotifications(): Observable<any []> {
    return this.notificationsSubject.asObservable().pipe(
      tap((notifs) => console.log('Notificaciones actualizadas en tiempo real:', notifs))
    );
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('WebSockets desconectado.');
    }
  }
}
