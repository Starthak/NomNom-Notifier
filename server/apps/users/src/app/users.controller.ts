import { Controller, Get, Post, Body, Res, HttpStatus, NotFoundException, UseGuards, Req, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto, LoginDto, ActivationDto, ForgotPasswordDto, ResetPasswordDto } from './dto/user.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Get('/')
  sayHello(@Res() res) {
    return res.status(200).json({ message: 'Hello from Users Controller!' });
  }
  // Register a new user
  @Post('register')
  async register(@Body() createUserDto: RegisterDto, @Res() res) {
    try {
      const user = await this.usersService.register(createUserDto, res);
      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      res.status(error.status || HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  // Activate a user account
  @Post('activate')
  async activateUser(@Body() activationDto: ActivationDto, @Res() res) {
    try {
      const user = await this.usersService.activateUser(activationDto, res);
      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      res.status(error.status || HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  // Login a user
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    try {
      const { user, accessToken, refreshToken, error } = await this.usersService.Login(loginDto);
      if (error) {
        res.status(HttpStatus.UNAUTHORIZED).json(error);
        return;
      }
      res.status(HttpStatus.OK).json({ user, accessToken, refreshToken });
    } catch (error) {
      res.status(error.status || HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  // Generate forgot password link
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Res() res) {
    try {
      const message = await this.usersService.ForgotPassword(forgotPasswordDto);
      res.status(HttpStatus.OK).json(message);
    } catch (error) {
      res.status(error.status || HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  // Reset password using activation token
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res) {
    try {
      const user = await this.usersService.resetPassword(resetPasswordDto);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      res.status(error.status || HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  // Get all users (requires authentication with JWT)
  @Get()
  async getUsers(@Res() res) {
    try {
      const users = await this.usersService.getUsers();
      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      res.status(error.status || HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  // Get all premium users (requires authentication with JWT)
  @Get('premium')
  async getPremiumUsers(@Res() res) {
    try {
      const premiumUsers = await this.usersService.getPremiumUsers();
      res.status(HttpStatus.OK).json(premiumUsers);
    } catch (error) {
      res.status(error.status || HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
