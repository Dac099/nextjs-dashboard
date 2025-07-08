import { Skeleton } from '@/components/common/skeleton/skeleton';

export function GroupsSkeleton() {
  const skeletons = [1,2,3,4];
  return (
    <>
      {skeletons.map(skeleton => (
        <article key={skeleton} style={{ marginTop: '35px' }}>
          <section style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Skeleton height='15px' width='15px' rounded='50%'/>
            <Skeleton height='15px' width='300px' rounded='5px'/>
          </section>
          <section>
            <Skeleton height='80px' width='100%' rounded='5px'/> 
          </section>
        </article>
      ))}
    </>
  );
}