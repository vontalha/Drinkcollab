import { ApiProperty } from '@nestjs/swagger';

export class LoginSwaggerDto {
  @ApiProperty({
    description: 'Username or E-Mail',
    example: 'ElonTusk or ElonTusk@example.com',
    minLength: 2,
    pattern: '^[a-zA-Z0-9_]+$'
  })
  login: string;

  @ApiProperty({
    description: 'Password',
    example: 'strongPassword123!',
    minLength: 8
  })
  password: string;
}
