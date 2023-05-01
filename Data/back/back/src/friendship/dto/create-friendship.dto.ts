import { IsBoolean, IsDate, IsEnum, IsNotEmpty, Matches } from "class-validator";

export class CreateFriendshipDto {
    @IsNotEmpty()
    @Matches(/^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    user1_username: string;
    
    
    @IsNotEmpty()
    @Matches( /^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    user2_username: string;
    
    @IsEnum({enum: ['pending', 'accepted']})
    status: string;
    
    @IsBoolean()
    blocked: boolean;
    
    @IsDate()
    created_at: Date;
    
    @IsDate()
    updated_at: Date;
    
    @Matches( /^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    blocked_by: string;
}

export class DealingWithRequestDto
{
    @IsNotEmpty()
    @Matches( /^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    Userone: string;
    
    @IsNotEmpty()
    @Matches( /^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    Usertwo: string;
}

export class UserValidatingDto
{
    @IsNotEmpty()
    @Matches( /^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    Userone: string;
}