import { apiClient } from './client';
import type { TravelCourse } from '@/types';

export async function fetchCourse(id: string): Promise<TravelCourse> {
  return apiClient<TravelCourse>(`/courses/${id}`);
}

export async function fetchCourses(): Promise<TravelCourse[]> {
  return apiClient<TravelCourse[]>('/courses');
}
