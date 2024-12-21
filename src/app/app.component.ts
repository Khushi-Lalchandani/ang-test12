import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  components = [
    { id: 1, type: 'input', label: 'Text Input' },
    { id: 2, type: 'image', src: '../assets/imgs/london.jpg' },
    { id: 3, type: 'clock' },
    {
      id: 4,
      type: 'dropdown',
      options: ['None', 'Option 1', 'Option 2', 'Option 3'],
    },
  ];

  title = 'test12';
  clone!: HTMLElement | null;
  originalElement!: HTMLElement;
  @ViewChild('timeContainer') timeContainer!: ElementRef;
  originalPosition: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } = { left: 0, top: 0, right: 0, bottom: 0 };
  ngAfterViewInit(): void {
    setInterval(() => {
      let time = new Date();
      let hour: string | number = time.getHours();
      let min: string | number = time.getMinutes();
      let sec: string | number = time.getSeconds();
      let am_pm = 'AM';

      // Setting time for 12 Hrs format
      if (hour >= 12) {
        if (hour > 12) hour -= 12;
        am_pm = 'PM';
      } else if (hour == 0) {
        hour = 12;
        am_pm = 'AM';
      }

      hour = hour < 10 ? '0' + hour : hour;
      min = min < 10 ? '0' + min : min;
      sec = sec < 10 ? '0' + sec : sec;

      let currentTime = hour + ':' + min + ':' + sec + am_pm;

      this.timeContainer.nativeElement.innerHTML = currentTime;
    }, 1000);
  }
  ngOnInit(): void {}
  onDragStart($event: CdkDragStart) {
    this.originalElement = $event.source.getRootElement();
    this.clone = this.originalElement.cloneNode(true) as HTMLElement;
  }
  onDragEnd($event: CdkDragEnd) {}

  onDrop($event: CdkDragDrop<any[]>) {
    // console.log($event);
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString();
  }
  private getPosition(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
    };
  }
}
