import { db } from '@/lib/db';
import CourseDetailClient from './CourseDetailClient';

export function generateStaticParams() {
  const courseParams = db.courses.map((c) => ({ id: c.id }));

  // Collect all subject IDs from curriculum
  const subjectIds: string[] = [];
  for (const level of db.curriculum) {
    for (const stream of level.streams) {
      for (const cls of stream.classes) {
        for (const sub of cls.subjects) {
          subjectIds.push(sub.id);
        }
      }
    }
  }
  const subjectParams = subjectIds.map((id) => ({ id }));

  return [...courseParams, ...subjectParams];
}

export default function CourseDetailPage() {
  return <CourseDetailClient />;
}
