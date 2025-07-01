import { Skeleton } from '@/components/common/skeleton/skeleton';

export function GroupsSkeleton() {
  const skeletons = [1,2,3,4,5,6,7];
  return (
    <>
      <article style={{ marginBottom: '30px' }}>
          <Skeleton height='40px' width='100%' rounded='5px'/>
      </article>
      {skeletons.map(skeleton => (
        <article key={skeleton} style={{ marginBottom: '35px' }}>
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