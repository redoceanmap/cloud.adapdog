import { CoursePage, type CoursePageProps } from './CoursePage';

/** @deprecated CoursePage를 사용하세요 */
export function CourseScreen(props: CoursePageProps) {
  return <CoursePage {...props} />;
}

export type { CoursePageProps as CourseScreenProps };
