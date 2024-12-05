import { type Profile } from "./database";

export interface UserSettings {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  weeklyDigest: boolean;
  mealPlanReminders: boolean;
  measurementUnit: "metric" | "imperial";
  dietaryPreferences: string[];
}

export interface UserProfile extends Profile {
  settings?: UserSettings;
}