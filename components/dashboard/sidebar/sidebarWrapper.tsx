'use client';
import { useBoardConfigurationStore } from '@/stores/boardConfiguration';

type Props = {
  children: React.ReactNode;
};

export function SidebarWrapper({ children }: Props) {
  const { showSidebar } = useBoardConfigurationStore();

  return (
    <section style={{ display: showSidebar ? 'block' : 'none' }}>
      {children}
    </section>
  );
}
