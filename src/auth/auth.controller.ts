import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards, // Itha add pannunga
  Req,       // Itha add pannunga
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // JWT Guard-ai use panni, request header-la irunthu user-a eduppom
  @UseGuards(JwtAuthGuard) 
  @Get('profile')
  async getProfile(@Req() req) {
    // AuthGuard automatically 'req.user'-a set pannidum
    return req.user; 
  }
}