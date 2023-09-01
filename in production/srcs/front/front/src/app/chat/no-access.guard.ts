import { CanActivateFn, Router } from '@angular/router';
import { ChatService } from './chat.service';
import { inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export const noACCESSGuard: CanActivateFn = async (route, state) => {

  const chatService: ChatService = inject(ChatService);
  const switchRoute: Router = inject(Router);

  try {
    const access = await lastValueFrom(chatService.hasAccessToChannel(route.params['id']), { defaultValue: false });
    if (!access) {
      switchRoute.navigateByUrl('/chat');
      return false;
    }
  }
  catch (err) {
    return false;
  }
  return true;
};
