import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { storage } from './storage';
import type { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 12;

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  static generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        userType: user.userType,
        emailVerified: user.emailVerified 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Generate 6-digit verification code
  static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate secure random token
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send verification email
  static async sendVerificationEmail(email: string, code: string): Promise<void> {
    // For development/demo purposes, log the verification code to console
    console.log(`🔐 EMAIL VERIFICATION CODE FOR ${email}: ${code}`);
    console.log(`📧 In production, this would be sent via email`);
    
    // Skip actual email sending for now to prevent authentication errors
    // In production, uncomment the email sending code below:
    
    /*
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Britannia Forge - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B5D44;">Britannia Forge - Email Verification</h2>
          <p>Your email verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Britannia Forge. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    */
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Britannia Forge - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B5D44;">Britannia Forge - Password Reset</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FF7800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Britannia Forge. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  }

  // Register user
  static async register(userData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    userType: 'customer' | 'engineer';
  }): Promise<{ user: User; token: string; requiresVerification: boolean }> {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Generate verification code
    const verificationCode = this.generateVerificationCode();
    const verificationToken = this.generateSecureToken();

    // Create user
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
      emailVerificationCode: verificationCode,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      emailVerified: false,
    });

    // Send verification email
    await this.sendVerificationEmail(userData.email, verificationCode);

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token, requiresVerification: true };
  }

  // Login user
  static async login(email: string, password: string): Promise<{ user: User; token: string; requiresVerification?: boolean }> {
    // Get user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if email verification is required
    if (!user.emailVerified) {
      // Generate new verification code if needed
      const verificationCode = this.generateVerificationCode();
      await storage.updateUser(user.id, {
        emailVerificationCode: verificationCode,
        emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
      });
      
      // Send verification email
      await this.sendVerificationEmail(email, verificationCode);
      
      // Generate JWT token
      const token = this.generateToken(user);
      
      return { user, token, requiresVerification: true };
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  }

  // Verify email with code
  static async verifyEmail(email: string, code: string): Promise<User> {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerificationCode !== code) {
      throw new Error('Invalid verification code');
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      throw new Error('Verification code has expired');
    }

    // Update user as verified
    const updatedUser = await storage.updateUser(user.id, {
      emailVerified: true,
      emailVerificationCode: null,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    return updatedUser;
  }

  // Resend verification code
  static async resendVerificationCode(email: string): Promise<void> {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    // Generate new verification code
    const verificationCode = this.generateVerificationCode();
    const verificationToken = this.generateSecureToken();

    // Update user with new code
    await storage.updateUser(user.id, {
      emailVerificationCode: verificationCode,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send verification email
    await this.sendVerificationEmail(email, verificationCode);
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<void> {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = this.generateSecureToken();

    // Update user with reset token
    await storage.updateUser(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send password reset email
    await this.sendPasswordResetEmail(email, resetToken);
  }

  // Reset password
  static async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await storage.getUserByResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update user with new password
    const updatedUser = await storage.updateUser(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return updatedUser;
  }
}