import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project } from '../../interface/project.model';
import { ProjectService } from '../../services/project.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectDetail } from '../../modals/project-detail/project-detail';
import { ProjectForm } from '../../modals/project-form/project-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteProject } from '../../modals/delete-project/delete-project';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ConfirmStatus } from '../../modals/confirm-status/confirm-status';
import { AuthService } from '../../services/auth.service';
import { ProposalForm } from '../../modals/proposal-form/proposal-form';
import { ProposalList } from '../../modals/proposal-list/proposal-list';
import { ChatConfirm } from '../../modals/chat-confirm/chat-confirm';
import { ReviewService } from '../../services/review.service';
import { ReviewForm } from '../../modals/review-form/review-form';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule, 
    RouterModule, 
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList implements OnInit { // 5. Implementar 'OnInit'
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  private reviewService = inject(ReviewService);

  public projects = signal<Project[]>([]);
  public projectStatusOptions: Project['status'][] = ['Aberto', 'Em Andamento', 'Concluído', 'Cancelado'];

  public currentUser = this.authService.currentUser;
  public isEmpresa = computed(() => this.currentUser()?.tipo === 'empresa');
  public isFreelancer = computed(() => this.currentUser()?.tipo === 'freelancer');

  public reviewsMap = signal<Map<string, boolean>>(new Map());

  public searchControl = new FormControl('');
  
  public searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''))
  );

  public filteredProjects = computed(() => {
    const term = this.searchTerm()?.toLowerCase() || '';
    const allProjects = this.projects(); // Pega a master list

    if (!term) {
      return allProjects;
    }

    return allProjects.filter(project =>
      project.titulo.toLowerCase().includes(term) ||
      project.descricao.toLowerCase().includes(term) ||
      project.habilidadesNecessarias?.some(h => h.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects.set(projects);
      // 5. Após carregar os projetos, verificar avaliações existentes
      this.checkExistingReviews(projects);
    });
  }

  checkExistingReviews(projects: Project[]): void {
    const user = this.currentUser();
    if (!user) return;

    this.reviewsMap.set(new Map()); 
    
    for (const project of projects) {
      if (project.status === 'Concluído') {
        this.reviewService.checkIfReviewExists(project.id, user.id).subscribe(exists => {
          this.reviewsMap.update(map => map.set(project.id, exists));
        });
      }
    }
  }

  openReviewModal(project: Project, event: MouseEvent): void {
    event.stopPropagation();
    
    const user = this.currentUser();
    if (!user) return;

    let revieweeId: string | number | undefined;
    let revieweeType: 'empresa' | 'freelancer';

    if (user.tipo === 'empresa' && project.freelancerId) {
      revieweeId = project.freelancerId;
      revieweeType = 'freelancer';
    } else if (user.tipo === 'freelancer' && project.freelancerId === user.id) {
      revieweeId = project.empresaId;
      revieweeType = 'empresa';
    } else {
      this.snackBar.open('Não foi possível identificar quem avaliar.', 'Fechar', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ReviewForm, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        project: project,
        revieweeId: revieweeId,
        revieweeType: revieweeType
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reviewsMap.update(map => map.set(project.id, true));
      }
    });
  }

  getStatusClass(status: Project['status']): string {
    switch (status) {
      case 'Aberto':
        return 'text-green-700 bg-green-50 ring-green-600/20';
      case 'Em Andamento':
        return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20';
      case 'Concluído':
        return 'text-blue-700 bg-blue-50 ring-blue-600/20';
      case 'Cancelado':
        return 'text-red-700 bg-red-50 ring-red-600/20';
      default:
        return 'text-gray-700 bg-gray-50 ring-gray-600/20';
    }
  }

  deleteProject(projectToDelete: Project, event: MouseEvent): void {
    event.stopPropagation(); 

    const dialogRef = this.dialog.open(DeleteProject, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja deletar o projeto "${projectToDelete.titulo}"?`,
        confirmButtonText: 'Confirmar Exclusão', 
        confirmButtonColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.projectService.deleteProject(projectToDelete.id).subscribe({
          next: () => {
            this.projects.update(currentProjects => 
              currentProjects.filter(p => p.id !== projectToDelete.id)
            );
            this.snackBar.open('Projeto deletado com sucesso!', 'OK', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open('Erro ao deletar projeto.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  changeProjectStatus(project: Project, newStatus: Project['status'], event: MouseEvent,): void { 

    if (project.status === newStatus) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmStatus, {
      width: '450px',
      data: {
        title: 'Confirmar Mudança de Status',
        message: `Tem certeza que quer mudar o status de "${project.status}" para "${newStatus}"?`,
        confirmButtonText: 'Confirmar Mudança', // Texto específico
        confirmButtonColor: 'primary' // Cor azul (padrão)
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const payload: Partial<Project> = { status: newStatus };

        this.projectService.updateProject(project.id, payload).subscribe({
          next: (updatedProject) => {
            this.projects.update(currentProjects => 
              currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
            );
            this.snackBar.open('Status do projeto atualizado!', 'OK', { duration: 3000 });
          },
          error: (err) => {
            console.error('Erro ao atualizar status:', err);
            this.snackBar.open('Erro ao atualizar status.', 'Fechar', { duration: 3000 });
          }
        });
      }
      
      event.stopPropagation();
    });
  }

  openProjectDetails(project: Project): void {
    this.dialog.open(ProjectDetail, { 
      data: project, 
      width: '800px',
      maxWidth: '90vw',
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(ProjectForm, {
      width: '800px',
      maxWidth: '90vw',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projects.update(currentProjects => [result, ...currentProjects]);
      }
    });
  }

  openEditModal(project: Project, event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ProjectForm, {
      width: '800px',
      maxWidth: '90vw',
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projects.update(currentProjects => 
          currentProjects.map(p => p.id === result.id ? result : p)
        );
      }
    });
  }

  openProposalModal(project: Project, event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ProposalForm, {
      width: '700px',
      maxWidth: '90vw',
      data: project 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.snackBar.open('Sua proposta foi enviada!', 'OK', { duration: 3000 });
      }
    });
  }

  openProposalList(project: Project, event: MouseEvent): void {
    event.stopPropagation(); 

    const dialogRef = this.dialog.open(ProposalList, {
      width: '900px',
      maxWidth: '90vw',
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projects.update(currentProjects => 
          currentProjects.map(p => p.id === result.updatedProject.id ? result.updatedProject : p)
        );

        this.dialog.open(ChatConfirm, {
          width: '500px',
          data: result.freelancer 
        });
      }
    });
  }
}
