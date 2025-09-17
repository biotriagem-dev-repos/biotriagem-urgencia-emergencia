import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-message',
  imports: [],
  templateUrl: './loadingMessage.component.html',
  styleUrl: './loadingMessage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingMessageComponent implements OnInit {

  ngOnInit(): void { }

}
