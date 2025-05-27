import { Skeleton } from '../../skeleton/skeleton';

export function ProjectFormSkeleton() {
  return (
      <article>
        <section style={{ display: 'flex', gap: '10px' }}>
          <Skeleton height='30px' width='30px' rounded='50%'/>
          <Skeleton height='30px' width='30px' rounded='50%'/>
        </section>

        <section style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '10px' }}>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
        </section>

        <hr style={{ margin: '35px 0' }} />

        <section style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
        </section>

        <hr style={{ margin: '35px 0' }} />

        <section style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
        </section>

        <hr style={{ margin: '35px 0' }} />
       
        <section style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
          <Skeleton height='30px' width='250px' rounded='5px'/>
        </section>
        
      </article>
    );
}