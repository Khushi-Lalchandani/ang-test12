import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
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
  dropZoneItems: any[] = []; // New array to store items in drop zone
  newItem!: HTMLElement;
  title = 'test12';
  clone!: HTMLElement | null;
  originalElement!: HTMLElement;

  draggedItem: any = null;

  @ViewChild('timeContainer') timeContainer!: ElementRef;
  currentTime!: string;
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

  onDragStart($event: CdkDragStart) {
    this.draggedItem = $event.source.data;
  }

  onDrop($event: CdkDragDrop<any>): void {
    if (this.draggedItem) {
      const event = $event.event as MouseEvent | TouchEvent;
      let clientX = 0;
      let clientY = 0;

      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event instanceof TouchEvent) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }

      const dropPosition = {
        left: clientX - $event.item.element.nativeElement.offsetWidth / 2,
        top: clientY - $event.item.element.nativeElement.offsetHeight / 2,
      };

      this.dropZoneItems.push({
        ...this.draggedItem,
        position: dropPosition,
      });
    }
    console.log(this.dropZoneItems);
  }

  drag($event: CdkDragStart) {
    console.log($event);
  }

  isItemInDropZone(item: any): boolean {
    return this.dropZoneItems.some(
      (droppedItem) =>
        droppedItem.id === item.id &&
        (droppedItem.type === 'clock' || droppedItem.type === 'image')
    );
  }
}
