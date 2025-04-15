
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique petition number in the format PTN00001YEAR
export function generatePetitionNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  
  // In a real app, this would fetch the last petition number from the database
  // For demo purposes, we'll use a random number
  const count = Math.floor(Math.random() * 1000) + 1;
  
  return `PTN${count.toString().padStart(5, '0')}${year}`;
}

// Generate a user ID based on name and designation
export function generateUserId(name: string, designation: string): string {
  const firstName = name.split(' ')[0];
  return `${firstName}/${designation}`;
}

// Format a date to DD-MM-YYYY
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}

// Get a random item from an array
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
