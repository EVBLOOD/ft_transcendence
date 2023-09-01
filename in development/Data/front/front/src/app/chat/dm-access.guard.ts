import { CanActivateFn, Router } from '@angular/router';
import { ChatService } from './chat.service';
import { inject } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';

export const dMACCESSGuard: CanActivateFn = async (route, state) => {
  const chatService: ChatService = inject(ChatService);
  const switchRoute: Router = inject(Router);

  const access = await lastValueFrom(chatService.hasAccessToDM(route.params['username']), { defaultValue: false });
  if (!access) {
    switchRoute.navigateByUrl('/chat');
    return false;
  }
  return true;
};
