import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proposal } from '../interface/proposal.model'; 

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/proposals'; 


  addProposal(proposalData: Omit<Proposal, 'id'>): Observable<Proposal> {
    return this.http.post<Proposal>(this.apiUrl, proposalData);
  }


 getProposalsForProject(projectId: string | number): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.apiUrl}?projetoId=${projectId}`);
  }

  updateProposal(id: string | number, data: Partial<Proposal>): Observable<Proposal> {
    return this.http.patch<Proposal>(`${this.apiUrl}/${id}`, data);
  }
}