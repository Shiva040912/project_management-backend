// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // User Registration
  async register(createUserDto: any): Promise<User> {
    const { email, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role: role || 'member',
    });

    return await newUser.save();
  }

  // User Login (JWT Generation Included)
  async login(email, password) {
    // 1. User irukkara check panrom
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Password match aagutha nu check panrom
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. JWT Payload create panrom (id, email, role)
    const payload = { sub: user._id, email: user.email, role: user.role };
    
    // 4. Token-a generate panni return panrom
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Get Profile (Password-ai avoid panrom)
  async getUserProfile(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}