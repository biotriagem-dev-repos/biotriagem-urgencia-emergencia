import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  type OnInit,
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { LocalStoreService } from '../../services/local-store.service'

@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './privacyPolicy.component.html',
  styleUrl: './privacyPolicy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent implements OnInit {
  private $localStoreService = inject(LocalStoreService)

  form = new FormGroup({
    accept1: new FormControl(false, [Validators.required]),
    accept2: new FormControl(false, [Validators.required]),
  })

  privacyPolicyOutput = output<boolean>()

  ngOnInit(): void {}

  submit() {
    // this.$localStoreService.setItem('privacyPolicy', 'accepted')
    this.privacyPolicyOutput.emit(true)
  }
}
