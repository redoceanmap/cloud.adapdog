export const APP_REGION = '강릉';

export function isGangneungPlace(place: { address: string }): boolean {
  return place.address.includes('강릉');
}

export function isGangneungCourse(course: { region: string }): boolean {
  return course.region === APP_REGION;
}
