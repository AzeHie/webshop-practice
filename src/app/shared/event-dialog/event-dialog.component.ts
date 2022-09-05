import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'event-dialog',
  templateUrl: 'event-dialog.component.html',
})
export class EventDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; firstname: string }
  ) {}
}
