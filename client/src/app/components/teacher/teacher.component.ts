import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Teacher, TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher',
  standalone: true,
  templateUrl: './teacher.component.html',
  // styleUrls: ['./teacher.component.css'],
  imports: [FormsModule]
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  newTeacher: Teacher = { name: '', subject: '' };
  editTeacher: Teacher = { name: '', subject: '' };  // instead of Teacher | null

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getAll().subscribe(data => this.teachers = data);
  }

  addTeacher() {
    if (!this.newTeacher.name) return;
    this.teacherService.create(this.newTeacher).subscribe(() => {
      this.newTeacher = { name: '', subject: '' };
      this.loadTeachers();
    });
  }

  startEdit(t: Teacher) {
    this.editTeacher = { ...t };
  }

  saveEdit() {
    if (!this.editTeacher?._id) return;
    this.teacherService.update(this.editTeacher._id, this.editTeacher).subscribe(() => {
      this.editTeacher = { name: '', subject: '' };
      this.loadTeachers();
    });
  }

  deleteTeacher(id: string | undefined) {
    if (!id) return;
    this.teacherService.delete(id).subscribe(() => this.loadTeachers());
  }
}
