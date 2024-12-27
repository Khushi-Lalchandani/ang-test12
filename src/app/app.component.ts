import {
  AfterViewInit,
  ChangeDetectorRef,
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
  dropZoneItems: any[] = [];
  isAvailable: boolean = false;
  existingItemIndex: number | undefined = undefined;

  draggedItem: any = null;
  draggedItemFromDropZone: any = null;

  @ViewChild('timeContainer') timeContainer!: ElementRef;
  @ViewChild('dropzone') dropzone!: any;

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
  onDrag($event: CdkDragStart) {
    for (let i of $event.source.data) {
      this.dropZoneItems.forEach((item, index) => {
        if (item.id === i.id) {
          this.isAvailable = true;
          this.existingItemIndex = index;
        } else {
          this.isAvailable = false;
          this.existingItemIndex = -1;
        }
      });
    }
  }
  drop($event: any) {
    if (this.draggedItem) {
      const dropPosition = this.calculateDropZone($event);
      const dropZoneBounds = this.isInDropZone($event).dropZoneBounds;

      const itemWidth = this.isInDropZone($event).itemWidth;
      const itemHeight = this.isInDropZone($event).itemHeight;

      if (
        dropPosition.left >= dropZoneBounds.left &&
        dropPosition.left + itemWidth <= dropZoneBounds.right &&
        dropPosition.top >= dropZoneBounds.top &&
        dropPosition.top + itemHeight <= dropZoneBounds.bottom
      ) {
        if (!this.isAvailable) {
          this.dropZoneItems.push({
            ...this.draggedItem,
            position: dropPosition,
          });
        } else {
          this.dropZoneItems = this.dropZoneItems.map((item, index) =>
            index === this.existingItemIndex
              ? { ...item, position: dropPosition }
              : item
          );
        }
      }
    }
  }
  onDrop($event: CdkDragDrop<any>): void {
    if (this.draggedItem) {
      const dropPosition = this.calculateDropZone($event);
      const dropZoneBounds = this.isInDropZone($event).dropZoneBounds;

      const itemWidth = this.isInDropZone($event).itemWidth;
      const itemHeight = this.isInDropZone($event).itemHeight;

      if (
        dropPosition.left >= dropZoneBounds.left &&
        dropPosition.left + itemWidth <= dropZoneBounds.right &&
        dropPosition.top >= dropZoneBounds.top &&
        dropPosition.top + itemHeight <= dropZoneBounds.bottom
      ) {
        this.dropZoneItems.push({
          ...this.draggedItem,
          position: dropPosition,
        });
      }
    }
  }

  isInDropZone($event: any) {
    const dropZoneBounds = this.dropzone?.nativeElement.getBoundingClientRect();
    const draggedItemElement = $event.item.element.nativeElement;
    const itemWidth = draggedItemElement.offsetWidth;
    const itemHeight = draggedItemElement.offsetHeight;
    return {
      dropZoneBounds,
      draggedItemElement,
      itemWidth,
      itemHeight,
    };
  }
  calculateDropZone($event: any) {
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
    return {
      left: clientX - $event.item.element.nativeElement.offsetWidth / 2,
      top: clientY - $event.item.element.nativeElement.offsetHeight / 2,
    };
  }

  isItemInDropZone(item: any): boolean {
    return this.dropZoneItems.some(
      (droppedItem) =>
        droppedItem.id === item.id &&
        (droppedItem.type === 'clock' || droppedItem.type === 'image')
    );
  }
  constructor(private cdr: ChangeDetectorRef) {}
}
