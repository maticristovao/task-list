import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { Task } from 'src/app/Task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit{
  @Output() onAddTask:EventEmitter<Task> = new EventEmitter();
  
  form:FormGroup;
  currentDate:string|null;

  showAddTask:boolean = false;
  subscription?: Subscription;

  constructor(private uiService:UiService, private formBuilder:FormBuilder, private datepipe:DatePipe){
    this.subscription = this.uiService.onToggle().subscribe(value => this.showAddTask = value);

    this.form = this.formBuilder.group({
      text:['', [Validators.required, Validators.minLength(10)]],
      day:['', []],
      reminder:[false, []]
    });

    let date:Date = new Date();
    this.currentDate = this.datepipe.transform(date, 'YYYY-MM-ddTHH:MM');
  }

  ngOnInit(): void {

  }


  get Text(){
    return this.form.get('text');
  }
  get Day(){
    return this.form.get('day');
  }
  get Reminder(){
    return this.form.get('reminder');
  }

  reset(){
    this.form.reset();
  }

  

  onSubmit(){
    if(this.form.valid && (this.form.value.day > this.currentDate!  ||  !this.form.value.day)){
      const newTask = {
        text: this.form.value.text,
        day: this.form.value.day,
        reminder: this.form.value.reminder
      }
      this.onAddTask.emit(newTask);
      this.uiService.toggleAddTask();
      this.reset();
    }else{
      this.form.markAllAsTouched();
    }
  }

  
}