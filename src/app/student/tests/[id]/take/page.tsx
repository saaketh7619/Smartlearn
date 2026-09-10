import { db } from '@/lib/db';
import AdaptiveTestRunnerClient from './AdaptiveTestRunnerClient';

export function generateStaticParams() {
  return db.tests.map((t) => ({ id: t.id }));
}

export default function AdaptiveTestRunnerPage() {
  return <AdaptiveTestRunnerClient />;
}
