import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

export enum AlertMessageType {
  success,
  info,
  warning,
  danger
}

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent {

  @ViewChild('alertElement') alertElement: ElementRef;
  @Input() title: string = 'Alert message';
  @Input() content: string = 'Alert message';
  @Input() type: AlertMessageType = AlertMessageType.info;

  constructor(private renderer: Renderer2) {
  }

  getClassType(){
    return {
      [`${AlertMessageType[this.type]}`]: true,
    }
  }

  closeAlert(){
    if (this.alertElement && this.alertElement.nativeElement) {
      this.renderer.setStyle(
        this.alertElement.nativeElement, 
        'display', 
        'none'
      );
    }
    
  }
}
