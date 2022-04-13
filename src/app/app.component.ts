import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { WebSocketClientMessage } from './interfaces/websocket-message.model';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public received: WebSocketClientMessage[] = [];
  public sent: WebSocketClientMessage[] = [];
  public formGroup!: FormGroup;

  constructor(
    private webSocketService: WebSocketService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.initForm();

    this.webSocketService.listen().subscribe({
      next: (message) => {
        this.received.push({ ...message });
        console.log(
          `Message from: ${message.source}, with: ${message.content}`
        );
      },
      error: (error) => {
        console.log(error);
        this.webSocketService.trowError();
      },
      complete: () => console.log('Completed'),
    });
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
  }

  public openConnection() {
    this.webSocketService.openConnection();
  }

  public initForm() {
    this.formGroup = this.fb.group({
      message: [null],
    });
  }
}
