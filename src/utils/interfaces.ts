import type { ChannelType, Id, UserStatus } from './types';

export interface User {
  id: Id;
  username: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  status: UserStatus;
}

export interface UserAccount extends User {
  email: string;
  personalInformation?: PersonalInformation;
  createdAt: string;
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  city: string;
}

export interface Server {
  id: Id;
  name: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  ownerId: Id;
  createdAt: string;
}

export interface Member {
  id: Id;
  userId: Id;
  serverId: Id;
  nickname?: string;
  joinedAt: string;
}

export interface Channel {
  id: Id;
  serverId: Id;
  name: string;
  type: ChannelType;
  position: number;
  createdAt: string;
}

export interface Message {
  id: Id;
  authorId: Id;
  channelId: Id;
  content: string;
  createdAt: string;
  editedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
