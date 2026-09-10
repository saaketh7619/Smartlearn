import { db } from '@/lib/db';
import CourseDetailClient from './CourseDetailClient';

export function generateStaticParams() {
  return db.courses.map((c) => ({ id: c.id }));
}

export default function CourseDetailPage() {
  return <CourseDetailClient />;
}
