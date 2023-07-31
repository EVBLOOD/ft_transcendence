import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { ChatService } from './chat.service';
import { inject } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

export const noACCESSGuard: CanActivateFn = async (route, state) => {

  const chatService: ChatService = inject(ChatService);
  const switchRoute: Router = inject(Router);

  try {
    const access = await lastValueFrom(chatService.hasAccessToChannel(route.params['id']));
    console.log(access);
    if (!access) {
      switchRoute.navigateByUrl('/chat');
      return false;
    }
  }
  catch (err) {
    console.log('catch ya', err);
    return false;
  }
  return true;
};
