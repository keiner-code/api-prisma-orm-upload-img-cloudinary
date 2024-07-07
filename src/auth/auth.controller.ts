import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  private user: User;
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: any) {
    this.user = req.user as User;
    return this.authService.generateJWT(this.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/check')
  checkAuth() {
    return this.authService.generateJWT(this.user);
  }
}
