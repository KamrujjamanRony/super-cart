import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.css'
})
export class InputsComponent {
  @Input() inputId: string = '';  // To set a unique id for each input
  @Input() type: string = 'text'; // Default input type is text
  @Input() placeholder: string = ''; // Placeholder for input
  @Input() label: string = ''; // Optional label for the input
  @Input() value: any; // The value passed to the input field
  @Input() options: Array<{ label: string, value: any }> = [];  // Array of options
  @Input() isRequired: boolean = false;

  @Output() valueChange = new EventEmitter<any>(); // Emit changes to the parent component

  // Emit changes when the input value changes
  onValueChange() {
    this.valueChange.emit(this.value);
  }

}
