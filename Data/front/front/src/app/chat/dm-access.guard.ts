import { CanActivateFn, Router } from '@angular/router';
import { ChatService } from './chat.service';
import { inject } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';

export const dMACCESSGuard: CanActivateFn = async (route, state) => {
  const chatService: ChatService = inject(ChatService);
  const switchRoute: Router = inject(Router);
  let response: boolean = false;

  // const access = await lastValueFrom(chatService.hasAccessToDM(route.params['username']));
  const access = chatService.hasAccessToDM(route.params['username']).subscribe((data) => { data ? response = true : response = false; });
  access.unsubscribe();
  if (!response) {
    switchRoute.navigateByUrl('/chat');
    return false;
  }
  return true;
};
