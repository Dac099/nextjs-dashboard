'use server';
import { ProgressProyects } from '@/components/home/progressProyects/progressProyects';

export default async function Page() {
  return (
    <section>
      <ProgressProyects />
    </section>
  );
}