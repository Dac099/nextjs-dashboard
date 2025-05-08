import Link from 'next/link';

export default function NotFound() {
  return (
    <section className='notFound'>
      <section className='notFound__title'>
        <h2>404</h2>
        <p>Página no encontrada</p>
      </section>

      <Link href={'/'} className='notFound__link'>
        Volver a la página principal
      </Link>
    </section>
  );
}