export class CreateChatDto {

    username: string;

    name: string;

    type: string;

    password: string
}

export class ChatPrimariesDto {

    id: number;

    username: string;
}
export class ChatMessagingDto
{
    messaegbody: string;
}

export class ChatRecieveMSGDto
{
    data1 : ChatPrimariesDto;

    data2 : ChatMessagingDto;
}

export class UpdateChatDto
{
    chat: ChatPrimariesDto;

    data: CreateChatDto;
}
export class OperatingChatDto
{
    id: number;

    username_doing: string;

    username_target: string;
}

export class ChatintochanellsDto
{
    id: number;
    username: string;
    password: string | undefined;
}

export class OperatingMuteChatDto
{
    id: number;

    username_doing: string;

    username_target: string;

    time: number;
}