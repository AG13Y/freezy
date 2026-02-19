import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, of, forkJoin, map, firstValueFrom } from 'rxjs';
import { Project } from '../../interface/project.model';
import { Proposal } from '../../interface/proposal.model';
import { User } from '../../interface/user.model';
import { ProposalService } from '../../services/proposal.service';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { MatChipsModule } from '@angular/material/chips';

export interface EnrichedProposal {
  proposal: Proposal;
  freelancer: User;
}

@Component({
  selector: 'app-proposal-list',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './proposal-list.html',
  styleUrl: './proposal-list.scss',
})
export class ProposalList {
  private proposalService = inject(ProposalService);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<ProposalList>);
  private snackBar = inject(MatSnackBar);
  private projectService = inject(ProjectService);

  public project = inject<Project>(MAT_DIALOG_DATA);
  
  public proposals = signal<EnrichedProposal[]>([]);
  public isLoading = signal(true);

  constructor() {
    this.loadProposals();
  }

  async loadProposals(): Promise<void> {
    try {
      this.isLoading.set(true);

      const proposals = await firstValueFrom(
        this.proposalService.getProposalsForProject(this.project.id)
      );

      if (proposals.length === 0) {
        this.isLoading.set(false);
        return; 
      }

      const enrichedProposals: EnrichedProposal[] = [];

      for (const proposal of proposals) {
        const freelancer = await firstValueFrom(
          this.userService.getUserById(proposal.freelancerId)
        );
        
        enrichedProposals.push({ proposal, freelancer });
      }

      this.proposals.set(enrichedProposals);

    } catch (err) {
      console.error('Erro ao buscar propostas ou usuários:', err);
      this.snackBar.open('Erro ao carregar propostas.', 'Fechar', { duration: 3000 });
    } finally {
      this.isLoading.set(false);
    }
  }
  acceptProposal(item: EnrichedProposal): void {
    
    const projectUpdate$ = this.projectService.updateProject(this.project.id, {
      status: 'Em Andamento',
      freelancerId: item.freelancer.id
    });

    const proposalUpdate$ = this.proposalService.updateProposal(item.proposal.id, {
      status: 'Aprovada'
    });

    forkJoin([projectUpdate$, proposalUpdate$]).subscribe({
      next: ([updatedProject, updatedProposal]) => {
        this.snackBar.open(`Proposta de ${item.freelancer.nome} aceita!`, 'OK', { duration: 3000 });
        
        this.dialogRef.close({ 
          updatedProject: updatedProject,
          freelancer: item.freelancer 
        });
      },
      error: (err) => {
        console.error('Erro ao aceitar proposta:', err);
        this.snackBar.open('Erro ao aceitar proposta.', 'Fechar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
