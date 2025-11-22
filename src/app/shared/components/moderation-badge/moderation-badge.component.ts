import { Component, Input } from '@angular/core';
import { ModerationStatus } from 'src/app/services/seller.service';

@Component({
  selector: 'app-moderation-badge',
  templateUrl: './moderation-badge.component.html',
  styleUrls: ['./moderation-badge.component.scss'],
  standalone: false
})
export class ModerationBadgeComponent {
  @Input() status!: ModerationStatus;
  @Input() rejectionReason?: string;
  @Input() showTooltip: boolean = true;

  ModerationStatus = ModerationStatus;

  getStatusConfig() {
    switch (this.status) {
      case ModerationStatus.APPROVED:
        return {
          class: 'approved',
          icon: 'checkmark-circle',
          text: 'Aprobado',
          color: 'success'
        };
      case ModerationStatus.PENDING_REVIEW:
        return {
          class: 'pending',
          icon: 'time',
          text: 'En Revisión',
          color: 'warning'
        };
      case ModerationStatus.REJECTED:
        return {
          class: 'rejected',
          icon: 'close-circle',
          text: 'Rechazado',
          color: 'danger'
        };
      case ModerationStatus.DRAFT:
        return {
          class: 'draft',
          icon: 'document',
          text: 'Borrador',
          color: 'medium'
        };
      default:
        return {
          class: 'unknown',
          icon: 'help-circle',
          text: 'Desconocido',
          color: 'medium'
        };
    }
  }
}