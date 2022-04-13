import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { WebSocketClientMessage } from './interfaces/websocket-message.model';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public received: WebSocketClientMessage[] = [];
  public sent: WebSocketClientMessage[] = [];
  public formGroup!: FormGroup;

  private destroyed$ = new Subject<void>();

  constructor(
    private webSocketService: WebSocketService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.initForm();
    this.listenMessages();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public pushMessage() {
    this.sent.push({
      source: 'client',
      content: this.formGroup.get('message')!.value,
    });
    this.webSocketService.push();
  }

  public closeConnection() {
    this.webSocketService.closeConnection();
    console.log('Connection closed');
  }

  public throwError() {
    this.webSocketService.throwError();
  }

  public openConnection() {
    this.webSocketService.openConnection();
    console.log('Connection reopened');
    this.listenMessages();
  }

  public initForm() {
    this.formGroup = this.fb.group({
      message: [null],
    });
  }

  private listenMessages() {
    this.webSocketService
      .listen()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (message) => {
          this.received.push({ ...message });
          console.log(
            `Message from: ${message.source}, with: ${message.content}`
          );
        },
        error: (error) => console.log(error),
        complete: () => console.log('Completed'),
      });
  }
}
