"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentStatus = exports.AchievementCategory = exports.SkillProficiency = exports.SkillCategory = exports.ProjectCategory = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProjectCategory;
(function (ProjectCategory) {
    ProjectCategory["WEB"] = "web";
    ProjectCategory["MOBILE"] = "mobile";
    ProjectCategory["BACKEND"] = "backend";
    ProjectCategory["AI_ML"] = "ai-ml";
    ProjectCategory["OPENSOURCE"] = "opensource";
    ProjectCategory["OTHER"] = "other";
})(ProjectCategory || (exports.ProjectCategory = ProjectCategory = {}));
var SkillCategory;
(function (SkillCategory) {
    SkillCategory["BACKEND"] = "backend";
    SkillCategory["FRONTEND"] = "frontend";
    SkillCategory["DATABASE"] = "database";
    SkillCategory["DEVOPS"] = "devops";
    SkillCategory["AI_ML"] = "ai-ml";
    SkillCategory["TOOLS"] = "tools";
    SkillCategory["OTHER"] = "other";
})(SkillCategory || (exports.SkillCategory = SkillCategory = {}));
var SkillProficiency;
(function (SkillProficiency) {
    SkillProficiency["BEGINNER"] = "beginner";
    SkillProficiency["INTERMEDIATE"] = "intermediate";
    SkillProficiency["ADVANCED"] = "advanced";
    SkillProficiency["EXPERT"] = "expert";
})(SkillProficiency || (exports.SkillProficiency = SkillProficiency = {}));
var AchievementCategory;
(function (AchievementCategory) {
    AchievementCategory["AWARD"] = "award";
    AchievementCategory["RECOGNITION"] = "recognition";
    AchievementCategory["PUBLICATION"] = "publication";
    AchievementCategory["SPEAKING"] = "speaking";
    AchievementCategory["MENTORSHIP"] = "mentorship";
    AchievementCategory["OTHER"] = "other";
})(AchievementCategory || (exports.AchievementCategory = AchievementCategory = {}));
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "draft";
    ContentStatus["PUBLISHED"] = "published";
    ContentStatus["ARCHIVED"] = "archived";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
//# sourceMappingURL=types.js.map