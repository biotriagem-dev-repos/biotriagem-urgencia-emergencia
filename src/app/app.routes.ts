import { Routes } from '@angular/router'
import { ChatBotComponent } from './pages/chatBot/chatBot.component'
import { NotFoundComponent } from './pages/notFound/notFound.component'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chatbot',
  },
  {
    path: 'chatbot',
    component: ChatBotComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
]
