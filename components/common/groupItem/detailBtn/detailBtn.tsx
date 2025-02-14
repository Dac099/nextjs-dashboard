'use client';
import { useRouter } from 'next/navigation';
import { MdOpenInFull } from 'react-icons/md';

type Props = {
  containerClass: string;
  iconClassName: string;
  itemId: string;
};

export const DetailBtn = (props: Props) => {
  const router = useRouter();

  return (
    <span
      className={props.containerClass}
      onClick={() => router.push(`?detail=${props.itemId}`)}
    >
        Detalle
        <MdOpenInFull className={props.iconClassName} />
    </span>
  );
}