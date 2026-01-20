export interface IUser {
    _id: string;
    email: string;
    name: string;
    picture?: string;
    role: UserRole;
    googleId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export interface IProfile {
    _id: string;
    userId: string;
    fullName: string;
    tagline: string;
    bio: string;
    location: string;
    email: string;
    phone?: string;
    avatar?: string;
    resume?: string;
    socialLinks: ISocialLink[];
    visibility: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface ISocialLink {
    platform: string;
    url: string;
    icon?: string;
}
export interface IProject {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    technologies: string[];
    category: ProjectCategory;
    images: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    order: number;
    status: ContentStatus;
    visibility: boolean;
    metrics?: IProjectMetrics;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface IProjectMetrics {
    views?: number;
    stars?: number;
    forks?: number;
}
export declare enum ProjectCategory {
    WEB = "web",
    MOBILE = "mobile",
    BACKEND = "backend",
    AI_ML = "ai-ml",
    OPENSOURCE = "opensource",
    OTHER = "other"
}
export interface ISkill {
    _id: string;
    name: string;
    category: SkillCategory;
    proficiency: SkillProficiency;
    icon?: string;
    order: number;
    visibility: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export declare enum SkillCategory {
    BACKEND = "backend",
    FRONTEND = "frontend",
    DATABASE = "database",
    DEVOPS = "devops",
    AI_ML = "ai-ml",
    TOOLS = "tools",
    OTHER = "other"
}
export declare enum SkillProficiency {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert"
}
export interface IExperience {
    _id: string;
    company: string;
    position: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    responsibilities: string[];
    achievements: string[];
    technologies: string[];
    order: number;
    visibility: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface IEducation {
    _id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    grade?: string;
    description?: string;
    order: number;
    visibility: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface ICertification {
    _id: string;
    title: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
    image?: string;
    order: number;
    visibility: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface IAchievement {
    _id: string;
    title: string;
    description: string;
    date: Date;
    category: AchievementCategory;
    image?: string;
    url?: string;
    order: number;
    visibility: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export declare enum AchievementCategory {
    AWARD = "award",
    RECOGNITION = "recognition",
    PUBLICATION = "publication",
    SPEAKING = "speaking",
    MENTORSHIP = "mentorship",
    OTHER = "other"
}
export interface ISiteSettings {
    _id: string;
    key: string;
    value: any;
    description?: string;
    updatedAt: Date;
    updatedBy: string;
}
export interface IAuditLog {
    _id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}
export declare enum ContentStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface FilterParams {
    search?: string;
    category?: string;
    status?: ContentStatus;
    visibility?: boolean;
    featured?: boolean;
}
//# sourceMappingURL=types.d.ts.map